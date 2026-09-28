import * as THREE from 'three';

export type PlayId = 'darts' | 'rubik' | 'piano';

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
  piano: {
    intro: string;
    chord: string;
    octave: string;
    sustain: string;
  };
  rubik: {
    intro: string;
    scramble: string;
    reset: string;
    time: string;
    best: string;
    ao5: string;
    solved: string;
    moves: string;
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

const playIds: readonly PlayId[] = ['darts', 'rubik', 'piano'];

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

const cstimerKeys: Record<string, string> = {
  j: 'U',
  f: "U'",
  h: 'F',
  g: "F'",
  i: 'R',
  k: "R'",
  d: 'L',
  e: "L'",
  s: 'D',
  l: "D'",
  w: 'B',
  o: "B'",
  ';': 'y',
  a: "y'",
  t: 'x',
  y: 'x',
  b: "x'",
  n: "x'",
  p: 'z',
  q: "z'",
  u: 'r',
  m: "r'",
  v: 'l',
  r: "l'",
  x: "M'",
  '.': "M'",
  '5': 'M',
  '6': 'M',
  z: 'd',
  '/': "d'",
  c: "u'",
  ',': 'u'
};

const scrambleSequence = () => {
  const faces = ['U', 'D', 'R', 'L', 'F', 'B'];
  const axis = (face: string) => Math.floor(faces.indexOf(face) / 2);
  const moves: string[] = [];
  while (moves.length < 20) {
    const face = faces[Math.floor(Math.random() * 6)];
    const last = moves[moves.length - 1]?.[0];
    const beforeLast = moves[moves.length - 2]?.[0];
    if (face === last) continue;
    if (last && beforeLast && axis(face) === axis(last) && axis(face) === axis(beforeLast))
      continue;
    moves.push(`${face}${['', "'", '2'][Math.floor(Math.random() * 3)]}`);
  }
  return moves;
};

const rubik = (context: PlayContext): PlaySession => {
  const { scene, camera, room, stats, controls, copy } = context;
  const cubies: THREE.Object3D[] = [];
  const stickers: THREE.Mesh[] = [];
  room.traverse((object) => {
    const name = object.name.replace(/[ _]/g, '');
    if (!(object instanceof THREE.Mesh) || !object.visible) return;
    if (name.startsWith('Rubikcubie')) cubies.push(object);
    else if (name.startsWith('Rubiksticker')) stickers.push(object);
  });
  const center = new THREE.Vector3();
  cubies.forEach((cubie) => center.add(cubie.getWorldPosition(new THREE.Vector3())));
  center.divideScalar(Math.max(cubies.length, 1));
  const spacing = 0.019;
  const homes = new Map<THREE.Object3D, THREE.Object3D>();
  stickers.forEach((sticker) => {
    const position = sticker.getWorldPosition(new THREE.Vector3());
    let nearest = cubies[0];
    let distance = Infinity;
    cubies.forEach((cubie) => {
      const d = cubie.getWorldPosition(new THREE.Vector3()).distanceTo(position);
      if (d < distance) {
        distance = d;
        nearest = cubie;
      }
    });
    homes.set(sticker, sticker.parent!);
    nearest.attach(sticker);
  });
  const faceNormals: Record<string, THREE.Vector3> = {
    U: new THREE.Vector3(0, 1, 0),
    D: new THREE.Vector3(0, -1, 0),
    F: new THREE.Vector3(-1, 0, 0),
    B: new THREE.Vector3(1, 0, 0),
    R: new THREE.Vector3(0, 0, 1),
    L: new THREE.Vector3(0, 0, -1)
  };
  const moveKinds: Record<string, { face: string; layers: number[] }> = {
    U: { face: 'U', layers: [1] },
    D: { face: 'D', layers: [1] },
    F: { face: 'F', layers: [1] },
    B: { face: 'B', layers: [1] },
    R: { face: 'R', layers: [1] },
    L: { face: 'L', layers: [1] },
    M: { face: 'L', layers: [0] },
    E: { face: 'D', layers: [0] },
    S: { face: 'F', layers: [0] },
    u: { face: 'U', layers: [1, 0] },
    d: { face: 'D', layers: [1, 0] },
    f: { face: 'F', layers: [1, 0] },
    b: { face: 'B', layers: [1, 0] },
    r: { face: 'R', layers: [1, 0] },
    l: { face: 'L', layers: [1, 0] },
    x: { face: 'R', layers: [1, 0, -1] },
    y: { face: 'U', layers: [1, 0, -1] },
    z: { face: 'F', layers: [1, 0, -1] }
  };
  const gridOf = (cubie: THREE.Object3D) =>
    cubie.getWorldPosition(new THREE.Vector3()).sub(center).divideScalar(spacing).round();
  const queue: { axis: THREE.Vector3; layers: number[]; angle: number; animate: boolean }[] = [];
  let turning: {
    pivot: THREE.Object3D;
    members: THREE.Object3D[];
    parents: THREE.Object3D[];
    angle: number;
    axis: THREE.Vector3;
    t: number;
  } | null = null;
  const beginTurn = () => {
    const next = queue.shift();
    if (!next) return;
    const pivot = new THREE.Object3D();
    pivot.position.copy(center);
    scene.add(pivot);
    pivot.updateMatrixWorld();
    const members = cubies.filter((cubie) =>
      next.layers.includes(Math.round(gridOf(cubie).dot(next.axis)))
    );
    const parents = members.map((cubie) => cubie.parent!);
    members.forEach((cubie) => pivot.attach(cubie));
    turning = {
      pivot,
      members,
      parents,
      angle: next.angle,
      axis: next.axis,
      t: next.animate ? 0 : 1
    };
    if (!next.animate) finishTurn();
  };
  const finishTurn = () => {
    if (!turning) return;
    turning.pivot.quaternion.setFromAxisAngle(turning.axis, turning.angle);
    turning.pivot.updateMatrixWorld();
    turning.members.forEach((cubie, index) => turning!.parents[index].attach(cubie));
    turning.pivot.removeFromParent();
    turning = null;
    afterTurn();
  };
  const enqueue = (move: string, animate = true) => {
    const kind = moveKinds[move[0]];
    if (!kind) return;
    const quarters = move.endsWith('2') ? 2 : 1;
    const direction = move.includes("'") ? 1 : -1;
    queue.push({
      axis: faceNormals[kind.face].clone(),
      layers: kind.layers,
      angle: direction * quarters * (Math.PI / 2),
      animate
    });
    if (!animate) while (queue.length && !turning) beginTurn();
    else if (!turning) beginTurn();
    if (!'xyz'.includes(move[0])) countMove();
  };
  let state: 'idle' | 'ready' | 'solving' | 'solved' = 'idle';
  let startedAt = 0;
  let moves = 0;
  let scrambleText = '';
  const times: number[] = [];
  const countMove = () => {
    if (state === 'ready') {
      state = 'solving';
      startedAt = performance.now();
      moves = 0;
    }
    if (state === 'solving') moves += 1;
  };
  const solved = () => {
    const faces = new Map<string, Set<string>>();
    stickers.forEach((sticker) => {
      const cubie = sticker.parent!;
      const normal = sticker
        .getWorldPosition(new THREE.Vector3())
        .sub(cubie.getWorldPosition(new THREE.Vector3()));
      const axis = [normal.x, normal.y, normal.z].map((value) => Math.abs(value));
      const index = axis.indexOf(Math.max(...axis));
      const key = `${index}${Math.sign([normal.x, normal.y, normal.z][index])}`;
      const material = Array.isArray(sticker.material) ? sticker.material[0] : sticker.material;
      const set = faces.get(key) ?? new Set<string>();
      set.add(material.name);
      faces.set(key, set);
    });
    return [...faces.values()].every((set) => set.size === 1);
  };
  const afterTurn = () => {
    if (state === 'solving' && !queue.length && solved()) {
      state = 'solved';
      times.push((performance.now() - startedAt) / 1000);
    }
    if (queue.length) beginTurn();
  };
  const scramble = () => {
    const sequence = scrambleSequence();
    scrambleText = sequence.join(' ');
    sequence.forEach((move) => {
      const kind = moveKinds[move[0]];
      const quarters = move.endsWith('2') ? 2 : 1;
      const direction = move.includes("'") ? 1 : -1;
      queue.push({
        axis: faceNormals[kind.face].clone(),
        layers: kind.layers,
        angle: direction * quarters * (Math.PI / 2),
        animate: false
      });
    });
    while (queue.length) beginTurn();
    state = 'ready';
    moves = 0;
  };
  const render = () => {
    const elapsed =
      state === 'solving'
        ? (performance.now() - startedAt) / 1000
        : state === 'solved'
          ? times[times.length - 1]
          : 0;
    const best = times.length ? Math.min(...times).toFixed(2) : '—';
    const last = times.slice(-5);
    const ao5 =
      last.length === 5
        ? (
            (last.reduce((sum, t) => sum + t, 0) - Math.max(...last) - Math.min(...last)) /
            3
          ).toFixed(2)
        : '—';
    stats.textContent = `${state === 'solved' ? `${copy.rubik.solved} · ` : ''}${copy.rubik.time} ${elapsed.toFixed(2)} · ${copy.rubik.moves} ${moves} · ${copy.rubik.best} ${best} · ${copy.rubik.ao5} ${ao5}${scrambleText && state !== 'solved' ? `\n${scrambleText}` : ''}`;
  };
  const raycaster = new THREE.Raycaster();
  let drag: { cubie: THREE.Object3D; point: THREE.Vector3; normal: THREE.Vector3 } | null = null;
  const pick = (ndc: THREE.Vector2) => {
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects([...cubies, ...stickers], false)[0];
    if (!hit || !hit.face) return null;
    const cubie = cubies.includes(hit.object) ? hit.object : hit.object.parent!;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    const axis = [normal.x, normal.y, normal.z].map((value) => Math.abs(value));
    const index = axis.indexOf(Math.max(...axis));
    const snapped = new THREE.Vector3();
    snapped.setComponent(index, Math.sign(normal.getComponent(index)));
    return { cubie, point: hit.point.clone(), normal: snapped };
  };
  const snapAxis = (vector: THREE.Vector3) => {
    const values = [vector.x, vector.y, vector.z].map((value) => Math.abs(value));
    const index = values.indexOf(Math.max(...values));
    const axis = new THREE.Vector3();
    axis.setComponent(index, 1);
    return axis;
  };
  controls.append(button(copy.rubik.scramble, scramble));
  render();
  return {
    pose: {
      position: center.clone().add(new THREE.Vector3(-0.2, 0.17, 0.1)),
      lookAt: center.clone()
    },
    intro: copy.rubik.intro,
    update: (dt) => {
      if (turning) {
        turning.t = Math.min(1, turning.t + dt / 0.11);
        turning.pivot.quaternion.setFromAxisAngle(turning.axis, turning.angle * turning.t);
        if (turning.t >= 1) finishTurn();
      }
      render();
    },
    pointerDown: (ndc) => {
      drag = pick(ndc);
    },
    pointerMove: () => {},
    pointerUp: (ndc) => {
      if (!drag) return;
      raycaster.setFromCamera(ndc, camera);
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(drag.normal, drag.point);
      const end = new THREE.Vector3();
      const start = drag;
      drag = null;
      if (!raycaster.ray.intersectPlane(plane, end)) return;
      const movement = end.sub(start.point);
      if (movement.length() < 0.006) return;
      const axis = snapAxis(new THREE.Vector3().crossVectors(start.normal, movement));
      const layer = Math.round(gridOf(start.cubie).dot(axis));
      const lever = start.point.clone().sub(center);
      const sign = Math.sign(new THREE.Vector3().crossVectors(axis, lever).dot(movement)) || 1;
      queue.push({ axis, layers: [layer], angle: sign * (Math.PI / 2), animate: true });
      if (!turning) beginTurn();
      countMove();
    },
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key === ' ') {
        scramble();
        return true;
      }
      const move = cstimerKeys[event.key.toLowerCase()];
      if (!move) return false;
      enqueue(move);
      return true;
    },
    keyUp: () => false,
    dispose: () => {
      while (queue.length || turning) {
        if (turning) finishTurn();
        else beginTurn();
      }
      stickers.forEach((sticker) => homes.get(sticker)?.attach(sticker));
    }
  };
};

