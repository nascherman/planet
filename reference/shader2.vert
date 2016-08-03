// Reference:
// http://glslb.in/s/7e7ed550

precision highp float;

attribute vec4 position;

uniform float planeSize;
uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

#pragma glslify: computeNoise = require('./noise.glsl')

float terrain (vec3 position) {
  float height = 0.0;

  // large hills
  height += 15.0 * computeNoise(vec2(position.xz * 0.05));

  return height;
}

void main () {
  // get terrain height offset
  float height = terrain(position.xyz);

  // offset final position by height
  vec3 outPosition = position.xyz;
  outPosition.y += height;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(outPosition, 1.0);
}