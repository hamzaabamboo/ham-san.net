export type MinigameId =
  | 'piano'
  | 'typing'
  | 'rubik'
  | 'yoyo'
  | 'penspinning'
  | 'kendama'
  | 'cardistry'
  | 'penlight';

export type MinigameCopy = {
  score: string;
  best: string;
  combo: string;
  start: string;
  reset: string;
  piano: { intro: string; playAlong: string; progress: string; done: string };
  typing: { intro: string; next: string; wpm: string; accuracy: string; done: string };
  rubik: { intro: string; scramble: string; moves: string; time: string; solved: string };
  yoyo: { intro: string; throw: string; bind: string; trick: string; dead: string; spin: string };
  penspinning: { intro: string; pass: string; drop: string; speed: string };
  kendama: { intro: string; pull: string; big: string; small: string; spike: string; miss: string };
  cardistry: { intro: string; deal: string; pick: string; right: string; wrong: string; level: string };
  penlight: { intro: string; perfect: string; great: string; miss: string };
};

const minigameIds: readonly MinigameId[] = [
  'piano',
  'typing',
  'rubik',
  'yoyo',
  'penspinning',
  'kendama',
  'cardistry',
  'penlight'
];

export const isMinigame = (id: string): id is MinigameId =>
  minigameIds.includes(id as MinigameId);

type Cleanup = () => void;

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const button = (label: string, onClick: () => void, className = 'room-game-button') => {
  const node = el('button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
};

const token = (host: HTMLElement, name: string) =>
  getComputedStyle(host).getPropertyValue(name).trim();

const shell = (host: HTMLElement, intro: string) => {
  const intro_ = el('p', 'room-game-intro', intro);
  const stats = el('p', 'room-game-stats');
  stats.setAttribute('aria-live', 'polite');
  const stage = el('div', 'room-game-stage');
  const controls = el('div', 'room-game-controls');
  host.append(intro_, stats, stage, controls);
  return { stats, stage, controls };
};

const makeCanvas = (stage: HTMLElement, height = 320) => {
  const canvas = el('canvas', 'room-game-canvas');
  stage.append(canvas);
  const context = canvas.getContext('2d');
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const width = stage.clientWidth || 560;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
  return {
    canvas,
    context,
    width: () => canvas.width / (window.devicePixelRatio || 1),
    height,
    dispose: () => window.removeEventListener('resize', resize)
  };
};

const loop = (step: (now: number, dt: number) => void) => {
  let frame = 0;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(now, dt);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
};

const objectColors = {
  white: 'hsl(0 0% 96%)',
  yellow: 'hsl(50 95% 55%)',
  green: 'hsl(142 60% 40%)',
  blue: 'hsl(214 80% 48%)',
  red: 'hsl(356 75% 50%)',
  orange: 'hsl(26 95% 55%)',
  pink: 'hsl(330 85% 65%)',
  purple: 'hsl(272 65% 62%)',
  wood: 'hsl(34 45% 62%)',
  woodDark: 'hsl(30 40% 42%)',
  cyan: 'hsl(186 60% 62%)'
};

let audio: AudioContext | undefined;
const tone = (frequency: number, duration = 0.6, type: OscillatorType = 'triangle', volume = 0.18) => {
  audio ??= new AudioContext();
  const now = audio.currentTime;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gain.connect(audio.destination);
  [1, 2].forEach((multiple, index) => {
    const oscillator = audio!.createOscillator();
    oscillator.type = index ? 'sine' : type;
    oscillator.frequency.value = frequency * multiple;
    const partial = audio!.createGain();
    partial.gain.value = index ? 0.25 : 1;
    oscillator.connect(partial).connect(gain);
    oscillator.start(now);
    oscillator.stop(now + duration);
  });
};

const piano = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.piano.intro);
  const keyboardKeys = 'awsedftgyhujkolp;';
  const whiteSteps = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
  const song = [0, 0, 7, 7, 9, 9, 7, 5, 5, 4, 4, 2, 2, 0];
  let songIndex = -1;
  let misses = 0;
  const keysEl = el('div', 'room-game-piano');
  stage.append(keysEl);
  const buttons = new Map<number, HTMLButtonElement>();
  for (let step = 0; step < 17; step += 1) {
    const black = !whiteSteps.includes(step);
    const key = el('button', black ? 'room-game-key room-game-key-black' : 'room-game-key');
    key.type = 'button';
    key.dataset.label = keyboardKeys[step]?.toUpperCase() ?? '';
    const whiteIndex = whiteSteps.filter((value) => value < step).length;
    key.style.setProperty('--key-index', String(black ? whiteIndex - 0.3 : whiteIndex));
    key.addEventListener('pointerdown', () => play(step));
    buttons.set(step, key);
    keysEl.append(key);
  }
  const render = () => {
    buttons.forEach((key, step) =>
      key.toggleAttribute('data-next', songIndex >= 0 && song[songIndex] === step)
    );
    stats.textContent =
      songIndex < 0
        ? copy.piano.playAlong
        : songIndex >= song.length
          ? `${copy.piano.done} · ${copy.piano.progress} ${song.length}/${song.length} · ✕ ${misses}`
          : `${copy.piano.progress} ${songIndex}/${song.length} · ✕ ${misses}`;
  };
  const play = (step: number) => {
    tone(261.63 * 2 ** (step / 12));
    const key = buttons.get(step);
    key?.setAttribute('data-active', '');
    window.setTimeout(() => key?.removeAttribute('data-active'), 160);
    if (songIndex >= 0 && songIndex < song.length) {
      if (song[songIndex] === step) songIndex += 1;
      else misses += 1;
    }
    render();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const step = keyboardKeys.indexOf(event.key.toLowerCase());
    if (step < 0) return;
    event.preventDefault();
    play(step);
  };
  controls.append(
    button(copy.piano.playAlong, () => {
      songIndex = 0;
      misses = 0;
      render();
    })
  );
  host.addEventListener('keydown', onKey);
  render();
  return () => host.removeEventListener('keydown', onKey);
};

