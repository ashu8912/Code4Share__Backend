const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        unique:"email must be unique"
    },
    name:{
        type:String,
        required:"name is required"
    },
    password:{
       type:String
    },
    facebookId:String
})
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
userSchema.pre("save",function(next){
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });  
})

const User=mongoose.model("users",userSchema);
