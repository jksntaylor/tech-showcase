import { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import { BlendFunction, Effect } from 'postprocessing'

const fragmentShader = `
  uniform float progress;
  uniform float time;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 p = 2.*uv - vec2(1.);

    p += 0.1 * cos(3. * p.yx + time + vec2(1.2, 3.4));
    p += 0.2 * cos(3.7 * p.yx + 1.4*time + vec2(2.2, 3.4));
    p += 0.3 * cos(5. * p.yx + 2.6*time + vec2(4.2, 1.4));
    p += 0.6 * cos(7. * p.yx + 3.6*time + vec2(10.2, 3.4));

    vec2 newUV = uv;
    newUV.x = mix(uv.x, length(p), progress);
    newUV.y = mix(uv.y, 0., progress);

    vec4 color = texture2D( inputBuffer, newUV );
    outputColor = color;
   }
`

type Props = {
  progress: number
  time: number
}

let _uProgress: number | undefined = 0
let _uTime: number = 0
// Effect implementation
class PixelRiverPass extends Effect {
  constructor(props: Props = { progress: 0, time: 0 }) {
    super('PixelRiverEffect', fragmentShader, {
      uniforms: new Map([['progress', new Uniform(props.progress)], ['time', new Uniform(0)]]),
      blendFunction: BlendFunction.NORMAL
    })
    _uProgress = props.progress
    _uTime = props.time
  }

  update(x: any, y: any, delta: number) {
    this.uniforms.get('progress').value = _uProgress
    this.uniforms.get('time').value += _uTime * 0.2
  }
}
// Effect component
export const PixelRiverEffect = forwardRef((props: { progress: number, time: number }, ref) => {
  const effect = useMemo(() => new PixelRiverPass({ progress: props.progress, time: props.time }), [props.progress, props.time])
  return <primitive ref={ref} props={props} object={effect} dispose={null} />
})
