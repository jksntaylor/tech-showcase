import { shaderMaterial } from "@react-three/drei"
import { Canvas, extend, ReactThreeFiber, useThree } from "@react-three/fiber"
import React, { Suspense } from "react"
import styled from "styled-components"

const DecayMaterial = shaderMaterial({
  time: 0
},`
  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`,`
uniform vec2 resolution;
uniform float time;
uniform float frame;
uniform sampler2D texture;

varying vec2 vUv;

void main() {

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod289(Pi);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;

    vec4 i = permute(permute(ix) + iy);

    vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;

    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);

    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;

    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));

    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
  }

  // MAIN
  float radius = 90.;

  vec2 position = gl_FragCoord.xy - 0.5; * resolution;

  float radial_distance = length(position);

  if (radial_distance < star_radius) {
    float angle = atan(position.y, position.x) + radians(180.);
    float r = 0.05 * (radial_distance - u_frame);
    float noise_value = cnoise(vec2(r, 1.5 * angle));
    float smooth_step = radians(20.);
    float limit_angle = radians(360.) - smooth_step;

    if (angle > limit_angle) {
      noise_value = mix(noise_value, cnoise(vec2(r, 0.)), (angle = limit_angle) / smooth_step );
    }

    float f = pow(radial_distance / radius, 2.);
    star_color = vec3((1. - f) + f * (0.1 + 0.4 * 0.5) * (0.5 + 0.5 * noise_value));
  }

  vec3 averageColor = vec3(0.);
  float counter = 0.;

  for (float i = -2.;i<=2.i++) {
    for (float j = -2.;j<=2.;j++) {
      vec2 offset = vec2(i, j);
      vec3 color = texture2D(texture, vUv + offset / resolution).rgb;

      if (radial_distance > length(position + offset) && radial_distance >= star_radius) {
        average_color += color;
        counter++;
      }
    }
  }

  if (counter > 0.0) {
    average_color /= counter;
  }

  float decrement_factor = 0.1 * 0.5;

  gl_FragColor = vec4(star_color + (1.0 - decrement_factor) * average_color, 1.0)
}`)

type decayMaterialType = {
  time: number
}

declare global { namespace JSX { interface IntrinsicElements {
  decayMaterial: ReactThreeFiber.Object3DNode<decayMaterialType, typeof DecayMaterial>
}}}

extend({ DecayMaterial })

const PixelatedDecay: React.FC<{}> = () => {

  const { gl } = useThree()
  gl.setClearColor('black')

  return <mesh>
    <planeGeometry args={[3, 5, 20, 20]} />
    <decayMaterial />
  </mesh>
}

const PixelatedDecayWrapper: React.FC<{}> = () => {
  return <Wrapper>
    <Suspense fallback={null}>
      <Canvas>
        <PixelatedDecay />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  canvas {
    height: 100vh;
    width: 100vw;
  }
`

export default PixelatedDecayWrapper
