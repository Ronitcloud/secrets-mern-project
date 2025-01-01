const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs"); // Import ejs and assign it to the ejs variable
const encrypt = require('mongoose-encryption');
var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/secrets");
const trySchema = new mongoose.Schema({
   email: String,
   password:String    //string is nothing String is , capital s
});
const secret = "thisislittlesecret.";
trySchema.plugin(encrypt,{secret:secret,encryptFields:["password"]});
const item = mongoose.model("second", trySchema);
app.get("/",function(req, res){
res.render("home");
});
app.post("/register",function(req,res){
    const newUser = new item({
        email: req.body.username,
        password: req.body.password
    });
   /* newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });     ye old method not working*/
    newUser.save()
    .then(() => {
      res.render("secrets");
    })
    .catch(err => {
      // Handle errors appropriately (e.g., send error message to user)
      if (err.code === 11000) { // Check for duplicate key error
        console.error("Duplicate email:", err.message);
        return res.send("Registration failed! Email already exists.");
      } else {
        console.error("Error registering user:", err);
        res.send("Error registering user. Please try again.");
      }
    });
});
//using post method by gemini
// Inside your login route
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    item.findOne({ email: username })
      .then(foundUser => {
        if (!foundUser) {
          console.error("User not found");
          return res.send("Incorrect username or password.");
        }
  
        // Compare password securely (not shown here for security reasons)
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.error("Incorrect password");
          res.send("Incorrect username or password.");
        }
      })
      .catch(err => {
        console.error("Error logging in:", err);
        res.send("Error logging in. Please try again.");
      });
  });
app.get("/login", function(req, res) { res.render("login");

});

app.get("/register", function(req, res){ res.render("register");

});

// Logout route
app.get('/logout', (req, res) => {
  // Clear session data if necessary
    res.redirect('/'); // Redirect to homepage
  });

// Submit a Secret route
app.get('/submit', (req, res) => {
  res.render('submit'); // Render the submit.ejs template
});

// ... other routes and app.listen() ...

app.post("/submit", function(req, res) {
  const submittedSecret = req.body.secret;

  // Validation
  if (!submittedSecret || typeof submittedSecret !== "string") {
    console.error("Invalid secret submission");
    res.status(400).send("Invalid secret submission");
    return;
  }

  // Log the submitted secret for debugging
  console.log(`Submitted secret: ${submittedSecret}`);

  // Redirect the user to the /secrets page
  res.redirect("/submit");
});

app.listen(5000, function(){ console.log("Server started"); });  




/*
// Logout route
app.post('/logout', (req, res) => {
    // Handle logout logic here
    res.send('You have been logged out.');
});

// Submit secret route
app.post('/submit', (req, res) => {
    const secret = req.body.secret;
    // Handle secret submission logic here
    res.send(Secret received: ${secret});
});




ye tha line 45 pe phir ai se replace kar diya, app.post("/login", function(req, res) {  // Added closing parenthesis
    const username = req.body.username;
    const password = req.body.password;
    item.findOne({ email: username }, function(err, foundUser) { // Use foundUser (camelCase)
      if (err) {
        console.log(err);
      } else {
        if (foundUser && foundUser.password === password) { // Check if user exists
          res.render("secrets");
        } else {
          // Handle invalid login attempt (e.g., send error message)
          console.error("Invalid username or password.");
        }
      }
    });
  });   */