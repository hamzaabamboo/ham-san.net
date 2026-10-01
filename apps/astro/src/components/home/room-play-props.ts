import * as THREE from 'three';
import type { PlayContext, PlaySession } from './room-play';

export type PropPlayCopy = {
  penlight: {
    intro: string;
    toggleGlow: string;
    cycleColor: string;
    picked: string;
  };
  cardistry: {
    intro: string;
    shuffle: string;
    reveal: string;
    find: string;
    win: string;
    miss: string;
  };
  penspinning: {
    intro: string;
    pickUp: string;
    charge: string;
    sonic: string;
    catch: string;
    drop: string;
    reset: string;
    spinning: string;
    dropped: string;
    caught: string;
  };
};

const button = (label: string, onClick: () => void) => {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'room-play-button';
  node.textContent = label;
  node.addEventListener('click', onClick);
  return node;
};

const normalizeName = (name: string) => name.replace(/[ _]/g, '').toLowerCase();

const requiredNode = (root: THREE.Object3D, name: string) => {
  const wanted = normalizeName(name);
  let found: THREE.Object3D | undefined;
  root.traverse((object) => {
    if (!found && normalizeName(object.name) === wanted) found = object;
  });
  if (!found) throw new Error(`Missing room play asset: ${name}`);
  return found;
};

const meshesWithin = (node: THREE.Object3D) => {
  const meshes: THREE.Mesh[] = [];
  node.traverse((object) => {
    if (object instanceof THREE.Mesh) meshes.push(object);
  });
  return meshes;
};

const hasMaterialName = (material: THREE.Material, name: string) =>
  normalizeName(material.name).startsWith(normalizeName(name));

const getAttributeComponent = (
  attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  index: number,
  component: number
) => {
  if (component === 0) return attribute.getX(index);
  if (component === 1) return attribute.getY(index);
  if (component === 2) return attribute.getZ(index);
  return attribute.getW(index);
};

const materialList = (material: THREE.Material | THREE.Material[]) =>
  Array.isArray(material) ? material : [material];

type TransformHome = {
  parent: THREE.Object3D | null;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  matrix: THREE.Matrix4;
  matrixAutoUpdate: boolean;
  visible: boolean;
};

const saveTransform = (object: THREE.Object3D): TransformHome => ({
  parent: object.parent,
  position: object.position.clone(),
  quaternion: object.quaternion.clone(),
  scale: object.scale.clone(),
  matrix: object.matrix.clone(),
  matrixAutoUpdate: object.matrixAutoUpdate,
  visible: object.visible
});

const restoreTransform = (object: THREE.Object3D, home: TransformHome) => {
  if (home.parent) home.parent.add(object);
  else object.removeFromParent();
  object.position.copy(home.position);
  object.quaternion.copy(home.quaternion);
  object.scale.copy(home.scale);
  object.matrixAutoUpdate = home.matrixAutoUpdate;
  object.matrix.copy(home.matrix);
  object.matrixWorldNeedsUpdate = true;
  object.visible = home.visible;
};

const worldPose = (object: THREE.Object3D) => {
  object.updateWorldMatrix(true, false);
  return {
    position: object.getWorldPosition(new THREE.Vector3()),
    quaternion: object.getWorldQuaternion(new THREE.Quaternion()),
    scale: object.getWorldScale(new THREE.Vector3())
  };
};

type PenlightMaterialSet = {
  mesh: THREE.Mesh;
  original: THREE.Material | THREE.Material[];
  originals: THREE.Material[];
  clones: THREE.Material[];
};

type Penlight = {
  node: THREE.Object3D;
  home: TransformHome;
  materials: PenlightMaterialSet[];
  centerLocal: THREE.Vector3;
  handleColor: THREE.Color;
  core: { material: THREE.MeshStandardMaterial; color: THREE.Color; intensity: number }[];
};

