const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const {errorShaper}=require("../utils/errorShaper");
const {responseShaper}=require("../utils/responseShaper");
const {checkLogin}=require("../middlewares");
const Task=mongoose.model("tasks");
router.get("/createTask",checkLogin,async function(req,res){
    var newTask=new Task();
    try
    {let savedTask=await newTask.save();
    res.json(responseShaper(savedTask,"successfully created task"))
    }
    catch(err)
    {
        let error=new Error("server error something went wrong")
        res.json(errorShaper(error,500))
    }
})
router.get("/task/:id",async (req,res)=>{
    try
    {let task=await Task.findOne({_id:req.params.id});
    if(task)
    {
        res.json(responseShaper(task,"successfully found a task"));
    }else{
      res.json(errorShaper("no task with this id found",404));
    }
}
catch(err)
{
    let error=new Error("server error");
    res.json(errorShaper(error,500));
}
})
module.exports=router;