export const displacementFragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture0;
  uniform sampler2D uTexture1;
  uniform float uProgress;
  uniform float uDisplacement;
  uniform float uRgbShift;
  uniform vec2 uResolution;
  uniform vec2 uTex0Size;
  uniform vec2 uTex1Size;
  varying vec2 vUv;

  // "cover" fit: llena el plano sin deformar la imagen
  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    vec2 s = res / img;
    float scale = max(s.x, s.y);
    vec2 size = img * scale;
    vec2 offset = (res - size) * 0.5 / res;
    vec2 ratio = size / res;
    return (uv - offset) / ratio;
  }

  void main() {
    vec2 uv0 = coverUv(vUv, uResolution, uTex0Size);
    vec2 uv1 = coverUv(vUv, uResolution, uTex1Size);
    float p = smoothstep(0.0, 1.0, uProgress);
    float wave = sin(p * 3.14159265);
    vec2 disp = vec2(0.0, wave * uDisplacement);
    float shift = uRgbShift * wave;

    vec4 c0 = texture2D(uTexture0, uv0 + disp);
    vec4 c1 = texture2D(uTexture1, uv1 - disp);
    c0.r = texture2D(uTexture0, uv0 + disp + vec2(shift, 0.0)).r;
    c1.r = texture2D(uTexture1, uv1 - disp + vec2(shift, 0.0)).r;

    gl_FragColor = mix(c0, c1, p);
  }
`;
