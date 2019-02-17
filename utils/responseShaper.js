exports.responseShaper=function(data,message){
    return {
        message,
        data,
        code:200,
        success:true
    }
}