import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import {JWT_SECRET} from "../constants.js"
import chalk from "chalk"

export const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            console.log("Token Undefined || No Token Found")
            return res.status(401).json({message:"Token Undefiend || NO Token Found"});
        }


        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded){
            console.log("TOken MisMatch")
            return res.status(401).json({message:"Token Mismatch"});
        }
        console.log("decoded: ",decoded)


        const user = await User.findById(decoded.id).select("-password");
        console.log(chalk.blue("username: ",user.email))
        if(!user){
            console.log("User is not logged in")
            return res.status(401).json({message:"User is not logged in"});
        }

        req.user = user 

        
        next()
    }catch(error){
        console.log("Error in Protect Route",error)
        res.status(500).json({message:"Error in Protect Route"});
    }
}