const typing = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.typing.intro);
  const phrases = [
    'the quick brown fox jumps over the lazy dog',
    'hello from my little room in tokyo',
    'practice makes the fingers remember',
    'steno chords type at the speed of speech',
    'darts piano and a rubik cube on the shelf'
  ];
  let phrase = phrases[0];
  let startedAt = 0;
  let typed = '';
  let errors = 0;
  let best = 0;
  const text = el('p', 'room-game-typing-text');
  const input = el('input', 'room-game-typing-input');
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', copy.typing.intro);
  stage.append(text, input);
  const render = () => {
    text.replaceChildren(
      ...phrase.split('').map((character, index) => {
        const span = el('span', undefined, character);
        if (index < typed.length)
          span.dataset.state = typed[index] === character ? 'ok' : 'bad';
        else if (index === typed.length) span.dataset.state = 'cursor';
        return span;
      })
    );
    const minutes = startedAt ? Math.max(performance.now() - startedAt, 2000) / 60000 : 0;
    const wpm = minutes > 0 ? Math.round(typed.length / 5 / minutes) : 0;
    const accuracy = typed.length ? Math.max(0, Math.round((1 - errors / typed.length) * 100)) : 100;
    const done = typed === phrase;
    if (done) best = Math.max(best, wpm);
    stats.textContent = `${done ? `${copy.typing.done} · ` : ''}${copy.typing.wpm} ${wpm} · ${copy.typing.accuracy} ${accuracy}% · ${copy.best} ${best}`;
  };
  const next = () => {
    phrase = phrases[(phrases.indexOf(phrase) + 1) % phrases.length];
    typed = '';
    errors = 0;
    startedAt = 0;
    input.value = '';
    input.focus();
    render();
  };
  input.addEventListener('input', () => {
    if (!startedAt) startedAt = performance.now();
    const value = input.value.slice(0, phrase.length);
    if (value.length > typed.length && value[value.length - 1] !== phrase[value.length - 1])
      errors += 1;
    typed = value;
    render();
  });
  controls.append(button(copy.typing.next, next));
  render();
  window.setTimeout(() => input.focus(), 50);
  return () => {};
};

