const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");


module.exports.index = async (req, res) => {
  let search = req.query.search || "";
  let category = req.query.category || "";
  let allListings = [];
  if (category != "") {
    allListings = await Listing.find({ category: `${category}` });
  } else if (search !== "") { 
    allListings = await Listing.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $match: {
        $or: [
          { title: { $regex: `\\b${search}`, $options: "i" } },
          { location: { $regex: `\\b${search}`, $options: "i" } },
          { country: { $regex: `\\b${search}`, $options: "i" } },
          { "result.username": { $regex: `\\b${search}`, $options: "i" } },
          { category: { $regex: `\\b${search}`, $options: "i" } },
        ],
      },
    },
  ]);
}
}
// ===========================   INDEX FUNCTIONALITY =============================

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


// ===========================   NEW FORM FUNCTIONALITY =============================

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs",);
};

// ===========================   SHOW FUNCTIONALITY =============================
module.exports.showListing = async (req,res)=>{
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
};

// ===========================   CREATE FUNCTIONALITY =============================

module.exports.createListing = async (req,res,next)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  
  let newListing =  new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success"," New listing created! ");
  res.redirect("/listings");
};

// ===========================   EDIT FUNCTIONALITY =============================

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

// ===========================   UPDATE FUNCTIONALITY =============================

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    req.flash("success"," Listing Updated! ");
    res.redirect(`/listings`);
};

// ===========================  DELETE FUNCTIONALITY =============================

module.exports.destoryListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted! ");
    res.redirect("/listings");
};