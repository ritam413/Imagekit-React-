import { filters } from 'fabric'
// import  fabric from 'fabric'
import * as fabric from 'fabric'

const BaseFilter = filters.BaseFilter

export class WarmFilter extends BaseFilter {
    static type='WarmFilter';

    // 1. Define your parameters
    constructor(options = {}) {
        super();
        this.warmth = options.warmth || 0
    }

    // 2. Ensure serialization works
    toObject() {
        return {
            ...super.toObject(),
            warmth:this.warmth,
        };
    }

    // 3. 2D Canvas Routine (CPU-based filtering)
    applyTo2d({ imageData }) {
        const data = imageData.data
        const factor = this.warmth
        for (let i = 0; i < data.length; i += 4) {
            if(factor > 0 ){
                //increase the red channel based on warmth(+15) more
                data[i] = Math.min(255, data[i] + (15*factor));
                //increase the green channel slightly(+5)
                data[i + 1] = Math.min(255, data[i + 1] + (5*factor));
                //decrease the blue channel reduce 
                data[i + 2] = Math.max(0, data[i + 2] - (5*factor));
            }else{
                data[i] = Math.max(255,data[i]-(5*factor))
                // data[i+1] = Math.min(255,data[i+1] + (5*factor))
                data[i+2] = Math.min(255,data[i+2] + (15*factor))
            }
        }
    }
    // 4. Applying WebGL (GPU - acclerated filtering)
    getFragmentSource() {
        return `
                precision highp float;
                uniform sampler2D uTexture;
                uniform float uWarmth;
                varying vec2 vTexCoord;

                void main() {
                    vec4 color = texture2D(uTexture, vTexCoord);
                    float factor = uWarmth ;
                    
                    if(factor > 0.0){
                        gl_FragColor = vec4(
                        min(color.r + (factor * 0.15), 1.0),
                        min(color.g + (factor * 0.05), 1.0),
                        max(color.b - (factor * 0.1), 0.0),
                        color.a
                        );
                    }else{
                        gl_FragColor = vec4(
                        max(color.r - (factor * 0.15), 0.0),
                        color.g,
                        min(color.b + (factor * 0.15), 1.0),
                        color.a
                        );
                    }
                );
            }
        `;
    }

    getUniformLocations(gl,program){
        return{
            ...super.getUniformLocations(gl,program),
            uWarmth:gl.getUniformLocations(program,'uWarmth'),
        }
    }
    sendUniformData(gl,uniformLocations){
        super.sendUniformData(gl,uniformLocations),
        gl.uniform1f(uniformLocations.uWarmth,this.warmth)
    }
};

// fabric.util.object.extend(fabric.filters, {
//   WarmFilter: WarmFilter
// });