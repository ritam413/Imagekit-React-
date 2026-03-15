import {filters} from 'fabric'
import { useImageStore } from '../zustand/image.store'

const ConvuluteFilter=(c)=>{
    const sharpen = new filters.Convolute({
        matrix:[
            0  , -1 , 0,
            -1 , c  , 0,
            0  , -1 , 0 
        ]
    })

    
}

