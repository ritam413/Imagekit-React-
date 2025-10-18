import {fileURLToPath} from 'url'
import path from 'path'
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log("PORT: ",process.env.PORT)
import { connectToDB } from "./db/connectDB.js";
import {app} from "./app.js";



connectToDB()
    .then(() => {
        const PORT = process.env.PORT

        const server = app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`)
        })

        console.log("✅ Connected to DB")
        
        server.on('error', (error) => {
            console.log(error)
        })
    })
    .catch((err)=>{
        console.log("Error Connecting to DB",err)
        process.exit(1)
    })


