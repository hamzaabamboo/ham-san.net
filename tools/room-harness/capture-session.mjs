import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const [endpoint, marker, destination, duration = '20'] = process.argv.slice(2);
if (!endpoint || !marker || !destination)
  throw new Error('CDP URL, window marker and output required');
const output = resolve(destination);
const directory = `${output}.frames`;
mkdirSync(directory, { recursive: true });
const socket = new WebSocket(endpoint);
await new Promise((done, reject) => {
  socket.addEventListener('open', done, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
const frames = [];
const events = [];
let session;
let onDocument;
let captureSize;
let lastFrame;
const send = (method, params = {}, sessionId) =>
  new Promise((done, reject) => {
    const id = ++sequence;
    pending.set(id, { done, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.done(message.result);
  }
  if (message.sessionId !== session) return;
  if (message.method === 'Page.domContentEventFired') onDocument?.();
  if (message.method === 'Page.screencastFrame') {
    const { data, metadata, sessionId } = message.params;
    captureSize ??= { width: metadata.deviceWidth, height: metadata.deviceHeight };
    lastFrame = data;
    const file = resolve(directory, `${String(frames.length).padStart(6, '0')}.jpg`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push({ file, timestamp: metadata.timestamp });
    void send('Page.screencastFrameAck', { sessionId }, session);
  } else if (['Page.frameNavigated', 'Runtime.exceptionThrown'].includes(message.method)) {
    events.push({ method: message.method, params: message.params, time: Date.now() });
  }
});

const targets = await send('Target.getTargets');
for (const target of targets.targetInfos) {
  if (target.type !== 'page' || !/^http:\/\/(?:127\.0\.0\.1|localhost):432[23]\//.test(target.url))
    continue;
  const attached = await send('Target.attachToTarget', {
    targetId: target.targetId,
    flatten: true
  });
  const name = await send(
    'Runtime.evaluate',
    { expression: 'window.name', returnByValue: true },
    attached.sessionId
  );
  if (name.result.value === marker) {
    session = attached.sessionId;
    break;
  }
  await send('Target.detachFromTarget', { sessionId: attached.sessionId });
}
if (!session) throw new Error('Marked project tab not found');
await send('Page.enable', {}, session);
let preload;
const asset = process.argv.includes('--asset');
const touch = process.argv.includes('--touch');
const enter = process.argv.includes('--enter');
const chapters = process.argv.includes('--chapters');
if (enter && !touch) throw new Error('--enter requires --touch');
if (chapters && (!touch || enter)) throw new Error('--chapters requires --touch without --enter');
if (touch || asset) {
  await send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: asset ? 640 : 390,
      height: asset ? 900 : 844,
      deviceScaleFactor: asset ? 1 : 2,
      mobile: !asset
    },
    session
  );
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, session);
  const state = await send(
    'Runtime.evaluate',
    {
      expression:
        'JSON.stringify({coarse:matchMedia("(pointer:coarse)").matches,touch:navigator.maxTouchPoints})',
      returnByValue: true
    },
    session
  );
  console.log(state.result.value);
  if (asset)
    preload = await send(
      'Page.addScriptToEvaluateOnNewDocument',
      {
        source: `document.addEventListener('DOMContentLoaded',()=>{const root=document.querySelector('[data-room-home]');if(!root)return;root.style.setProperty('--room-mobile-scene-height','400px');const style=document.createElement('style');style.textContent='.shell-nav,.room-tour-content,.room-tour-position,.room-tour-status{visibility:hidden!important}::-webkit-scrollbar{display:none}';document.head.append(style);${process.argv.includes('--day') ? "const observer=new MutationObserver(()=>{if(!root.hasAttribute('data-room-revealed'))return;observer.disconnect();document.querySelector('[data-room-enter]').click();document.querySelector('[data-room-light-toggle]').click();document.querySelector('[data-room-exit]').click();});observer.observe(root,{attributes:true,attributeFilter:['data-room-revealed']});" : ''}});`
      },
      session
    );
}
await send('Page.enable', {}, session);
await send('Runtime.enable', {}, session);
await send('Network.enable', {}, session);
await send('Network.setCacheDisabled', { cacheDisabled: true }, session);
await send(
  'Page.startScreencast',
  { format: 'jpeg', quality: 90, maxWidth: 1600, maxHeight: 1000, everyNthFrame: 1 },
  session
);
console.log('Capturing existing project tab');
if (touch || asset) {
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' }, session);
  const documentReady = new Promise((done, reject) => {
    const timeout = setTimeout(() => reject(new Error('Document load timed out')), 15000);
    onDocument = () => {
      clearTimeout(timeout);
      onDocument = undefined;
      done();
    };
  });
  await send('Page.reload', {}, session);
  await documentReady;
}
if (enter) {
  const button = await send(
    'Runtime.evaluate',
    {
      expression: `JSON.stringify((()=>{const button=document.querySelector('[data-room-enter]');if(!button)throw new Error('Entry button missing');const rect=button.getBoundingClientRect();return{x:rect.x+rect.width/2,y:rect.y+rect.height/2,width:innerWidth,coarse:matchMedia('(pointer:coarse)').matches}})())`,
      returnByValue: true
    },
    session
  );
  const point = JSON.parse(button.result.value);
  if (point.width !== 390 || !point.coarse) throw new Error('Phone emulation changed');
  await send(
    'Input.dispatchTouchEvent',
    { type: 'touchStart', touchPoints: [{ x: point.x, y: point.y }] },
    session
  );
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }, session);
  events.push({ method: 'Harness.touchEntry', params: point, time: Date.now() });
}
if (chapters) {
  await send(
    'Runtime.evaluate',
    {
      expression: `new Promise((resolve,reject)=>{const root=document.querySelector('[data-room-home]');if(root.hasAttribute('data-room-revealed'))return resolve();const timer=setTimeout(()=>{observer.disconnect();reject(new Error('Room reveal timed out'))},15000);const observer=new MutationObserver(()=>{if(!root.hasAttribute('data-room-revealed'))return;clearTimeout(timer);observer.disconnect();resolve()});observer.observe(root,{attributes:true,attributeFilter:['data-room-revealed']})})`,
      awaitPromise: true
    },
    session
  );
  const chapterDirectory = `${output}.chapters`;
  mkdirSync(chapterDirectory, { recursive: true });
  const stops = await send(
    'Runtime.evaluate',
    { expression: `document.querySelectorAll('[data-tour-stop]').length`, returnByValue: true },
    session
  );
  for (let index = 0; index < stops.result.value; index += 1) {
    const destination = await send(
      'Runtime.evaluate',
      {
        expression: `(()=>{const section=document.querySelectorAll('[data-tour-stop]')[${index}];const scene=document.querySelector('[data-room-tour-viewport]');return Math.max(0,section.getBoundingClientRect().top+scrollY-scene.offsetHeight-64)-scrollY})()`,
        returnByValue: true
      },
      session
    );
    await send(
      'Input.dispatchMouseEvent',
      { type: 'mouseWheel', x: 195, y: 600, deltaX: 0, deltaY: destination.result.value },
      session
    );
    await send(
      'Runtime.evaluate',
      { expression: 'new Promise(resolve=>setTimeout(resolve,1200))', awaitPromise: true },
      session
    );
    const screenshot = await send(
      'Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: false },
      session
    );
    writeFileSync(
      resolve(chapterDirectory, `${String(index + 1).padStart(2, '0')}.png`),
      Buffer.from(screenshot.data, 'base64')
    );
    const state = await send(
      'Runtime.evaluate',
      {
        expression: `JSON.stringify({index:${index},width:innerWidth,coarse:matchMedia('(pointer:coarse)').matches,scrollY,caption:document.querySelector('[data-tour-caption]').textContent,overflow:document.documentElement.scrollWidth>innerWidth})`,
        returnByValue: true
      },
      session
    );
    const observation = JSON.parse(state.result.value);
    if (observation.width !== 390 || !observation.coarse || observation.overflow)
      throw new Error('Chapter phone layout changed or overflowed');
    events.push({ method: 'Harness.chapter', params: observation, time: Date.now() });
  }
}
await new Promise((done) => setTimeout(done, Number(duration) * 1000));
const finalState = await send(
  'Runtime.evaluate',
  {
    expression: `JSON.stringify({width:innerWidth,height:innerHeight,coarse:matchMedia('(pointer:coarse)').matches,touch:navigator.maxTouchPoints,motion:document.querySelector('[data-room-home]')?.dataset.roomMotion,entered:document.querySelector('[data-room-home]')?.hasAttribute('data-room-entered'),revealed:document.querySelector('[data-room-home]')?.hasAttribute('data-room-revealed')})`,
    returnByValue: true
  },
  session
);
events.push({
  method: 'Harness.finalState',
  params: JSON.parse(finalState.result.value),
  time: Date.now()
});
if (enter) {
  const state = JSON.parse(finalState.result.value);
  if (state.width !== 390 || !state.coarse || !state.entered || !state.revealed)
    throw new Error('Phone entry did not complete in the captured context');
}
await send('Page.stopScreencast', {}, session);
writeFileSync(`${output}.last.jpg`, Buffer.from(lastFrame, 'base64'));
await send('Network.setCacheDisabled', { cacheDisabled: false }, session);
if (preload)
  await send(
    'Page.removeScriptToEvaluateOnNewDocument',
    { identifier: preload.identifier },
    session
  );
await send('Target.detachFromTarget', { sessionId: session });
socket.close();
if (frames.length < 2) throw new Error('Insufficient screencast frames');
const concat = frames
  .map((frame, index) => {
    const next = frames[index + 1];
    const seconds = next ? Math.max(0.001, next.timestamp - frame.timestamp) : 1 / 30;
    return `file '${frame.file.replaceAll("'", "'\\''")}'\nduration ${seconds}`;
  })
  .join('\n');
writeFileSync(resolve(directory, 'frames.txt'), `${concat}\n`);
writeFileSync(
  `${output}.json`,
  JSON.stringify({ captureSize, frames: frames.map(({ timestamp }) => timestamp), events }, null, 2)
);
execFileSync(
  'ffmpeg',
  [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-threads',
    '2',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    resolve(directory, 'frames.txt'),
    '-fps_mode',
    'vfr',
    '-vf',
    `${touch ? 'scale=-1:844,crop=390:844:0:0,' : ''}pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0`,
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'fast',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-threads',
    '2',
    '-movflags',
    '+faststart',
    output
  ],
  { stdio: 'inherit', env: { ...process.env, DO_NOT_TRACK: '1' } }
);
rmSync(directory, { recursive: true });
console.log(
  JSON.stringify({
    output,
    frames: frames.length,
    seconds: frames.at(-1).timestamp - frames[0].timestamp
  })
);