type Vec = [number, number, number];
type Sticker = { pos: Vec; normal: Vec; face: keyof typeof faceColors };
const faceColors = {
  U: objectColors.white,
  D: objectColors.yellow,
  F: objectColors.green,
  B: objectColors.blue,
  R: objectColors.red,
  L: objectColors.orange
};
const faceNormals: Record<keyof typeof faceColors, Vec> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0]
};
const moveDefinitions: Record<string, { axis: 0 | 1 | 2; layer: number; sign: number }> = {
  U: { axis: 1, layer: 1, sign: -1 },
  D: { axis: 1, layer: -1, sign: 1 },
  R: { axis: 0, layer: 1, sign: -1 },
  L: { axis: 0, layer: -1, sign: 1 },
  F: { axis: 2, layer: 1, sign: -1 },
  B: { axis: 2, layer: -1, sign: 1 }
};
const rotate = (v: Vec, axis: 0 | 1 | 2, s: number): Vec => {
  const [x, y, z] = v;
  if (axis === 0) return [x, -s * z, s * y];
  if (axis === 1) return [s * z, y, -s * x];
  return [-s * y, s * x, z];
};
const netCell = (sticker: Sticker): [number, number] => {
  const [x, y, z] = sticker.pos;
  const [nx, ny, nz] = sticker.normal;
  if (ny === 1) return [3 + x + 1, z + 1];
  if (ny === -1) return [3 + x + 1, 6 + 1 - z];
  if (nz === 1) return [3 + x + 1, 3 + 1 - y];
  if (nz === -1) return [9 + 1 - x, 3 + 1 - y];
  if (nx === 1) return [6 + 1 - z, 3 + 1 - y];
  return [z + 1, 3 + 1 - y];
};

const rubik = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.rubik.intro);
  let stickers: Sticker[] = [];
  let moves = 0;
  let startedAt = 0;
  let solvedTime = 0;
  let scrambled = false;
  const net = el('div', 'room-game-rubik');
  stage.append(net);
  const reset = () => {
    stickers = [];
    (Object.keys(faceNormals) as (keyof typeof faceColors)[]).forEach((face) => {
      const normal = faceNormals[face];
      const axis = normal.findIndex((value) => value !== 0);
      for (let a = -1; a <= 1; a += 1)
        for (let b = -1; b <= 1; b += 1) {
          const others = [0, 1, 2].filter((index) => index !== axis);
          const pos: Vec = [0, 0, 0];
          pos[axis] = normal[axis];
          pos[others[0]] = a;
          pos[others[1]] = b;
          stickers.push({ pos, normal: [...normal] as Vec, face });
        }
    });
    moves = 0;
    startedAt = 0;
    solvedTime = 0;
    scrambled = false;
  };
  const solved = () =>
    (Object.keys(faceNormals) as (keyof typeof faceColors)[]).every((face) => {
      const normal = faceNormals[face];
      const onFace = stickers.filter((sticker) => sticker.normal.every((v, i) => v === normal[i]));
      return onFace.every((sticker) => sticker.face === onFace[0].face);
    });
  const turn = (name: string, count = true) => {
    const base = moveDefinitions[name[0]];
    const sign = name.endsWith("'") ? -base.sign : base.sign;
    stickers.forEach((sticker) => {
      if (sticker.pos[base.axis] !== base.layer) return;
      sticker.pos = rotate(sticker.pos, base.axis, sign);
      sticker.normal = rotate(sticker.normal, base.axis, sign);
    });
    if (!count) return;
    if (!startedAt && scrambled) startedAt = performance.now();
    moves += 1;
    if (scrambled && solved()) {
      solvedTime = (performance.now() - startedAt) / 1000;
      scrambled = false;
    }
    render();
  };
  const render = () => {
    net.replaceChildren(
      ...stickers.map((sticker) => {
        const [column, row] = netCell(sticker);
        const cell = el('span', 'room-game-sticker');
        cell.style.gridColumn = String(column + 1);
        cell.style.gridRow = String(row + 1);
        cell.style.background = faceColors[sticker.face];
        return cell;
      })
    );
    const time = startedAt ? ((solvedTime || (performance.now() - startedAt) / 1000)).toFixed(1) : '0.0';
    stats.textContent = `${solvedTime ? `${copy.rubik.solved} · ` : ''}${copy.rubik.moves} ${moves} · ${copy.rubik.time} ${time}s`;
  };
  const moveRow = el('div', 'room-game-rubik-moves');
  Object.keys(moveDefinitions).forEach((face) =>
    [face, `${face}'`].forEach((name) => moveRow.append(button(name, () => turn(name), 'room-game-chip')))
  );
  controls.append(
    moveRow,
    button(copy.rubik.scramble, () => {
      reset();
      const names = Object.keys(moveDefinitions);
      for (let index = 0; index < 18; index += 1)
        turn(`${names[Math.floor(Math.random() * names.length)]}${Math.random() < 0.5 ? "'" : ''}`, false);
      scrambled = !solved();
      render();
    }),
    button(copy.reset, () => {
      reset();
      render();
    })
  );
  const onKey = (event: KeyboardEvent) => {
    const face = event.key.toUpperCase();
    if (!moveDefinitions[face]) return;
    event.preventDefault();
    turn(event.shiftKey ? `${face}'` : face);
  };
  host.addEventListener('keydown', onKey);
  const stopTimer = window.setInterval(() => startedAt && !solvedTime && render(), 200);
  reset();
  render();
  return () => {
    host.removeEventListener('keydown', onKey);
    window.clearInterval(stopTimer);
  };
};

