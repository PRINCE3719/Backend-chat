const express = require("express");
const cookieparse = require("cookie-parser");
const protect = require("../middleware/protect");
const Conversation = require("../models/Conversation");
const Message = require("../models/messagemodel");
const { getRecieverId, io } = require("../Socket/Socket");
const Router = express.Router();



Router.use(express.json())
Router.use(cookieparse())

Router.post("/send/:id", protect, async (req, res) => {
    try {
        const message = req.body.message;
        const id = req.params.id;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, id] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, id],
            })
        }

        const newMessage = new Message({
            senderId: senderId,
            recieverId: id,
            message: message
        })

        await newMessage.save();

        if (newMessage) {
            conversation.messages.push(newMessage._id)
            await conversation.save();
        }


        const receiversocketId = getRecieverId(id);
        if(receiversocketId){
            io.to(receiversocketId).emit("newMessage",newMessage);
        }


        res.status(201).json(newMessage);







    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal error" })

    }
})

Router.get("/:id", protect, async (req, res) => {

    try {
        const id = req.params.id;
        const senderId = req.user._id;


        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, id] },
        }).populate("messages");

        if (conversation && conversation.messages && conversation.messages.length > 0) {

            res.status(200).json(conversation.messages);
        } else {

            res.status(200).json([]);
        }



    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "internal error" })
    }



})
module.exports = Router;