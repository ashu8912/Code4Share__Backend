const passport=require("passport");
const mongoose=require("mongoose");
const User=mongoose.model("users");
const LocalStrategy=require("passport-local").Strategy;
const FacebookStrategy=require("passport-facebook").Strategy;
const bcrypt=require("bcryptjs");
passport.serializeUser(function(user,done){
done(null,user._id);
})
passport.deserializeUser(function(id,done){
User.findById(id,(err,user)=>{
    done(err,user);
})    
})
passport.use(new LocalStrategy({
    
        usernameField: 'email',
        passwordField: 'password'
      
},
    async function(email, password, done) {
       try{      
        let user=await User.findOne({ email })
        if (!user) { return done(null, false,"no user with this email exists"); }
        let value=await bcrypt.compare(password,user.password);
            if(value)
            {
                return done(null, user);
            }
            return done(null, false,"wrong email or password provided");
}
    catch(err){
        return done(err);
    }
}))

  passport.use(new FacebookStrategy({
  clientID:process.env.FACEBOOK_CLIENT_ID,
  clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL:process.env.FACEBOOK_CALLBACK_URL,
  profileFields:["id","displayName","email"]},async function(
  token,refreshToken,profile,done    
  ){
try{      
let user=await User.findOne({facebookId:profile.id});
if(user)
{
    return done(null,user);
}
var newUser=new User();
    if(profile.emails)
    {
        newUser.email=profile.emails[0].value;
    }
    newUser.name=profile.displayName; 
    newUser.facebookId=profile.id;
    try
    {let savedUser=await newUser.save()
        return done(null,savedUser);
    }
    catch(err){
        return done(null,false,"cant save user info")
    }
}catch(err){return done(err)}
  }))