const yoyo = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.yoyo.intro);
  const view = makeCanvas(stage);
  let state: 'hand' | 'down' | 'sleep' | 'up' | 'trick' | 'dead' = 'hand';
  let depth = 0;
  let spin = 0;
  let angle = 0;
  let sleepFor = 0;
  let trickTime = 0;
  let score = 0;
  let combo = 0;
  let best = 0;
  let message = '';
  const action = () => {
    if (state === 'hand' || state === 'dead') {
      state = 'down';
      spin = 100;
      sleepFor = 0;
      message = '';
    } else if (state === 'sleep') {
      state = 'up';
      combo += 1;
      const gained = Math.round(sleepFor * 10 * combo);
      score += gained;
      best = Math.max(best, score);
      message = `+${gained}`;
    }
  };
  const trick = () => {
    if (state !== 'sleep' || spin < 30) return;
    state = 'trick';
    trickTime = 0;
    spin -= 25;
  };
  const stop = loop((_, dt) => {
    const context = view.context;
    if (!context) return;
    const width = view.width();
    const handX = width / 2;
    const handY = 30;
    const bottom = view.height - 50;
    if (state === 'down') {
      depth = Math.min(1, depth + dt * 2.6);
      if (depth >= 1) state = 'sleep';
    } else if (state === 'up') {
      depth = Math.max(0, depth - dt * 3);
      if (depth <= 0) state = 'hand';
    } else if (state === 'sleep' || state === 'trick') {
      spin -= dt * 14;
      sleepFor += dt;
      if (state === 'trick') {
        trickTime += dt;
        if (trickTime > 1) {
          state = 'sleep';
          score += 50 * Math.max(1, combo);
          best = Math.max(best, score);
          message = `${copy.yoyo.trick} +${50 * Math.max(1, combo)}`;
        }
      }
      if (spin <= 0) {
        spin = 0;
        state = 'dead';
        combo = 0;
        message = copy.yoyo.dead;
      }
    }
    angle += dt * (spin / 6);
    const reach = handY + depth * (bottom - handY);
    let x = handX;
    let y = reach;
    if (state === 'trick') {
      const t = trickTime * Math.PI * 2;
      x = handX + Math.sin(t) * (bottom - handY) * 0.5;
      y = handY + (bottom - handY) * 0.5 + Math.cos(t) * (bottom - handY) * 0.5;
    }
    if (state === 'dead') y = bottom + 10;
    context.clearRect(0, 0, width, view.height);
    context.strokeStyle = token(host, '--atelier-fg-muted');
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(handX, handY);
    context.lineTo(x, y);
    context.stroke();
    context.fillStyle = token(host, '--atelier-fg');
    context.beginPath();
    context.arc(handX, handY - 8, 10, 0, Math.PI * 2);
    context.fill();
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.fillStyle = objectColors.cyan;
    context.beginPath();
    context.arc(0, 0, 26, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = token(host, '--atelier-bg');
    context.lineWidth = 3;
    for (let spoke = 0; spoke < 3; spoke += 1) {
      context.rotate((Math.PI * 2) / 3);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(22, 0);
      context.stroke();
    }
    context.restore();
    context.fillStyle = token(host, '--atelier-accent');
    context.fillRect(16, view.height - 18, (width - 32) * (spin / 100), 8);
    context.font = '600 16px system-ui';
    if (message) context.fillText(message, 16, 28);
    stats.textContent = `${copy.score} ${score} · ${copy.combo} ${combo} · ${copy.best} ${best} · ${copy.yoyo.spin} ${Math.round(spin)}%`;
  });
  const onKey = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
      action();
    }
    if (event.key.toLowerCase() === 't') trick();
  };
  view.canvas.addEventListener('pointerdown', action);
  host.addEventListener('keydown', onKey);
  controls.append(
    button(`${copy.yoyo.throw} / ${copy.yoyo.bind}`, action),
    button(copy.yoyo.trick, trick)
  );
  return () => {
    stop();
    view.dispose();
    host.removeEventListener('keydown', onKey);
  };
};

