import * as THREE from 'three';
import type { PlayContext, PlaySession } from './room-play';

type PhysicsLabels = {
  intro: string;
  throw: string;
  catch: string;
  land: string;
  reset: string;
  catches: string;
  drops: string;
};

export type PhysicsPlayCopy = {
  kendama: PhysicsLabels;
  juggling: PhysicsLabels;
};

type TransformHome = {
  parent: THREE.Object3D;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  visible: boolean;
};

const normalizeName = (name: string) => name.replace(/[ _]/g, '').toLowerCase();

const findNamedNode = (root: THREE.Object3D, name: string) => {
  const wanted = normalizeName(name);
  let found: THREE.Object3D | undefined;
  root.traverse((object) => {
    if (!found && normalizeName(object.name) === wanted) found = object;
  });
  return found;
};

const requireNode = (root: THREE.Object3D, name: string) => {
  const found = findNamedNode(root, name);
  if (!found) throw new Error(`Missing room interaction model: ${name}`);
  return found;
};

const worldBounds = (object: THREE.Object3D) => new THREE.Box3().setFromObject(object);

const worldCenterLocal = (object: THREE.Object3D) => {
  object.updateWorldMatrix(true, false);
  return object.worldToLocal(worldBounds(object).getCenter(new THREE.Vector3()));
};

const captureHome = (object: THREE.Object3D): TransformHome => {
  if (!object.parent) throw new Error(`Room interaction model has no parent: ${object.name}`);
  return {
    parent: object.parent,
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone(),
    visible: object.visible
  };
};

const restoreHome = (object: THREE.Object3D, home: TransformHome) => {
  home.parent.add(object);
  object.position.copy(home.position);
  object.quaternion.copy(home.quaternion);
  object.scale.copy(home.scale);
  object.visible = home.visible;
  object.updateMatrix();
  object.updateWorldMatrix(true, true);
};

const setWorldCenter = (
  object: THREE.Object3D,
  localCenter: THREE.Vector3,
  center: THREE.Vector3
) => {
  object.position
    .copy(center)
    .sub(localCenter.clone().multiply(object.scale).applyQuaternion(object.quaternion));
  object.updateMatrix();
  object.updateMatrixWorld(true);
};

const cameraBasis = (camera: THREE.PerspectiveCamera) => {
  const forward = camera.getWorldDirection(new THREE.Vector3()).normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  return { forward, right, up };
};

const handPosition = (
  camera: THREE.PerspectiveCamera,
  side: 'left' | 'right',
  separation: number,
  spread = 0
) => {
  const { forward, right, up } = cameraBasis(camera);
  return camera.position
    .clone()
    .addScaledVector(forward, 1.05)
    .addScaledVector(right, (side === 'left' ? -1 : 1) * separation + spread)
    .addScaledVector(up, -0.12);
};

const makeButton = (label: string, action: () => void) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'room-play-button';
  button.textContent = label;
  button.addEventListener('click', action);
  return button;
};

const uniqueWorldVertices = (root: THREE.Object3D) => {
  const vertices: THREE.Vector3[] = [];
  const keys = new Set<string>();
  root.updateWorldMatrix(true, true);
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const attribute = object.geometry.getAttribute('position');
    if (!attribute) return;
    object.updateWorldMatrix(true, false);
    const point = new THREE.Vector3();
    for (let index = 0; index < attribute.count; index += 1) {
      point.fromBufferAttribute(attribute, index).applyMatrix4(object.matrixWorld);
      const key = `${Math.round(point.x * 10000)}:${Math.round(point.y * 10000)}:${Math.round(point.z * 10000)}`;
      if (keys.has(key)) continue;
      keys.add(key);
      vertices.push(point.clone());
    }
  });
  return vertices;
};

