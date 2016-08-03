// Reference:
// http://glslb.in/s/7e7ed550

precision highp float;

attribute vec4 position;

uniform float planeSize;
uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

#pragma glslify: computeNoise = require('./noise');

float height(vec3 position) {
  float h = 0.0;
  h += computeNoise(vec2(position.xz * 0.5));
  h += 1.0 * computeNoise(vec3(position.xz + (time * 0.01), 0.0) * 20.0);
  float distToCenter = length(position.x) / planeSize;
  h *= smoothstep(0.15, 0.0, distToCenter);
  return h * 10.0;
}

void main () {
  vec3 outPosition = position.xyz;
  outPosition.y += height(position.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(outPosition, 1.0);
}