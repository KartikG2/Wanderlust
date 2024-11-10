const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const Listing = require("../Majorproject/models/listing");
const path = require("path");
const { count } = require("console");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("../Majorproject/models/review");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({encoded : false}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//connecting the database
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
main()
.then(()=>{console.log("connected to DB");
})
.catch(err => console.log(err));

app.get("/",(req,res)=>{
    res.send("YO BROOOO");
})

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}
const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}
//===================INDEX ROUTE=======================
app.get("/listings",
  wrapAsync(async (req,res)=>{
  let allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));


//================= NEW and CREATE ROUTE===============
app.get("/listings/new",(req,res)=>{
  let{title,description,image,price,country,location} = req.body;
  res.render("listings/new.ejs",)
})
//==================SHOW ROUTE=======================
app.get("/listings/:id",
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}));

//================CREATE ROUTE===========================
app.post("/listings",
  validateListing,
  wrapAsync(async (req,res,next)=>{
    let newListing =  new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//=================EDIT ROUTE================
app.get("/listings/:id/edit",
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//==================UPDATE ROUT=============
app.put("/listings/:id",
  wrapAsync( async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings`);
}));

// ===================== DELETE ROUTE =========
app.delete("/listings/:id",
  wrapAsync( async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// ======================= Reviews ===================

// ======================post route(add review)==============
app.post(`/listings/:id/reviews`,validateReview,wrapAsync(async(req,res)=>{
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));


app.all('*',(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

// ============== ERROR HANDLER =============
app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "Something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});


app.listen(port,()=>{
  console.log(`The port is listening to port ${port}`);
});