const kendamaRim = (ken: THREE.Object3D) => {
  const vertices = uniqueWorldVertices(ken);
  if (vertices.length < 6) throw new Error('Kendama cup rim geometry is missing');
  const bounds = new THREE.Box3().setFromPoints(vertices);
  const size = bounds.getSize(new THREE.Vector3());
  const tolerance = Math.max(0.0005, size.y * 0.0015);
  const rows = new Map<number, THREE.Vector3[]>();
  vertices.forEach((point) => {
    const key = Math.round(point.y / tolerance);
    const row = rows.get(key) ?? [];
    row.push(point);
    rows.set(key, row);
  });
  const topRows = [...rows.entries()].sort((a, b) => b[0] - a[0]);
  for (const [, row] of topRows) {
    if (row.length < 6) continue;
    const center = row
      .reduce((sum, point) => sum.add(point), new THREE.Vector3())
      .divideScalar(row.length);
    const radii = row
      .map((point) => Math.hypot(point.x - center.x, point.z - center.z))
      .sort((a, b) => a - b);
    const radius = radii[Math.floor((radii.length - 1) * 0.9)];
    if (radius > 0.005) return { center, radius };
  }
  throw new Error('Kendama upper cup ring vertices are missing');
};

const cordTopology = (mesh: THREE.Mesh, toward: THREE.Vector3) => {
  mesh.updateWorldMatrix(true, false);
  const attribute = mesh.geometry.getAttribute('position');
  const index = mesh.geometry.index;
  if (!attribute || !index) throw new Error('Kendama string indexed geometry is missing');
  const vertices: THREE.Vector3[] = [];
  const originals: THREE.Vector3[] = [];
  const remap: number[] = [];
  const keys = new Map<string, number>();
  for (let vertex = 0; vertex < attribute.count; vertex += 1) {
    const point = new THREE.Vector3()
      .fromBufferAttribute(attribute, vertex)
      .applyMatrix4(mesh.matrixWorld);
    originals.push(point);
    const key = point
      .toArray()
      .map((value) => Math.round(value * 1e7))
      .join(':');
    if (!keys.has(key)) {
      keys.set(key, vertices.length);
      vertices.push(point);
    }
    remap.push(keys.get(key)!);
  }
  const edges = new Map<string, { a: number; b: number; count: number }>();
  const neighbors = vertices.map(() => new Set<number>());
  for (let face = 0; face < index.count; face += 3) {
    const triangle = [0, 1, 2].map((corner) => remap[index.getX(face + corner)]);
    for (let corner = 0; corner < 3; corner += 1) {
      const a = triangle[corner];
      const b = triangle[(corner + 1) % 3];
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const edge = edges.get(key) ?? { a, b, count: 0 };
      edge.count += 1;
      edges.set(key, edge);
      neighbors[a].add(b);
      neighbors[b].add(a);
    }
  }
  if ([...edges.values()].some((edge) => edge.count > 2))
    throw new Error('Kendama string has nonmanifold edges');
  const boundary = new Map<number, Set<number>>();
  [...edges.values()]
    .filter((edge) => edge.count === 1)
    .forEach(({ a, b }) => {
      for (const [from, to] of [
        [a, b],
        [b, a]
      ]) {
        const values = boundary.get(from) ?? new Set<number>();
        values.add(to);
        boundary.set(from, values);
      }
    });
  if ([...boundary.values()].some((values) => values.size !== 2))
    throw new Error('Kendama string end rings are incomplete');
  const loops: number[][] = [];
  const unseen = new Set(boundary.keys());
  while (unseen.size) {
    const queue = [unseen.values().next().value!];
    unseen.delete(queue[0]);
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      for (const neighbor of boundary.get(queue[cursor])!) {
        if (unseen.delete(neighbor)) queue.push(neighbor);
      }
    }
    loops.push(queue);
  }
  if (loops.length !== 2 || loops[0].length !== loops[1].length)
    throw new Error('Kendama string must have two matching end rings');
  const levels = vertices.map(() => -1);
  const queue = [...loops[0]];
  queue.forEach((vertex) => {
    levels[vertex] = 0;
  });
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const vertex = queue[cursor];
    for (const neighbor of neighbors[vertex]) {
      if (levels[neighbor] >= 0) continue;
      levels[neighbor] = levels[vertex] + 1;
      queue.push(neighbor);
    }
  }
  if (levels.some((level) => level < 0))
    throw new Error('Kendama string has disconnected vertices');
  const rings = Array.from({ length: Math.max(...levels) + 1 }, () => [] as number[]);
  levels.forEach((level, vertex) => rings[level].push(vertex));
  if (rings.length < 3 || rings.some((ring) => ring.length !== loops[0].length))
    throw new Error('Kendama string tube rings are inconsistent');
  const centers = rings.map((ring) =>
    ring
      .reduce((sum, vertex) => sum.add(vertices[vertex]), new THREE.Vector3())
      .divideScalar(ring.length)
  );
  const reverse = centers[0].distanceTo(toward) > centers[centers.length - 1].distanceTo(toward);
  if (reverse) centers.reverse();
  const vertexRings = remap.map((vertex) =>
    reverse ? centers.length - 1 - levels[vertex] : levels[vertex]
  );
  const distances = [0];
  centers
    .slice(1)
    .forEach((center, ring) => distances.push(distances[ring] + center.distanceTo(centers[ring])));
  const length = distances[distances.length - 1];
  if (length < 0.01) throw new Error('Kendama string centerline is missing');
  return {
    originals,
    vertexRings,
    centers,
    fractions: distances.map((distance) => distance / length),
    length
  };
};