const penspinning = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.penspinning.intro);
  const view = makeCanvas(stage);
  let angle = 0;
  let speed = 3.2;
  let window_ = 0.55;
  let combo = 0;
  let best = 0;
  let finger = 0;
  let turnsSincePass = 0;
  let dropTime = 0;
  let message = '';
  const pass = () => {
    if (dropTime > 0) return;
    const phase = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const offset = Math.abs(phase - Math.PI * 1.5);
    if (offset < window_ / 2) {
      combo += 1;
      best = Math.max(best, combo);
      speed *= 1.08;
      window_ = Math.max(0.22, window_ * 0.96);
      finger = (finger + 1) % 4;
      turnsSincePass = 0;
      message = `${copy.penspinning.pass} ×${combo}`;
    } else drop();
  };
  const drop = () => {
    dropTime = 1;
    combo = 0;
    speed = 3.2;
    window_ = 0.55;
    message = copy.penspinning.drop;
  };
  const stop = loop((_, dt) => {
    const context = view.context;
    if (!context) return;
    const width = view.width();
    const pivotX = width / 2 - 90 + finger * 60;
    const pivotY = view.height / 2 + 30;
    if (dropTime > 0) {
      dropTime -= dt;
      if (dropTime <= 0) angle = 0;
    } else {
      const before = angle;
      angle += speed * dt;
      if (Math.floor(angle / (Math.PI * 2)) > Math.floor(before / (Math.PI * 2))) {
        turnsSincePass += 1;
        if (turnsSincePass > 2) drop();
      }
    }
    context.clearRect(0, 0, width, view.height);
    context.fillStyle = token(host, '--atelier-line');
    for (let index = 0; index < 4; index += 1) {
      context.beginPath();
      context.roundRect(width / 2 - 108 + index * 60, pivotY + 8, 36, 90, 16);
      context.fill();
    }
    context.strokeStyle = token(host, '--atelier-accent');
    context.lineWidth = 10;
    context.globalAlpha = 0.35;
    context.beginPath();
    context.arc(pivotX, pivotY, 92, Math.PI * 1.5 - window_ / 2, Math.PI * 1.5 + window_ / 2);
    context.stroke();
    context.globalAlpha = 1;
    context.save();
    const fall = dropTime > 0 ? (1 - dropTime) * 160 : 0;
    context.translate(pivotX, pivotY + fall);
    context.rotate(angle);
    context.fillStyle = token(host, '--atelier-fg');
    context.beginPath();
    context.roundRect(-84, -5, 168, 10, 5);
    context.fill();
    context.fillStyle = objectColors.purple;
    context.fillRect(-84, -6, 30, 12);
    context.fillRect(54, -6, 30, 12);
    context.restore();
    context.fillStyle = token(host, '--atelier-fg');
    context.font = '600 16px system-ui';
    if (message) context.fillText(message, 16, 28);
    stats.textContent = `${copy.combo} ${combo} · ${copy.best} ${best} · ${copy.penspinning.speed} ${(speed / 3.2).toFixed(2)}×`;
  });
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== ' ') return;
    event.preventDefault();
    pass();
  };
  view.canvas.addEventListener('pointerdown', pass);
  host.addEventListener('keydown', onKey);
  controls.append(button(copy.penspinning.pass, pass));
  return () => {
    stop();
    view.dispose();
    host.removeEventListener('keydown', onKey);
  };
};

