import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const HttpsPolling = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        console.log("Polling started")
        let isMounted = true
        const startPolling = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/poll',
                    {
                        method: "GET",
                        credentials: "include"
                    }
                )

                const data = await response.json()
                if (response.ok === 200 && isMounted) {
                    setData(data.data)
                    console.log("Data received:", data);
                    
                    
                    startPolling();
                }
            }
            catch (err){
                console.log(`Error while white polling: ${err}`)
                if(isMounted){
                    setTimeout(startPolling,2000)
                }
            }

            startPolling();

            return () => {
                isMounted = false
            }
        }
    },[])

    
    return (
        <div>

        </div>
    )
}

export default HttpsPolling
