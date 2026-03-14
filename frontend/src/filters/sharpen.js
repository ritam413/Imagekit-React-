import {filters} from 'fabric'
import { useImageStore } from '../zustand/image.store'

const activeImageUrl = useImageStore((state)=>state.activeImage)

if(!activeImageUrl) return;

const sharpen = new filters.Convolute({
    matrix:[
        
    ]
})
