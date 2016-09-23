uniform sampler2D texture;
uniform sampler2D tGlow;
uniform float time;
varying vec2 vUv;
 
void main() {
  float speed = 2.0; 
  float frequency=100.0;
  float amplitude=0.003;
  float distortion=cos(vUv.y*frequency+time*speed)*amplitude;
  vec4 texel = texture2D( texture, vec2(vUv.x+distortion, vUv.y) );
  vec4 glow = texture2D( tGlow, vUv );
  vec4 frag = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 0.5;
  gl_FragColor = frag;
 }