export const penlight = (context: PlayContext): PlaySession => {
  const { scene, camera, room, stats, controls } = context;
  const copy = context.copy;
  const names = Array.from(
    { length: 12 },
    (_, index) => `Penlight row2 ${String(index + 1).padStart(2, '0')}`
  );
  const sources = names.map((name) => {
    const node = requiredNode(room, name);
    const meshes = meshesWithin(node);
    if (!meshes.length) throw new Error(`Penlight has no mesh primitives: ${name}`);
    const materials = meshes.map((mesh) => ({
      mesh,
      original: mesh.material,
      originals: materialList(mesh.material)
    }));
    const originals = materials.flatMap((entry) => entry.originals);
    const handle = originals.find((entry) => hasMaterialName(entry, 'Penlight handle'));
    const core = originals.filter(
      (entry): entry is THREE.MeshStandardMaterial =>
        hasMaterialName(entry, 'Penlight core') &&
        (entry as THREE.MeshStandardMaterial).isMeshStandardMaterial
    );
    if (!(handle instanceof THREE.MeshStandardMaterial) || !core.length)
      throw new Error(`Incomplete penlight materials: ${name}`);
    return {
      node,
      home: saveTransform(node),
      materials,
      handle,
      centerLocal: node.worldToLocal(
        new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3())
      ),
      handleColor: handle.color.clone()
    };
  });
  const prepared = sources.map((source) => ({
    ...source,
    materials: source.materials.map((entry) => ({
      ...entry,
      clones: entry.originals.map((material) => material.clone())
    }))
  }));
  const wands: Penlight[] = prepared.map((source) => {
    source.materials.forEach((entry) => {
      entry.mesh.material = Array.isArray(entry.original) ? entry.clones : entry.clones[0];
    });
    const core = source.materials
      .flatMap((entry) => entry.clones)
      .filter(
        (entry): entry is THREE.MeshStandardMaterial =>
          hasMaterialName(entry, 'Penlight core') &&
          (entry as THREE.MeshStandardMaterial).isMeshStandardMaterial
      )
      .map((material) => ({
        material,
        color: material.emissive.clone(),
        intensity: material.emissiveIntensity
      }));
    return {
      node: source.node,
      home: source.home,
      materials: source.materials,
      centerLocal: source.centerLocal,
      handleColor: source.handleColor,
      core
    };
  });
  const colors = [
    ...new Map(wands.map((wand) => [wand.handleColor.getHex(), wand.handleColor])).values()
  ];
  const raycaster = new THREE.Raycaster();
  const aim = new THREE.Vector2();
  const plane = new THREE.Plane();
  const planeNormal = new THREE.Vector3();
  const planeOffset = new THREE.Vector3();
  const previous = new THREE.Vector2();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const sceneRotation = new THREE.Quaternion();
  let selected = 0;
  let colorIndex = 0;
  let glowing = false;
  let grabbed: Penlight | null = null;
  const accentValue = getComputedStyle(stats).getPropertyValue('--atelier-accent').trim();
  if (!colors.length && accentValue) colors.push(new THREE.Color(accentValue));
  const syncColorIndex = () => {
    const current = wands[selected].handleColor.getHex();
    const index = colors.findIndex((color) => color.getHex() === current);
    if (index >= 0) colorIndex = index;
  };
  const paintGlow = () => {
    wands.forEach((wand) => {
      wand.core.forEach(({ material, color, intensity }) => {
        if (wand !== wands[selected] || !glowing) {
          material.emissive.copy(color);
          material.emissiveIntensity = intensity;
          return;
        }
        material.emissive.copy(colors[colorIndex] ?? wand.handleColor);
        material.emissiveIntensity = Math.max(1.8, intensity);
      });
    });
  };
  const render = () => {
    stats.textContent = `${copy.penlight.picked}${grabbed ? ` · ${wands[selected].node.name}` : ''}`;
  };
  const setPlane = (point: THREE.Vector3) => {
    camera.getWorldDirection(planeNormal);
    plane.setFromNormalAndCoplanarPoint(planeNormal, point);
  };
  const setWandCenter = (wand: Penlight, centerWorld: THREE.Vector3) => {
    const centerLocal = scene.worldToLocal(centerWorld.clone());
    const offset = wand.centerLocal
      .clone()
      .multiply(wand.node.scale)
      .applyQuaternion(wand.node.quaternion);
    wand.node.position.copy(centerLocal.sub(offset));
    wand.node.updateWorldMatrix(true, true);
  };
  const positionGrabbed = (ndc: THREE.Vector2) => {
    if (!grabbed) return;
    raycaster.setFromCamera(ndc, camera);
    const point = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, point)) return;
    setWandCenter(grabbed, point.add(planeOffset));
  };
  const beginGrab = (ndc: THREE.Vector2) => {
    if (grabbed) return;
    grabbed = wands[selected];
    grabbed.node.updateWorldMatrix(true, true);
    const center = new THREE.Box3().setFromObject(grabbed.node).getCenter(new THREE.Vector3());
    raycaster.setFromCamera(ndc, camera);
    setPlane(center);
    const point = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, point)) planeOffset.copy(center).sub(point);
    else planeOffset.set(0, 0, 0);
    scene.attach(grabbed.node);
    grabbed.node.matrixAutoUpdate = true;
    setWandCenter(grabbed, center);
    previous.copy(ndc);
    render();
  };
  const endGrab = () => {
    grabbed = null;
    render();
  };
  const toggleGlow = () => {
    glowing = !glowing;
    paintGlow();
  };
  const cycleColor = () => {
    if (!colors.length) return;
    colorIndex = (colorIndex + 1) % colors.length;
    paintGlow();
  };
  controls.append(button(copy.penlight.toggleGlow, toggleGlow));
  controls.append(button(copy.penlight.cycleColor, cycleColor));
  render();
  const center = wands
    .reduce((sum, wand) => {
      wand.node.updateWorldMatrix(true, true);
      return sum.add(new THREE.Box3().setFromObject(wand.node).getCenter(new THREE.Vector3()));
    }, new THREE.Vector3())
    .divideScalar(wands.length);
  return {
    pose: {
      position: center.clone().add(new THREE.Vector3(-0.8, 0.18, -0.28)),
      lookAt: center
    },
    intro: copy.penlight.intro,
    update: () => {
      if (!grabbed) return;
      const delta = new THREE.Vector2().subVectors(aim, previous);
      previous.copy(aim);
      if (delta.lengthSq() < 1e-7) return;
      camera.getWorldDirection(forward);
      right.crossVectors(forward, camera.up).normalize();
      up.crossVectors(right, forward).normalize();
      const axis = right.clone().multiplyScalar(delta.y).addScaledVector(up, -delta.x);
      if (axis.lengthSq() > 1e-8) {
        const center = new THREE.Box3().setFromObject(grabbed.node).getCenter(new THREE.Vector3());
        scene.getWorldQuaternion(sceneRotation).invert();
        grabbed.node.quaternion.premultiply(
          new THREE.Quaternion().setFromAxisAngle(
            axis.applyQuaternion(sceneRotation).normalize(),
            Math.min(0.32, delta.length() * 3)
          )
        );
        setWandCenter(grabbed, center);
      }
    },
    pointerDown: (ndc) => {
      aim.copy(ndc);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(
        wands.map((wand) => wand.node),
        true
      )[0];
      if (hit) {
        if (grabbed) endGrab();
        selected = wands.findIndex((wand) => {
          let object: THREE.Object3D | null = hit.object;
          while (object) {
            if (object === wand.node) return true;
            object = object.parent;
          }
          return false;
        });
        syncColorIndex();
        paintGlow();
        beginGrab(ndc);
        render();
      }
    },
    pointerMove: (ndc) => {
      aim.copy(ndc);
      positionGrabbed(ndc);
    },
    pointerUp: (ndc) => {
      aim.copy(ndc);
      positionGrabbed(ndc);
      endGrab();
    },
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key === ' ') {
        if (event.repeat) return true;
        if (grabbed) endGrab();
        else beginGrab(new THREE.Vector2(0, 0));
        return true;
      }
      if (event.key.toLowerCase() === 'c') {
        if (event.repeat) return true;
        cycleColor();
        return true;
      }
      if (event.key === 'Enter') {
        if (event.repeat) return true;
        toggleGlow();
        return true;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (grabbed) endGrab();
        selected = (selected + (event.key === 'ArrowRight' ? 1 : 11)) % 12;
        syncColorIndex();
        paintGlow();
        render();
        return true;
      }
      if (grabbed && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
        camera.getWorldDirection(forward);
        right.crossVectors(forward, camera.up).normalize();
        up.crossVectors(right, forward).normalize();
        const center = new THREE.Box3().setFromObject(grabbed.node).getCenter(new THREE.Vector3());
        setWandCenter(
          grabbed,
          center.addScaledVector(up, event.key === 'ArrowUp' ? 0.025 : -0.025)
        );
        return true;
      }
      return false;
    },
    keyUp: (event) => event.key === ' ',
    dispose: () => {
      wands.forEach((wand) => {
        wand.materials.forEach((entry) => {
          entry.clones.forEach((material) => material.dispose());
          entry.mesh.material = entry.original;
        });
        restoreTransform(wand.node, wand.home);
      });
    }
  };
};

