import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { roomCopy } from './room-copy';
import { roomPhaseForTokyoHour, type RoomPhase } from './room-logic';
import { isPlayable, startPlay, type PlayId, type PlaySession } from './room-play';

type Locale = keyof typeof roomCopy;
type HobbyTargetId =
  | 'piano'
  | 'typing'
  | 'darts'
  | 'rubik'
  | 'yoyo'
  | 'penspinning'
  | 'kendama'
  | 'cardistry';
type MusicChildId = 'trombone' | 'transcriptions';
type TargetId =
  | 'projects'
  | 'notes'
  | 'hobbies'
  | HobbyTargetId
  | 'namecard'
  | 'events'
  | 'photos'
  | 'juggling'
  | 'penlight'
  | 'nesoberi'
  | 'light'
  | 'closet';
type ContentId = TargetId | MusicChildId | 'about' | 'contact';
type Pose = { position: THREE.Vector3; yaw: number; pitch: number };
type TargetDefinition = {
  id: TargetId;
  position: [number, number, number];
  path: string;
  label?: false;
};
type ContentLink = { id: ContentId; label: string; path: string };
type CurtainMotion = {
  object: THREE.Mesh;
  id: string;
  attribute: THREE.BufferAttribute;
  normalAttribute?: THREE.BufferAttribute;
  open: Float32Array;
  closed: Float32Array;
  openNormals?: Float32Array;
  closedNormals?: Float32Array;
};

const hobbyTargetIds: readonly HobbyTargetId[] = [
  'piano',
  'typing',
  'darts',
  'rubik',
  'yoyo',
  'penspinning',
  'kendama',
  'cardistry'
];

const hobbyHeadingTitles: Record<HobbyTargetId, readonly string[]> = {
  piano: ['music', '音楽', 'ดนตรี'],
  typing: ['typing', 'typing / steno', 'タイピング', 'タイピング / ステノ', 'พิมพ์ดีด', 'ไทป์ปิง'],
  darts: ['darts', 'ダーツ', 'ดาร์ต', 'ปาเป้า'],
  rubik: ['rubik', 'rubiks', 'ルービック', 'ルービックキューブ', 'รูบิก'],
  yoyo: ['yoyo', 'yo-yo', 'ヨーヨー', 'โยโย่'],
  penspinning: ['pen spinning', 'pen-spinning', 'penspinning', 'ペンスピニング', 'เพนสปินนิ่ง'],
  kendama: ['kendama', 'けん玉', 'เคนดามะ'],
  cardistry: [
    'cardistry',
    'cardistry / magic',
    'cardistry/magic',
    'カーディストリー',
    'カーディストリー / マジック',
    'คาร์ดิสทรี',
    'คาร์ดิสทรี / มายากล'
  ]
};

const normalizeHeading = (value: string) =>
  value
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
const isHobbyTarget = (id: ContentId): id is HobbyTargetId =>
  hobbyTargetIds.includes(id as HobbyTargetId);
const musicChildIds: readonly MusicChildId[] = ['trombone', 'transcriptions'];
const isMusicChild = (id: ContentId): id is MusicChildId =>
  musicChildIds.includes(id as MusicChildId);
const musicChildTitles: Record<MusicChildId, readonly string[]> = {
  trombone: ['trombone'],
  transcriptions: ['transcriptions', 'transcription']
};

const targetDefinitions: TargetDefinition[] = [
  { id: 'projects', position: [-2.65, 1.4, 0.55], path: 'projects' },
  { id: 'notes', position: [-2.08, 0.85, 1.59], path: 'notes' },
  {
    id: 'namecard',
    position: [-1.82, 0.81, 1.15],
    path: 'namecard/default'
  },
  { id: 'hobbies', position: [1.72, 1.2, -3.3], path: 'hobbies' },
  { id: 'events', position: [1.15, 1.22, -3.17], path: 'events' },
  { id: 'photos', position: [0.436, 0.923, 1.703], path: 'photos' },
  { id: 'penlight', position: [3.2, 1.62, 1.15], path: 'events' },
  { id: 'juggling', position: [0.935, 0.2875, -1.64], path: 'hobbies' },
  { id: 'nesoberi', position: [0.8, 0.6, -1.6], path: '', label: false },
  { id: 'light', position: [-1.86, 1.24, -2.45], path: '' },
  {
    id: 'closet',
    position: [2.42, 1.25, -2.45],
    path: ''
  },
  { id: 'darts', position: [-2.4, 1.97, -3.64], path: 'hobbies' },
  { id: 'piano', position: [-2.76, 0.73, -3.015], path: 'hobbies' },
  {
    id: 'typing',
    position: [-3.205, 0.8235, -1.201],
    path: 'hobbies'
  },
  { id: 'rubik', position: [-2.47, 0.89, 1.28], path: 'hobbies' },
  {
    id: 'yoyo',
    position: [3.48, 1.24, -1.22],
    path: 'hobbies'
  },
  {
    id: 'penspinning',
    position: [3.48, 1.22, -1.05],
    path: 'hobbies'
  },
  {
    id: 'kendama',
    position: [3.5, 1.3, -0.55],
    path: 'hobbies'
  },
  {
    id: 'cardistry',
    position: [3.5, 1.22, 0.1],
    path: 'hobbies'
  }
];

const defaultBounds = { minX: -3, maxX: 3, minZ: -3.8, maxZ: 3.8, minY: 0, maxY: 2.8 };
const defaultCollisionRects = [
  { minX: -2.865, maxX: -1.615, minZ: -0.355, maxZ: 1.895 },
  { minX: -1.43, maxX: -0.85, minZ: 0.53, maxZ: 1.12 },
  { minX: 0.61, maxX: 2.835, minZ: -3.69, maxZ: -3.1 },
  { minX: 1.005, maxX: 1.755, minZ: -3.05, maxZ: -2.59 },
  { minX: -2.72, maxX: -2.08, minZ: -3.76, maxZ: -3.1 },
  { minX: -2.65, maxX: -2.25, minZ: -3.12, maxZ: -2.92 },
  { minX: 0.95, maxX: 2.35, minZ: -1.62, maxZ: -0.28 }
];
const playerRadius = 0.22;
const initialPosition: [number, number, number] = [0, 1.6, 2.6];
const initialLookAt: [number, number, number] = [-0.8, 1, -2];
const defaultFocusPositions: Record<TargetId, [number, number, number]> = {
  projects: [-0.8, 1.5, 0.55],
  notes: [-0.8, 1.45, 1.6],
  namecard: [-0.7, 1.2, 1.2],
  hobbies: [1, 1.5, -2.05],
  events: [1.15, 1.55, -2],
  photos: [0.58, 1.27, 0.95],
  nesoberi: [0.8, 1.2, -0.4],
  penlight: [2.25, 1.6, 1.15],
  juggling: [0.935, 0.8, -0.8],
  light: [-1.86, 1.35, -2.15],
  darts: [-1.35, 1.5, -2.3],
  piano: [-1.35, 1.5, -2.3],
  typing: [-1.45, 1.45, -1.2],
  rubik: [-0.8, 1.5, 1.28],
  yoyo: [2.75, 1.4, -1.22],
  penspinning: [2.75, 1.4, -1.05],
  kendama: [2.75, 1.4, -0.55],
  cardistry: [2.75, 1.4, 0.1],
  closet: [1.15, 1.45, -1.65]
};
const focusDuration = 520;
const returnDuration = 420;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
const lerpAngle = (from: number, to: number, amount: number) =>
  from + wrapAngle(to - from) * amount;
const easeInOut = (amount: number) => amount * amount * (3 - 2 * amount);

const getTargetDefinition = (id: TargetId) => targetDefinitions.find((target) => target.id === id);

const parseBounds = (value: unknown) => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const numbers = ['minX', 'maxX', 'minZ', 'maxZ', 'minY', 'maxY'].map((key) => record[key]);
  if (numbers.some((item) => typeof item !== 'number')) return undefined;
  return {
    minX: numbers[0] as number,
    maxX: numbers[1] as number,
    minZ: numbers[2] as number,
    maxZ: numbers[3] as number,
    minY: numbers[4] as number,
    maxY: numbers[5] as number
  };
};

const parseCollision = (value: unknown) => {
  if (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((item) => typeof item === 'number')
  ) {
    return {
      minX: value[0],
      maxX: value[1],
      minZ: value[2],
      maxZ: value[3]
    };
  }
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const numbers = ['minX', 'maxX', 'minZ', 'maxZ'].map((key) => record[key]);
  if (numbers.some((item) => typeof item !== 'number')) return undefined;
  return {
    minX: numbers[0] as number,
    maxX: numbers[1] as number,
    minZ: numbers[2] as number,
    maxZ: numbers[3] as number
  };
};

const parseVector = (value: unknown) => {
  if (Array.isArray(value)) {
    if (value.length !== 3 || !value.every((item) => typeof item === 'number')) return undefined;
    return new THREE.Vector3(value[0], value[1], value[2]);
  }
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if ([record.x, record.y, record.z].every((item) => typeof item === 'number')) {
    return new THREE.Vector3(record.x as number, record.y as number, record.z as number);
  }
  if (record.position) return parseVector(record.position);
  return undefined;
};

const getRoomTarget = (object: THREE.Object3D): TargetId | undefined => {
  let current: THREE.Object3D | null = object;
  while (current) {
    const target = current.userData?.roomTarget;
    if (typeof target === 'string' && getTargetDefinition(target as TargetId)) {
      return target as TargetId;
    }
    current = current.parent;
  }
  return undefined;
};

type ArchitecturalGlassKind = 'clear' | 'frosted';
const penlightNamePattern = /^Penlight[_ ]spill[_ ][1-3](?:_\d+)?$/i;
const nonAtlasPosterNodeNames = new Set([
  'Web Closet yellow illustration poster',
  'Web Desk blue group poster',
  'Web Desk poster costume',
  'Web Desk poster footer',
  'Web Desk poster portrait',
  'Web Entry wall blue portrait banner'
]);

const getArchitecturalGlassKind = (
  material: THREE.Material
): ArchitecturalGlassKind | undefined => {
  const name = material.name.trim().toLowerCase();
  if (name === 'architectural clear glass' || name.startsWith('optical clear display case'))
    return 'clear';
  if (name === 'architectural frosted glass') return 'frosted';
  return undefined;
};

const isOpticalDisplayCaseMaterial = (material: THREE.Material) =>
  material.name.trim().toLowerCase().startsWith('optical clear display case');

