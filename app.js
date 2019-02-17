const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const app=express();

const routes=require("./routes/route");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/",routes);

const errorHandlers=require('./handlers/errorHandler');
app.get("*",errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports=app;