type Card = {
  node: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  face: THREE.Material;
  back: THREE.Material;
  edge: THREE.Material;
  faceUp?: THREE.Quaternion;
  flip?: THREE.Quaternion;
  legacy?: boolean;
  faceHome: { color: THREE.Color; intensity: number } | null;
  backHome: { color: THREE.Color; intensity: number } | null;
};

const cardComponents = (source: THREE.BufferGeometry) => {
  const index = source.index;
  if (!index || index.count % 3 !== 0)
    throw new Error('Card spread must contain indexed triangles');
  const faceCount = index.count / 3;
  const parents = Array.from({ length: faceCount }, (_, face) => face);
  const root = (face: number): number => {
    if (parents[face] !== face) parents[face] = root(parents[face]);
    return parents[face];
  };
  const join = (left: number, rightFace: number) => {
    const leftRoot = root(left);
    const rightRoot = root(rightFace);
    if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
  };
  const edgeFaces = new Map<string, number>();
  for (let face = 0; face < faceCount; face += 1) {
    const vertices = [index.getX(face * 3), index.getX(face * 3 + 1), index.getX(face * 3 + 2)];
    for (let edge = 0; edge < 3; edge += 1) {
      const a = vertices[edge];
      const b = vertices[(edge + 1) % 3];
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const previousFace = edgeFaces.get(key);
      if (previousFace === undefined) edgeFaces.set(key, face);
      else join(face, previousFace);
    }
  }
  const components = new Map<number, number[]>();
  for (let face = 0; face < faceCount; face += 1) {
    const key = root(face);
    const faces = components.get(key) ?? [];
    faces.push(face);
    components.set(key, faces);
  }
  return [...components.values()].map((faces) => {
    const geometry = new THREE.BufferGeometry();
    const vertexIndices = [
      ...new Set(faces.flatMap((face) => [0, 1, 2].map((corner) => index.getX(face * 3 + corner))))
    ];
    const vertices = new Map<number, number>(
      vertexIndices.map((sourceIndex, nextIndex): [number, number] => [sourceIndex, nextIndex])
    );
    const attributes: [string, THREE.BufferAttribute][] = Object.entries(source.attributes).map(
      ([name, attribute]) => {
        const values = vertexIndices.flatMap((sourceIndex) =>
          Array.from({ length: attribute.itemSize }, (_, component) =>
            getAttributeComponent(attribute, sourceIndex, component)
          )
        );
        return [
          name,
          new THREE.Float32BufferAttribute(new Float32Array(values), attribute.itemSize)
        ];
      }
    );
    if (!attributes.some(([name]) => name === 'position'))
      throw new Error('Card spread is missing positions');
    attributes.forEach(([name, attribute]) => geometry.setAttribute(name, attribute));
    const indices: number[] = [];
    faces.forEach((face) => {
      for (let corner = 0; corner < 3; corner += 1)
        indices.push(vertices.get(index.getX(face * 3 + corner))!);
    });
    geometry.setIndex(indices);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  });
};

