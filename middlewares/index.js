exports.checkLogin=function(req,res,next){
    if(req.session && req.session.user)
    {
        next();
    }else{
        res.json({
            message:"You must login to access",
            code:401,
            success:false
        })
    }
}