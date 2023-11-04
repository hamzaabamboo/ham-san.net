import { BackSide, Color, Mesh, Scene, ShaderMaterial, SphereGeometry } from 'three';

export const createSky = (scene: Scene, topColor: Color) => {
  const vertexShader = `varying vec3 vWorldPosition;
    
    void main() {
    
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
    }`;
  const fragmentShader = `uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    
    varying vec3 vWorldPosition;
    
    void main() {
    
        float h = normalize( vWorldPosition + offset ).y;
        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    
    }`;
  const uniforms = {
    topColor: { value: new Color(0x0077ff) },
    bottomColor: { value: new Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };
  uniforms['topColor'].value.copy(topColor);

  scene.fog?.color.copy(uniforms['bottomColor'].value);

  const skyGeo = new SphereGeometry(4000, 32, 15);
  const skyMat = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: BackSide
  });

  const sky = new Mesh(skyGeo, skyMat);
  return sky;
};