const configureArchitecturalGlass = (material: THREE.Material) => {
  const kind = getArchitecturalGlassKind(material);
  if (!kind) return false;
  if (material instanceof THREE.MeshStandardMaterial) {
    material.emissiveIntensity = 0;
  }
  if (material instanceof THREE.MeshPhysicalMaterial) {
    const isOpticalDisplayCase = isOpticalDisplayCaseMaterial(material);
    material.transmission = Math.max(material.transmission, kind === 'clear' ? 1 : 0.82);
    material.ior = isOpticalDisplayCase ? Math.max(material.ior, 1.45) : 1.45;
    material.thickness = Math.max(material.thickness, isOpticalDisplayCase ? 0.001 : 0.01);
  } else {
    material.transparent = true;
    material.opacity = kind === 'clear' ? 0.36 : 0.64;
    material.depthWrite = false;
  }
  material.side = THREE.DoubleSide;
  material.needsUpdate = true;
  return true;
};

const configureAcrylicCase = (material: THREE.Material) => {
  if (!material.name.trim().toLowerCase().startsWith('room/acrylicclear case')) return;
  if (material instanceof THREE.MeshPhysicalMaterial) {
    material.transmission = 0;
    material.thickness = 0;
  }
  material.transparent = true;
  material.opacity = 0.14;
  material.depthWrite = false;
  material.side = THREE.DoubleSide;
  material.needsUpdate = true;
};

const isOpaqueMaterial = (material: THREE.Material) =>
  !getArchitecturalGlassKind(material) &&
  !(material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0) &&
  !material.transparent &&
  material.opacity >= 0.98 &&
  material.depthWrite !== false;

const isOpaqueObject = (object: THREE.Object3D) => {
  if (!(object instanceof THREE.Mesh)) return true;
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  return materials.some(isOpaqueMaterial);
};

const disposeObject = (object: THREE.Object3D) => {
  if (!(object instanceof THREE.Mesh)) return;
  object.geometry.dispose();
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof THREE.Texture) value.dispose();
    });
    material.dispose();
  });
};

const createPose = (camera: THREE.PerspectiveCamera, yaw: number, pitch: number): Pose => ({
  position: camera.position.clone(),
  yaw,
  pitch
});

