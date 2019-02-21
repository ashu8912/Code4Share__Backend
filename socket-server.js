const socketIO=require("socket.io");
const mongoose=require("mongoose");
const Task=mongoose.model("tasks");
const ot=require("ot");
const roomList={};
module.exports=function(server){
    var io=socketIO(server);
    const str="/*welcome to Code4Share*/";
    io.on("connection",function(socket){
        socket.on("joinRoom",function(data){
            if(!roomList[data.room])
            {
           const socketIoServer=new ot.EditorSocketIOServer(str,[],data.room,function(socket,cb){
            var self=this;
            Task.findByIdAndUpdate(data.room,{content:self.document}).then((task)=>{
                if(!task)
                {
                    return cb(false)
                }
                cb(true)
            }).catch(()=>{
                cb(false);
            })   
           })
           roomList[data.room]=socketIoServer;
            }
       roomList[data.room].addClient(socket);
       roomList[data.room].setName(socket,data.username)
            socket.room=data.room;
            socket.join(data.room);
            })
    socket.on("sendMessage",function(data){ 
       
        io.to(socket.room).emit("receiveMessage",data)
    })
    socket.on("disconnect",function(){
        socket.leave(socket.room);
    })
    })
}