const deformCord = (
  mesh: THREE.Mesh,
  scene: THREE.Scene,
  topology: ReturnType<typeof cordTopology>
) => {
  const home = captureHome(mesh);
  const { originals, vertexRings, centers, fractions, length } = topology;
  const originalGeometry = mesh.geometry;
  const dynamicGeometry = originalGeometry.clone();
  const dynamicPosition = new THREE.BufferAttribute(new Float32Array(originals.length * 3), 3);
  dynamicGeometry.setAttribute('position', dynamicPosition);
  const tangents = centers.map((_, ring) =>
    centers[Math.min(centers.length - 1, ring + 1)]
      .clone()
      .sub(centers[Math.max(0, ring - 1)])
      .normalize()
  );
  const sourceDirection = centers[centers.length - 1].clone().sub(centers[0]).normalize();
  const sourceBow = centers
    .reduce((furthest, center) => {
      const offset = center.clone().sub(centers[0]);
      offset.addScaledVector(sourceDirection, -offset.dot(sourceDirection));
      return offset.lengthSq() > furthest.lengthSq() ? offset : furthest;
    }, new THREE.Vector3())
    .normalize();
  scene.attach(mesh);
  mesh.geometry = dynamicGeometry;
  mesh.position.set(0, 0, 0);
  mesh.quaternion.identity();
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrixWorld(true);
  const update = (start: THREE.Vector3, end: THREE.Vector3) => {
    const direction = end.clone().sub(start).normalize();
    const sagDirection = new THREE.Vector3(0, -1, 0);
    sagDirection.addScaledVector(direction, -sagDirection.dot(direction));
    if (sagDirection.lengthSq() < 1e-6) {
      sagDirection
        .copy(sourceBow)
        .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(sourceDirection, direction));
    }
    sagDirection.normalize();
    const sample = (sag: number) =>
      fractions.map((fraction) =>
        start
          .clone()
          .lerp(end, fraction)
          .addScaledVector(sagDirection, sag * 4 * fraction * (1 - fraction))
      );
    let low = 0;
    let high = length;
    if (start.distanceTo(end) < length) {
      for (let iteration = 0; iteration < 20; iteration += 1) {
        const sag = (low + high) / 2;
        const points = sample(sag);
        const measured = points
          .slice(1)
          .reduce((sum, point, ring) => sum + point.distanceTo(points[ring]), 0);
        if (measured < length) low = sag;
        else high = sag;
      }
    } else high = 0;
    const points = sample((low + high) / 2);
    const rotations = points.map((_, ring) =>
      new THREE.Quaternion().setFromUnitVectors(
        tangents[ring],
        points[Math.min(points.length - 1, ring + 1)]
          .clone()
          .sub(points[Math.max(0, ring - 1)])
          .normalize()
      )
    );
    for (let index = 0; index < originals.length; index += 1) {
      const ring = vertexRings[index];
      const radial = originals[index].clone().sub(centers[ring]).applyQuaternion(rotations[ring]);
      const next = scene.worldToLocal(points[ring].clone().add(radial));
      dynamicPosition.setXYZ(index, next.x, next.y, next.z);
    }
    dynamicPosition.needsUpdate = true;
    dynamicGeometry.computeVertexNormals();
    dynamicGeometry.computeBoundingBox();
    dynamicGeometry.computeBoundingSphere();
  };
  const restore = () => {
    dynamicGeometry.dispose();
    mesh.geometry = originalGeometry;
    restoreHome(mesh, home);
  };
  return { update, restore };
};

