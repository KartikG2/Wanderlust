const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const path = require("path");
const { count } = require("console");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js"); 

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({encoded : true}));
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

// ======================================Express sessions =========================
const sessionOptions = {
  secret : "mysupersecrectstring",
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires : Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge :  7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  } 
};
app.get("/",(req,res)=>{
  res.send("YO BROOOO");
})
// =============== connect flash===============
app.use(session(sessionOptions));
app.use(flash());

// ==========================================   PASSPORT ==============================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// ===================routes======================
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// ==============================================================
app.all('*',(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

// ============== ERROR HANDLER =============
app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "Something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
});


app.listen(port,()=>{
  console.log(`The port is listening to port ${port}`);
});