const kendama = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.kendama.intro);
  const view = makeCanvas(stage);
  const targets = [
    { label: copy.kendama.big, width: 0.3 },
    { label: copy.kendama.small, width: 0.2 },
    { label: copy.kendama.spike, width: 0.11 }
  ];
  let time = 0;
  let level = 0;
  let streak = 0;
  let best = 0;
  let flight = 0;
  let caught = false;
  let message = '';
  const amplitude = () => 0.9 + level * 0.05;
  const frequency = () => 2.2 + level * 0.25;
  const pull = () => {
    if (flight > 0) return;
    const swing = Math.sin(time * frequency()) * amplitude();
    const target = targets[level % targets.length];
    caught = Math.abs(swing) < target.width;
    flight = 0.6;
    if (caught) {
      streak += 1;
      level += 1;
      best = Math.max(best, streak);
      message = `${target.label}!`;
    } else {
      streak = 0;
      level = 0;
      message = copy.kendama.miss;
    }
  };
  const stop = loop((_, dt) => {
    const context = view.context;
    if (!context) return;
    time += dt;
    if (flight > 0) flight = Math.max(0, flight - dt);
    const width = view.width();
    const anchorX = width / 2;
    const anchorY = view.height - 110;
    const swing = Math.sin(time * frequency()) * amplitude();
    const length = 120;
    let ballX = anchorX + Math.sin(swing) * length;
    let ballY = anchorY + 30 + Math.cos(swing) * length * 0.2 - 150;
    if (flight > 0) {
      const t = 1 - flight / 0.6;
      ballX = caught ? anchorX : ballX;
      ballY = anchorY - 150 - Math.sin(t * Math.PI) * 60 + (caught ? t * 120 : 0);
    }
    context.clearRect(0, 0, width, view.height);
    const target = targets[level % targets.length];
    context.fillStyle = token(host, '--atelier-accent');
    context.globalAlpha = 0.25;
    context.fillRect(anchorX - target.width * length, anchorY - 200, target.width * length * 2, 60);
    context.globalAlpha = 1;
    context.fillStyle = objectColors.wood;
    context.fillRect(anchorX - 8, anchorY - 20, 16, 110);
    context.fillRect(anchorX - 46, anchorY - 34, 92, 16);
    context.fillStyle = objectColors.woodDark;
    context.fillRect(anchorX - 3, anchorY - 70, 6, 50);
    context.strokeStyle = token(host, '--atelier-fg-muted');
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(anchorX, anchorY + 40);
    context.quadraticCurveTo(anchorX + 40, anchorY, ballX, ballY);
    context.stroke();
    context.fillStyle = objectColors.red;
    context.beginPath();
    context.arc(ballX, ballY, 20, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = token(host, '--atelier-fg');
    context.font = '600 16px system-ui';
    context.fillText(message || target.label, 16, 28);
    stats.textContent = `${copy.combo} ${streak} · ${copy.best} ${best} · ${target.label}`;
  });
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== ' ') return;
    event.preventDefault();
    pull();
  };
  view.canvas.addEventListener('pointerdown', pull);
  host.addEventListener('keydown', onKey);
  controls.append(button(copy.kendama.pull, pull));
  return () => {
    stop();
    view.dispose();
    host.removeEventListener('keydown', onKey);
  };
};

