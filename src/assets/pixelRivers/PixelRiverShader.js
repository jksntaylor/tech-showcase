const PixelRiverShader = {

	uniforms: {

		'tDiffuse': { value: null },
    'uProgress': { value: 1 },
    'uTime': { value: 0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			vUv = uv;

		}`,

	fragmentShader: /* glsl */`

    uniform float uProgress;
    uniform float uTime;
		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

      vec2 p = 2.*vUv - vec2(1.);

      p += 0.1 * cos(2.9 * p.yx + 1.0*uTime + vec2(1.2, 3.4));
      p += 0.2 * cos(3.7 * p.yx + 1.4*uTime + vec2(2.2, 3.4));
      p += 0.3 * cos(4.7 * p.yx + 2.6*uTime + vec2(4.2, 1.4));
      p += 0.6 * cos(6.7 * p.yx + 3.6*uTime + vec2(10.2, 3.4));

      vec2 newUV = vUv;
      newUV.x = mix(vUv.x, length(p), uProgress);
      newUV.y = mix(vUv.y, 0., uProgress);

      gl_FragColor = texture2D( tDiffuse, newUV );
		}`

};

export { PixelRiverShader };
