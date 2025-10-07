import ImageKit from '@imagekit/nodejs';
import { IMAGEKIT_PRIVATE_KEY,IMAGEKIT_PUBLIC_KEY,PUBLIC_URL_ENDPOINT } from '../constants.js';

// console.log("PRIVATE KEY: ",IMAGEKIT_PRIVATE_KEY)
// console.log("PUBLIC KEY: ",IMAGEKIT_PUBLIC_KEY)
// console.log("URL ENDPOINT : ",PUBLIC_URL_ENDPOINT)

const client = new ImageKit({
    privateKey: IMAGEKIT_PRIVATE_KEY ,
    publicKey: IMAGEKIT_PUBLIC_KEY,
});
// console.log("URL ENDPOINT : ",client.baseURL)

export default client


// const response = await client.files.upload({
//     file: fs.createReadStream('path/to/file'),
//     fileName: 'file-name.jpg',
// });

// console.log(response);


"https://ik.imagekit.io/ritam123/image_1758744337576_3iNQuXGfF?tr=h-200,w-300,c-maintain_ratio,q-80,f-webp,e-upscale"

"https://ik.imagekit.io/ritam123/image_1758744337576_3iNQuXGfF?tr=h-200,w-300,c-maintain_ratio,q-80,f-webp,e-upscale"