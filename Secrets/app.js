//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
//const md5 = require("md5");
//const encrypt = require("mongoose-encryption");


const app = express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(request, response){
    response.render("home");
});

app.get("/auth/google",
    passport.authenticate('google', {scope: ["profile"]}) 
);

app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: '/login'}),
    function(request, response){
        response.redirect("/secrets")
    });

app.get("/login", function(request, response){
    response.render("login");
});

app.get("/register", function(request, response){
    response.render("register");
});

app.get("/secrets", function(request, response){
    if(request.isAuthenticated()){
        response.render("secrets");
    }
    else{
        response.redirect("/login");
    }
});

app.get("/submit", function(request, response){
    User.find({"secret": {$ne: null}}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                response.render("secrets", {userWithSecrets: foundUser});
            }
        }
    });
});

app.post("/submit", function(request, response){
    const submittedSecret = request.body.secret;
    User.findById(request.user.id, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    response.redirect("/secrets");
                })
            }
        }
    })
})

app.get("/logout", function(request, response){
    request.logOut();
    response.redirect("/");
});

app.post("/register", function(request, response){
    User.register({username: request.body.username}, request.body.password, function(err, user){
        if(err){
            console.log(err);
            response.redirect("/register");
        }
        else{
            passport.authenticate("local")(request, response, function(){
                response.redirect("/secrets");
            });
        }
    })
});

app.post("/login", function(request, response){
    const user = new User({
        username: request.body.username,
        password: request.body.password
    });
    request.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(request, response, function(){
                response.redirect("/secrets");
            });
        }
    });
});


app.listen(3000, function(){
    console.log("server is running on port 3000");
})