const playPose = (): PlaySession['pose'] => ({
  position: new THREE.Vector3(1.2, 1.2, 1.7),
  lookAt: new THREE.Vector3(1.2, 0.72, 0.5)
});

export const kendama = (context: PlayContext, copy: PhysicsPlayCopy['kendama']): PlaySession => {
  const { scene, camera, room, stats, controls } = context;
  room.updateMatrixWorld(true);
  const ken = requireNode(room, 'Kendama ken');
  const tama = requireNode(room, 'Kendama tama');
  const stringNode = requireNode(room, 'Kendama string');
  const stringMesh =
    stringNode instanceof THREE.Mesh
      ? stringNode
      : (() => {
          let found: THREE.Mesh | undefined;
          stringNode.traverse((object) => {
            if (!found && object instanceof THREE.Mesh) found = object;
          });
          if (!found) throw new Error('Kendama string mesh is missing');
          return found;
        })();
  const kenBounds = worldBounds(ken);
  const rim = kendamaRim(ken);
  const cupLocal = ken.worldToLocal(rim.center.clone());
  const topology = cordTopology(stringMesh, kenBounds.getCenter(new THREE.Vector3()));
  const anchorLocal = ken.worldToLocal(topology.centers[0].clone());
  const cordLength = topology.length;
  const tamaLocal = worldCenterLocal(tama);
  const tamaSize = worldBounds(tama).getSize(new THREE.Vector3());
  const tamaRadius = Math.max(tamaSize.x, tamaSize.y, tamaSize.z) / 2;
  const rimContactHeight = Math.sqrt(
    Math.max(0, tamaRadius * tamaRadius - rim.radius * rim.radius)
  );
  const kenHome = captureHome(ken);
  const tamaHome = captureHome(tama);
  const cord = deformCord(stringMesh, scene, topology);
  scene.attach(ken);
  scene.attach(tama);
  ken.visible = true;
  tama.visible = true;
  const kenQuaternion = ken.quaternion.clone();
  const tamaQuaternion = tama.quaternion.clone();
  const aim = new THREE.Vector2();
  const gravity = new THREE.Vector3(0, -9.81, 0);
  const velocity = new THREE.Vector3();
  const ballPosition = new THREE.Vector3();
  const down = new THREE.Vector3(0, -1, 0);
  const tetherLength = cordLength + tamaRadius;
  let state: 'ready' | 'flight' | 'missed' | 'caught' | 'landed' = 'ready';
  let flightTime = 0;
  let retryAfter = 0;
  let catches = 0;
  let drops = 0;
  const cupCenter = () => ken.localToWorld(cupLocal.clone());
  const stringAnchor = () => ken.localToWorld(anchorLocal.clone());
  const contactCenter = () => cupCenter().add(new THREE.Vector3(0, rimContactHeight, 0));
  const setBall = (position: THREE.Vector3) => setWorldCenter(tama, tamaLocal, position);
  const render = () => {
    const label =
      state === 'caught'
        ? copy.catch
        : state === 'landed' || state === 'missed'
          ? copy.land
          : copy.throw;
    stats.textContent = `${label} · ${copy.catches} ${catches} · ${copy.drops} ${drops}`;
  };
  const holdBall = () => {
    const anchor = stringAnchor();
    ballPosition.copy(anchor).addScaledVector(down, cordLength * 0.72);
    setBall(ballPosition);
    tama.quaternion.copy(tamaQuaternion);
  };
  const setKenFromAim = () => {
    const { forward, right, up } = cameraBasis(camera);
    const center = camera.position
      .clone()
      .addScaledVector(forward, 1.03)
      .addScaledVector(right, aim.x * 0.28)
      .addScaledVector(up, aim.y * 0.18 - 0.03);
    ken.quaternion.copy(kenQuaternion);
    setWorldCenter(ken, cupLocal, center);
  };
  const reset = () => {
    state = 'ready';
    catches = 0;
    drops = 0;
    velocity.set(0, 0, 0);
    flightTime = 0;
    ken.quaternion.copy(kenQuaternion);
    setKenFromAim();
    holdBall();
    render();
  };
  const throwBall = () => {
    if (state === 'flight') return;
    setKenFromAim();
    if (state === 'landed' || state === 'missed') holdBall();
    state = 'flight';
    const { right } = cameraBasis(camera);
    const rise = Math.max(0.08, contactCenter().y - ballPosition.y + 0.08);
    const launchSpeed = Math.sqrt(2 * 9.81 * rise);
    velocity.set(0, launchSpeed, 0).addScaledVector(right, aim.x * 0.24);
    flightTime = 0;
    retryAfter = (2 * launchSpeed) / 9.81 + 2 * Math.PI * Math.sqrt(tetherLength / 9.81);
    render();
  };
  const catchBall = () => {
    if (state !== 'flight') return;
    state = 'caught';
    catches += 1;
    velocity.set(0, 0, 0);
    ballPosition.copy(contactCenter());
    setBall(ballPosition);
    render();
  };
  const throwButton = makeButton(copy.throw, throwBall);
  const resetButton = makeButton(copy.reset, reset);
  controls.append(throwButton, resetButton);
  setKenFromAim();
  holdBall();
  render();
  return {
    pose: playPose(),
    intro: copy.intro,
    update: (dt) => {
      setKenFromAim();
      const step = Math.max(0, dt);
      const substeps = Math.max(1, Math.ceil(step / (1 / 120)));
      const substep = step / substeps;
      if (state === 'ready') holdBall();
      if (state === 'caught') {
        ballPosition.copy(contactCenter());
        setBall(ballPosition);
      }
      if (state === 'flight' || state === 'missed') {
        for (
          let index = 0;
          index < substeps && (state === 'flight' || state === 'missed');
          index += 1
        ) {
          flightTime += substep;
          const previous = ballPosition.clone();
          const anchor = stringAnchor();
          velocity.addScaledVector(gravity, substep);
          ballPosition.addScaledVector(velocity, substep);
          const offset = ballPosition.clone().sub(anchor);
          const distance = offset.length();
          if (distance > tetherLength) {
            const direction = offset.divideScalar(distance);
            ballPosition.copy(anchor).addScaledVector(direction, tetherLength);
            const outward = velocity.dot(direction);
            if (outward > 0) velocity.addScaledVector(direction, -outward);
          }
          const rimCenter = contactCenter();
          if (
            state === 'flight' &&
            velocity.y < 0 &&
            previous.y >= rimCenter.y &&
            ballPosition.y <= rimCenter.y
          ) {
            const amount = (previous.y - rimCenter.y) / (previous.y - ballPosition.y);
            const crossing = previous.lerp(ballPosition, amount);
            const alignment = Math.max(0.008, rim.radius * 0.35);
            if (Math.hypot(crossing.x - rimCenter.x, crossing.z - rimCenter.z) <= alignment) {
              ballPosition.copy(rimCenter);
              catchBall();
            } else {
              state = 'missed';
              drops += 1;
            }
          }
          if (state === 'flight' && flightTime > retryAfter) {
            state = 'missed';
            drops += 1;
          }
          if ((state === 'flight' || state === 'missed') && ballPosition.y <= tamaRadius) {
            ballPosition.y = tamaRadius;
            velocity.y = Math.abs(velocity.y) * 0.3;
            velocity.x *= 0.65;
            velocity.z *= 0.65;
            if (velocity.y < 0.25) {
              velocity.set(0, 0, 0);
              if (state === 'flight') drops += 1;
              state = 'landed';
            }
          }
          tama.quaternion.premultiply(
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), substep * 9)
          );
        }
        setBall(ballPosition);
      }
      const anchor = stringAnchor();
      const ballSurface = ballPosition
        .clone()
        .addScaledVector(anchor.clone().sub(ballPosition).normalize(), tamaRadius);
      cord.update(anchor, ballSurface);
      render();
    },
    pointerDown: (ndc) => {
      aim.copy(ndc);
      throwBall();
    },
    pointerMove: (ndc) => aim.copy(ndc),
    pointerUp: () => {},
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key !== ' ' && event.key !== 'Enter') return false;
      if (!event.repeat) throwBall();
      return true;
    },
    keyUp: (event) => event.key === ' ' || event.key === 'Enter',
    dispose: () => {
      cord.restore();
      restoreHome(tama, tamaHome);
      restoreHome(ken, kenHome);
    }
  };
};

