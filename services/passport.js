const passport=require("passport");
const mongoose=require("mongoose");
const User=mongoose.model("users");
const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcryptjs");
passport.serializeUser(function(user,done){
done(null,user._id);
})
passport.deserializeUser(function(id,done){
console.log("id",id)    
User.findById(id,(err,user)=>{
    console.log("user",user);
    done(err,user);
})    
})
passport.use(new LocalStrategy({
    
        usernameField: 'email',
        passwordField: 'password'
      
},
    function(email, password, done) {
      User.findOne({ email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false,"no user with this email exists"); }
        bcrypt.compare(password,user.password).then((value)=>{
            if(value)
            {
                return done(null, user);
            }
            return done(null, false,"wrong email or password provided");
        })
        
      });
    }
  ));