const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const chordShapes: [string, number[]][] = [
  ['', [0, 4, 7]],
  ['m', [0, 3, 7]],
  ['dim', [0, 3, 6]],
  ['aug', [0, 4, 8]],
  ['sus2', [0, 2, 7]],
  ['sus4', [0, 5, 7]],
  ['5', [0, 7]],
  ['7', [0, 4, 7, 10]],
  ['maj7', [0, 4, 7, 11]],
  ['m7', [0, 3, 7, 10]],
  ['mMaj7', [0, 3, 7, 11]],
  ['m7b5', [0, 3, 6, 10]],
  ['dim7', [0, 3, 6, 9]],
  ['6', [0, 4, 7, 9]],
  ['m6', [0, 3, 7, 9]],
  ['add9', [0, 2, 4, 7]],
  ['m(add9)', [0, 2, 3, 7]],
  ['9', [0, 2, 4, 7, 10]],
  ['maj9', [0, 2, 4, 7, 11]],
  ['m9', [0, 2, 3, 7, 10]],
  ['7sus4', [0, 5, 7, 10]]
];

export const chordName = (notes: number[]) => {
  if (!notes.length) return '';
  const sorted = [...notes].sort((a, b) => a - b);
  const classes = [...new Set(sorted.map((note) => note % 12))];
  const bass = sorted[0] % 12;
  if (classes.length === 1) return noteNames[bass];
  const roots = [bass, ...classes.filter((note) => note !== bass)];
  for (const root of roots) {
    const intervals = classes.map((note) => (note - root + 12) % 12).sort((a, b) => a - b);
    const match = chordShapes.find(
      ([, shape]) =>
        shape.length === intervals.length &&
        shape.every((value, index) => value === intervals[index])
    );
    if (match) return `${noteNames[root]}${match[0]}${root === bass ? '' : `/${noteNames[bass]}`}`;
  }
  return sorted.map((note) => noteNames[note % 12]).join(' ');
};

