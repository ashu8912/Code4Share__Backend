const express=require("express");
const router=express.Router();
const joi=require("joi");
const mongoose=require("mongoose");
const User=mongoose.model("users");
const passport=require("passport");
const {errorShaper}=require("../utils/errorShaper");
const {responseShaper}=require("../utils/responseShaper");
const {checkLogin}=require("../middlewares");

router.post("/login",function(req,res,next){
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

router.post("/register",(req,res,next)=>{
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
router.get("/me",checkLogin,(req,res)=>{
res.json(responseShaper(req.session.user,"you are logged in"))
})
module.exports=router;