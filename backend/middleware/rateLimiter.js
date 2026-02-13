import rateLimit from "express-rate-limit";


const authlimiter = rateLimit({
    windowMs:15*60*1000,
    limit:5,
    standardHeaders: true,legacyHeaders: false, 
    message:"Too many requests from this IP, please try again after 15 minutes"
})

const apilimiter = rateLimit({
    windowMs:15*60*1000,
    limit:10,
    standardHeaders: true,legacyHeaders: false,   
    message:"Too many requests from this IP, please try again after 15 minutes"
})

const editLimiter =  rateLimit({
    windowMs:5*60*1000,
    limit:30,
    standardHeaders: true,legacyHeaders: false,   
    message:"Too many requests from this IP, please try again after 15 minutes"
})

const fetchDataLimitter = rateLimit({
    windowMs:5*60*1000,
    limit:100,
    standardHeaders: true,legacyHeaders: false,   
    message:"Too many requests from this IP, please try again after 15 minutes"
})

 

export {authlimiter , apilimiter}