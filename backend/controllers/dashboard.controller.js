import express from "express"
import Image from "../models/image.model.js";
import Video from '../models/video.model.js'
import client from "../utils/imagekitConfig.js";
import fs from 'fs'
import chalk from "chalk";
import Audio from "../models/audio.model.js";
export const getUserMedia = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        console.log("User id is required")
        return res.status(400).json({ message: "User id is required" });
    }

    try {
        const image = await Image.find({ user: userId }).populate("user")
        const video = await Video.find({ user: userId }).populate("user")

        const media = [...image, ...video];

        media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (!media) {
            console.log("No media found")
            return res.status(400).json({ message: "No media found" });
        }

        console.log("Media Found Succesfully ✅ : ", media.length)
        console.log("Original Urls : ", media.map(media => media.originalUrl))

        res.status(200).json({
            sucess: true,
            count: media.length,
            media
        })

    } catch (error) {
        console.log("Error getting user media in dashboard.controller.js", error)
        return res.status(500).json({ message: "Error getting user media in dashboard.controller.js" })
    }

}

export const uploadMedia = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        console.log("No files were uploaded.");
        return res.status(400).json({ message: "No files were uploaded." });
    }

    const uploadedFile = []

    const handleFileUpload = async (file) => {
        try {

            const { path: filePath, originalname: fileName, mimetype } = file;
            console.log("Mimetype:", mimetype);

            const response = await client.files.upload({
                file: fs.createReadStream(filePath),
                fileName: fileName + Date.now(),
            });

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            let doc;

            if (mimetype.startsWith("image/")) {
                doc = await Image.create({
                    user: req.user._id,
                    originalUrl: response.url,
                    filePath: response.filePath,
                    fileName: response.name,
                });
            } else if (mimetype.startsWith("video/")) {
                doc = await Video.create({
                    user: req.user._id,
                    originalUrl: response.url,
                    filePath: response.filePath,
                    fileName: response.name,
                });
            } else if (mimetype.startsWith("audio/")) {
                doc = await Audio.create({
                    user: req.user._id,
                    originalUrl: response.url,
                    filePath: response.filePath,
                    fileName: response.name,
                });
            } else {
                console.log("File type not supported")
                return res.status(400).json({ message: "File type not supported" });
            }

            await doc.save();

            console.log("File uploaded successfully: ")
            console.log(chalk.green(` ${response.url}`))
            uploadedFile.push(doc)
            return doc;

        } catch (error) {
            console.log("Error uploading file", error)
            return null
        }
    }

    try {
        const uploadResults = await Promise.all(req.files.map(handleFileUpload))

        const succesfullUploades = uploadResults.filter(result => result !== null)

        console.log("Succesfull Uploades: ", succesfullUploades.map(result => result.originalUrl))
        return res.json({
            success:true,
            count: succesfullUploades.length,
            data: succesfullUploades
        })
    } catch (error) {
        console.log("Error uploading file", error)
        return res.status(500).json({success: false, message: "Error uploading file" });
    }
   
   
}

export const setImageVisiblity= async(req,res)=>{
    const {_id}=req.body
    if(!_id)
        return res.status(404).json({message:"Image id is undefined"})
    try{
        const image = await Image.findByIdAndUpdate(_id,
            [
                {$set:{isPublic:{$not:"$isPublic"}}}
            ],
            {new : true}
        );

        if(!image)
        {
            console.log("No image found")
            return res.status(400).json({message:"No image found"})
        }
        res.status(200).json({message:"Image visiblity set successfully"})
    }catch(err){
        console.log("Error setting image visiblity",err)
    }

}
