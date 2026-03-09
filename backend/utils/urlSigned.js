import { createHmacSha1 } from "@imagekit/nodejs/lib/crypto-utils.js";
import crypto from 'crypto'


const secureUrl = (imageUrl) => {

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    // Split by '/', remove the first 4 elements, then join the rest back
    let urlEndpoint =  imageUrl.split('/').slice(0,4).join('/')+"/";
    // urlEndpoint = urlEndpoint+"/"
    // console.log(result); // Outputs: /assets/image.jpgurlEndpoint +"/"

    var expiryTime = parseInt(new Date().getTime() / 1000, 10) + 600;

    var str = imageUrl.replace(urlEndpoint, "")

    str = str+expiryTime

    var signature = crypto.createHmac('sha1',privateKey).update(str).digest('hex');

    var finalImageUrl = imageUrl + "?ik-t" + expiryTime + "&ik-s=" + signature;

    return finalImageUrl
}

export  {secureUrl}