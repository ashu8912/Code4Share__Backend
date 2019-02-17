const express=require("express");
const router=express.Router();
const joi=require("joi");
const nodemailer=require("nodemailer");
const {mailConfig}=require("../configs/mailConfig");

const {errorShaper}=require("../utils/errorShaper");
const {responseShaper}=require("../utils/responseShaper");

const tranporter=nodemailer.createTransport(mailConfig);
router.post("/api/contact",(req,res,next)=>{
contactSchema=joi.object().keys({
    name:joi.string().required(),
    email:joi.string().email().required(),
    message:joi.string().min(4)
})
joi.validate(req.body,contactSchema,function(err,value){
    if(err)
    {
        res.json(errorShaper(err,422));
    }else
{
 console.log(value.email,process.env.MAIL_HOST);   
let mailOptions={
    from:value.email,
    to:process.env.EMAIL,
    subject:"you got a new message from visitor",
    text:req.body.message
}    
tranporter.sendMail(mailOptions,function(err,info){
    if(err)
    {
     return console.log(err);
    }
    res.json(responseShaper(value,"successfully contacted"))

})
};
});

})
module.exports=router;