const trackerKeys: Record<string, number> = {
  z: 0,
  s: 1,
  x: 2,
  d: 3,
  c: 4,
  v: 5,
  g: 6,
  b: 7,
  h: 8,
  n: 9,
  j: 10,
  m: 11,
  ',': 12,
  l: 13,
  '.': 14,
  ';': 15,
  '/': 16,
  q: 12,
  '2': 13,
  w: 14,
  '3': 15,
  e: 16,
  r: 17,
  '5': 18,
  t: 19,
  '6': 20,
  y: 21,
  '7': 22,
  u: 23,
  i: 24,
  '9': 25,
  o: 26,
  '0': 27,
  p: 28,
  '[': 29,
  '=': 30,
  ']': 31
};

const chordPads: [string, number[]][] = [
  ['C', [48, 52, 55, 60]],
  ['Am', [45, 52, 57, 60]],
  ['F', [41, 53, 57, 60]],
  ['G', [43, 55, 59, 62]],
  ['Em', [40, 52, 55, 59]],
  ['Dm7', [50, 53, 57, 60]],
  ['Fmaj7', [41, 52, 57, 60]],
  ['G7', [43, 53, 59, 62]]
];

const piano = (context: PlayContext): PlaySession => {
  const { camera, room, stats, controls, copy } = context;
  const keyNodes: { node: THREE.Object3D; center: THREE.Vector3; black: boolean }[] = [];
  room.traverse((object) => {
    const name = object.name.replace(/[ _]/g, '');
    const white = /^Keyboardwhitekey\d+$/.test(name);
    const black = /^Keyboardblackkey\d+-?\d+$/.test(name);
    if (!white && !black) return;
    const center = new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
    keyNodes.push({ node: object, center, black });
  });
  keyNodes.sort((a, b) => b.center.z - a.center.z);
  const lowest = 36;
  const keys = keyNodes.map((entry, index) => {
    const parent = entry.node.parent!;
    const world = entry.node.getWorldPosition(new THREE.Vector3());
    const down = parent
      .worldToLocal(world.clone().add(new THREE.Vector3(0, entry.black ? -0.007 : -0.008, 0)))
      .sub(parent.worldToLocal(world.clone()));
    return {
      ...entry,
      note: lowest + index,
      rest: entry.node.position.clone(),
      down,
      depth: 0,
      held: 0
    };
  });
  const glow = new THREE.Color(getComputedStyle(stats).getPropertyValue('--atelier-accent').trim());
  const tinted = keys.map((key) => {
    const materials: THREE.MeshStandardMaterial[] = [];
    key.node.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const original = object.material as THREE.MeshStandardMaterial;
      const material = original.clone();
      object.userData.pianoMaterial = original;
      object.material = material;
      materials.push(material);
    });
    return { key, materials };
  });
  const byNote = new Map(keys.map((key) => [key.note, key]));
  const meshToKey = new Map<THREE.Object3D, (typeof keys)[number]>();
  keys.forEach((key) => key.node.traverse((object) => meshToKey.set(object, key)));
  audio ??= new AudioContext();
  const sound = audio;
  if (sound.state === 'suspended') void sound.resume();
  const master = sound.createGain();
  master.gain.value = 0.5;
  const compressor = sound.createDynamicsCompressor();
  master.connect(compressor).connect(sound.destination);
  const voices = new Map<
    number,
    { gain: GainNode; stop: (at: number) => void; released: boolean }
  >();
  const sounding = new Set<number>();
  let sustain = false;
  let octave = 0;
  let lastChord = '';
  const frequency = (note: number) => 440 * 2 ** ((note - 69) / 12);
  const strike = (note: number, velocity = 0.8) => {
    voices.get(note)?.stop(sound.currentTime + 0.03);
    const now = sound.currentTime;
    const f = frequency(note);
    const gain = sound.createGain();
    const decay = 1.2 + 3.5 * (1 - (note - 36) / 60);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22 * velocity, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.09 * velocity, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    const filter = sound.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(12000, f * 9), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(9000, f * 3), now + 0.6);
    filter.connect(gain).connect(master);
    const partials: [number, number, OscillatorType][] = [
      [1, 0.6, 'triangle'],
      [2, 0.25, 'sine'],
      [3, 0.12, 'sine'],
      [1.003, 0.3, 'sawtooth']
    ];
    const oscillators = partials.map(([ratio, level, type]) => {
      const oscillator = sound.createOscillator();
      oscillator.type = type;
      oscillator.frequency.value = f * ratio;
      const partial = sound.createGain();
      partial.gain.value = level * (type === 'sawtooth' ? 0.25 : 1);
      oscillator.connect(partial).connect(filter);
      oscillator.start(now);
      oscillator.stop(now + decay + 0.1);
      return oscillator;
    });
    const voice = {
      gain,
      released: false,
      stop: (at: number) => {
        gain.gain.cancelScheduledValues(at);
        gain.gain.setTargetAtTime(0, at, 0.08);
        oscillators.forEach((oscillator) => oscillator.stop(at + 0.5));
        voices.delete(note);
      }
    };
    voices.set(note, voice);
  };
  const noteOn = (note: number, velocity = 0.8) => {
    if (!byNote.has(note)) return;
    const key = byNote.get(note)!;
    key.held += 1;
    strike(note, velocity);
    sounding.add(note);
    render();
  };
  const noteOff = (note: number) => {
    const key = byNote.get(note);
    if (!key || key.held === 0) return;
    key.held -= 1;
    if (key.held > 0) return;
    const voice = voices.get(note);
    if (voice && !sustain) voice.stop(sound.currentTime);
    else if (voice) voice.released = true;
    if (!sustain) sounding.delete(note);
    render();
  };
  const setSustain = (value: boolean) => {
    sustain = value;
    sustainButton.setAttribute('aria-pressed', String(value));
    if (!value) {
      voices.forEach((voice, note) => {
        if (voice.released && !byNote.get(note)?.held) {
          voice.stop(sound.currentTime);
          sounding.delete(note);
        }
      });
    }
    render();
  };
  const render = () => {
    const held = keys.filter((key) => key.held > 0).map((key) => key.note);
    const chord = chordName(held.length ? held : [...sounding]);
    if (chord) lastChord = chord;
    stats.textContent = `${copy.piano.chord} ${chord || lastChord || '—'} · ${copy.piano.octave} ${4 + octave} · ${copy.piano.sustain} ${sustain ? 'ON' : 'OFF'}`;
  };
  const raycaster = new THREE.Raycaster();
  const pick = (ndc: THREE.Vector2) => {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(
      keys.map((key) => key.node),
      true
    );
    for (const hit of hits) {
      const key = meshToKey.get(hit.object);
      if (key) return key;
    }
    return undefined;
  };
  let pointerNote: number | undefined;
  const pressedKeys = new Map<string, number>();
  const sustainButton = button(copy.piano.sustain, () => setSustain(!sustain));
  sustainButton.setAttribute('aria-pressed', 'false');
  controls.append(sustainButton);
  chordPads.forEach(([label, notes]) => {
    const pad = button(label, () => {});
    const release = () => {
      if (pad.dataset.down !== '1') return;
      pad.dataset.down = '';
      notes.forEach(noteOff);
    };
    pad.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      pad.dataset.down = '1';
      notes.forEach((note, index) => setTimeout(() => noteOn(note, 0.7), index * 12));
    });
    pad.addEventListener('pointerup', release);
    pad.addEventListener('pointerleave', release);
    controls.append(pad);
  });
  const keyboardCenter = keys.length
    ? keys.reduce((sum, key) => sum.add(key.center), new THREE.Vector3()).divideScalar(keys.length)
    : new THREE.Vector3(-1.41, 0.83, 0.54);
  render();
  return {
    pose: {
      position: keyboardCenter.clone().add(new THREE.Vector3(0.52, 0.42, 0)),
      lookAt: keyboardCenter.clone().add(new THREE.Vector3(0.02, 0, 0))
    },
    intro: copy.piano.intro,
    update: (dt) => {
      keys.forEach((key) => {
        const target = key.held > 0 ? 1 : 0;
        key.depth += (target - key.depth) * Math.min(1, dt * (target ? 40 : 18));
        key.node.position.copy(key.rest).addScaledVector(key.down, key.depth);
      });
      tinted.forEach(({ key, materials }) =>
        materials.forEach((material) =>
          material.emissive?.copy(glow).multiplyScalar(key.depth * (key.black ? 0.9 : 0.55))
        )
      );
    },
    pointerDown: (ndc) => {
      const key = pick(ndc);
      if (!key) return;
      pointerNote = key.note;
      noteOn(key.note, 0.6 + Math.random() * 0.2 + (key.black ? 0 : 0.1));
    },
    pointerMove: (ndc) => {
      if (pointerNote === undefined) return;
      const key = pick(ndc);
      if (!key || key.note === pointerNote) return;
      noteOff(pointerNote);
      pointerNote = key.note;
      noteOn(key.note, 0.65);
    },
    pointerUp: () => {
      if (pointerNote !== undefined) noteOff(pointerNote);
      pointerNote = undefined;
    },
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key === ' ') {
        if (!event.repeat) setSustain(true);
        return true;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        octave = Math.max(-1, Math.min(2, octave + (event.key === 'ArrowLeft' ? -1 : 1)));
        render();
        return true;
      }
      const offset = trackerKeys[event.key.toLowerCase()];
      if (offset === undefined) return false;
      if (event.repeat || pressedKeys.has(event.code)) return true;
      const note = 48 + octave * 12 + offset;
      pressedKeys.set(event.code, note);
      noteOn(note);
      return true;
    },
    keyUp: (event) => {
      if (event.key === ' ') {
        setSustain(false);
        return true;
      }
      const note = pressedKeys.get(event.code);
      if (note === undefined) return false;
      pressedKeys.delete(event.code);
      noteOff(note);
      return true;
    },
    dispose: () => {
      voices.forEach((voice) => voice.stop(sound.currentTime));
      keys.forEach((key) => key.node.position.copy(key.rest));
      keys.forEach((key) =>
        key.node.traverse((object) => {
          if (!(object instanceof THREE.Mesh) || !object.userData.pianoMaterial) return;
          (object.material as THREE.Material).dispose();
          object.material = object.userData.pianoMaterial;
          delete object.userData.pianoMaterial;
        })
      );
      setTimeout(() => master.disconnect(), 800);
    }
  };
};

const sessions: Record<PlayId, (context: PlayContext) => PlaySession> = { darts, rubik, piano };

export const startPlay = (id: PlayId, context: PlayContext) => sessions[id](context);
