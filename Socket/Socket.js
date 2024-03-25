const {Server} = require("socket.io");
const http = require("http");
const express = require("express");



const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:['https://66018ec369f9eb2ce5cb3302--scintillating-chimera-0622dc.netlify.app'],
        methods:["GET","POST"]
    }
});



const getRecieverId = (recieverId)=>{
    return userSocketmap[recieverId];
}


const userSocketmap = {};

io.on('connection',(socket)=>{
    
    console.log('user connected',socket.id);

    const userId = socket.handshake.query.userId;

    if(userId != undefined) userSocketmap[userId] = socket.id;

    io.emit("getonlineuser",Object.keys(userSocketmap))

    socket.on("disconnect",()=>{
        console.log('disconnected',socket.id);
        delete userSocketmap[userId];
        io.emit("getonlineuser",Object.keys(userSocketmap));
    })
})

module.exports = {
    app,
    io,
    server,
    getRecieverId
   };