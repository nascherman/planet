// Reference:
// http://glslb.in/s/7e7ed550

precision highp float;

attribute vec4 position;

uniform float planeSize;
uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main () {
  vec3 outPosition = position.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(outPosition, 1.0);
}