const spreadCardComponents = (
  sources: { mesh: THREE.Mesh; role: number }[],
  spread: THREE.Object3D
) => {
  type Triangle = { source: THREE.BufferGeometry; role: number; face: number };
  const triangles: Triangle[] = [];
  const transformed: THREE.BufferGeometry[] = [];
  sources.forEach(({ mesh, role }) => {
    const geometry = mesh.geometry.clone();
    transformed.push(geometry);
    geometry.applyMatrix4(spread.matrixWorld.clone().invert().multiply(mesh.matrixWorld));
    if (!geometry.index || geometry.index.count % 3 !== 0)
      throw new Error('Card spread must contain indexed triangles');
    for (let face = 0; face < geometry.index.count / 3; face += 1)
      triangles.push({ source: geometry, role, face });
  });
  const parents = triangles.map((_, index) => index);
  const root = (face: number): number => {
    if (parents[face] !== face) parents[face] = root(parents[face]);
    return parents[face];
  };
  const join = (left: number, right: number) => {
    const leftRoot = root(left);
    const rightRoot = root(right);
    if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
  };
  const positionKey = (geometry: THREE.BufferGeometry, index: number) => {
    const position = geometry.getAttribute('position');
    return [position.getX(index), position.getY(index), position.getZ(index)]
      .map((value) => Math.round(value * 100000))
      .join(':');
  };
  const edges = new Map<string, number>();
  triangles.forEach(({ source, face }, triangleIndex) => {
    const index = source.index!;
    const vertices = [index.getX(face * 3), index.getX(face * 3 + 1), index.getX(face * 3 + 2)];
    for (let edge = 0; edge < 3; edge += 1) {
      const a = positionKey(source, vertices[edge]);
      const b = positionKey(source, vertices[(edge + 1) % 3]);
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      const previous = edges.get(key);
      if (previous === undefined) edges.set(key, triangleIndex);
      else join(triangleIndex, previous);
    }
  });
  const components = new Map<number, Triangle[]>();
  triangles.forEach((triangle, index) => {
    const key = root(index);
    const component = components.get(key) ?? [];
    component.push(triangle);
    components.set(key, component);
  });
  const names = [...new Set(sources.flatMap(({ mesh }) => Object.keys(mesh.geometry.attributes)))];
  const geometries = [...components.values()].map((component) => {
    const geometry = new THREE.BufferGeometry();
    names.forEach((name) => {
      const itemSize = sources
        .map(({ mesh }) => mesh.geometry.getAttribute(name))
        .find((attribute) => attribute)?.itemSize;
      if (!itemSize) return;
      const values = component.flatMap(({ source, face }) => {
        const index = source.index!;
        const attribute = source.getAttribute(name);
        return [0, 1, 2].flatMap((corner) => {
          const vertex = index.getX(face * 3 + corner);
          return Array.from({ length: itemSize }, (_, part) =>
            attribute ? getAttributeComponent(attribute, vertex, part) : 0
          );
        });
      });
      geometry.setAttribute(
        name,
        new THREE.Float32BufferAttribute(new Float32Array(values), itemSize)
      );
    });
    const indices = Array.from({ length: component.length * 3 }, (_, index) => index);
    geometry.setIndex(indices);
    let groupStart = 0;
    let groupRole = component[0].role;
    component.forEach((triangle, index) => {
      if (triangle.role === groupRole) return;
      geometry.addGroup(groupStart, index * 3 - groupStart, groupRole);
      groupStart = index * 3;
      groupRole = triangle.role;
    });
    geometry.addGroup(groupStart, indices.length - groupStart, groupRole);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  });
  transformed.forEach((geometry) => geometry.dispose());
  return geometries;
};

const shuffled = <T>(source: T[]) => {
  const values = [...source];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [values[index], values[other]] = [values[other], values[index]];
  }
  return values;
};

