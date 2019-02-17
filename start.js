const mongoose=require("mongoose");
require("dotenv").config({path:"variables.env"})

mongoose.Promise=global.Promise;
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true});

mongoose.connection.on("error",(error)=>{
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
})

const app=require("./app");
app.set("port",process.env.PORT || 8080);
const server=app.listen(app.get("port"),()=>{
    console.log("listening on port",server.address().port)
})