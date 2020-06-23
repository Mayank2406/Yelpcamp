var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")  ;

// INDEX ROUTE => Shows all campgrounds.
router.get("/",function(req,res){
    // Get all campgrounds from Database..
    Campground.find({},function(err,allCampgrounds){
        if(err){console.log(err);}
        else
        {
          res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});      
        }
    });
});

// CREATE ROUTE => Add new campground to the database. 
router.post("/",middleware.isLoggedIn,function(req,res){
    
    // Get Data From Form And Add To Campgrounds Array.
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,price:price,image:image,description:desc,author:author};                     // newcampground is an object.
    // create a new campground and save to DB.
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            // Redirect Back To Campgrounds Page.
            res.redirect("/campgrounds");
        }
    });
})



// NEW ROUTE => Show form to create a new campground.
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});



// SHOW ROUTE => shows more info about one campground. 
router.get("/:id",function(req,res)
{
    // find all the campgrounds with provided id.
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        } else 
        {
                 // render show template with that campground.
                 res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});




// edit campground: A form for making changes to the campground:
// Authorisation means giving permission to edit and delete campground:
// if authorised =>  give permission  else  don't.
// Authorisation Logic : Does the current user's id matches the id of the author:


router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
      Campground.findById(req.params.id,function(err,foundCampground){
      res.render("campgrounds/edit",{campground:foundCampground});
              });
        });



 //  Update Route: The changes made through edit form is submitted through update route: 

 router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground: \

    // (^ req.body.campground contains name,image and desc of the campground which we have 
    // specified in edit.ejs in the form of campground[name],campground[image],campgrounds[desc]; 
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            // redirecting to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
 });

// Destroy campgrond Route

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/campgrouds");
        else    
            res.redirect("/campgrounds");
    });
});

        

module.exports = router;