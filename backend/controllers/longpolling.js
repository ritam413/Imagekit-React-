
export const longpolling = async(req , res )=>{
    console.log("Client Connected waiting for new data")

    let latestData = {message:"initial Message"}

    let isClosed = false;

    req.on("close",()=>{
        isClosed = true;
        console.log("Client Disconnected");
    })

    const startTime = Date.now()

    const MAX_WAIT = 15000;
    
    const checkForNewData = ()=>{
        if(isClosed) return;

        const randomNumver = Math.random()

        if(randomNumver > 0.5)
        {
            latestData = {message:`New Data  recieved : ${randomNumver} at ${new Date().toLocaleTimeString()}`}

            res.json(latestData)
        }else if(Date.now() -startTime > MAX_WAIT){
            res.json({message:"No new data for 15 seconds"})
        }
        else{
            setTimeout(checkForNewData,2000)
        }
    }

    checkForNewData();
}