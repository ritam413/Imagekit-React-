import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import chalk from "chalk";

export const signup = async (req,res)=>{
    try{
        const {email,password,username} = req.body

        if(!email||!password||!username){
            return res.status(400).json({message:"All fields are required"})
        }
        const existing_user = await User.findOne({email})
        if(existing_user){
            console.log("User already exists")
            return res.status(409).json({message:"User already exists"})
        }
        
        const hashed_Password = await bcrypt.hash(password,10)

        const user = await User.create({
            email,
            username,
            password:hashed_Password
        });
        
        const userWithoutPassword = await User.findById(user._id).select(
            "-password"
        )

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV==="prod",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            user:userWithoutPassword,
            token,
            message:"User created successfully"
        })

        console.log(chalk.green("User created successfully: ",userWithoutPassword.email))
    }catch(err){
        console.log("Error Registreing User",err)
        res.status(500).json({
            message:"Error Registreing User",
        })
        console.log(chalk.red("Error Registreing User",err))
    }
}

export const login = async (req,res)=>{
    try{
        const {email,password} = req.body;

        if(req.cookies.token){
            console.log("User already logged in")
            return res.status(400).json({message:"User already logged in"})
        }
        if(!email||!password){
            console.log("All fields are required")
            return res.status(400).json({message:"All fields are required"})
        }

        const user = await User.findOne({email})
        if(!user){
            console.log("User does not exist, Login failed")
            return res.status(400).json({message:"User does not exist, Login failed"})
        }

        const userWithoutPassword = await User.findById(user._id).select(
            "-password"
        )

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect) {
            console.log("Invalid Password")
            return res.status(400).json({message:"Invalid Password"})
        }

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV==="prod",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        console.log(chalk.green("User logged in successfully: ",userWithoutPassword.email))
        
        res.status(200).json({
            user:userWithoutPassword,
            token,
            message:"User logged in successfully"
        })
    }catch(error){
        res.status(500).json({
            message:"Error logging in User",
        })
        console.log(chalk.red("Error logging in User",error))
    }
}

export const logout = async (req,res)=>{
    try{
        if(!req.cookies.token){
            return res.status(400).json({message:"User is not logged in"})
        }

        res.clearCookie("token",{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        res.status(200).json({
            message:"User logged out successfully"
        })
        console.log(chalk.green("User logged out successfully"))
    }catch(error){
        res.status(500).json({
            message:"Error logging out User",
        })
        console.log(chalk.red("Error logging out User",error))
    }
}

export const resetPassword = async (req,res)=>{
    
    try {
        const {password,newPassword} = req.body
    
        if(!email||!password || !newPassword){
            return res.status(400).json({message:"All fields are required"})
        }
    
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
    
        const  isMatch = await bcrypt.compare(password,user.password)
    
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"})
        }
    
        const hashed_Password = await bcrypt.hash(newPassword,10)
        const updateUser = await User.findByIdAndUpdate(
            user._id,
            {password:hashed_Password},
            {new:true}
        )
    
        const {password:pwd , ...userWithoutPassword} = updateUser._doc
        
    
        res.status(200).json({
            user:userWithoutPassword,
            message:"Password reset successfully"
        })   
    } catch (error) {
        console.log("Error resetting password",error)
        return res.status(400).json({message:"Error resetting password"})
    }
}