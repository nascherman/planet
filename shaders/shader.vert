precision highp float;

varying vec2 vUv;
uniform float time;

#pragma glslify: computeNoise = require('./noise');

float height(vec3 position) {
  float h = 0.0;
  h += computeNoise(vec2(position.xz * 0.5));
  h += 1.0 * computeNoise(vec3(position.xz + (time * 0.01), 0.0) * 20.0);
  float distToCenter = length(position.x) / 200.00;
  h *= smoothstep(0.99, 0.0, distToCenter);
  return h * 10.0;
}

void main() {
    vUv = uv;vec3 outPosition = position.xyz;
    outPosition.y += height(position.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(outPosition, 1.0);
}
