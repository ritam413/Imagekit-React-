import Video from '../models/video.model.js'


export const uploadVideo = async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileName = req.file.originalname;

        const response = await client.files.upload({
            file: fs.createReadStream(filePath),
            fileName: fileName + Date.now(),
        })

        if (!response) {
            console.log("Error uploading file")
            return res.status(400).json({ message: "Error uploading file" })
        }
        console.log("File uploaded successfully: ")
        console.log(chalk.green(` ${response.url}`))
        fs.unlinkSync(filePath);

        const imageBaseUrl =await Video.create({
            user: req.user._id,
            originalUrl: response.url,
            filePath: response.filePath,
            fileName: response.name,
        });

        console.log("✅ File Uploaded to DB: ",imageBaseUrl.originalUrl)
        return res.json({ success: true, data: response })

    } catch (err) {
        console.log("Error uploading file", err)
        return res.status(400).json({ message: "Error uploading file" })
    }
}

export const resize_crop = async (req, res) => {
    // Choosing the right cropping strategy

}

export const overlay_video = async (req,res)=>{
    // handle image overlay 
}

export const common_Transformation = async (req,res)=>{
    // handle common transformation like rotation background , border , glass morphism 
}

export const audio_Transformation = async (req,res)=>{
    // handle audio transformation 
}

export const thumbnail = async (req,res)=>{
    // create thumbnail from videos 
}

export const trim_Vidoes = async (req,res)=>{
    // trim videos
}

export const adaptive_bitrate = async (req,res)=>{
    // handle adaptive bitrate
}

export const getVideos = async (req,res)=>{
    
    try {
        const videos = await Video.find({}).populate("user");
        if(!videos){
            console.log("Videos not found")
        }
        res.json(videos)
    } catch (error) {
        console.log(
            "Error getting videos",
            error
        )        
    }
}

export const getVideo = async (req,res)=>{
    const {fileId, fileName , originalUrl } = req.body;


   if(!fileId && !fileName && !originalUrl){
    console.log("fileId, fileName or Url is required")
    return res.status(400).json({message:"fileId, fileName or Url is required "})
   }

   let video
   if(fileId){
    video = await Video.findById(fileId);
   }else if(fileName){
    video = await Video.findOne({fileName});
   }else if(originalUrl){
    video = await Video.findOne({originalUrl});
   }Video

   if(!video){
    console.log("No image found")
    return res.status(400).json({message:"No image found"})
   }
   res.json(video)
}


export const deleteVideo = async (req,res)=>{
    const id  = req.params.id;
    
    try{
        const video = await Video.findByIdAndDelete(id);

        if(!video) {
            console.log("No video found")
            return res.status(400).json({message:"No video found"})
        }

        res.status(200).json({message:"Video deleted successfully"})
    }

}