var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

   middlewareObj.checkCampgroundOwnership = function (req, res, next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You dont't have permission to do that")
                        res.redirect("back");
                    }
                }
            });
    
        } else 
       
             res.redirect("back");
    }



middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                //does user own comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });

    } else {
         res.redirect("back");
}
 }
//Middleware - a set of functions where the logic is where it checks if the request is authenticated it will go to next command
 middlewareObj.isLoggedIn =  function(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     req.flash("error", "You need to be logged in to do that!")
    res.redirect("/login");
  }
  

module.exports = middlewareObj