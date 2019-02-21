const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const app=express();
const passport=require("passport");

const session=require("express-session");
const indexRoutes=require("./routes");
const authRoutes=require("./routes/auth");
const taskRoutes=require("./routes/task");
app.use(cors({
    origin:true,
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
app.use("/",authRoutes);
app.use("/api",taskRoutes);
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('frontend/build'));
  
    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
  }
const errorHandlers=require('./handlers/errorHandler');
app.get("*",errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports=app;