import client from "../utils/imagekitConfig.js";
import fs from 'fs'
import chalk from "chalk";
import Image from "../models/image.model.js";
export const transformation = async (req, res) => {
    const { sourceUrl, prompt } = req.body;

    if (!sourceUrl) {
        return res.status(400).json({ message: "Source URL is required" });
    }

    try {
        const uploadResults = await client.files.upload({
            file: sourceUrl,
            fileName: `image_${Date.now()}`,
        });

        if (!uploadResults || !uploadResults.filePath) {
            return res.status(400).json({ message: "Error uploading file" });
        }

        console.log("Uploaded File:", uploadResults);

        const transformedURL = client.helper.buildSrc({
            urlEndpoint: "https://ik.imagekit.io/ritam123", // your delivery endpoint
            src: uploadResults.filePath,
            transformation: [
                {
                    // height: 200,
                    // width: 300,
                    // crop: "maintain_ratio",
                    quality: 80,
                    format: "webp",
                    raw: `e-edit-prompt-${prompt}`,
                }
            ]
        });

        console.log("Transformed URL:", transformedURL);

        return res.status(200).json({ transformedURL });
    } catch (error) {
        console.error("Error in transformation:", error);

        if (error.status === 403) {
            return res.status(403).json({
                error: "Access Denied. Check your API keys and url endpoint.",
                details: error.error?.message,
            });
        }

        return res.status(500).json({
            error: error.message || "Error in Image Transformation",
        });
    }
};


export const uploadImage = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        console.log("No files were uploaded.");
        return res.status(400).json({ message: "No files were uploaded." });
    }

    const uploadedFiles = [];

    const handleFileUpload = async (file) => {
        const { path: filePath, originalname: fileName, mimetype } = file;
        console.log("Mimetype:", mimetype);

        const response = await client.files.upload({
            file: fs.createReadStream(filePath),
            fileName: fileName + Date.now(),
        });

        fs.unlinkSync(filePath);

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
            throw new Error("Unsupported file type");
        }

        uploadedFiles.push(doc);
        console.log("✅ File Uploaded to DB:", doc.originalUrl);
    };

    try {
        console.log(`${req.files.length} files were uploaded.`);
        for (const file of req.files) {
            try {
                await handleFileUpload(file);
            } catch (err) {
                console.log("Error uploading file:", err);
                continue;
            }
        }

        return res.json({ success: true, data: uploadedFiles });
    } catch (err) {
        console.log("Error uploading file:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const AItransformtaion = async (req, res) => {

    const { filePath, aiTransformation, format } = req.body


    try {
        const transformedURL = client.helper.buildSrc({
            urlEndpoint: "https://ik.imagekit.io/ritam123",
            src: filePath,
            transformation: [
                {
                    // height: 200,
                    // width: 300,
                    // crop: "maintain_ratio",
                    quality: 80,
                    format: `${format}`,
                    raw: `${aiTransformation}`,
                }
            ]
        });

        if (!transformedURL) {
            console.log("Failed Transformed URL");
            return res.status(200).json({ "message": "Failed Transformed URL" });
        }
        console.log("Transformed URL: ", chalk.yellow(`${transformedURL}`));
        return res.status(200).json({
            "Transformed URL": transformedURL
        });
    } catch (err) {
        console.log("Error Transformting file in AItransformation function", err)
        return res.status(400).json({ message: "Error Transforming file" })
    }
}

export const resize_crop = async (req, res) => {
    // Choosing the right cropping strategy
    // If you want to preserve the whole image content(no cropping) and need the exact same dimensions(height and width) in the output image as requested, choose either of the pad resize crop or forced crop strategy.

    // If you want to preserve the whole image content(no cropping), but it is okay if one or both the dimensions(height or width) in the output image are adjusted to preserve the aspect ratio.Then choose either of the max - size cropping or min - size cropping strategy.You can also use the max - size - enlarge cropping strategy if you want to allow enlarging of the image in case the requested dimensions are more than the original image dimension.

    // If you need the exact same dimensions(height and width) in the output image as requested but it's okay to crop the image to preserve the aspect ratio (or extract a region from the original image). Then choose either of the maintain ratio crop or extract crop or pad extract crop strategy. You can combine the extract crop strategy with different focus values to get the desired result. 
}

export const effect_enhancements = async (req, res) => {
    // we require the method , parameeter (rotation) from req.body nothing else
}
export const image_overlay = async (req, res) => {
    // this is a bit complicated have to study 
}

export const test = async (req, res) => {
    res.send("Test Successfull")
}


export const getImages = async (req, res) => {
    const images = await Image.find({}).populate("user");
    res.json(images)
}

export const getImage = async (req, res) => {
    const { fileId, fileName, originalUrl } = req.body;


    if (!fileId && !fileName && !originalUrl) {
        console.log("fileId, fileName or Url is required")
        return res.status(400).json({ message: "fileId, fileName or Url is required " })
    }

    let image
    if (fileId) {
        image = await Image.findById(fileId);
    } else if (fileName) {
        image = await Image.findOne({ fileName });
    } else if (originalUrl) {
        image = await Image.findOne({ originalUrl });
    }

    if (!image) {
        console.log("No image found")
        return res.status(400).json({ message: "No image found" })
    }
    res.json(image)
}




export const deleteImage = async (req, res) => {
    const id = req.params.id;

    const image = await Image.findByIdAndDelete(id);
    if (!image) {
        console.log("No image found")
        return res.status(400).json({ message: "No image found" })
    }
    res.status(200).json({ message: "Image deleted successfully" })
}