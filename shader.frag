uniform sampler2D texture;
uniform sampler2D tGlow;
varying vec2 vUv;
 
void main() { 
  vec4 texel = texture2D( texture, vUv );
  vec4 glow = texture2D( tGlow, vUv );
  gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 0.5;
 }