const express = require("express");
const protect = require("../middleware/protect");
const cookieparse = require("cookie-parser");
const User = require("../models/usermodel");
const { ObjectId } = require("mongodb");

const router = express.Router()
router.use(cookieparse())

router.get("/all",protect,async(req,res)=>{
    try {
        const loggedInUser = req.user._id;
        console.log(loggedInUser);
        const allUser = await User.find({_id:{$ne:loggedInUser}}).select("-password");
        res.status(200).json(allUser);

        
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/:id",protect,async(req,res)=>{
    try {
        const currentuser = req.params.id;
      
        const finduser  = await User.findById(currentuser);
        if(finduser){
            res.status(200).json({finduser});
        }
        else{
            res.status(400).json({message:"NO user found"});
        }
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;