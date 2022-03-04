//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 12;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// creating a schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Creating a new Mongoose model
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            };
        };
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});