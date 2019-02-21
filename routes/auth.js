const express=require("express");
const router=express.Router();
const joi=require("joi");
const mongoose=require("mongoose");
const User=mongoose.model("users");
const passport=require("passport");
const {errorShaper}=require("../utils/errorShaper");
const {responseShaper}=require("../utils/responseShaper");
const {checkLogin}=require("../middlewares");

router.post("/api/login",function(req,res,next){
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err) }
          if (!user) {
            // *** Display message without using flash option
            // re-render the login form with a message
            
            return res.json(errorShaper(info,401));
          }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.session.user=user;
            res.json(responseShaper(user,"successfully logged in"));
          });
        })(req, res, next);
      }
)

router.post("/api/register",(req,res,next)=>{
    let registerSchema=joi.object({
        "name":joi.string().required(),
        "email":joi.string().email().required(),
        "password":joi.string().required(),
        "confirmPassword":joi.string().equal(req.body.password || "")
    }).required()
   joi.validate(req.body,registerSchema,function(err,values){
       if(err)
       {
           res.json(errorShaper(err,422))
       }else{
           let {confirmPassword,...body}=req.body;
           let user=new User(body);
           user.save().then(()=>{
req.session.user=user;               
res.json(responseShaper(user,"successfully created user"));
}).catch((err)=>{
    const error=new Error("there is already  an account with this email");
    error.status=422;
    next(error)})
       }
   }) 
})
router.get("/api/logout",(req,res)=>{
    req.logOut();
    req.session.user=null;
    res.json({message:"successfully logged out",code:200,success:true,errors:{}});
})
router.get("/api/me",checkLogin,(req,res)=>{
res.json(responseShaper(req.session.user,"you are logged in"))
})
router.get("/auth/facebook",passport.authenticate("facebook",{scope:"email"}))
router.get("/auth/facebook/callback",passport.authenticate("facebook"),(req,res)=>{
    req.session.user=req.user;
    res.redirect("/")})
module.exports=router;