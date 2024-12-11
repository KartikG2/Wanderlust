const User = require("../models/user");


// ======================================SIGNUP==========================================
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup =  async (req,res)=>{
    try{
       let {username,email,password}=req.body;
       const newUser= new User({email,username});
       let registerdUser = await User.register(newUser,password);
       console.log(registerdUser);
       req.login(registerdUser,(err)=>{
           if(err){
               return next(err);
           }
           req.flash("success","Welcome to WanderLust");
           res.redirect("/listings");
       });
    }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
       
};

// ==================================================LOGIN====================================================

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async (req,res)=>{
req.flash("success","Welcome back to WanderLust!");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully!");
        res.redirect("/listings");
    })
};