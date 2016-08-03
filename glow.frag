precision highp float;

varying vec2 vUv;
uniform sampler2D texture;
uniform float opacity;

void main() {
  float frequency=100.0;
  float amplitude=0.033;
  float distortion=sin(vUv.y*frequency)*amplitude;
  vec4 color=texture2D(texture,vec2(vUv.x + distortion, vUv.y));
  color[3] = opacity;
  gl_FragColor = color;
}