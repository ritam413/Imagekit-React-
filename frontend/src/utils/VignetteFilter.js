import { filters, classRegistry } from 'fabric';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class VignetteFilter extends filters.BaseFilter {
  // Used for serialization / classRegistry lookup
  static type = 'Vignette';

  // Default property values — BaseFilter reads these to populate instances
  // and to serialize via toObject() automatically
  static defaults = {
    intensity: 0.6,
    centerX: null,
    centerY: null,
    innerRadius: null,
    featherRadius: null,
    outerRadius: null,
    continueFading: false,
  };

  // Declare uniform names — BaseFilter v7 resolves WebGLUniformLocations
  // for these automatically; uStepW / uStepH are handled by BaseFilter itself
  static uniformLocations = [
    'uCenter',
    'uInnerRadius',
    'uFeatherRadius',
    'uOuterRadius',
    'uIntensity',
    'uContinueFading',
  ];

  constructor(options = {}) {
    super(options);
    // Clamp intensity after BaseFilter assigns defaults + options
    if (typeof this.intensity === 'number') {
      this.intensity = clamp(this.intensity, 0, 1);
    }
  }

  // Capture source dimensions before BaseFilter calls sendUniformData.
  // In v7 sendUniformData only receives (gl, uniformLocations), so we
  // stash the dimensions here for use in that method.
  applyToWebGL(options) {
    this._sourceWidth = options.sourceWidth;
    this._sourceHeight = options.sourceHeight;
    super.applyToWebGL(options);
  }

  applyTo2d({ imageData }) {
    if (!imageData) return;

    const { data, width, height } = imageData;
    if (!data || !width || !height) return;

    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);

    const centerX = this.centerX ?? width / 2;
    const centerY = this.centerY ?? height / 2;

    const innerRadius = this.innerRadius ?? minDim * 0.15;
    const featherRadius = this.featherRadius ?? minDim * 0.4;
    const outerRadius = this.outerRadius ?? maxDim * 0.7;

    const innerRadiusSq = innerRadius * innerRadius;
    const featherRadiusSq = featherRadius * featherRadius;
    const outerRadiusSq = outerRadius * outerRadius;

    const intensity = clamp(this.intensity ?? 0.6, 0, 1);
    const continueFading = !!this.continueFading;

    const featherSpan = Math.max(featherRadius - innerRadius, 1e-6);
    const outerFadeSpan = Math.max(
      Math.hypot(width, height) - outerRadius,
      1e-6
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceSq = dx * dx + dy * dy;

        let factor = 1;

        if (distanceSq <= innerRadiusSq) {
          factor = 1;
        } else if (distanceSq <= featherRadiusSq) {
          const distance = Math.sqrt(distanceSq);
          const t = (distance - innerRadius) / featherSpan;
          factor = 1 - intensity * clamp(t, 0, 1);
        } else if (distanceSq <= outerRadiusSq) {
          factor = 1 - intensity;
        } else if (continueFading) {
          const distance = Math.sqrt(distanceSq);
          const t = clamp((distance - outerRadius) / outerFadeSpan, 0, 1);
          factor = (1 - intensity) * (1 - t);
        } else {
          factor = 1 - intensity;
        }

        data[idx] *= factor;
        data[idx + 1] *= factor;
        data[idx + 2] *= factor;
      }
    }
  }

  getFragmentSource() {
    // uStepW = 1/width and uStepH = 1/height are injected by BaseFilter,
    // so we derive pixel-space dimensions from them instead of a separate
    // uResolution uniform.
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform float uStepW;
      uniform float uStepH;
      uniform vec2 uCenter;
      uniform float uInnerRadius;
      uniform float uFeatherRadius;
      uniform float uOuterRadius;
      uniform float uIntensity;
      uniform float uContinueFading;
      varying vec2 vTexCoord;

      void main() {
        float w = 1.0 / uStepW;
        float h = 1.0 / uStepH;
        vec2 pixelCoord = vTexCoord * vec2(w, h);
        vec2 diff = pixelCoord - uCenter;
        float distanceSq = dot(diff, diff);
        float innerSq = uInnerRadius * uInnerRadius;
        float featherSq = uFeatherRadius * uFeatherRadius;
        float outerSq = uOuterRadius * uOuterRadius;
        float factor = 1.0;

        if (distanceSq <= innerSq) {
          factor = 1.0;
        } else if (distanceSq <= featherSq) {
          float dist = sqrt(distanceSq);
          float t = clamp((dist - uInnerRadius) / (uFeatherRadius - uInnerRadius), 0.0, 1.0);
          factor = 1.0 - (uIntensity * t);
        } else if (distanceSq <= outerSq) {
          factor = 1.0 - uIntensity;
        } else {
          if (uContinueFading > 0.5) {
            float maxDist = length(vec2(w, h));
            float t = clamp((sqrt(distanceSq) - uOuterRadius) / (maxDist - uOuterRadius), 0.0, 1.0);
            factor = (1.0 - uIntensity) * (1.0 - t);
          } else {
            factor = 1.0 - uIntensity;
          }
        }

        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = vec4(color.rgb * factor, color.a);
      }
    `;
  }

  // In v7, sendUniformData only receives (gl, uniformLocations).
  // Dimensions were captured in applyToWebGL above.
  sendUniformData(gl, uniformLocations) {
    const width = this._sourceWidth || 1;
    const height = this._sourceHeight || 1;
    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);

    const centerX = this.centerX ?? width / 2;
    const centerY = this.centerY ?? height / 2;

    const innerRadius = this.innerRadius ?? minDim * 0.15;
    const featherRadius = this.featherRadius ?? minDim * 0.4;
    const outerRadius = this.outerRadius ?? maxDim * 0.7;

    gl.uniform2f(uniformLocations.uCenter, centerX, centerY);
    gl.uniform1f(uniformLocations.uInnerRadius, innerRadius);
    gl.uniform1f(uniformLocations.uFeatherRadius, featherRadius);
    gl.uniform1f(uniformLocations.uOuterRadius, outerRadius);
    gl.uniform1f(uniformLocations.uIntensity, clamp(this.intensity ?? 0.6, 0, 1));
    gl.uniform1f(uniformLocations.uContinueFading, this.continueFading ? 1.0 : 0.0);
  }

  isNeutralState() {
    return (this.intensity ?? 0) <= 0;
  }
}

// Register so canvas.loadFromJSON can reconstruct this filter by type name
classRegistry.setClass(VignetteFilter);

export default VignetteFilter;