type JugglingBall = {
  object: THREE.Object3D;
  localCenter: THREE.Vector3;
  radius: number;
  quaternion: THREE.Quaternion;
  state: 'held' | 'flight' | 'dropped';
  holdSide: 'left' | 'right';
  catchSide: 'left' | 'right';
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  dropCounted: boolean;
  home?: TransformHome;
};

export const juggling = (context: PlayContext, copy: PhysicsPlayCopy['juggling']): PlaySession => {
  const { scene, camera, room, stats, controls } = context;
  room.updateMatrixWorld(true);
  const first = requireNode(room, 'Juggling ball 0');
  const second = requireNode(room, 'Juggling ball 1');
  const firstHome = captureHome(first);
  const secondHome = captureHome(second);
  const makeWorldClone = (source: THREE.Object3D) => {
    source.updateWorldMatrix(true, true);
    const clone = source.clone(true);
    scene.add(clone);
    source.updateWorldMatrix(true, true);
    source.matrixWorld.decompose(clone.position, clone.quaternion, clone.scale);
    clone.updateMatrix();
    clone.updateMatrixWorld(true);
    return clone;
  };
  const third = makeWorldClone(first);
  const objects = [first, second, third];
  const homes = [firstHome, secondHome];
  const balls: JugglingBall[] = objects.map((object, index) => {
    const center = worldBounds(object).getCenter(new THREE.Vector3());
    const localCenter = object.worldToLocal(center.clone());
    const size = worldBounds(object).getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) / 2;
    const home = homes[index];
    if (home) scene.attach(object);
    return {
      object,
      localCenter,
      radius,
      quaternion: object.quaternion.clone(),
      state: 'held',
      holdSide: index === 1 ? 'right' : 'left',
      catchSide: 'right',
      position: center,
      velocity: new THREE.Vector3(),
      dropCounted: false,
      home
    };
  });
  const gravity = new THREE.Vector3(0, -9.81, 0);
  let catches = 0;
  let drops = 0;
  let nextBall = 0;
  let renderAt = 0;
  const separation = Math.max(0.22, ...balls.map((ball) => ball.radius * 2.8));
  const catchRadius = Math.max(0.12, ...balls.map((ball) => ball.radius * 2.5));
  const hand = (side: 'left' | 'right') => handPosition(camera, side, separation * 0.65);
  const setBall = (ball: JugglingBall, center: THREE.Vector3) => {
    ball.position.copy(center);
    setWorldCenter(ball.object, ball.localCenter, ball.position);
  };
  const heldCenter = (ball: JugglingBall) => {
    const held = balls.filter(
      (candidate) => candidate.state === 'held' && candidate.holdSide === ball.holdSide
    );
    const slot = held.indexOf(ball);
    const spacing = Math.max(ball.radius * 2.2, 0.035);
    return hand(ball.holdSide).addScaledVector(
      cameraBasis(camera).right,
      (slot - (held.length - 1) / 2) * spacing
    );
  };
  const catchable = (ball: JugglingBall) => {
    if (ball.state !== 'flight' || ball.velocity.y >= 0) return false;
    return ball.position.distanceTo(hand(ball.catchSide)) <= catchRadius + ball.radius * 0.5;
  };
  const render = () => {
    const available = balls.filter((ball) => ball.state === 'held').length;
    const inFlight = balls.filter((ball) => ball.state === 'flight').length;
    const ready = balls.some(catchable);
    const landed = balls.some((ball) => ball.state === 'dropped');
    const action = ready
      ? copy.catch
      : landed
        ? copy.land
        : `${copy.throw} ${inFlight}/${available}`;
    stats.textContent = `${copy.catches} ${catches} · ${copy.drops} ${drops} · ${action}`;
  };
  const catchBall = () => {
    const candidates = balls
      .filter(catchable)
      .sort(
        (a, b) =>
          a.position.distanceTo(hand(a.catchSide)) - b.position.distanceTo(hand(b.catchSide))
      );
    const ball = candidates[0];
    if (!ball) return false;
    ball.state = 'held';
    ball.holdSide = ball.catchSide;
    ball.velocity.set(0, 0, 0);
    ball.dropCounted = false;
    ball.quaternion.copy(ball.object.quaternion);
    setBall(ball, heldCenter(ball));
    catches += 1;
    render();
    return true;
  };
  const throwBall = () => {
    const ball =
      balls.find((candidate, index) => {
        if (candidate.state !== 'held') return false;
        const selected = index >= nextBall;
        return selected;
      }) ?? balls.find((candidate) => candidate.state === 'held');
    if (!ball) return;
    const index = balls.indexOf(ball);
    nextBall = (index + 1) % balls.length;
    const side = ball.holdSide;
    const destination: 'left' | 'right' = side === 'left' ? 'right' : 'left';
    const origin = heldCenter(ball);
    const target = hand(destination);
    const flightTime = (2 * 2.6) / 9.81;
    ball.position.copy(origin);
    ball.velocity
      .copy(target.sub(origin).multiplyScalar(1 / flightTime))
      .addScaledVector(new THREE.Vector3(0, 1, 0), 2.6);
    ball.catchSide = destination;
    ball.state = 'flight';
    ball.dropCounted = false;
    setBall(ball, ball.position);
    render();
  };
  const throwOrCatch = () => {
    if (!catchBall()) throwBall();
  };
  const reset = () => {
    catches = 0;
    drops = 0;
    nextBall = 0;
    balls.forEach((ball, index) => {
      ball.state = 'held';
      ball.holdSide = index === 1 ? 'right' : 'left';
      ball.catchSide = ball.holdSide === 'left' ? 'right' : 'left';
      ball.velocity.set(0, 0, 0);
      ball.dropCounted = false;
      ball.object.quaternion.copy(ball.quaternion);
    });
    balls.forEach((ball) => setBall(ball, heldCenter(ball)));
    render();
  };
  controls.append(
    makeButton(copy.throw, throwBall),
    makeButton(copy.catch, catchBall),
    makeButton(copy.reset, reset)
  );
  reset();
  return {
    pose: playPose(),
    intro: copy.intro,
    update: (dt) => {
      const step = Math.max(0, dt);
      const substeps = Math.max(1, Math.ceil(step / (1 / 120)));
      const substep = step / substeps;
      balls.forEach((ball) => {
        if (ball.state === 'held') {
          setBall(ball, heldCenter(ball));
          return;
        }
        if (ball.state === 'flight') {
          for (let index = 0; index < substeps && ball.state === 'flight'; index += 1) {
            ball.velocity.addScaledVector(gravity, substep);
            ball.position.addScaledVector(ball.velocity, substep);
            ball.object.quaternion.premultiply(
              new THREE.Quaternion().setFromAxisAngle(cameraBasis(camera).right, substep * 10)
            );
            if (catchable(ball)) continue;
            if (ball.position.y <= ball.radius) {
              ball.position.y = ball.radius;
              ball.velocity.y = Math.abs(ball.velocity.y) * 0.24;
              ball.velocity.x *= 0.65;
              ball.velocity.z *= 0.65;
              ball.state = 'dropped';
              if (!ball.dropCounted) {
                drops += 1;
                ball.dropCounted = true;
              }
            }
          }
          setBall(ball, ball.position);
          return;
        }
        if (ball.state === 'dropped') {
          if (ball.velocity.lengthSq() < 0.0025) {
            ball.velocity.set(0, 0, 0);
          } else {
            ball.velocity.addScaledVector(gravity, step);
            ball.position.addScaledVector(ball.velocity, step);
            if (ball.position.y <= ball.radius) {
              ball.position.y = ball.radius;
              ball.velocity.y = Math.abs(ball.velocity.y) * 0.18;
              ball.velocity.x *= 0.88;
              ball.velocity.z *= 0.88;
            }
          }
          setBall(ball, ball.position);
        }
      });
      const now = performance.now();
      if (now >= renderAt) {
        renderAt = now + 80;
        render();
      }
    },
    pointerDown: () => throwOrCatch(),
    pointerMove: () => {},
    pointerUp: () => {},
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key.toLowerCase() === 'c') {
        if (!event.repeat) catchBall();
        return true;
      }
      if (event.key === ' ') {
        if (!event.repeat) throwOrCatch();
        return true;
      }
      if (event.key === 'Enter') {
        if (!event.repeat) throwBall();
        return true;
      }
      return false;
    },
    keyUp: (event) => event.key === ' ' || event.key.toLowerCase() === 'c' || event.key === 'Enter',
    dispose: () => {
      balls.slice(2).forEach((ball) => ball.object.removeFromParent());
      restoreHome(first, firstHome);
      restoreHome(second, secondHome);
    }
  };
};
