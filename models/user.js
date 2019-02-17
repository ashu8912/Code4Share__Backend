const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:"email is required",
        unique:"email must be unique"
    },
    name:{
        type:String,
        required:"name is required"
    },
    password:{
       type:String,
       required:"password is required"
    },
})