const cardistry = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.cardistry.intro);
  const table = el('div', 'room-game-cards');
  stage.append(table);
  let level = 1;
  let best = 0;
  let order = [0, 1, 2];
  let ace = 1;
  let phase: 'idle' | 'shuffling' | 'pick' = 'idle';
  const timers: number[] = [];
  const cards = [0, 1, 2].map((index) => {
    const card = el('button', 'room-game-card');
    card.type = 'button';
    card.dataset.card = String(index);
    card.addEventListener('click', () => pick(index));
    table.append(card);
    return card;
  });
  const layout = () =>
    order.forEach((card, slot) => cards[card].style.setProperty('--slot', String(slot)));
  const reveal = (show: boolean) =>
    cards.forEach((card, index) => {
      card.dataset.face = show ? (index === ace ? 'ace' : 'blank') : 'back';
      card.textContent = show ? (index === ace ? 'A♥' : '♣') : '';
    });
  const render = (message = '') => {
    stats.textContent = `${message ? `${message} · ` : ''}${copy.cardistry.level} ${level} · ${copy.best} ${best}`;
  };
  const deal = () => {
    if (phase === 'shuffling') return;
    ace = Math.floor(Math.random() * 3);
    order = [0, 1, 2];
    layout();
    reveal(true);
    phase = 'shuffling';
    render();
    const swaps = 3 + level * 2;
    const speed = Math.max(170, 520 - level * 45);
    table.style.setProperty('--shuffle-speed', `${speed}ms`);
    timers.push(window.setTimeout(() => reveal(false), 900));
    for (let index = 0; index < swaps; index += 1)
      timers.push(
        window.setTimeout(() => {
          const a = Math.floor(Math.random() * 3);
          const b = (a + 1 + Math.floor(Math.random() * 2)) % 3;
          [order[a], order[b]] = [order[b], order[a]];
          layout();
          if (index === swaps - 1)
            timers.push(
              window.setTimeout(() => {
                phase = 'pick';
                render(copy.cardistry.pick);
              }, speed)
            );
        }, 1100 + index * speed)
      );
  };
  const pick = (index: number) => {
    if (phase !== 'pick') return;
    phase = 'idle';
    reveal(true);
    if (index === ace) {
      level += 1;
      best = Math.max(best, level - 1);
      render(copy.cardistry.right);
    } else {
      level = 1;
      render(copy.cardistry.wrong);
    }
  };
  controls.append(button(copy.cardistry.deal, deal));
  layout();
  reveal(true);
  render();
  return () => timers.forEach((timer) => window.clearTimeout(timer));
};

