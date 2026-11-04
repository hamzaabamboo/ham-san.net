import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FogExp2,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer
} from 'three';

let disposeHero: (() => void) | undefined;

export const mountHomeHero = () => {
  disposeHero?.();
  const canvas = document.querySelector<HTMLCanvasElement>('[data-home-hero]');
  if (!canvas) return;

  const style = getComputedStyle(document.documentElement);
  const color = (name: string) => new Color(style.getPropertyValue(name).trim());
  const background = color('--atelier-surface-lowest');
  const accent = color('--atelier-accent');
  const scene = new Scene();
  scene.background = background;
  scene.fog = new FogExp2(background, 0.025);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  } catch {
    canvas.dataset.unavailable = 'true';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));

  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  const ambient = new AmbientLight(color('--atelier-fg'), 1.4);
  const light = new DirectionalLight(color('--atelier-fg'), 2.5);
  light.position.set(-5, 10, 8);
  const warmLight = new PointLight(accent, 180, 24, 2);
  warmLight.position.set(4, 4, -4);
  scene.add(ambient, light, warmLight);

  const world = new Group();
  scene.add(world);
  const glow = new MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.8 });

  const ribbonGeometry = new BufferGeometry();
  const ribbonVertices: number[] = [];
  const ribbonIndices: number[] = [];
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64;
    const angle = t * Math.PI * 2.5;
    const width = 0.25 + 0.5 * Math.sin(t * Math.PI);
    for (const edge of [-1, 1]) {
      ribbonVertices.push(
        (t - 0.5) * 6,
        Math.sin(t * Math.PI * 2) * 0.7 + edge * width * Math.cos(angle),
        edge * width * Math.sin(angle) + Math.sin(t * Math.PI) * 0.8
      );
    }
    if (i < 64) {
      const n = i * 2;
      ribbonIndices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
    }
  }
  ribbonGeometry.setAttribute('position', new Float32BufferAttribute(ribbonVertices, 3));
  ribbonGeometry.setIndex(ribbonIndices);
  ribbonGeometry.computeVertexNormals();
  const ribbonMaterial = new MeshStandardMaterial({
    color: color('--atelier-fg-muted'),
    roughness: 0.45,
    metalness: 0.65,
    side: DoubleSide
  });
  const landmarks: Group[] = [];
  for (let i = 0; i < 4; i += 1) {
    const landmark = new Group();
    const count = i === 0 ? 1 : i === 2 ? 3 : 2;
    for (let j = 0; j < count; j += 1) {
      const ribbon = new Mesh(ribbonGeometry, ribbonMaterial);
      ribbon.rotation.set(j * 0.7, j * 0.9, j * 0.45);
      ribbon.position.y = j * 0.5;
      landmark.add(ribbon);
    }
    landmark.position.set(i % 2 ? -3 : 3, 0.5, -6 - i * 15);
    landmark.rotation.set(0.25, i * 0.9, 0.18);
    world.add(landmark);
    landmarks.push(landmark);
  }

  const floorGeometry = new PlaneGeometry(100, 120, 80, 80);
  const floorMaterial = new ShaderMaterial({
    uniforms: { base: { value: background }, ink: { value: accent } },
    vertexShader: `varying float elevation; varying vec2 vUv; void main(){vUv=uv;vec3 p=position;p.z=sin(p.x*.16+p.y*.08)*1.4+sin(p.x*.07-p.y*.18)*.8;elevation=p.z;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader: `uniform vec3 base; uniform vec3 ink; varying float elevation; varying vec2 vUv; void main(){float contour=1.0-smoothstep(.0,.045,abs(fract(elevation*2.0)-.5));float fade=smoothstep(.0,.2,vUv.y);gl_FragColor=vec4(mix(base,ink,(.025+contour*.12)*fade),1.0);}`
  });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3.05, -30);
  world.add(floor);

  const beamGeometry = new BoxGeometry(0.035, 0.035, 1);
  for (let i = 0; i < 12; i += 1) {
    const beam = new Mesh(beamGeometry, glow);
    beam.scale.z = 3 + (i % 4) * 0.7;
    beam.position.set((i % 2 ? 1 : -1) * (3.4 + (i % 3)), -2.4 + (i % 4) * 1.4, -i * 5);
    world.add(beam);
  }

  const points: number[] = [];
  for (let i = 0; i < 1800; i += 1) {
    points.push(((i * 73) % 997) / 55 - 9, ((i * 41) % 601) / 75 - 3, -((i * 97) % 6200) / 100);
  }
  const particles = new BufferGeometry();
  particles.setAttribute('position', new Float32BufferAttribute(points, 3));
  const particleMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { ink: { value: accent }, time: { value: 0 } },
    vertexShader: `uniform float time; varying float vAlpha; void main(){vec3 p=position;p.y+=sin(time*.35+position.x)*.18;vec4 view=modelViewMatrix*vec4(p,1.0);vAlpha=clamp(1.0+view.z/65.0,0.0,.8);gl_PointSize=clamp(32.0/-view.z,1.2,4.5);gl_Position=projectionMatrix*view;}`,
    fragmentShader: `uniform vec3 ink; varying float vAlpha; void main(){float a=1.0-smoothstep(.1,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(ink,a*vAlpha);}`
  });
  world.add(new Points(particles, particleMaterial));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const look = new Vector3();
  let frame = 0;
  let previous = 0;
  let progress = 0;
  let target = 0;
  let lost = false;
  const chapters = Array.from(
    document.querySelectorAll<HTMLElement>('.home-hero-grid, .home-chapter')
  );
  let positions: number[] = [];
  const updateTarget = () => {
    const position = window.scrollY + window.innerHeight * 0.3;
    let chapter = 0;
    while (chapter < positions.length - 1 && position >= positions[chapter + 1]) chapter += 1;
    const start = positions[chapter] ?? 0;
    const end =
      positions[chapter + 1] ?? document.documentElement.scrollHeight - window.innerHeight;
    const fraction = Math.max(0, Math.min(1, (position - start) / Math.max(1, end - start)));
    target = Math.min(1, (chapter + fraction) / Math.max(1, positions.length));
    schedule();
  };
  const draw = (time: number) => {
    frame = 0;
    if (document.hidden || lost) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    progress = reducedMotion.matches
      ? target
      : progress + (target - progress) * (1 - Math.exp(-delta * 8));
    const mobile = window.innerWidth < 768;
    const cameraZ = 9 - progress * 50;
    landmarks.forEach((landmark, i) => {
      const distance = cameraZ - landmark.position.z;
      landmark.visible = distance > 5;
      landmark.scale.setScalar((mobile ? 0.5 : 0.8) * Math.min(1, Math.max(0, (distance - 5) / 8)));
      landmark.position.x = (i % 2 ? -1 : 1) * (mobile ? 0.5 : 3.4);
      landmark.position.y = mobile ? 2.8 : 0.5;
      landmark.rotation.y =
        i * 0.9 + (reducedMotion.matches ? 0 : Math.sin(time * 0.0004 + i) * 0.18);
    });
    camera.position.set(
      (mobile ? 0.3 : 1.2) + Math.sin(progress * Math.PI * 2) * 1.2,
      1.3 + Math.sin(progress * Math.PI) * 0.7,
      cameraZ
    );
    warmLight.position.z = camera.position.z - 10;
    look.set(mobile ? 0 : 1.2, -0.3, camera.position.z - 12);
    camera.lookAt(look);
    particleMaterial.uniforms.time.value = reducedMotion.matches ? 0 : time / 1000;
    renderer.render(scene, camera);
    if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    positions = chapters.map((chapter) => chapter.getBoundingClientRect().top + window.scrollY);
    updateTarget();
  };
  const visibility = () => {
    previous = 0;
    schedule();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    canvas.dataset.unavailable = 'true';
  };
  const contextRestored = () => {
    lost = false;
    delete canvas.dataset.unavailable;
    previous = 0;
    schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const content = document.querySelector<HTMLElement>('.home-content');
  if (content) observer.observe(content);
  window.addEventListener('scroll', updateTarget, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  reducedMotion.addEventListener('change', visibility);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  resize();

  disposeHero = () => {
    observer.disconnect();
    window.removeEventListener('scroll', updateTarget);
    document.removeEventListener('visibilitychange', visibility);
    reducedMotion.removeEventListener('change', visibility);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    if (frame) cancelAnimationFrame(frame);
    ribbonGeometry.dispose();
    beamGeometry.dispose();
    floorGeometry.dispose();
    particles.dispose();
    [glow, ribbonMaterial, floorMaterial, particleMaterial].forEach((material) =>
      material.dispose()
    );
    renderer.dispose();
    disposeHero = undefined;
  };
};

document.addEventListener('astro:before-swap', () => disposeHero?.());