export const initRoom = (root: HTMLElement) => {
  const locale = (root.dataset.locale ?? 'en') as Locale;
  const copy = roomCopy[locale] ?? roomCopy.en;
  const stage = root.querySelector<HTMLElement>('[data-room-stage]');
  const entry = root.querySelector<HTMLElement>('[data-room-entry]');
  const enterButton = root.querySelector<HTMLButtonElement>('[data-room-enter]');
  const status = root.querySelector<HTMLElement>('[data-room-status]');
  const help = root.querySelector<HTMLElement>('[data-room-help]');
  const hint = root.querySelector<HTMLElement>('[data-room-hint]');
  const targetLabelsRoot = root.querySelector<HTMLElement>('[data-room-target-labels]');
  const reticle = root.querySelector<HTMLElement>('[data-room-reticle]');
  const exitButton = root.querySelector<HTMLButtonElement>('[data-room-exit]');
  const timeElement = root.querySelector<HTMLElement>('[data-room-time]');
  const panel = root.querySelector<HTMLDialogElement>('[data-room-panel]');
  const panelTitle = root.querySelector<HTMLElement>('#room-panel-title');
  const panelStatus = root.querySelector<HTMLElement>('[data-room-panel-status]');
  const panelTabs = root.querySelector<HTMLElement>('[data-room-tabs]');
  const frame = root.querySelector<HTMLIFrameElement>('[data-room-frame]');
  const fullPage = root.querySelector<HTMLAnchorElement>('[data-room-full-page]');
  const preview = root.querySelector<HTMLElement>('[data-room-preview]');
  const lightControl = root.querySelector<HTMLElement>('[data-room-light-control]');
  const lightToggle = root.querySelector<HTMLButtonElement>('[data-room-light-toggle]');
  const lightLeft = root.querySelector<HTMLButtonElement>('[data-room-light-left]');
  const lightRight = root.querySelector<HTMLButtonElement>('[data-room-light-right]');
  const lightAuto = root.querySelector<HTMLButtonElement>('[data-room-light-auto]');
  const curtainButton = root.querySelector<HTMLButtonElement>('[data-room-curtains]');
  const curtainAuto = root.querySelector<HTMLButtonElement>('[data-room-curtains-auto]');
  const lieDownButton = root.querySelector<HTMLButtonElement>('[data-room-lie-down]');
  const closetButton = root.querySelector<HTMLButtonElement>('[data-room-closet]');
  const panelKicker = root.querySelector<HTMLElement>('[data-room-panel-kicker]');
  const playHud = root.querySelector<HTMLElement>('[data-room-play]');
  const playTitle = root.querySelector<HTMLElement>('[data-room-play-title]');
  const playIntro = root.querySelector<HTMLElement>('[data-room-play-intro]');
  const playStats = root.querySelector<HTMLElement>('[data-room-play-stats]');
  const playControls = root.querySelector<HTMLElement>('[data-room-play-controls]');
  const playPage = root.querySelector<HTMLButtonElement>('[data-room-play-page]');
  const playExit = root.querySelector<HTMLButtonElement>('[data-room-play-exit]');

  if (
    !stage ||
    !entry ||
    !enterButton ||
    !status ||
    !help ||
    !hint ||
    !targetLabelsRoot ||
    !reticle ||
    !exitButton ||
    !panel ||
    !panelTitle ||
    !panelStatus ||
    !panelTabs ||
    !frame ||
    !fullPage ||
    !preview ||
    !lightControl ||
    !lightToggle ||
    !lightLeft ||
    !lightRight ||
    !lightAuto ||
    !curtainButton ||
    !curtainAuto ||
    !lieDownButton ||
    !closetButton ||
    !panelKicker ||
    !playHud ||
    !playTitle ||
    !playIntro ||
    !playStats ||
    !playControls ||
    !playPage ||
    !playExit
  ) {
    return;
  }

  let disposed = false;
  const hobbyRoutesController = new AbortController();

  const destinationLabels = new Map(
    Array.from(root.querySelectorAll<HTMLElement>('[data-room-destination]')).map((element) => [
      element.dataset.roomDestination ?? '',
      element.textContent?.trim() ?? ''
    ])
  );
  const labelFor = (id: ContentId) => {
    if (isHobbyTarget(id)) return copy[id];
    if (id === 'light') return copy.light;
    if (id === 'penlight') return copy.penlight;
    if (id === 'juggling') return copy.juggling;
    if (id === 'nesoberi') return copy.nesoberi;
    if (id === 'closet') return copy.closet;
    if (id === 'about') return copy.about;
    if (id === 'contact') return copy.contact;
    return destinationLabels.get(id) ?? id;
  };
  const hobbyPaths: Record<HobbyTargetId, string> = {
    piano: 'hobbies',
    typing: 'hobbies',
    darts: 'hobbies',
    rubik: 'hobbies',
    yoyo: 'hobbies',
    penspinning: 'hobbies',
    kendama: 'hobbies',
    cardistry: 'hobbies'
  };
  const musicChildPaths: Record<MusicChildId, string> = {
    trombone: 'hobbies',
    transcriptions: 'hobbies'
  };
  const musicChildLabels: Record<MusicChildId, string> = {
    trombone: 'Trombone',
    transcriptions: 'Transcriptions'
  };
  const pathFor = (id: ContentId) => {
    if (id === 'about') return 'about';
    if (id === 'contact') return 'contact';
    if (isHobbyTarget(id)) return hobbyPaths[id];
    if (isMusicChild(id)) return musicChildPaths[id];
    return getTargetDefinition(id)?.path ?? id;
  };
  const toUrl = (path: string) => `/${locale}/${path}`;
  const toFrameUrl = (path: string) => `${toUrl(path)}?roomEmbed=1`;
  const targetLabels = new Map<TargetId, HTMLElement>();
  targetDefinitions.forEach((target) => {
    if (target.label === false) return;
    const label = document.createElement('button');
    label.type = 'button';
    label.setAttribute('aria-label', labelFor(target.id));
    label.className = 'room-target-label';
    label.dataset.roomTargetLabel = target.id;
    if (isHobbyTarget(target.id)) label.dataset.roomTargetMarker = '';
    label.textContent = labelFor(target.id);
    label.addEventListener('pointerenter', () => setHint(target.id));
    label.addEventListener('pointerleave', () => setHint());
    label.addEventListener('focus', () => setHint(target.id));
    label.addEventListener('blur', () => setHint());
    label.addEventListener('click', () => {
      if (entered && !focusActive) focusTarget(target.id);
    });
    targetLabelsRoot.append(label);
    targetLabels.set(target.id, label);
  });

  const hobbyRoutesReady = fetch(toUrl('hobbies'), {
    headers: { accept: 'text/html' },
    signal: hobbyRoutesController.signal
  })
    .then(async (response) => {
      if (!response.ok) return;
      const html = await response.text();
      const document = new DOMParser().parseFromString(html, 'text/html');
      const routes = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
        .map((anchor) => {
          try {
            const url = new URL(anchor.href, window.location.href);
            const match = url.pathname.match(new RegExp(`^/${locale}/hobbies/([^/?#]+)$`));
            const heading = anchor.querySelector<HTMLHeadingElement>('h1, h2, h3');
            if (url.origin !== window.location.origin || !match?.[1] || !heading) return null;
            return { id: match[1], heading: normalizeHeading(heading.textContent ?? '') };
          } catch {
            return null;
          }
        })
        .filter((route): route is { id: string; heading: string } => !!route);
      const routeFor = (id: HobbyTargetId) =>
        routes.find((route) =>
          hobbyHeadingTitles[id].some((title) => normalizeHeading(title) === route.heading)
        );
      hobbyTargetIds.forEach((id) => {
        const route = routeFor(id);
        if (route) hobbyPaths[id] = `hobbies/${route.id}`;
      });
      const piano = routeFor('piano');
      if (piano) {
        const musicResponse = await fetch(toUrl(`hobbies/${piano.id}`), {
          headers: { accept: 'text/html' },
          signal: hobbyRoutesController.signal
        });
        if (!musicResponse.ok) return;
        const musicDocument = new DOMParser().parseFromString(
          await musicResponse.text(),
          'text/html'
        );
        const child = Array.from(musicDocument.querySelectorAll<HTMLAnchorElement>('a[href]')).find(
          (anchor) => {
            const url = new URL(anchor.getAttribute('href') ?? '', window.location.href);
            return (
              url.origin === window.location.origin &&
              url.pathname.startsWith(`/${locale}/hobbies/${piano.id}/doc/`) &&
              /^(piano|ピアノ|เปียโน)(?:\s|$)/i.test(anchor.textContent?.trim() ?? '')
            );
          }
        );
        if (child) {
          hobbyPaths.piano = new URL(
            child.getAttribute('href')!,
            window.location.href
          ).pathname.slice(locale.length + 2);
        }
        Array.from(musicDocument.querySelectorAll<HTMLAnchorElement>('a[href]')).forEach(
          (anchor) => {
            const url = new URL(anchor.getAttribute('href') ?? '', window.location.href);
            const childId = musicChildIds.find((id) =>
              musicChildTitles[id].some((title) =>
                normalizeHeading(anchor.textContent?.trim() ?? '').startsWith(
                  normalizeHeading(title)
                )
              )
            );
            if (
              !childId ||
              url.origin !== window.location.origin ||
              !url.pathname.startsWith(`/${locale}/hobbies/${piano.id}/doc/`)
            ) {
              return;
            }
            musicChildPaths[childId] = url.pathname.slice(locale.length + 2);
            musicChildLabels[childId] = anchor.textContent?.trim() ?? musicChildLabels[childId];
          }
        );
      }
    })
    .catch(() => undefined);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch {
    hobbyRoutesController.abort();
    status.textContent = root.dataset.roomError ?? copy.failed;
    enterButton.disabled = true;
    return;
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  renderer.shadowMap.autoUpdate = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', copy.scene);
  stage.replaceChildren(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 50);
  camera.rotation.order = 'YXZ';
  camera.position.set(...initialPosition);
  let compositionActive = false;

  let composer: EffectComposer | undefined;
  if (!coarsePointer) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const ambientOcclusion = new GTAOPass(scene, camera, stage.clientWidth, stage.clientHeight);
    ambientOcclusion.updateGtaoMaterial({
      radius: 0.35,
      distanceFallOff: 1,
      thickness: 1,
      scale: 1
    });
    ambientOcclusion.blendIntensity = 0.85;
    composer.addPass(ambientOcclusion);
    composer.addPass(new OutputPass());
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(stage.clientWidth, stage.clientHeight);
  }

  const updateCameraComposition = () => {
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    if (!compositionActive) {
      camera.clearViewOffset();
    } else if (window.matchMedia('(max-width: 700px)').matches) {
      camera.setViewOffset(width, height, 0, height * 0.36, width, height);
    } else {
      camera.setViewOffset(width, height, width * 0.335, 0, width, height);
    }
    camera.updateProjectionMatrix();
  };

  const ambient = new THREE.HemisphereLight(
    new THREE.Color(1, 0.93, 0.83),
    new THREE.Color(0.66, 0.56, 0.46),
    0.9
  );
  const topWindowSunPosition = new THREE.Vector3(-1.6, 2.7, -2.8);
  const topWindowLightTarget = new THREE.Vector3(0, 0, -0.45);
  const daylight = new THREE.DirectionalLight(new THREE.Color(1, 0.86, 0.68), 2.4);
  daylight.position.copy(topWindowSunPosition);
  daylight.target.position.copy(topWindowLightTarget);
  daylight.castShadow = true;
  const shadowMapSize = coarsePointer ? 512 : 1024;
  daylight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  daylight.shadow.camera.near = 0.1;
  daylight.shadow.camera.far = 12;
  daylight.shadow.camera.left = -5.5;
  daylight.shadow.camera.right = 5.5;
  daylight.shadow.camera.top = 5.5;
  daylight.shadow.camera.bottom = -5.5;
  daylight.shadow.bias = -0.0002;
  daylight.shadow.normalBias = 0.025;
  daylight.shadow.camera.updateProjectionMatrix();
  const warmLight = new THREE.SpotLight(new THREE.Color(1, 0.78, 0.56), 0, 7, Math.PI * 0.45, 1, 2);
  ambient.position.set(0, 2.8, 0);
  warmLight.position.set(-2.25, 2.67, -0.25);
  warmLight.target.position.set(-2.25, 0, -0.25);
  const frontWarmLight = warmLight.clone();
  frontWarmLight.position.set(2.05, 2.66, 0.75);
  frontWarmLight.target.position.set(2.05, 0, 0.75);
  if (!coarsePointer) {
    warmLight.shadow.mapSize.set(1024, 1024);
    warmLight.shadow.camera.near = 0.1;
    warmLight.shadow.camera.far = 7;
    warmLight.shadow.bias = -0.0003;
    warmLight.shadow.normalBias = 0.02;
  }
  scene.add(
    ambient,
    daylight,
    daylight.target,
    warmLight,
    warmLight.target,
    frontWarmLight,
    frontWarmLight.target
  );

  const sky = new Sky();
  sky.scale.setScalar(450);
  sky.frustumCulled = false;
  sky.renderOrder = -1;
  const skyMaterial = sky.material as THREE.ShaderMaterial;
  const skyUniforms = skyMaterial.uniforms;
  skyUniforms.radianceScale = { value: 0.08 };
  skyMaterial.fragmentShader = `uniform float radianceScale;\n${skyMaterial.fragmentShader.replace(
    'vec4( texColor, 1.0 )',
    'vec4( texColor * radianceScale, 1.0 )'
  )}`;
  const environmentScene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  let environmentTarget: THREE.WebGLRenderTarget | null = null;
  const skySunPosition = new THREE.Vector3();
  let lightingPhase: 'day' | 'night' | undefined;
  let nightPhase = false;
  let manualPhase: RoomPhase | undefined;
  let leftLightManual: boolean | undefined;
  let rightLightManual: boolean | undefined;
  let curtainManualOpen: boolean | undefined;
  const curtainTargets = new Map<string, number>();
  const curtainAmounts = new Map<string, number>();
  const curtainMotion: CurtainMotion[] = [];
  const backdrops: THREE.Object3D[] = [];
  const syncVisibleBackdrop = () => {
    scene.background = null;
    sky.visible = true;
    backdrops.forEach((object) => {
      object.visible = (object.userData.roomBackdrop === 'night') === nightPhase;
    });
  };

  const updateSkyPhase = (night: boolean) => {
    if (night) {
      skySunPosition.set(-0.2, -0.12, 0.96).normalize();
      skyUniforms.turbidity.value = 7;
      skyUniforms.rayleigh.value = 0.35;
      skyUniforms.mieCoefficient.value = 0.012;
      skyUniforms.mieDirectionalG.value = 0.76;
      skyUniforms.cloudCoverage.value = 0.18;
      skyUniforms.cloudDensity.value = 0.25;
      skyUniforms.showSunDisc.value = 0;
    } else {
      skySunPosition.copy(topWindowSunPosition).normalize();
      skyUniforms.turbidity.value = 3.2;
      skyUniforms.rayleigh.value = 1.8;
      skyUniforms.mieCoefficient.value = 0.004;
      skyUniforms.mieDirectionalG.value = 0.8;
      skyUniforms.cloudCoverage.value = 0.36;
      skyUniforms.cloudDensity.value = 0.34;
      skyUniforms.showSunDisc.value = 1;
    }
    skyUniforms.sunPosition.value.copy(skySunPosition);
  };

  const refreshSkyEnvironment = (night: boolean) => {
    updateSkyPhase(night);
    const showSunDisc = skyUniforms.showSunDisc.value;
    const previousSkyVisibility = sky.visible;
    environmentScene.add(sky);
    sky.visible = true;
    skyUniforms.showSunDisc.value = 0;
    try {
      const nextTarget = pmremGenerator.fromScene(environmentScene);
      const previousTarget = environmentTarget;
      environmentTarget = nextTarget;
      scene.environment = nextTarget.texture;
      scene.environmentIntensity = night ? 0.3 : 0.55;
      previousTarget?.dispose();
    } catch {
      scene.environment = environmentTarget?.texture ?? null;
    }
    skyUniforms.showSunDisc.value = showSunDisc;
    sky.visible = previousSkyVisibility;
    scene.add(sky);
    syncVisibleBackdrop();
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const interactionRoot = new THREE.Group();
  scene.add(interactionRoot);

  let worldBounds = { ...defaultBounds };
  let collisionRects = defaultCollisionRects.map((rect) => ({ ...rect }));
  const resolvedTargetPositions = new Map<TargetId, THREE.Vector3>();
  const resolvedFocusPositions = new Map<TargetId, THREE.Vector3>();
  const authoredTargetPositions = new Set<TargetId>();

  let room: THREE.Group | null = null;
  let entered = false;
  let authoredEntryPosition: THREE.Vector3 | null = null;
  let authoredEntryLookAt: THREE.Vector3 | null = null;
  let focusActive = false;
  let resting = false;
  let closetOpen = false;
  let contentRequest = 0;
  let savedPose: Pose | null = null;
  let play: { id: PlayId; session: PlaySession; active: boolean } | null = null;
  let lastHitObject: THREE.Object3D | null = null;
  const pats: { object: THREE.Object3D; base: THREE.Vector3; t: number }[] = [];
  const hearts: { sprite: THREE.Sprite; t: number; velocity: THREE.Vector3 }[] = [];
  const heartTexture = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = getComputedStyle(root).getPropertyValue('--atelier-accent').trim();
      context.beginPath();
      context.moveTo(32, 54);
      context.bezierCurveTo(4, 34, 8, 8, 32, 20);
      context.bezierCurveTo(56, 8, 60, 34, 32, 54);
      context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  })();
  let transition: {
    from: Pose;
    to: Pose;
    startedAt: number;
    duration: number;
    complete?: () => void;
  } | null = null;
  const closetMotion: {
    object: THREE.Object3D;
    offset: number;
    closedX: number;
    leaf: string;
  }[] = [];
  let closetAmount = 0;
  let closetTarget = 0;
  let moveTarget: THREE.Vector3 | null = null;
  let yaw = 0;
  let pitch = 0;
  let lastFrame = performance.now();
  const keys = new Set<string>();
  const lookKeys = new Set<string>();
  let pointerState: { id: number; x: number; y: number; dragging: boolean } | null = null;
  let pointerLocked = false;
  let frameRequest = 0;
  let clockTimer = 0;
  let frameFocusTimer = 0;

  const setLookAt = (target: THREE.Vector3) => {
    const direction = target.clone().sub(camera.position);
    const horizontal = Math.hypot(direction.x, direction.z);
    yaw = Math.atan2(-direction.x, -direction.z);
    pitch = Math.atan2(direction.y, horizontal);
    camera.rotation.set(pitch, yaw, 0);
  };

  const applyOrientation = () => {
    camera.rotation.set(pitch, yaw, 0);
  };

  const currentPose = () => createPose(camera, yaw, pitch);

  const releasePointerLock = () => {
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
  };

  const onPointerLockChange = () => {
    pointerLocked = document.pointerLockElement === renderer.domElement;
    if (pointerLocked) {
      pointerState = null;
      renderer.domElement.style.cursor = 'none';
      root.dataset.roomPointerLock = 'locked';
      return;
    }
    renderer.domElement.style.cursor = play ? 'none' : 'grab';
    delete root.dataset.roomPointerLock;
  };

  const onPointerLockError = () => {
    pointerLocked = false;
    renderer.domElement.style.cursor = play ? 'none' : 'grab';
    root.dataset.roomPointerLock = 'denied';
    if (entered && !focusActive) {
      hint.textContent = copy.controls;
      hint.hidden = false;
    }
  };

  const requestPointerLock = () => {
    if (
      coarsePointer ||
      pointerLocked ||
      typeof renderer.domElement.requestPointerLock !== 'function'
    )
      return;
    try {
      const result = renderer.domElement.requestPointerLock();
      if (result && typeof result.then === 'function') void result.catch(onPointerLockError);
    } catch {
      onPointerLockError();
    }
  };

  const targetPosition = (id: TargetId) =>
    resolvedTargetPositions.get(id)?.clone() ??
    new THREE.Vector3(...getTargetDefinition(id)!.position);

  let highlightedTarget: TargetId | undefined;
  const targetMeshes = new Map<TargetId, THREE.Mesh[]>();
  const highlightOverlays: THREE.Mesh[] = [];
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(getComputedStyle(root).getPropertyValue('--atelier-accent').trim()),
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });
  const applyModelHighlight = (target?: TargetId) => {
    highlightOverlays.splice(0).forEach((overlay) => overlay.removeFromParent());
    if (!target) return;
    targetMeshes.get(target)?.forEach((mesh) => {
      const overlay = new THREE.Mesh(mesh.geometry, highlightMaterial);
      overlay.raycast = () => {};
      mesh.add(overlay);
      highlightOverlays.push(overlay);
    });
  };
  const setHighlightedTarget = (target?: TargetId) => {
    if (highlightedTarget === target) return;
    highlightedTarget = target;
    applyModelHighlight(target);
    reticle.toggleAttribute('data-target', Boolean(target));
    targetLabels.forEach((label, id) => {
      if (id === target) label.dataset.roomTargetHover = '';
      else delete label.dataset.roomTargetHover;
    });
  };

  const labelRaycaster = new THREE.Raycaster();
  const labelVisibility = new Map<TargetId, boolean>();
  const labelCameraPosition = new THREE.Vector3(Infinity, Infinity, Infinity);
  const labelCameraQuaternion = new THREE.Quaternion();
  const labelProjectionMatrix = new THREE.Matrix4();
  let lastLabelVisibilityCheck = -Infinity;
  let lastCenterCheck = -Infinity;

  const updateTargetLabels = (now: number) => {
    const visible = Boolean(room && entered && !focusActive);
    targetLabelsRoot.hidden = !visible;
    if (!visible) {
      targetLabels.forEach((label) => {
        label.hidden = true;
      });
      return;
    }
    const canvasRect = renderer.domElement.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;
    const checkVisibility =
      now - lastLabelVisibilityCheck >= 150 &&
      (!camera.position.equals(labelCameraPosition) ||
        !camera.quaternion.equals(labelCameraQuaternion) ||
        !camera.projectionMatrix.equals(labelProjectionMatrix));
    if (checkVisibility) {
      room!.updateMatrixWorld(true);
      labelCameraPosition.copy(camera.position);
      labelCameraQuaternion.copy(camera.quaternion);
      labelProjectionMatrix.copy(camera.projectionMatrix);
      lastLabelVisibilityCheck = now;
    }
    targetLabels.forEach((label, id) => {
      const position = targetPosition(id);
      const projected = position.clone().project(camera);
      const onScreen =
        projected.z >= -1 &&
        projected.z <= 1 &&
        projected.x >= -1 &&
        projected.x <= 1 &&
        projected.y >= -1 &&
        projected.y <= 1;
      if (onScreen && checkVisibility) {
        const direction = position.clone().sub(camera.position);
        labelRaycaster.far = direction.length();
        labelRaycaster.set(camera.position, direction.normalize());
        const blocker = labelRaycaster
          .intersectObject(room!, true)
          .find((intersection) => isOpaqueObject(intersection.object));
        labelVisibility.set(id, !blocker || getRoomTarget(blocker.object) === id);
      }
      label.hidden = !onScreen;
      if (label.hidden) return;
      label.style.left = `${canvasRect.left - rootRect.left + ((projected.x + 1) / 2) * canvasRect.width}px`;
      label.style.top = `${canvasRect.top - rootRect.top + ((1 - projected.y) / 2) * canvasRect.height}px`;
    });
  };

  const focusPose = (target: TargetId): Pose => {
    const authoredPosition = resolvedFocusPositions.get(target);
    if (authoredPosition) {
      const direction = targetPosition(target).sub(authoredPosition);
      const horizontal = Math.hypot(direction.x, direction.z);
      return {
        position: authoredPosition.clone(),
        yaw: Math.atan2(-direction.x, -direction.z),
        pitch: Math.atan2(direction.y, horizontal)
      };
    }
    const fallbackPosition = new THREE.Vector3(...defaultFocusPositions[target]);
    const direction = targetPosition(target).sub(fallbackPosition);
    const horizontal = Math.hypot(direction.x, direction.z);
    return {
      position: fallbackPosition,
      yaw: Math.atan2(-direction.x, -direction.z),
      pitch: Math.atan2(direction.y, horizontal)
    };
  };

  const setTransition = (to: Pose, duration: number, complete?: () => void) => {
    transition = { from: currentPose(), to, startedAt: performance.now(), duration, complete };
  };

  const setComposition = (active: boolean) => {
    compositionActive = active;
    updateCameraComposition();
  };

  const isColliding = (x: number, z: number) =>
    collisionRects.some(
      (rect) =>
        x > rect.minX - playerRadius &&
        x < rect.maxX + playerRadius &&
        z > rect.minZ - playerRadius &&
        z < rect.maxZ + playerRadius
    );

  const moveAlong = (dx: number, dz: number) => {
    const nextX = clamp(
      camera.position.x + dx,
      worldBounds.minX + playerRadius,
      worldBounds.maxX - playerRadius
    );
    const nextZ = clamp(
      camera.position.z + dz,
      worldBounds.minZ + playerRadius,
      worldBounds.maxZ - playerRadius
    );
    if (!isColliding(nextX, camera.position.z)) camera.position.x = nextX;
    if (!isColliding(camera.position.x, nextZ)) camera.position.z = nextZ;
    camera.position.y = clamp(camera.position.y, worldBounds.minY + 0.05, worldBounds.maxY - 0.05);
  };

  const moveToward = (target: THREE.Vector3, distance: number) => {
    const direction = new THREE.Vector3(
      target.x - camera.position.x,
      0,
      target.z - camera.position.z
    );
    const length = direction.length();
    if (length < 0.08) {
      moveTarget = null;
      return;
    }
    direction.multiplyScalar(Math.min(distance, length) / length);
    const before = camera.position.clone();
    moveAlong(direction.x, direction.z);
    if (camera.position.distanceToSquared(before) < 0.0001) moveTarget = null;
  };

  const toggleManualLight = () => {
    const anyLightOn = (leftLightManual ?? nightPhase) || (rightLightManual ?? nightPhase);
    leftLightManual = undefined;
    rightLightManual = undefined;
    manualPhase = anyLightOn ? 'day' : 'night';
    updatePhase();
  };

  const restoreAutomaticLight = () => {
    manualPhase = undefined;
    leftLightManual = undefined;
    rightLightManual = undefined;
    updatePhase();
  };

  const updateIndividualLightControls = () => {
    const leftOn = leftLightManual ?? nightPhase;
    const rightOn = rightLightManual ?? nightPhase;
    lightLeft.textContent = `${copy.lightLeft}: ${leftOn ? copy.lightStateOn : copy.lightStateOff}`;
    lightRight.textContent = `${copy.lightRight}: ${rightOn ? copy.lightStateOn : copy.lightStateOff}`;
    lightLeft.setAttribute('aria-pressed', String(leftOn));
    lightRight.setAttribute('aria-pressed', String(rightOn));
  };

  const toggleIndividualLight = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const current = isLeft ? (leftLightManual ?? nightPhase) : (rightLightManual ?? nightPhase);
    if (isLeft) leftLightManual = !current;
    else rightLightManual = !current;
    updatePhase();
  };

  const bakeToParentSpace = (object: THREE.Mesh) => {
    object.updateMatrix();
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(object.matrix);
    const vertex = new THREE.Vector3();
    const source = object.geometry.getAttribute('position');
    const positions = new Float32Array(source.count * 3);
    for (let index = 0; index < source.count; index += 1) {
      vertex
        .fromBufferAttribute(source, index)
        .applyMatrix4(object.matrix)
        .toArray(positions, index * 3);
    }
    object.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sourceNormals = object.geometry.getAttribute('normal');
    if (sourceNormals) {
      const normals = new Float32Array(sourceNormals.count * 3);
      for (let index = 0; index < sourceNormals.count; index += 1) {
        vertex
          .fromBufferAttribute(sourceNormals, index)
          .applyMatrix3(normalMatrix)
          .normalize()
          .toArray(normals, index * 3);
      }
      object.geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    }
    object.position.set(0, 0, 0);
    object.quaternion.identity();
    object.scale.set(1, 1, 1);
    object.updateMatrix();
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();
  };

  const captureCurtains = (loadedRoom: THREE.Group) => {
    curtainMotion.length = 0;
    loadedRoom.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const curtainId = object.userData?.roomCurtain;
      if (typeof curtainId !== 'string') return;
      bakeToParentSpace(object);
      const attribute = object.geometry.getAttribute('position');
      if (!(attribute instanceof THREE.BufferAttribute)) return;
      const normalAttribute = object.geometry.getAttribute('normal');
      const numberValue = (value: unknown) => {
        const number = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(number) ? number : undefined;
      };
      const authoredClosedCenter = numberValue(object.userData.roomCurtainClosedCenter);
      const authoredOpenCenter = numberValue(object.userData.roomCurtainOpenCenter);
      const gatheredScale = numberValue(object.userData.roomCurtainGatheredScale);
      const bounds = object.geometry.boundingBox;
      if (
        authoredClosedCenter === undefined ||
        authoredOpenCenter === undefined ||
        gatheredScale === undefined ||
        !bounds
      )
        return;
      const closedCenter = (bounds.min.x + bounds.max.x) / 2;
      const openCenter = closedCenter + authoredOpenCenter - authoredClosedCenter;
      const closed = Float32Array.from(attribute.array as ArrayLike<number>);
      const open = new Float32Array(closed.length);
      for (let index = 0; index < attribute.count; index += 1) {
        const offset = index * 3;
        open[offset] = openCenter + (closed[offset] - closedCenter) * gatheredScale;
        open[offset + 1] = closed[offset + 1];
        open[offset + 2] = closed[offset + 2];
      }
      if (normalAttribute instanceof THREE.BufferAttribute) {
        const closedNormals = Float32Array.from(normalAttribute.array as ArrayLike<number>);
        const openNormals = new Float32Array(closedNormals.length);
        for (let index = 0; index < normalAttribute.count; index += 1) {
          const offset = index * 3;
          const x = closedNormals[offset] / gatheredScale;
          const y = closedNormals[offset + 1];
          const z = closedNormals[offset + 2];
          const length = Math.hypot(x, y, z) || 1;
          openNormals[offset] = x / length;
          openNormals[offset + 1] = y / length;
          openNormals[offset + 2] = z / length;
        }
        curtainMotion.push({
          object,
          id: curtainId,
          attribute,
          normalAttribute,
          open,
          closed,
          openNormals,
          closedNormals
        });
        return;
      }
      curtainMotion.push({ object, id: curtainId, attribute, open, closed });
    });
  };

  const updateCurtains = (delta: number) => {
    curtainMotion.forEach(
      ({ object, id, attribute, normalAttribute, open, closed, openNormals, closedNormals }) => {
        const previousAmount = curtainAmounts.get(id);
        const amount = previousAmount ?? 0;
        const target = curtainTargets.get(id) ?? 0;
        const nextAmount = amount + (target - amount) * Math.min(delta * 4, 1);
        if (previousAmount !== undefined && Math.abs(nextAmount - previousAmount) < 0.0005) return;
        curtainAmounts.set(id, nextAmount);
        renderer.shadowMap.needsUpdate = true;
        for (let index = 0; index < attribute.count; index += 1) {
          const offset = index * 3;
          attribute.array[offset] = open[offset] + (closed[offset] - open[offset]) * nextAmount;
          attribute.array[offset + 1] = open[offset + 1];
          attribute.array[offset + 2] = open[offset + 2];
          if (normalAttribute && openNormals && closedNormals) {
            const x =
              openNormals[offset] + (closedNormals[offset] - openNormals[offset]) * nextAmount;
            const y =
              openNormals[offset + 1] +
              (closedNormals[offset + 1] - openNormals[offset + 1]) * nextAmount;
            const z =
              openNormals[offset + 2] +
              (closedNormals[offset + 2] - openNormals[offset + 2]) * nextAmount;
            const length = Math.hypot(x, y, z) || 1;
            normalAttribute.array[offset] = x / length;
            normalAttribute.array[offset + 1] = y / length;
            normalAttribute.array[offset + 2] = z / length;
          }
        }
        attribute.needsUpdate = true;
        if (normalAttribute) normalAttribute.needsUpdate = true;
        object.geometry.computeBoundingSphere();
      }
    );
  };

  const captureCloset = (loadedRoom: THREE.Group) => {
    closetMotion.length = 0;
    loadedRoom.traverse((object) => {
      const leaf = object.userData?.roomClosetLeaf;
      const offset = Number(object.userData?.roomClosetOpenOffset);
      if (typeof leaf !== 'string' || !Number.isFinite(offset)) return;
      closetMotion.push({ object, offset, closedX: object.position.x, leaf });
    });
  };

  const updateCloset = (delta: number) => {
    closetAmount += (closetTarget - closetAmount) * Math.min(delta * 5, 1);
    closetMotion.forEach(({ object, offset, closedX }) => {
      object.position.x = closedX + offset * closetAmount;
    });
  };

  const updateClosetControl = () => {
    closetButton.textContent = closetOpen ? copy.closetClose : copy.closetOpen;
    closetButton.setAttribute('aria-pressed', String(closetOpen));
    root.dataset.roomCloset = closetOpen ? 'open' : 'closed';
  };

  const toggleCloset = () => {
    closetOpen = !closetOpen;
    closetTarget = closetOpen ? 1 : 0;
    updateClosetControl();
    if (entered && !focusActive) {
      hint.textContent = `${copy.closet} · ${closetOpen ? copy.closetClose : copy.closetOpen}`;
      hint.hidden = false;
    }
  };

  const updateCurtainControl = () => {
    const open = curtainManualOpen ?? !nightPhase;
    curtainButton.textContent = open ? copy.curtainsClose : copy.curtainsOpen;
    curtainButton.setAttribute('aria-pressed', String(open));
    curtainAuto.hidden = curtainManualOpen === undefined;
    root.dataset.roomCurtains = open ? 'open' : 'closed';
  };

  const restoreAutomaticCurtains = () => {
    curtainManualOpen = undefined;
    updatePhase();
    if (entered && !focusActive) {
      hint.textContent = `${copy.curtains} · ${copy.curtainsAuto}`;
      hint.hidden = false;
    }
  };

  const toggleCurtains = () => {
    const currentlyOpen = curtainManualOpen ?? !nightPhase;
    curtainManualOpen = !currentlyOpen;
    updatePhase();
    if (entered && !focusActive) {
      hint.textContent = `${copy.curtains} · ${curtainManualOpen ? copy.curtainsOpen : copy.curtainsClose}`;
      hint.hidden = false;
    }
  };

  const updatePhase = () => {
    const hour = Number(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hourCycle: 'h23',
        timeZone: 'Asia/Tokyo'
      }).format(new Date())
    );
    const phase = roomPhaseForTokyoHour(hour, manualPhase);
    const night = phase === 'night';
    nightPhase = night;
    curtainTargets.clear();
    curtainMotion.forEach(({ id }) => {
      const open = curtainManualOpen ?? !night;
      curtainTargets.set(id, open && !(id === 'balcony-left' && !night) ? 0 : 1);
    });
    root.dataset.roomPhase = night ? 'night' : 'day';
    root.dataset.roomLightMode =
      manualPhase || leftLightManual !== undefined || rightLightManual !== undefined
        ? 'manual'
        : 'automatic';
    const leftOn = leftLightManual ?? night;
    const rightOn = rightLightManual ?? night;
    const anyLightOn = leftOn || rightOn;
    lightToggle.textContent = anyLightOn ? copy.lightOff : copy.lightOn;
    lightToggle.setAttribute('aria-pressed', String(anyLightOn));
    lightAuto.hidden =
      manualPhase === undefined && leftLightManual === undefined && rightLightManual === undefined;
    updateCurtainControl();
    ambient.intensity = night ? 1 : 1.3;
    if (night) ambient.groundColor.setRGB(0.45, 0.4, 0.34);
    else ambient.groundColor.setRGB(0.66, 0.56, 0.46);
    daylight.intensity = night ? 0.025 : 4.2;
    warmLight.intensity = leftOn ? 11 : 0;
    frontWarmLight.intensity = rightOn ? 13 : 0;
    const daylightShadows = !night;
    const warmShadows = !coarsePointer && night;
    if (daylight.castShadow !== daylightShadows) {
      daylight.castShadow = daylightShadows;
      renderer.shadowMap.needsUpdate = true;
    }
    if (warmLight.castShadow !== warmShadows) {
      warmLight.castShadow = warmShadows;
      renderer.shadowMap.needsUpdate = true;
    }
    if (lightingPhase !== phase) {
      lightingPhase = phase;
      refreshSkyEnvironment(night);
    } else {
      syncVisibleBackdrop();
    }
    updateIndividualLightControls();
  };

  const updateClock = () => {
    if (timeElement) {
      const timeLocale = locale === 'ja' ? 'ja-JP' : locale === 'th' ? 'th-TH' : 'en-GB';
      timeElement.textContent = new Intl.DateTimeFormat(timeLocale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        timeZone: 'Asia/Tokyo'
      }).format(new Date());
    }
    updatePhase();
  };

  const updateHelp = () => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    help.textContent = coarse
      ? (root.dataset.roomMobileControls ?? copy.mobileControls)
      : (help.dataset.roomDesktopControls ?? copy.controls);
  };

  const targetFromPointer = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    return targetAt(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  const targetAt = (x: number, y: number) => {
    lastHitObject = null;
    if (!room) return undefined;
    pointer.set(x, y);
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects([room, interactionRoot], true);
    for (const intersection of intersections) {
      const target = getRoomTarget(intersection.object);
      lastHitObject = intersection.object;
      if (target) return target;
      if (isOpaqueObject(intersection.object)) return undefined;
    }
    return undefined;
  };

  const floorPointFromPointer = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const point = new THREE.Vector3();
    return raycaster.ray.intersectPlane(floorPlane, point) ? point : null;
  };

  const setHint = (target?: TargetId) => {
    if (!entered || focusActive) {
      setHighlightedTarget();
      hint.hidden = true;
      return;
    }
    setHighlightedTarget(target);
    hint.textContent = target ? `${labelFor(target)} · ${copy.look}` : copy.blocked;
    hint.hidden = false;
  };

  const relatedLinks = (id: ContentId): ContentLink[] => {
    if (id === 'namecard' || id === 'about' || id === 'contact') {
      return [
        { id: 'namecard', label: labelFor('namecard'), path: pathFor('namecard') },
        { id: 'about', label: copy.about, path: pathFor('about') },
        { id: 'contact', label: copy.contact, path: pathFor('contact') }
      ];
    }
    if (id === 'piano' || isMusicChild(id)) {
      const links: ContentLink[] = [
        { id: 'hobbies', label: labelFor('hobbies'), path: pathFor('hobbies') },
        { id: 'piano', label: labelFor('piano'), path: pathFor('piano') },
        ...musicChildIds.map((childId) => ({
          id: childId,
          label: musicChildLabels[childId],
          path: pathFor(childId)
        }))
      ];
      const unique = new Map<string, ContentLink>();
      links.forEach((link) => {
        if (!unique.has(link.path) || link.id === id) unique.set(link.path, link);
      });
      return Array.from(unique.values());
    }
    if (id === 'hobbies' || isHobbyTarget(id)) {
      const links: ContentLink[] = [
        { id: 'hobbies', label: labelFor('hobbies'), path: pathFor('hobbies') },
        ...hobbyTargetIds.map((hobbyId) => ({
          id: hobbyId,
          label: labelFor(hobbyId),
          path: pathFor(hobbyId)
        }))
      ];
      const unique = new Map<string, ContentLink>();
      links.forEach((link) => {
        if (!unique.has(link.path) || link.id === id) unique.set(link.path, link);
      });
      return Array.from(unique.values());
    }
    return [];
  };

  const renderTabs = (id: ContentId) => {
    panelTabs.replaceChildren();
    const links = relatedLinks(id);
    if (links.length < 2) return;
    links.forEach((link) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = link.label;
      button.dataset.roomTab = link.id;
      if (link.id === id) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => loadContent(link.id));
      panelTabs.append(button);
    });
  };

  let cleanupFrameDocument = () => {};
  let frameShellStyle: HTMLStyleElement | undefined;

  const syncFrameNavigation = () => {
    cleanupFrameDocument();
    try {
      const frameUrl = frame.contentWindow?.location.href;
      if (frameUrl) {
        const fullPageUrl = new URL(frameUrl);
        fullPageUrl.searchParams.delete('roomEmbed');
        fullPage.href = fullPageUrl.href;
      }
      const heading = frame.contentDocument?.querySelector('h1')?.textContent?.trim();
      if (heading) panelTitle.textContent = heading;
      const frameDocument = frame.contentDocument;
      const frameWindow = frame.contentWindow;
      if (!frameDocument || !frameWindow) return;
      frameShellStyle = frameDocument.createElement('style');
      frameShellStyle.dataset.roomEmbeddedShell = 'true';
      frameShellStyle.textContent = `
        html, body { background: transparent !important; }
        .skip-link, .shell-nav, .shell-sidebar, .shell-footer, astro-dev-toolbar { display: none !important; }
        .shell-content, .shell-main { min-height: 100% !important; margin: 0 !important; padding: 0 !important; }
        .page-shell { max-width: none !important; padding: 1.15rem 1.35rem 2rem !important; }
      `;
      frameDocument.head.append(frameShellStyle);
      const closeFromFrame = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        closePanel();
      };
      frameDocument.addEventListener('keydown', closeFromFrame, true);
      frameWindow.addEventListener('keydown', closeFromFrame, true);
      const onFrameClick = (event: MouseEvent) => {
        const eventTarget = event.target as {
          closest?: (selector: string) => HTMLAnchorElement | null;
          parentElement?: {
            closest?: (selector: string) => HTMLAnchorElement | null;
          } | null;
        } | null;
        const element = eventTarget?.closest?.('a') ?? eventTarget?.parentElement?.closest?.('a');
        if (!element) return;
        const href = element.href;
        if (!href || new URL(href, window.location.href).origin !== window.location.origin) return;
        event.preventDefault();
        const nextUrl = new URL(href, window.location.href);
        nextUrl.searchParams.set('roomEmbed', '1');
        frameWindow.location.href = nextUrl.href;
      };
      frameDocument.addEventListener('click', onFrameClick, true);
      cleanupFrameDocument = () => {
        frameDocument.removeEventListener('keydown', closeFromFrame, true);
        frameWindow.removeEventListener('keydown', closeFromFrame, true);
        frameDocument.removeEventListener('click', onFrameClick, true);
        frameShellStyle?.remove();
        frameShellStyle = undefined;
        cleanupFrameDocument = () => {};
      };
    } catch {
      fullPage.href = frame.src;
    }
  };

  const loadContent = async (id: ContentId) => {
    const request = ++contentRequest;
    if (id === 'hobbies' || isHobbyTarget(id) || isMusicChild(id)) await hobbyRoutesReady;
    if (disposed || request !== contentRequest) return;
    panelTitle.textContent = labelFor(id);
    panelKicker.textContent = copy.examine;
    fullPage.href = toUrl(pathFor(id));
    renderTabs(id);
    frame.hidden = false;
    panelStatus.hidden = false;
    panelStatus.textContent = copy.loadingDescription;
    frame.src = toFrameUrl(pathFor(id));
    if (!panel.open) panel.showModal();
    if (frameFocusTimer) window.clearTimeout(frameFocusTimer);
    frameFocusTimer = window.setTimeout(() => {
      if (!disposed) frame.focus();
    }, 0);
  };

  const closePanel = () => {
    contentRequest += 1;
    keys.clear();
    cleanupFrameDocument();
    if (frameFocusTimer) {
      window.clearTimeout(frameFocusTimer);
      frameFocusTimer = 0;
    }
    setComposition(false);
    if (panel.open) panel.close();
    frame.src = 'about:blank';
    frame.hidden = false;
    panelTabs.replaceChildren();
    if (!savedPose) {
      focusActive = false;
      delete root.dataset.roomExamine;
      setHint();
      return;
    }
    focusActive = true;
    moveTarget = null;
    setTransition(savedPose, returnDuration, () => {
      focusActive = false;
      savedPose = null;
      delete root.dataset.roomExamine;
      setHint();
    });
  };

  const patPlush = () => {
    let object: THREE.Object3D | null = lastHitObject;
    while (object && object.userData?.roomTarget !== 'nesoberi') object = object.parent;
    if (!object || pats.some((pat) => pat.object === object)) return;
    pats.push({ object, base: object.scale.clone(), t: 0 });
    const bounds = new THREE.Box3().setFromObject(object);
    for (let index = 0; index < 3; index += 1) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: heartTexture, transparent: true, depthWrite: false })
      );
      sprite.scale.setScalar(0.06);
      sprite.position.set(
        (bounds.min.x + bounds.max.x) / 2 + (index - 1) * 0.05,
        bounds.max.y + 0.02,
        (bounds.min.z + bounds.max.z) / 2
      );
      scene.add(sprite);
      hearts.push({
        sprite,
        t: -index * 0.12,
        velocity: new THREE.Vector3((index - 1) * 0.04, 0.22, 0)
      });
    }
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(520, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(340, context.currentTime + 0.18);
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.25);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.26);
    oscillator.onended = () => void context.close();
  };

  const updatePats = (delta: number) => {
    for (let index = pats.length - 1; index >= 0; index -= 1) {
      const pat = pats[index];
      pat.t += delta;
      const phase = Math.min(1, pat.t / 0.55);
      const squash = Math.sin(phase * Math.PI * 2) * (1 - phase) * 0.22;
      pat.object.scale.set(
        pat.base.x * (1 + squash * 0.5),
        pat.base.y * (1 - squash),
        pat.base.z * (1 + squash * 0.5)
      );
      if (phase >= 1) {
        pat.object.scale.copy(pat.base);
        pats.splice(index, 1);
      }
    }
    for (let index = hearts.length - 1; index >= 0; index -= 1) {
      const heart = hearts[index];
      heart.t += delta;
      if (heart.t < 0) continue;
      heart.sprite.position.addScaledVector(heart.velocity, delta);
      (heart.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - heart.t / 1.1);
      if (heart.t >= 1.1) {
        heart.sprite.removeFromParent();
        heart.sprite.material.dispose();
        hearts.splice(index, 1);
      }
    }
  };

  const poseLookingAt = (position: THREE.Vector3, lookAt: THREE.Vector3): Pose => {
    const direction = lookAt.clone().sub(position);
    return {
      position: position.clone(),
      yaw: Math.atan2(-direction.x, -direction.z),
      pitch: Math.atan2(direction.y, Math.hypot(direction.x, direction.z))
    };
  };

  const clearPlay = () => {
    if (!play) return;
    play.session.dispose();
    play = null;
    playHud.hidden = true;
    playControls.replaceChildren();
    delete root.dataset.roomPlay;
    renderer.domElement.style.cursor = 'grab';
  };

  const startPlaySession = (id: PlayId) => {
    if (!room) return;
    keys.clear();
    lookKeys.clear();
    moveTarget = null;
    savedPose = currentPose();
    focusActive = true;
    setHint();
    playControls.replaceChildren();
    playStats.textContent = '';
    playTitle.textContent = labelFor(id);
    let session: PlaySession;
    try {
      session = startPlay(id, {
        scene,
        camera,
        room,
        stats: playStats,
        controls: playControls,
        copy: copy.play
      });
    } catch (error) {
      console.error('Room interaction failed', id, error);
      focusActive = false;
      savedPose = null;
      playControls.replaceChildren();
      playStats.textContent = '';
      hint.textContent = copy.playFailed;
      hint.hidden = false;
      return;
    }
    playIntro.textContent = session.intro;
    play = { id, session, active: false };
    root.dataset.roomPlay = id;
    playHud.hidden = false;
    renderer.domElement.style.cursor = 'none';
    setTransition(poseLookingAt(session.pose.position, session.pose.lookAt), focusDuration, () => {
      if (play?.session === session) play.active = true;
    });
  };

  const exitPlay = () => {
    if (!play) return;
    clearPlay();
    if (!savedPose) {
      focusActive = false;
      setHint();
      return;
    }
    setTransition(savedPose, returnDuration, () => {
      focusActive = false;
      savedPose = null;
      setHint();
    });
  };

  const openPlayPage = () => {
    if (!play) return;
    const id = play.id;
    clearPlay();
    root.dataset.roomExamine = id;
    setComposition(true);
    setTransition(focusPose(id), focusDuration, () => loadContent(id));
  };

  const playPointer = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  const startRest = () => {
    if (!entered || resting || focusActive || panel.open) return;
    releasePointerLock();
    keys.clear();
    lookKeys.clear();
    moveTarget = null;
    savedPose = currentPose();
    resting = true;
    focusActive = true;
    root.dataset.roomResting = 'true';
    lieDownButton.textContent = copy.standUp;
    lieDownButton.setAttribute('aria-pressed', 'true');
    setComposition(true);
    setTransition(focusPose('projects'), focusDuration, () => {
      hint.textContent = copy.resting;
      hint.hidden = false;
    });
  };

  const stopRest = () => {
    if (!resting) return;
    keys.clear();
    lookKeys.clear();
    moveTarget = null;
    focusActive = true;
    lieDownButton.textContent = copy.lieDown;
    lieDownButton.setAttribute('aria-pressed', 'false');
    const pose = savedPose;
    if (!pose) {
      resting = false;
      focusActive = false;
      delete root.dataset.roomResting;
      setComposition(false);
      hint.hidden = true;
      return;
    }
    setTransition(pose, returnDuration, () => {
      resting = false;
      focusActive = false;
      savedPose = null;
      delete root.dataset.roomResting;
      setComposition(false);
      setHint();
    });
  };

  const focusTarget = (id: TargetId) => {
    if (resting) return;
    const definition = getTargetDefinition(id);
    if (!definition) return;
    releasePointerLock();
    if (id === 'light') {
      toggleManualLight();
      setHint(id);
      return;
    }
    if (id === 'closet') {
      toggleCloset();
      return;
    }
    if (id === 'nesoberi') {
      patPlush();
      return;
    }
    if (isPlayable(id)) {
      startPlaySession(id);
      return;
    }
    keys.clear();
    savedPose = currentPose();
    focusActive = true;
    root.dataset.roomExamine = id;
    setHint();
    setComposition(true);
    moveTarget = null;
    setTransition(focusPose(id), focusDuration, () => loadContent(id));
  };

  const enterRoom = () => {
    if (!room) return;
    if (authoredEntryPosition) camera.position.copy(authoredEntryPosition);
    else camera.position.set(...initialPosition);
    setLookAt(authoredEntryLookAt ?? new THREE.Vector3(...initialLookAt));
    camera.updateMatrixWorld();
    moveTarget = null;
    pointerState = null;
    entered = true;
    entry.hidden = true;
    exitButton.hidden = false;
    reticle.hidden = false;
    lightControl.hidden = false;
    lieDownButton.hidden = false;
    closetButton.hidden = false;
    updateClosetControl();
    updateCurtainControl();
    help.textContent = window.matchMedia('(pointer: coarse)').matches
      ? (root.dataset.roomMobileControls ?? copy.mobileControls)
      : (help.dataset.roomDesktopControls ?? copy.controls);
    setHint();
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.focus({ preventScroll: true });
    requestPointerLock();
  };

  const exitRoom = () => {
    clearPlay();
    releasePointerLock();
    keys.clear();
    lookKeys.clear();
    closePanel();
    transition = null;
    savedPose = null;
    resting = false;
    focusActive = false;
    setComposition(false);
    entered = false;
    entry.hidden = false;
    exitButton.hidden = true;
    reticle.hidden = true;
    lightControl.hidden = true;
    lieDownButton.hidden = true;
    closetButton.hidden = true;
    delete root.dataset.roomExamine;
    delete root.dataset.roomResting;
    hint.hidden = true;
  };

  const handlePointerTap = (event: PointerEvent) => {
    const target = targetFromPointer(event);
    if (target) {
      focusTarget(target);
      return;
    }
    if (event.pointerType === 'touch' || window.matchMedia('(pointer: coarse)').matches) {
      moveTarget = floorPointFromPointer(event);
      if (moveTarget) {
        moveTarget.x = clamp(
          moveTarget.x,
          worldBounds.minX + playerRadius,
          worldBounds.maxX - playerRadius
        );
        moveTarget.z = clamp(
          moveTarget.z,
          worldBounds.minZ + playerRadius,
          worldBounds.maxZ - playerRadius
        );
      }
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (play?.active && event.button === 0) {
      try {
        renderer.domElement.setPointerCapture(event.pointerId);
      } catch {}
      play.session.pointerDown(playPointer(event));
      return;
    }
    if (!entered || focusActive || event.button > 0) return;
    if (pointerLocked) {
      const target = targetAt(0, 0);
      if (target) focusTarget(target);
      return;
    }
    setHint();
    if (!targetFromPointer(event)) requestPointerLock();
    pointerState = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
    if (!document.pointerLockElement) {
      try {
        renderer.domElement.setPointerCapture(event.pointerId);
      } catch {}
    }
    renderer.domElement.style.cursor = 'grabbing';
  };

  const onPointerMove = (event: PointerEvent) => {
    if (play?.active) {
      play.session.pointerMove(playPointer(event));
      return;
    }
    if (!entered || focusActive) return;
    if (pointerLocked) {
      if (!event.movementX && !event.movementY) return;
      yaw -= event.movementX * 0.0025;
      pitch = clamp(pitch - event.movementY * 0.002, -1.2, 1.2);
      applyOrientation();
      return;
    }
    if (!pointerState || pointerState.id !== event.pointerId) {
      const target = targetFromPointer(event);
      setHint(target);
      renderer.domElement.style.cursor = target ? 'pointer' : 'grab';
      return;
    }
    const deltaX = event.clientX - pointerState.x;
    const deltaY = event.clientY - pointerState.y;
    if (Math.hypot(deltaX, deltaY) > 4) pointerState.dragging = true;
    if (!pointerState.dragging) return;
    pointerState.x = event.clientX;
    pointerState.y = event.clientY;
    yaw -= deltaX * 0.004;
    pitch = clamp(pitch - deltaY * 0.003, -1.2, 1.2);
    applyOrientation();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (play?.active) {
      if (renderer.domElement.hasPointerCapture(event.pointerId))
        renderer.domElement.releasePointerCapture(event.pointerId);
      play.session.pointerUp(playPointer(event));
      return;
    }
    if (pointerLocked) return;
    if (!pointerState || pointerState.id !== event.pointerId) return;
    const wasDragging = pointerState.dragging;
    pointerState = null;
    if (renderer.domElement.hasPointerCapture(event.pointerId))
      renderer.domElement.releasePointerCapture(event.pointerId);
    renderer.domElement.style.cursor = 'grab';
    if (!wasDragging) handlePointerTap(event);
    else setHint(targetFromPointer(event));
  };

  const onPointerCancel = () => {
    if (pointerLocked) return;
    pointerState = null;
    renderer.domElement.style.cursor = play ? 'none' : 'grab';
    setHint();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (play && event.key === 'Escape') {
      event.preventDefault();
      exitPlay();
      return;
    }
    if (play?.active && play.session.keyDown(event)) {
      event.preventDefault();
      return;
    }
    if (event.key === 'Escape' && resting) {
      event.preventDefault();
      stopRest();
      return;
    }
    if (event.key === 'Escape' && (panel.open || focusActive || transition)) {
      event.preventDefault();
      closePanel();
      return;
    }
    if (!entered || focusActive || panel.open || event.metaKey || event.ctrlKey || event.altKey)
      return;
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      lookKeys.add(key);
      return;
    }
    if (!['w', 'a', 's', 'd'].includes(key)) return;
    event.preventDefault();
    keys.add(key);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (play?.active && play.session.keyUp(event)) {
      event.preventDefault();
      return;
    }
    keys.delete(event.key.toLowerCase());
    lookKeys.delete(event.key.toLowerCase());
  };

  const onResize = () => {
    const width = stage.clientWidth;
    const height = Math.max(stage.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    composer?.setSize(width, height);
    updateCameraComposition();
    updateHelp();
  };

  const onFrameLoad = () => {
    if (disposed || frame.hidden) return;
    panelStatus.hidden = true;
    syncFrameNavigation();
  };

  const onEnterClick = () => enterRoom();
  const onExitClick = () => exitRoom();
  const closeButton = root.querySelector<HTMLButtonElement>('[data-room-close]');
  const onCloseClick = () => closePanel();
  const onLightToggle = () => toggleManualLight();
  const onLightLeft = () => toggleIndividualLight('left');
  const onLightRight = () => toggleIndividualLight('right');
  const onLightAuto = () => restoreAutomaticLight();
  const onCurtainToggle = () => toggleCurtains();
  const onCurtainAuto = () => restoreAutomaticCurtains();
  const onLieDownClick = () => (resting ? stopRest() : startRest());
  const onClosetClick = () => toggleCloset();
  const onPanelCancel = (event: Event) => {
    event.preventDefault();
    closePanel();
  };
  const onPanelPointerDown = (event: PointerEvent) => {
    if (event.target === panel) closePanel();
  };
  const onWindowBlur = () => {
    keys.clear();
    lookKeys.clear();
    releasePointerLock();
  };
  const pointerMedia = window.matchMedia('(pointer: coarse)');
  const destinationHandlers = new Map<HTMLAnchorElement, (event: MouseEvent) => void>();

  enterButton.addEventListener('click', onEnterClick);
  exitButton.addEventListener('click', onExitClick);
  lightToggle.addEventListener('click', onLightToggle);
  lightLeft.addEventListener('click', onLightLeft);
  lightRight.addEventListener('click', onLightRight);
  lightAuto.addEventListener('click', onLightAuto);
  curtainButton.addEventListener('click', onCurtainToggle);
  curtainAuto.addEventListener('click', onCurtainAuto);
  lieDownButton.addEventListener('click', onLieDownClick);
  playExit.addEventListener('click', exitPlay);
  playPage.addEventListener('click', openPlayPage);
  closetButton.addEventListener('click', onClosetClick);
  root.querySelectorAll<HTMLAnchorElement>('[data-room-destination]').forEach((link) => {
    const onDestinationClick = (event: MouseEvent) => {
      const id = link.dataset.roomDestination as TargetId | undefined;
      if (!entered || !id || !getTargetDefinition(id)) return;
      event.preventDefault();
      if (!focusActive) focusTarget(id);
    };
    destinationHandlers.set(link, onDestinationClick);
    link.addEventListener('click', onDestinationClick);
  });
  closeButton?.addEventListener('click', onCloseClick);
  panel.addEventListener('cancel', onPanelCancel);
  panel.addEventListener('pointerdown', onPanelPointerDown);
  frame.addEventListener('load', onFrameLoad);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('pointerlockerror', onPointerLockError);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('resize', onResize);
  pointerMedia.addEventListener('change', updateHelp);
  help.textContent = help.dataset.roomDesktopControls ?? copy.controls;
  updateClock();
  updateHelp();
  onResize();
  setLookAt(new THREE.Vector3(...initialLookAt));

  const parseMetadataValue = (value: unknown) => {
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return value;
    }
  };

  const applyModelMetadata = (loadedRoom: THREE.Group) => {
    const targetBounds = new Map<TargetId, THREE.Box3>();
    const modelCollisions = [] as { minX: number; maxX: number; minZ: number; maxZ: number }[];
    let navigation: Record<string, unknown> | undefined;

    loadedRoom.traverse((object) => {
      const metadata = object.userData as Record<string, unknown>;
      const candidateNavigation = parseMetadataValue(metadata.roomNavigation);
      if (candidateNavigation && typeof candidateNavigation === 'object') {
        navigation = candidateNavigation as Record<string, unknown>;
      }
      const target = getRoomTarget(object);
      if (target) {
        const objectBounds = new THREE.Box3().setFromObject(object);
        if (!objectBounds.isEmpty()) {
          const current = targetBounds.get(target);
          targetBounds.set(target, current ? current.union(objectBounds) : objectBounds);
        }
      }
      const collisionValue = parseMetadataValue(
        metadata.roomCollision ?? metadata.roomCollisionRect
      );
      const parsedCollision = parseCollision(collisionValue);
      if (parsedCollision) {
        modelCollisions.push(parsedCollision);
      } else if (collisionValue === true) {
        const objectBounds = new THREE.Box3().setFromObject(object);
        if (!objectBounds.isEmpty()) {
          modelCollisions.push({
            minX: objectBounds.min.x,
            maxX: objectBounds.max.x,
            minZ: objectBounds.min.z,
            maxZ: objectBounds.max.z
          });
        }
      }
      const objectBoundsMetadata = parseBounds(parseMetadataValue(metadata.roomBounds));
      if (objectBoundsMetadata) worldBounds = objectBoundsMetadata;
    });

    if (navigation) {
      const navigationBounds = parseBounds(parseMetadataValue(navigation.bounds));
      if (navigationBounds) worldBounds = navigationBounds;
      const navigationTargets = parseMetadataValue(navigation.targets);
      if (navigationTargets && typeof navigationTargets === 'object') {
        Object.entries(navigationTargets as Record<string, unknown>).forEach(([id, value]) => {
          if (!getTargetDefinition(id as TargetId)) return;
          const target = parseMetadataValue(value);
          const record =
            target && typeof target === 'object' ? (target as Record<string, unknown>) : {};
          const targetPositionValue =
            parseVector(target) ||
            parseVector(
              parseMetadataValue(record.position ?? record.target ?? record.point ?? record.origin)
            );
          if (targetPositionValue) {
            resolvedTargetPositions.set(id as TargetId, targetPositionValue);
            authoredTargetPositions.add(id as TargetId);
          }
          const focusPosition = parseVector(
            parseMetadataValue(
              record.closeup ?? record.camera ?? record.focus ?? record.closeupPosition
            )
          );
          if (focusPosition) resolvedFocusPositions.set(id as TargetId, focusPosition);
        });
      }
      const navigationColliders = parseMetadataValue(navigation.colliders);
      const directCollider = parseCollision(navigationColliders);
      if (directCollider) modelCollisions.push(directCollider);
      else if (Array.isArray(navigationColliders)) {
        navigationColliders.forEach((item) => {
          const collision = parseCollision(parseMetadataValue(item));
          if (collision) modelCollisions.push(collision);
        });
      } else if (navigationColliders && typeof navigationColliders === 'object') {
        Object.values(navigationColliders as Record<string, unknown>).forEach((item) => {
          const collision = parseCollision(parseMetadataValue(item));
          if (collision) modelCollisions.push(collision);
        });
      }
      const entryPosition = parseVector(parseMetadataValue(navigation.entry));
      const entryLookAt = parseVector(parseMetadataValue(navigation.lookAt));
      authoredEntryPosition = entryPosition ?? null;
      authoredEntryLookAt = entryLookAt ?? null;
      if (!entered && entryPosition) camera.position.copy(entryPosition);
      if (!entered && entryLookAt) setLookAt(entryLookAt);
    }

    if (modelCollisions.length > 0) collisionRects = modelCollisions;
    targetBounds.forEach((objectBounds, target) => {
      const center = objectBounds.getCenter(new THREE.Vector3());
      if (!authoredTargetPositions.has(target)) resolvedTargetPositions.set(target, center);
    });
  };

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(
    '/models/room.glb',
    (gltf) => {
      if (disposed) {
        gltf.scene.traverse(disposeObject);
        return;
      }
      room = gltf.scene;
      room.traverse((object) => {
        if (object.userData?.roomBackdrop) backdrops.push(object);
        if (!(object instanceof THREE.Mesh)) return;
        const target = getRoomTarget(object);
        if (!target) return;
        const list = targetMeshes.get(target) ?? [];
        list.push(object);
        targetMeshes.set(target, list);
      });
      targetLabels.forEach((label, id) => {
        if (targetMeshes.has(id)) return;
        label.remove();
        targetLabels.delete(id);
      });
      syncVisibleBackdrop();
      room.traverse((object) => {
        if (object instanceof THREE.PointLight && penlightNamePattern.test(object.name)) {
          object.visible = true;
          object.castShadow = false;
          object.decay = 2;
          object.intensity = 0.35;
          object.distance = 1.5;
        }
        if (!(object instanceof THREE.Mesh)) return;
        object.frustumCulled = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (
          nonAtlasPosterNodeNames.has(object.name) ||
          materials.some((material) => material.name === 'Desk group poster print')
        ) {
          object.visible = false;
        }
        materials.forEach(configureAcrylicCase);
        materials.forEach(configureArchitecturalGlass);
        materials.forEach((material) => {
          if (!(material instanceof THREE.MeshStandardMaterial)) return;
          [material.map, material.normalMap, material.roughnessMap, material.emissiveMap].forEach(
            (texture) => {
              if (texture) texture.anisotropy = maxAnisotropy;
            }
          );
        });
        object.castShadow = !object.userData?.roomBackdrop && materials.every(isOpaqueMaterial);
        object.receiveShadow = materials.some(isOpaqueMaterial);
      });
      applyModelMetadata(room);
      captureCurtains(room);
      captureCloset(room);
      updatePhase();
      scene.add(room);
      preview.hidden = true;
      renderer.shadowMap.needsUpdate = true;
      enterButton.disabled = false;
      enterButton.textContent = copy.enter;
      status.textContent = '';
    },
    undefined,
    () => {
      if (disposed) return;
      status.textContent = root.dataset.roomError ?? copy.failed;
      enterButton.disabled = true;
    }
  );

  const frameLoop = (now: number) => {
    if (disposed) return;
    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    if (transition) {
      const progress = clamp((now - transition.startedAt) / transition.duration, 0, 1);
      const eased = easeInOut(progress);
      camera.position.copy(transition.from.position).lerp(transition.to.position, eased);
      yaw = lerpAngle(transition.from.yaw, transition.to.yaw, eased);
      pitch = transition.from.pitch + (transition.to.pitch - transition.from.pitch) * eased;
      applyOrientation();
      if (progress >= 1) {
        const complete = transition.complete;
        transition = null;
        complete?.();
      }
    } else if (entered && !focusActive) {
      let lookHorizontal = 0;
      let lookVertical = 0;
      if (lookKeys.has('arrowleft')) lookHorizontal -= 1;
      if (lookKeys.has('arrowright')) lookHorizontal += 1;
      if (lookKeys.has('arrowup')) lookVertical += 1;
      if (lookKeys.has('arrowdown')) lookVertical -= 1;
      if (lookHorizontal || lookVertical) {
        yaw += lookHorizontal * 1.6 * delta;
        pitch = clamp(pitch + lookVertical * 1.2 * delta, -1.2, 1.2);
        applyOrientation();
      }
      let horizontal = 0;
      let vertical = 0;
      if (keys.has('w') || keys.has('arrowup')) vertical += 1;
      if (keys.has('s') || keys.has('arrowdown')) vertical -= 1;
      if (keys.has('d') || keys.has('arrowright')) horizontal += 1;
      if (keys.has('a') || keys.has('arrowleft')) horizontal -= 1;
      if (horizontal || vertical) {
        const length = Math.hypot(horizontal, vertical);
        const forwardX = -Math.sin(yaw);
        const forwardZ = -Math.cos(yaw);
        const rightX = Math.cos(yaw);
        const rightZ = -Math.sin(yaw);
        moveAlong(
          (forwardX * vertical + rightX * horizontal) * ((2.05 * delta) / length),
          (forwardZ * vertical + rightZ * horizontal) * ((2.05 * delta) / length)
        );
      } else if (moveTarget) {
        moveToward(moveTarget, 2.4 * delta);
      }
    }
    if (play?.active) play.session.update(delta);
    updatePats(delta);
    updateCurtains(delta);
    updateCloset(delta);
    camera.updateMatrixWorld();
    updateTargetLabels(now);
    if (pointerLocked && entered && !focusActive && now - lastCenterCheck > 90) {
      lastCenterCheck = now;
      setHint(targetAt(0, 0));
    }
    if (composer) composer.render();
    else renderer.render(scene, camera);
    frameRequest = window.requestAnimationFrame(frameLoop);
  };

  frameRequest = window.requestAnimationFrame(frameLoop);
  clockTimer = window.setInterval(updateClock, 30_000);

  return () => {
    if (disposed) return;
    disposed = true;
    contentRequest += 1;
    clearPlay();
    hobbyRoutesController.abort();
    keys.clear();
    pointerState = null;
    cleanupFrameDocument();
    if (frameFocusTimer) window.clearTimeout(frameFocusTimer);
    if (clockTimer) window.clearInterval(clockTimer);
    if (frameRequest) window.cancelAnimationFrame(frameRequest);
    enterButton.removeEventListener('click', onEnterClick);
    exitButton.removeEventListener('click', onExitClick);
    lightToggle.removeEventListener('click', onLightToggle);
    lightLeft.removeEventListener('click', onLightLeft);
    lightRight.removeEventListener('click', onLightRight);
    lightAuto.removeEventListener('click', onLightAuto);
    curtainButton.removeEventListener('click', onCurtainToggle);
    curtainAuto.removeEventListener('click', onCurtainAuto);
    lieDownButton.removeEventListener('click', onLieDownClick);
    playExit.removeEventListener('click', exitPlay);
    playPage.removeEventListener('click', openPlayPage);
    closetButton.removeEventListener('click', onClosetClick);
    destinationHandlers.forEach((handler, link) => link.removeEventListener('click', handler));
    closeButton?.removeEventListener('click', onCloseClick);
    panel.removeEventListener('cancel', onPanelCancel);
    panel.removeEventListener('pointerdown', onPanelPointerDown);
    frame.removeEventListener('load', onFrameLoad);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    document.removeEventListener('pointerlockerror', onPointerLockError);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onWindowBlur);
    window.removeEventListener('resize', onResize);
    pointerMedia.removeEventListener('change', updateHelp);
    releasePointerLock();
    if (panel.open) panel.close();
    room?.traverse(disposeObject);
    interactionRoot.traverse(disposeObject);
    scene.background = null;
    environmentTarget?.dispose();
    pmremGenerator.dispose();
    disposeObject(sky);
    targetLabelsRoot.replaceChildren();
    composer?.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement === stage) stage.replaceChildren();
  };
};
