import * as THREE from 'three';

export type PlayId = 'darts';

export type PlayCopy = {
  exit: string;
  openPage: string;
  darts: {
    intro: string;
    remaining: string;
    round: string;
    bust: string;
    win: string;
    newGame: string;
    miss: string;
  };
};

export type PlayPose = { position: THREE.Vector3; lookAt: THREE.Vector3 };

export type PlayContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  room: THREE.Object3D;
  stats: HTMLElement;
  controls: HTMLElement;
  copy: PlayCopy;
};

export type PlaySession = {
  pose: PlayPose;
  intro: string;
  update: (dt: number) => void;
  pointerDown: (ndc: THREE.Vector2) => void;
  pointerMove: (ndc: THREE.Vector2) => void;
  pointerUp: (ndc: THREE.Vector2) => void;
  keyDown: (event: KeyboardEvent) => boolean;
  keyUp: (event: KeyboardEvent) => boolean;
  dispose: () => void;
};

const playIds: readonly PlayId[] = ['darts'];

export const isPlayable = (id: string): id is PlayId => playIds.includes(id as PlayId);

export const findNode = (root: THREE.Object3D, name: string) => {
  const wanted = name.replace(/[ _]/g, '');
  let found: THREE.Object3D | undefined;
  root.traverse((object) => {
    if (!found && object.name.replace(/[ _]/g, '') === wanted) found = object;
  });
  return found;
};

let audio: AudioContext | undefined;
export const playTone = (frequency: number, duration = 0.08, volume = 0.1) => {
  audio ??= new AudioContext();
  if (audio.state === 'suspended') void audio.resume();
  const now = audio.currentTime;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  const oscillator = audio.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
};

const button = (label: string, onClick: () => void) => {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'room-play-button';
  node.textContent = label;
  node.addEventListener('click', onClick);
  return node;
};

const dartOrder = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

export const dartScore = (x: number, y: number) => {
  const r = Math.hypot(x, y);
  if (r <= 0.0064) return { points: 50, label: 'BULL', double: true };
  if (r <= 0.016) return { points: 25, label: '25', double: false };
  if (r > 0.17) return { points: 0, label: '', double: false };
  const degrees = ((Math.atan2(x, y) * 180) / Math.PI + 369) % 360;
  const number = dartOrder[Math.floor(degrees / 18)];
  if (r >= 0.162) return { points: number * 2, label: `D${number}`, double: true };
  if (r >= 0.099 && r <= 0.107) return { points: number * 3, label: `T${number}`, double: false };
  return { points: number, label: String(number), double: false };
};