export const cardistry = (context: PlayContext): PlaySession => {
  const { scene, camera, room, stats, controls } = context;
  const copy = context.copy;
  const spread = requiredNode(room, 'Skill toy card spread');
  const spreadMeshes = meshesWithin(spread);
  const deckMeshes = meshesWithin(requiredNode(room, 'Skill toy cardistry deck'));
  if (spreadMeshes.length !== 1 && spreadMeshes.length !== 3)
    throw new Error(
      `Expected one legacy card mesh or three card primitives, found ${spreadMeshes.length}`
    );
  const spreadVisible = spread.visible;
  const deckMaterials = deckMeshes.flatMap((mesh) => materialList(mesh.material));
  const spreadMaterials = spreadMeshes.flatMap((mesh) => materialList(mesh.material));
  const faceSource = spreadMaterials.find((material) =>
    normalizeName(material.name).startsWith('cardfacesuits')
  );
  const legacy = spreadMeshes.length === 1;
  const backSource = (legacy ? deckMaterials : spreadMaterials).find((material) =>
    normalizeName(material.name).startsWith(legacy ? 'cardbacknavy' : 'cardbackprint')
  );
  const edgeSource = legacy
    ? backSource
    : spreadMaterials.find((material) =>
        normalizeName(material.name).startsWith('cardedgeunprintedpaper')
      );
  if (!backSource || !faceSource || !edgeSource)
    throw new Error('Card spread face, back, and edge materials are incomplete');
  spread.updateWorldMatrix(true, true);
  const faceMatches = spreadMeshes.filter((mesh) =>
    materialList(mesh.material).some((material) => material === faceSource)
  );
  const backMatches = spreadMeshes.filter((mesh) =>
    materialList(mesh.material).some((material) => material === backSource)
  );
  const edgeMatches = spreadMeshes.filter((mesh) =>
    materialList(mesh.material).some((material) => material === edgeSource)
  );
  let geometries: THREE.BufferGeometry[];
  if (legacy) {
    geometries = cardComponents(spreadMeshes[0].geometry);
    const transform = spread.matrixWorld.clone().invert().multiply(spreadMeshes[0].matrixWorld);
    geometries.forEach((geometry) => {
      geometry.applyMatrix4(transform);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    });
  } else {
    if (faceMatches.length !== 1 || backMatches.length !== 1 || edgeMatches.length !== 1)
      throw new Error('Card spread primitives must map to distinct face, back, and edge materials');
    geometries = spreadCardComponents(
      [
        { mesh: faceMatches[0], role: 0 },
        { mesh: backMatches[0], role: 1 },
        { mesh: edgeMatches[0], role: 2 }
      ],
      spread
    );
  }
  if (geometries.length !== 12) {
    geometries.forEach((geometry) => geometry.dispose());
    throw new Error(`Expected twelve separated cards, found ${geometries.length}`);
  }
  const spreadPose = worldPose(spread);
  const spreadBounds = new THREE.Box3().setFromObject(spread);
  const center = spreadBounds.getCenter(new THREE.Vector3());
  const right = new THREE.Vector3(1, 0, 0).transformDirection(spread.matrixWorld);
  const width = Math.max(
    ...geometries.map((geometry) => {
      const bounds = geometry.boundingBox!;
      let min = Infinity;
      let max = -Infinity;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            const projection = new THREE.Vector3(x, y, z)
              .applyMatrix4(spread.matrixWorld)
              .dot(right);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
          }
        }
      }
      return max - min;
    })
  );
  const slotSpacing = Math.max(width * 1.16, 0.025);
  const slots = Array.from({ length: 3 }, (_, index) =>
    center.clone().addScaledVector(right, (index - 1) * slotSpacing)
  );
  const chosen = shuffled(geometries).slice(0, 3);
  geometries
    .filter((geometry) => !chosen.includes(geometry))
    .forEach((geometry) => geometry.dispose());
  scene.updateWorldMatrix(true, false);
  const sceneInverse = scene.matrixWorld.clone().invert();
  const cards: Card[] = chosen.map((geometry, index) => {
    const localCenter = geometry.boundingBox!.getCenter(new THREE.Vector3());
    geometry.translate(-localCenter.x, -localCenter.y, -localCenter.z);
    const face = faceSource.clone();
    const back = backSource.clone();
    const edge = edgeSource.clone();
    face.side = THREE.DoubleSide;
    back.side = THREE.DoubleSide;
    const node = new THREE.Mesh(geometry, legacy ? back : [face, back, edge]);
    const matrix = sceneInverse
      .clone()
      .multiply(new THREE.Matrix4().compose(slots[index], spreadPose.quaternion, spreadPose.scale));
    matrix.decompose(node.position, node.quaternion, node.scale);
    scene.add(node);
    const standardFace = face as THREE.MeshStandardMaterial;
    const standardBack = back as THREE.MeshStandardMaterial;
    return {
      node,
      geometry,
      face,
      back,
      edge,
      faceUp: node.quaternion.clone(),
      flip: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI),
      legacy,
      faceHome: standardFace.isMeshStandardMaterial
        ? { color: standardFace.emissive.clone(), intensity: standardFace.emissiveIntensity }
        : null,
      backHome: standardBack.isMeshStandardMaterial
        ? { color: standardBack.emissive.clone(), intensity: standardBack.emissiveIntensity }
        : null
    };
  });
  spread.visible = false;
  const accentValue = getComputedStyle(stats).getPropertyValue('--atelier-accent').trim();
  const accent = accentValue ? new THREE.Color(accentValue) : null;
  let target = cards[Math.floor(Math.random() * cards.length)];
  let selected = -1;
  let state: 'watch' | 'shuffling' | 'guess' | 'result' = 'watch';
  let result = '';
  let steps: [number, number][] = [];
  let step = 0;
  let progress = 0;
  let activeSwap:
    | {
        left: Card;
        right: Card;
        leftStart: THREE.Vector3;
        rightStart: THREE.Vector3;
        leftRotation: THREE.Quaternion;
        rightRotation: THREE.Quaternion;
      }
    | undefined;
  const setFace = (card: Card, faceUp: boolean) => {
    if (card.legacy) card.node.material = faceUp ? card.face : card.back;
    else
      card.node.quaternion
        .copy(card.faceUp!)
        .multiply(faceUp ? new THREE.Quaternion() : card.flip!);
  };
  const setEmissive = (
    material: THREE.Material,
    home: Card['faceHome'],
    color: THREE.Color | null
  ) => {
    const standard = material as THREE.MeshStandardMaterial;
    if (!standard.isMeshStandardMaterial || !home) return;
    standard.emissive.copy(color ?? home.color);
    standard.emissiveIntensity = color ? 0.65 : home.intensity;
  };
  const clearHighlights = () => {
    cards.forEach((card) => {
      setEmissive(card.face, card.faceHome, null);
      setEmissive(card.back, card.backHome, null);
    });
  };
  const highlightTarget = () => {
    if (accent) setEmissive(target.face, target.faceHome, accent);
  };
  const select = (index: number) => {
    if (index < 0 || index > 2) return;
    selected = index;
    cards.forEach((card, cardIndex) =>
      setEmissive(card.back, card.backHome, cardIndex === selected ? accent : null)
    );
  };
  const render = () => {
    if (result) stats.textContent = result;
    else if (state === 'guess') stats.textContent = copy.cardistry.find;
    else if (state === 'shuffling') stats.textContent = copy.cardistry.shuffle;
    else stats.textContent = copy.cardistry.find;
  };
  const reveal = () => {
    if (state !== 'guess' || selected < 0) return;
    cards.forEach((card) => setFace(card, true));
    result = cards[selected] === target ? copy.cardistry.win : copy.cardistry.miss;
    state = 'result';
    clearHighlights();
    highlightTarget();
    render();
  };
  const nextRound = () => {
    if (state !== 'result') return;
    target = cards[Math.floor(Math.random() * cards.length)];
    selected = -1;
    result = '';
    clearHighlights();
    cards.forEach((card) => setFace(card, true));
    highlightTarget();
    state = 'watch';
    render();
  };
  const shuffle = () => {
    if (state === 'result') {
      nextRound();
      return;
    }
    if (state !== 'watch') return;
    selected = -1;
    result = '';
    clearHighlights();
    cards.forEach((card) => setFace(card, false));
    steps = Array.from({ length: 9 }, () => {
      const left = Math.floor(Math.random() * 3);
      let rightIndex = Math.floor(Math.random() * 2);
      if (rightIndex >= left) rightIndex += 1;
      return [left, rightIndex];
    });
    step = 0;
    progress = 0;
    activeSwap = undefined;
    state = 'shuffling';
    render();
  };
  const beginSwap = () => {
    if (step >= steps.length) {
      state = 'guess';
      cards.forEach((card) => setFace(card, false));
      render();
      return;
    }
    const [leftIndex, rightIndex] = steps[step];
    activeSwap = {
      left: cards[leftIndex],
      right: cards[rightIndex],
      leftStart: cards[leftIndex].node.position.clone(),
      rightStart: cards[rightIndex].node.position.clone(),
      leftRotation: cards[leftIndex].node.quaternion.clone(),
      rightRotation: cards[rightIndex].node.quaternion.clone()
    };
    progress = 0;
  };
  const shuffleButton = button(copy.cardistry.shuffle, shuffle);
  const revealButton = button(copy.cardistry.reveal, reveal);
  controls.append(shuffleButton, revealButton);
  cards.forEach((card) => setFace(card, true));
  highlightTarget();
  render();
  const raycaster = new THREE.Raycaster();
  return {
    pose: {
      position: center.clone().add(new THREE.Vector3(0.52, 0.58, 0.65)),
      lookAt: center.clone()
    },
    intro: copy.cardistry.intro,
    update: (dt) => {
      if (state !== 'shuffling') return;
      if (!activeSwap) beginSwap();
      if (!activeSwap) return;
      progress = Math.min(1, progress + dt / 0.24);
      const eased = progress * progress * (3 - 2 * progress);
      const arc = Math.sin(progress * Math.PI) * Math.min(0.11, width * 0.55);
      activeSwap.left.node.position
        .copy(activeSwap.leftStart)
        .lerp(activeSwap.rightStart, eased)
        .add(new THREE.Vector3(0, arc, 0));
      activeSwap.right.node.position
        .copy(activeSwap.rightStart)
        .lerp(activeSwap.leftStart, eased)
        .add(new THREE.Vector3(0, arc * 0.5, 0));
      const turn = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI * progress
      );
      activeSwap.left.node.quaternion.copy(activeSwap.leftRotation).multiply(turn);
      activeSwap.right.node.quaternion.copy(activeSwap.rightRotation).multiply(turn);
      if (progress < 1) return;
      activeSwap.left.node.position.copy(activeSwap.rightStart);
      activeSwap.right.node.position.copy(activeSwap.leftStart);
      activeSwap.left.node.quaternion.copy(activeSwap.leftRotation);
      activeSwap.right.node.quaternion.copy(activeSwap.rightRotation);
      const [leftIndex, rightIndex] = steps[step];
      [cards[leftIndex], cards[rightIndex]] = [cards[rightIndex], cards[leftIndex]];
      activeSwap = undefined;
      step += 1;
      if (step >= steps.length) {
        state = 'guess';
        cards.forEach((card) => setFace(card, false));
        render();
      }
    },
    pointerDown: (ndc) => {
      if (state !== 'guess') return;
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(
        cards.map((card) => card.node),
        false
      )[0];
      if (!hit) return;
      select(cards.findIndex((card) => card.node === hit.object));
      render();
    },
    pointerMove: () => {},
    pointerUp: () => {},
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key === ' ') {
        if (event.repeat) return true;
        if (state === 'result') nextRound();
        else if (state === 'watch') shuffle();
        else if (state === 'guess') reveal();
        return true;
      }
      if (/^[1-3]$/.test(event.key) && state === 'guess') {
        select(Number(event.key) - 1);
        return true;
      }
      if (event.key === 'Enter' && state === 'guess') {
        if (event.repeat) return true;
        reveal();
        return true;
      }
      return false;
    },
    keyUp: (event) => event.key === ' ',
    dispose: () => {
      cards.forEach((card) => {
        card.node.removeFromParent();
        card.geometry.dispose();
        card.face.dispose();
        card.back.dispose();
        card.edge.dispose();
      });
      spread.visible = spreadVisible;
    }
  };
};

