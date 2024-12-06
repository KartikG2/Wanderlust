const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

//===================INDEX ROUTE=======================
router.get("/",
  wrapAsync(async (req,res)=>{
  let allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));


//================= NEWROUTE===============
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/new.ejs",);
})
//==================SHOW ROUTE=======================
router.get("/:id",
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path : "reviews",
    populate:({
    path:"author"
  })})
    .populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});
}));

//================CREATE ROUTE===========================
router.post("/",isLoggedIn,
  validateListing,
  wrapAsync(async (req,res,next)=>{
    let newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success"," New listing created! ");
    res.redirect("/listings");
}));


//=================EDIT ROUTE================
router.get("/:id/edit",isLoggedIn,isOwner,
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}));

//==================UPDATE ROUT=============
router.put("/:id",isLoggedIn,isOwner,
  wrapAsync( async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success"," Listing Updated! ");
  res.redirect(`/listings`);
}));

// ===================== DELETE ROUTE =========
router.delete("/:id",isLoggedIn,isOwner,
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing Deleted! ");
  res.redirect("/listings");
}));
  
module.exports = router;