const penlight = (host: HTMLElement, copy: MinigameCopy): Cleanup => {
  const { stats, stage, controls } = shell(host, copy.penlight.intro);
  const view = makeCanvas(stage, 280);
  const colors = [objectColors.pink, objectColors.blue, objectColors.yellow, objectColors.green, objectColors.purple];
  const beat = 0.6;
  let running = false;
  let startedAt = 0;
  let cues: number[] = [];
  let judged = new Set<number>();
  let held = 0;
  let swing = 0;
  let score = 0;
  let combo = 0;
  let best = 0;
  let message = '';
  const cueFor = (index: number) => {
    while (cues.length <= index) cues.push(Math.floor(Math.random() * colors.length));
    return cues[index];
  };
  const start = () => {
    running = true;
    startedAt = performance.now() / 1000 + 1;
    cues = [];
    judged = new Set();
    score = 0;
    combo = 0;
    message = '';
  };
  const press = (color: number) => {
    held = color;
    swing = 1;
    if (!running) return;
    const now = performance.now() / 1000 - startedAt;
    const index = Math.round(now / beat);
    if (index < 0 || judged.has(index)) return;
    const offset = Math.abs(now - index * beat);
    judged.add(index);
    if (cueFor(index) === color && offset < 0.09) {
      score += 100;
      combo += 1;
      message = copy.penlight.perfect;
    } else if (cueFor(index) === color && offset < 0.18) {
      score += 50;
      combo += 1;
      message = copy.penlight.great;
    } else {
      combo = 0;
      message = copy.penlight.miss;
    }
    best = Math.max(best, combo);
  };
  const stop = loop((_, dt) => {
    const context = view.context;
    if (!context) return;
    const width = view.width();
    swing = Math.max(0, swing - dt * 3);
    const now = performance.now() / 1000 - startedAt;
    if (running) {
      const index = Math.floor(now / beat) - 1;
      if (index >= 0 && !judged.has(index) && now - index * beat > 0.2) {
        judged.add(index);
        combo = 0;
        message = copy.penlight.miss;
      }
    }
    context.clearRect(0, 0, width, view.height);
    if (running)
      for (let ahead = -1; ahead < 5; ahead += 1) {
        const index = Math.floor(now / beat) + ahead;
        if (index < 0) continue;
        const x = width / 2 + (index * beat - now) * 260;
        context.globalAlpha = judged.has(index) ? 0.25 : 1;
        context.fillStyle = colors[cueFor(index)];
        context.beginPath();
        context.arc(x, 60, 20, 0, Math.PI * 2);
        context.fill();
      }
    context.globalAlpha = 1;
    context.strokeStyle = token(host, '--atelier-fg');
    context.lineWidth = 2;
    context.beginPath();
    context.arc(width / 2, 60, 26, 0, Math.PI * 2);
    context.stroke();
    context.save();
    context.translate(width / 2, view.height - 20);
    context.rotate(Math.sin(swing * Math.PI) * 0.5);
    context.fillStyle = token(host, '--atelier-fg');
    context.fillRect(-9, -70, 18, 70);
    context.shadowColor = colors[held];
    context.shadowBlur = 30;
    context.fillStyle = colors[held];
    context.fillRect(-7, -170, 14, 100);
    context.restore();
    context.fillStyle = token(host, '--atelier-fg');
    context.font = '600 16px system-ui';
    if (message) context.fillText(message, 16, 28);
    stats.textContent = `${copy.score} ${score} · ${copy.combo} ${combo} · ${copy.best} ${best}`;
  });
  const pad = el('div', 'room-game-pads');
  colors.forEach((color, index) => {
    const pad_ = button(String(index + 1), () => press(index), 'room-game-pad');
    pad_.style.background = color;
    pad.append(pad_);
  });
  const onKey = (event: KeyboardEvent) => {
    const index = Number(event.key) - 1;
    if (index < 0 || index >= colors.length || Number.isNaN(index)) return;
    event.preventDefault();
    press(index);
  };
  host.addEventListener('keydown', onKey);
  controls.append(pad, button(copy.start, start));
  return () => {
    stop();
    view.dispose();
    host.removeEventListener('keydown', onKey);
  };
};

const games: Record<MinigameId, (host: HTMLElement, copy: MinigameCopy) => Cleanup> = {
  piano,
  typing,
  rubik,
  yoyo,
  penspinning,
  kendama,
  cardistry,
  penlight
};

export const mountMinigame = (host: HTMLElement, id: MinigameId, copy: MinigameCopy): Cleanup => {
  host.replaceChildren();
  host.dataset.game = id;
  host.tabIndex = -1;
  const cleanup = games[id](host, copy);
  window.setTimeout(() => host.contains(document.activeElement) || host.focus(), 30);
  return () => {
    cleanup();
    host.replaceChildren();
    delete host.dataset.game;
  };
};