const darts = (context: PlayContext): PlaySession => {
  const { scene, camera, room, stats, controls, copy } = context;
  const boardCenter = new THREE.Vector3(0.795, 1.54, -1.7425);
  const boardNormal = new THREE.Vector3(0, 0, 1);
  const gravity = new THREE.Vector3(0, -9.81, 0);
  const template = findNode(room, 'Dart 1');
  const decorative = ['Dart 4', 'Dart 5', 'Dart 6']
    .map((name) => findNode(room, name))
    .filter(Boolean) as THREE.Object3D[];
  decorative.forEach((object) => (object.visible = false));
  const makeDart = () => {
    const dart = template
      ? template.clone(true)
      : new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.15));
    if (template) dart.scale.copy(template.getWorldScale(new THREE.Vector3()));
    scene.add(dart);
    return dart;
  };
  const tipAxis = new THREE.Vector3(0, -1, 0);
  const orient = (dart: THREE.Object3D, direction: THREE.Vector3) =>
    dart.quaternion.setFromUnitVectors(tipAxis, direction.clone().normalize());
  const raycaster = new THREE.Raycaster();
  const aim = new THREE.Vector2();
  let hand = makeDart();
  let flying: { dart: THREE.Object3D; velocity: THREE.Vector3; fall: boolean } | null = null;
  let stuck: THREE.Object3D[] = [];
  let pullStart = 0;
  let pulling = false;
  let remaining = 301;
  let turnStart = 301;
  let turnDarts: string[] = [];
  let round = 1;
  let message = '';
  let collectTimer = 0;
  const render = () => {
    stats.textContent = `${copy.darts.remaining} ${remaining} · ${copy.darts.round} ${round} · ${turnDarts.join(' ')}${message ? ` · ${message}` : ''}`;
  };
  const aimDirection = () => {
    raycaster.setFromCamera(aim, camera);
    return raycaster.ray.direction.clone();
  };
  const placeHand = (dt = 1) => {
    if (!hand || flying) return;
    const direction = aimDirection();
    const offset = new THREE.Vector3(0.09, -0.08, -0.32).applyQuaternion(camera.quaternion);
    const pullback = pulling ? Math.min(0.08, (performance.now() - pullStart) / 3000) : 0;
    const target = camera.position.clone().add(offset).addScaledVector(direction, -pullback);
    hand.position.lerp(target, Math.min(1, dt * 20));
    orient(hand, direction);
  };
  const newGame = () => {
    stuck.forEach((dart) => dart.removeFromParent());
    stuck = [];
    remaining = 301;
    turnStart = 301;
    turnDarts = [];
    round = 1;
    message = '';
    render();
  };
  const release = () => {
    if (!pulling || flying || !hand || collectTimer > 0) return;
    pulling = false;
    const held = Math.min(1, (performance.now() - pullStart) / 600);
    const speed = 9 + held * 5;
    raycaster.setFromCamera(aim, camera);
    const aimPoint = new THREE.Vector3();
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(boardNormal, boardCenter);
    if (!raycaster.ray.intersectPlane(plane, aimPoint)) aimPoint.copy(boardCenter);
    const tremble = Math.max(0, (performance.now() - pullStart) / 1000 - 1.2) * 0.04;
    aimPoint.x += (Math.random() - 0.5) * tremble;
    aimPoint.y += (Math.random() - 0.5) * tremble;
    const velocity = aimPoint.sub(hand.position).normalize().multiplyScalar(speed);
    flying = { dart: hand, velocity, fall: false };
    hand = null as unknown as THREE.Object3D;
    playTone(220, 0.05, 0.05);
  };
  const land = (point: THREE.Vector3, onBoard: boolean) => {
    if (!flying) return;
    const dart = flying.dart;
    if (onBoard) {
      dart.position.copy(point).addScaledVector(flying.velocity.clone().normalize(), 0.012);
      const local = point.clone().sub(boardCenter);
      const result = dartScore(local.x, local.y);
      if (turnDarts.length === 0) turnStart = remaining;
      const next = remaining - result.points;
      if (next < 0 || next === 1 || (next === 0 && !result.double)) {
        message = copy.darts.bust;
        turnDarts.push(result.label || copy.darts.miss);
        remaining = turnStart;
        turnDarts.length = 3;
      } else {
        remaining = next;
        turnDarts.push(result.label || copy.darts.miss);
        message = remaining === 0 ? copy.darts.win : '';
      }
      playTone(result.points ? 520 + result.points * 5 : 160, 0.07, 0.08);
      stuck.push(dart);
      flying = null;
    } else {
      flying.fall = true;
      return;
    }
    if (turnDarts.length >= 3) collectTimer = 1.4;
    else hand = makeDart();
    render();
  };
  const update = (dt: number) => {
    if (collectTimer > 0) {
      collectTimer -= dt;
      if (collectTimer <= 0) {
        stuck.forEach((dart) => dart.removeFromParent());
        stuck = [];
        turnDarts = [];
        if (remaining > 0) round += 1;
        else newGame();
        message = '';
        hand = makeDart();
        render();
      }
    }
    placeHand(dt);
    if (!flying) return;
    const previous = flying.dart.position.clone();
    flying.velocity.addScaledVector(gravity, dt);
    flying.dart.position.addScaledVector(flying.velocity, dt);
    orient(flying.dart, flying.velocity);
    if (flying.fall) {
      if (flying.dart.position.y < 0.02) {
        flying.dart.position.y = 0.02;
        stuck.push(flying.dart);
        flying = null;
        if (turnStart === remaining && turnDarts.length === 0) turnStart = remaining;
        turnDarts.push(copy.darts.miss);
        if (turnDarts.length >= 3) collectTimer = 1.4;
        else hand = makeDart();
        render();
      }
      return;
    }
    const before = previous.clone().sub(boardCenter).dot(boardNormal);
    const after = flying.dart.position.clone().sub(boardCenter).dot(boardNormal);
    if (before > 0 && after <= 0) {
      const t = before / (before - after);
      const point = previous.lerp(flying.dart.position, t);
      const local = point.clone().sub(boardCenter);
      const onBoard = Math.hypot(local.x, local.y) <= 0.225;
      if (onBoard) land(point, true);
      else {
        flying.velocity.set(flying.velocity.x * 0.2, -0.5, 0.6);
        land(point, false);
      }
    }
  };
  controls.append(button(copy.darts.newGame, newGame));
  render();
  return {
    pose: { position: new THREE.Vector3(0.795, 1.58, 0.44), lookAt: boardCenter.clone() },
    intro: copy.darts.intro,
    update,
    pointerDown: (ndc) => {
      aim.copy(ndc);
      if (flying || collectTimer > 0) return;
      pulling = true;
      pullStart = performance.now();
    },
    pointerMove: (ndc) => aim.copy(ndc),
    pointerUp: (ndc) => {
      aim.copy(ndc);
      release();
    },
    keyDown: (event) => {
      if (event.key !== ' ') return false;
      if (!event.repeat && !pulling && !flying && collectTimer <= 0) {
        pulling = true;
        pullStart = performance.now();
      }
      return true;
    },
    keyUp: (event) => {
      if (event.key !== ' ') return false;
      release();
      return true;
    },
    dispose: () => {
      hand?.removeFromParent();
      flying?.dart.removeFromParent();
      stuck.forEach((dart) => dart.removeFromParent());
      decorative.forEach((object) => (object.visible = true));
    }
  };
};

const sessions: Record<PlayId, (context: PlayContext) => PlaySession> = { darts };

export const startPlay = (id: PlayId, context: PlayContext) => sessions[id](context);
