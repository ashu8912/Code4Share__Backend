const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const app=express();
const passport=require("passport");

const session=require("express-session");
const indexRoutes=require("./routes");
const authRoutes=require("./routes/auth");
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{expires:24*60*60*1000}
}))
app.use(passport.initialize());
app.use(passport.session());
app.use("/api",indexRoutes);
app.use("/api",authRoutes);
const errorHandlers=require('./handlers/errorHandler');
app.get("*",errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports=app;