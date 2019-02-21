const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema({
content:String
})
mongoose.model("tasks",taskSchema)