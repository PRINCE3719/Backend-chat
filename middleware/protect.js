const jwt = require("jsonwebtoken");
const key = require("../config");
const User = require("../models/usermodel.js")
 
const protect = async (req,res,next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({error:"Unauthorized - No token"})
        }
       
        const decoded = jwt.verify(token,key.secret);
       

        if(!decoded){
            return res.status(400).json({error:"Unauthorized - Invalid token"})
        }

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(400).json({error:"NO user found"})
        }

        req.user = user;

        next();
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Internal error"})
    }
}
module.exports = protect;