type PenState = 'rest' | 'held' | 'spinning' | 'dropped';

export const penspinning = (context: PlayContext): PlaySession => {
  const { scene, camera, room, stats, controls } = context;
  const copy = context.copy;
  const pen = requiredNode(room, 'Skill toy penspinning pen');
  const home = saveTransform(pen);
  const homeBounds = new THREE.Box3().setFromObject(pen);
  const homeCenter = homeBounds.getCenter(new THREE.Vector3());
  const localCenter = pen.worldToLocal(homeCenter.clone());
  const supports = ['Floor', 'Genkan tile floor', 'Low table top'].flatMap((name) =>
    meshesWithin(requiredNode(room, name))
  );
  const rest = room.getObjectByName('Skill toy pen rest');
  if (rest) supports.push(...meshesWithin(rest));
  const supportRay = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const raycaster = new THREE.Raycaster();
  const aim = new THREE.Vector2();
  const plane = new THREE.Plane();
  const planeNormal = new THREE.Vector3();
  const planeOffset = new THREE.Vector3();
  const pointerVelocity = new THREE.Vector3();
  const position = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const angularAxis = new THREE.Vector3(0, 0, 1);
  const localLongAxis = new THREE.Vector3(1, 0, 0);
  const gravity = new THREE.Vector3(0, -9.81, 0);
  const sceneRight = new THREE.Vector3();
  const sceneUp = new THREE.Vector3();
  const forward = new THREE.Vector3();
  let state: PenState = 'rest';
  let chargingAt = 0;
  let charge = 0;
  let spin = 0;
  let spinAngle = 0;
  let spinTime = 0;
  let catchWindow = false;
  let grabbedPointer = false;
  let previousTimestamp = 0;
  let feedback = '';
  let feedbackUntil = 0;
  const render = () => {
    if (feedback && performance.now() < feedbackUntil) stats.textContent = feedback;
    else if (state === 'spinning')
      stats.textContent = catchWindow ? copy.penspinning.catch : copy.penspinning.spinning;
    else if (state === 'dropped') stats.textContent = copy.penspinning.dropped;
    else if (state === 'held' && chargingAt)
      stats.textContent = `${copy.penspinning.charge} ${Math.round(charge * 100)}%`;
    else if (state === 'held') stats.textContent = copy.penspinning.sonic;
    else stats.textContent = copy.penspinning.pickUp;
  };
  const setCenter = (center: THREE.Vector3) => {
    position.copy(center);
    pen.position
      .copy(center)
      .sub(localCenter.clone().multiply(pen.scale).applyQuaternion(pen.quaternion));
    pen.updateWorldMatrix(true, true);
  };
  const syncCenter = () => {
    pen.updateWorldMatrix(true, true);
    position.copy(new THREE.Box3().setFromObject(pen).getCenter(new THREE.Vector3()));
  };
  const aimPlane = (point: THREE.Vector3) => {
    camera.getWorldDirection(planeNormal);
    plane.setFromNormalAndCoplanarPoint(planeNormal, point);
  };
  const updateHeldPosition = (ndc: THREE.Vector2) => {
    if (state !== 'held') return;
    raycaster.setFromCamera(ndc, camera);
    const point = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, point)) return;
    const next = point.add(planeOffset);
    const now = performance.now();
    const elapsed = Math.max(0.001, (now - previousTimestamp) / 1000);
    pointerVelocity.copy(next).sub(position).divideScalar(elapsed).clampLength(0, 8);
    setCenter(next);
    if (pointerVelocity.lengthSq() > 0.04) {
      const penAxis = localLongAxis.clone().applyQuaternion(pen.quaternion).normalize();
      const axis = new THREE.Vector3().crossVectors(penAxis, pointerVelocity);
      if (axis.lengthSq() > 1e-6) angularAxis.copy(axis.normalize());
    }
    previousTimestamp = now;
  };
  const pickUp = (ndc = new THREE.Vector2()) => {
    if (state !== 'rest' && state !== 'dropped') return;
    scene.attach(pen);
    pen.matrixAutoUpdate = true;
    state = 'held';
    syncCenter();
    aim.copy(ndc);
    raycaster.setFromCamera(ndc, camera);
    aimPlane(position);
    const point = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, point)) planeOffset.copy(position).sub(point);
    else planeOffset.set(0, 0, 0);
    previousTimestamp = performance.now();
    pointerVelocity.set(0, 0, 0);
    grabbedPointer = true;
    render();
  };
  const drop = () => {
    if (state !== 'held' && state !== 'spinning') return;
    if (state === 'held') {
      syncCenter();
      velocity.copy(pointerVelocity).multiplyScalar(0.18);
    }
    chargingAt = 0;
    charge = 0;
    spin = 0;
    catchWindow = false;
    feedback = '';
    feedbackUntil = 0;
    state = 'dropped';
    grabbedPointer = false;
    render();
  };
  const startCharge = () => {
    if (state !== 'held' || chargingAt) return;
    feedback = '';
    feedbackUntil = 0;
    chargingAt = performance.now();
    charge = 0;
    render();
  };
  const sonic = () => {
    if (state !== 'held') return;
    const charged = chargingAt ? Math.min(1, (performance.now() - chargingAt) / 1200) : 0;
    const flick = pointerVelocity.length();
    chargingAt = 0;
    if (charged < 0.12 && flick < 0.35) {
      charge = 0;
      pointerVelocity.set(0, 0, 0);
      render();
      return;
    }
    charge = charged;
    syncCenter();
    camera.getWorldDirection(forward);
    sceneRight.crossVectors(forward, camera.up).normalize();
    sceneUp.crossVectors(sceneRight, forward).normalize();
    const flickDirection = pointerVelocity.lengthSq()
      ? pointerVelocity.clone().normalize()
      : sceneRight.clone();
    const penAxis = localLongAxis.clone().applyQuaternion(pen.quaternion).normalize();
    const axis = new THREE.Vector3().crossVectors(penAxis, flickDirection);
    angularAxis.copy(axis.lengthSq() > 1e-5 ? axis.normalize() : sceneUp);
    spin = Math.min(34, 7 + charged * 21 + flick * 0.7);
    spinTime = 0;
    spinAngle = 0;
    position.add(sceneRight.clone().multiplyScalar(0.07)).addScaledVector(sceneUp, 0.025);
    velocity.copy(pointerVelocity).multiplyScalar(0.18).addScaledVector(forward, 0.22);
    state = 'spinning';
    grabbedPointer = false;
    render();
  };
  const catchPen = () => {
    if (state !== 'spinning') return;
    if (!catchWindow) {
      drop();
      return;
    }
    state = 'held';
    spin = 0;
    velocity.set(0, 0, 0);
    pointerVelocity.set(0, 0, 0);
    chargingAt = 0;
    charge = 0;
    catchWindow = false;
    feedback = copy.penspinning.caught;
    feedbackUntil = performance.now() + 900;
    aimPlane(position);
    raycaster.setFromCamera(aim, camera);
    const point = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, point)) planeOffset.copy(position).sub(point);
    previousTimestamp = performance.now();
    render();
  };
  const reset = () => {
    chargingAt = 0;
    charge = 0;
    spin = 0;
    spinAngle = 0;
    spinTime = 0;
    catchWindow = false;
    velocity.set(0, 0, 0);
    pointerVelocity.set(0, 0, 0);
    grabbedPointer = false;
    feedback = '';
    feedbackUntil = 0;
    restoreTransform(pen, home);
    position.copy(homeCenter);
    state = 'rest';
    render();
  };
  const chargeButton = button(copy.penspinning.charge, () => {});
  chargeButton.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
    chargeButton.setPointerCapture(event.pointerId);
    startCharge();
  });
  const releaseCharge = (event: Event) => {
    event.stopPropagation();
    if (state === 'held' && chargingAt) sonic();
  };
  chargeButton.addEventListener('pointerup', releaseCharge);
  chargeButton.addEventListener('pointercancel', releaseCharge);
  controls.append(
    button(copy.penspinning.pickUp, () => pickUp()),
    chargeButton,
    button(copy.penspinning.catch, catchPen),
    button(copy.penspinning.drop, drop),
    button(copy.penspinning.reset, reset)
  );
  render();
  return {
    pose: {
      position: homeCenter.clone().add(new THREE.Vector3(0.52, 0.5, 0.72)),
      lookAt: homeCenter
    },
    intro: copy.penspinning.intro,
    update: (dt) => {
      if (state === 'held') {
        if (chargingAt) charge = Math.min(1, (performance.now() - chargingAt) / 1200);
        render();
        return;
      }
      if (state !== 'spinning' && state !== 'dropped') return;
      let remaining = Math.max(0, dt);
      while (remaining > 0) {
        const step = Math.min(remaining, 1 / 120);
        remaining -= step;
        const previousBounds = new THREE.Box3().setFromObject(pen);
        if (state === 'spinning') {
          spinTime += step;
          const previousAngle = spinAngle;
          spinAngle += spin * step;
          const phase = ((spinAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          catchWindow = spinTime > 0.28 && (phase < 0.52 || phase > Math.PI * 2 - 0.52);
          const orbitRadius = 0.07;
          const oldOrbit = new THREE.Vector3(
            Math.cos(previousAngle),
            0,
            Math.sin(previousAngle)
          ).multiplyScalar(orbitRadius);
          const newOrbit = new THREE.Vector3(
            Math.cos(spinAngle),
            0,
            Math.sin(spinAngle)
          ).multiplyScalar(orbitRadius);
          position.add(newOrbit.sub(oldOrbit));
          spin = Math.max(0, spin - step * (4.2 + spin * 0.025));
          if (spin < 4.5 && !catchWindow) drop();
        } else {
          catchWindow = false;
        }
        velocity.addScaledVector(gravity, step);
        position.addScaledVector(velocity, step);
        pen.quaternion.premultiply(
          new THREE.Quaternion().setFromAxisAngle(angularAxis, spin * step)
        );
        setCenter(position);
        const bounds = new THREE.Box3().setFromObject(pen);
        supportRay.set(
          new THREE.Vector3(
            position.x,
            Math.max(previousBounds.min.y, bounds.min.y) + 0.001,
            position.z
          ),
          down
        );
        const support = supportRay.intersectObjects(supports, false)[0];
        const penetration = support ? support.point.y - bounds.min.y : 0;
        if (penetration > 0) {
          position.y += penetration;
          if (velocity.y < 0) velocity.y *= -0.12;
          velocity.x *= Math.exp(-step * 4);
          velocity.z *= Math.exp(-step * 4);
          setCenter(position);
          if (Math.abs(velocity.y) < 0.04) {
            velocity.y = 0;
            if (state === 'dropped') {
              const axis = localLongAxis.clone().applyQuaternion(pen.quaternion).normalize();
              const restingAxis = new THREE.Vector3(axis.x, 0, axis.z);
              if (restingAxis.lengthSq() < 1e-8) restingAxis.set(1, 0, 0);
              pen.quaternion.premultiply(
                new THREE.Quaternion().setFromUnitVectors(axis, restingAxis.normalize())
              );
              setCenter(position);
              const restingBounds = new THREE.Box3().setFromObject(pen);
              position.y += support!.point.y - restingBounds.min.y;
              setCenter(position);
            }
          }
        }
      }
      render();
    },
    pointerDown: (ndc) => {
      aim.copy(ndc);
      if (state === 'spinning') {
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.intersectObject(pen, true).length) catchPen();
        else drop();
        return;
      }
      if (state === 'held') {
        startCharge();
        grabbedPointer = true;
        return;
      }
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(pen, true).length) pickUp(ndc);
    },
    pointerMove: (ndc) => {
      aim.copy(ndc);
      if (state === 'held' && grabbedPointer) updateHeldPosition(ndc);
    },
    pointerUp: () => {
      if (state !== 'held' || !grabbedPointer) return;
      grabbedPointer = false;
      if (chargingAt || pointerVelocity.length() > 0.55) sonic();
    },
    keyDown: (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return false;
      if (event.key === ' ') {
        if (event.repeat) return true;
        if (state === 'spinning') catchPen();
        else if (state === 'rest' || state === 'dropped') pickUp();
        else startCharge();
        return true;
      }
      if (event.key.toLowerCase() === 's' && state === 'held') {
        if (!event.repeat) sonic();
        return true;
      }
      if (event.key.toLowerCase() === 'r') {
        if (!event.repeat) reset();
        return true;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (state !== 'held') return false;
        camera.getWorldDirection(forward);
        sceneRight.crossVectors(forward, camera.up).normalize();
        setCenter(
          position.clone().addScaledVector(sceneRight, event.key === 'ArrowRight' ? 0.02 : -0.02)
        );
        return true;
      }
      return false;
    },
    keyUp: (event) => {
      if (event.key !== ' ') return false;
      if (state === 'held' && chargingAt) sonic();
      return true;
    },
    dispose: reset
  };
};
