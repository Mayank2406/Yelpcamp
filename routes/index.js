var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

// Root route:
router.get("/",function(req,res){
    res.render("campgrounds/landing");
});

// ==== AUTHENTICATION ROUTES ==== //

// 1. Show the register form : //

router.get("/register",function(req,res){
    res.render("register");
})

// 2. Handle Signup form :  //

router.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            req.flash("error",err.message);   
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelpcamp " + user.username);   
            res.redirect("/campgrounds");
        });
    });
});

// 3. Login Form : //

router.get("/login",function(req,res){
    res.render("login");
});

// 4. logic for Login : //


router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
 }),function(req,res){
});

// 5. Logout :  //

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!");
    res.redirect("/campgrounds");
})



module.exports = router;