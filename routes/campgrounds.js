var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");


//index campground routes
router.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({} , function(err, allCampgrounds){
        if(err){
            console.log("Opps something went wrong");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        } 
    });
});
//CREATE - add new campground to db
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   //get data from form and add to camp ground array 
   var name = req.body.name; 
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, image: image, description: desc, author: author};
   //create a  new campground and save to new database
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //redirect to campgrounds
              res.redirect("/campgrounds");
       }
   });
});

//shows info about just one campground
router.get("/", function(req, res){
    res.render("landing");
});

//show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
})

router.get("/campgrounds/:id", function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
             //render show template with that camground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
}); 
// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){ 
           Campground.findById (req.params.id, function(err, foundCampground) {
              res.render("campgrounds/edit", {campground: foundCampground});
    });         
});



//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
  
    Campground.findByIdAndUpdate(req.params.id, req.body.edit, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect showpage
});
//DESTORY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

 

module.exports = router;