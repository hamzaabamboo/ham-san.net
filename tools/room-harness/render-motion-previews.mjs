import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const output = resolve(root, 'apps/astro/public/models');
const temporary = resolve(root, '.scratch/rec/room-continuity');
mkdirSync(temporary, { recursive: true });
const metadata = JSON.parse(
  readFileSync(resolve(root, 'apps/astro/src/components/home/room-preview.json'), 'utf8')
);

for (const clip of manifest.clips) {
  const stem = `room-tour-${clip.phase}${clip.mobile ? '-mobile' : ''}`;
  const width = clip.width ?? (clip.mobile ? 390 : 1280);
  const height = clip.height ?? (clip.mobile ? 844 : 800);
  const crop = clip.crop ? `crop=${clip.crop},` : clip.mobile ? 'crop=390:844:0:0,' : '';
  const normalize = clip.inputSize ? `scale=${clip.inputSize},` : '';
  const filter = `${normalize}${crop}scale=${width}:${height},fps=30,split[a][b];[a]trim=start=0.6:end=12.6,setpts=PTS-STARTPTS[body];[b]trim=start=0:end=0.6,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=0.6:offset=11.4`;
  const video = resolve(output, `${stem}.mp4`);
  const poster = resolve(temporary, `${stem}.png`);
  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-threads',
      '2',
      '-ss',
      String(clip.start),
      '-i',
      resolve(root, clip.source ?? manifest.source),
      '-filter_complex_threads',
      '1',
      '-filter_complex',
      filter,
      '-t',
      '12',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '24',
      '-threads',
      '2',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      video
    ],
    { stdio: 'inherit', env: { ...process.env, DO_NOT_TRACK: '1' } }
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
      '-i',
      video,
      '-frames:v',
      '1',
      '-threads',
      '2',
      poster
    ],
    { stdio: 'inherit' }
  );
  await sharp(poster)
    .webp({ quality: 86 })
    .toFile(resolve(output, `${stem}.webp`));
  metadata[`${clip.phase}${clip.mobile ? 'Mobile' : ''}`] = {
    video: `/models/${stem}.mp4`,
    poster: `/models/${stem}.webp`
  };
}

writeFileSync(
  resolve(root, 'apps/astro/src/components/home/room-preview.json'),
  `${JSON.stringify(metadata, null, 2)}\n`
);
