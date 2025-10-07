import express from "express";
import { JWT_SECRET } from "../constants";
import { JsonWebTokenError } from "jsonwebtoken";

export const authMe = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token) 
    {
        console.log("No Token || Invalid Token")
        return res.status(401).json({message:"No Token || Invalid Token"});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!token )
    }
} 