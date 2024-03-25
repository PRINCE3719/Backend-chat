const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/usermodel.js");
const key = require("../config.js");

const router = express.Router();

router.use(express.json())



const generateToken = (userId) => {
    return jwt.sign({ id: userId }, key.secret, {
        expiresIn: 129009
    });
};


router.post("/signup", async (req, res) => {

    try {

        const existinguser = await User.findOne({ email: req.body.email })
        if (existinguser) {
            return res.status(400).json({ error: "email already in use" })
        }


        const hashpassword = bcrypt.hashSync(req.body.password, 8)

        const profilepicboy = `https://avatar.iran.liara.run/public/boy?username=${req.body.name}`
        const profilepicgirl = `https://avatar.iran.liara.run/public/girl?username=${req.body.name}`

        const Newuser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashpassword,
            gender: req.body.gender,
            profilepic: req.body.gender === 'male' ? profilepicboy : profilepicgirl,
        });

       
      
 

        res.status(200).json({auth:true,user:Newuser});

      





    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }



})




router.post("/signin", async (req, res) => {
    try {

       const user = await User.findOne({ email: req.body.email });
           

            if (!user) {
                return res.status(400).json({ auth: false, token: "invalid user" })

            }
            else {
                const pass = bcrypt.compareSync(req.body.password, user.password)
                if (!pass) return res.status(400).json({ auth: false, token: "invalid credential" })

                const toke = generateToken(user._id);
                res.cookie("jwt",toke,{
                    maxAge: 10*24*60*60*1000,
                    httpOnly:true,
                    sameSite:"strict",
                });
                res.status(200).json({auth:true,token:toke});
            }
       
    

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
})


router.post("/signout",(req,res)=>{
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).json("deleted successfully")
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"internal error"})
    }
})

module.exports = router;