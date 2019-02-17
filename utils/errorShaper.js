exports.errorShaper=function(err,code){
if(err.hasOwnProperty("details")){
    let message; 
   err.details.forEach((error)=>{
   message=error.message
   })
   return {
       message:message,
       code,
       success:false
}

}else {
    return {
        message:err.message,
        code,
        success:false
    }
}
}