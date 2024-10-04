const Listing = require("./models/listing");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Review = require("./models/review");
module.exports.isLoggedIn = (req,res,next)=>{
    if( !req.isAuthenticated() ){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing ");
     return  res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this listing");
   return res.redirect("/listings");
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let result= listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
     throw new ExpressError(404,error);
    }
    else{next();}
  }

  module.exports.validateReview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
    };

    
module.exports.isReviewAuthor = async(req,res,next)=>{
  let {reviewId,id}=req.params;
  const review = await Review.findById(reviewId);
  if( !review.author.equals(res.locals.currUser._id)){
  req.flash("error","you are not the author of this reviw");
 return res.redirect(`/listings/${id}`);
  }
  next();
};