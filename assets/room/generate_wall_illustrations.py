import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

TEX = Path(__file__).resolve().parent / 'textures'
rng = random.Random(2609)


def cutout(name):
    im = Image.open(TEX / f'acrylic-idol-{name}.png').convert('RGB')
    im.thumbnail((1400, 1400))
    w, h = im.size
    px = im.load()
    bg = bytearray(w * h)
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or bg[y * w + x]:
            continue
        r, g, b = px[x, y]
        if min(r, g, b) < 232:
            continue
        bg[y * w + x] = 1
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    mask = Image.frombytes('L', (w, h), bytes(0 if v else 255 for v in bg))
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
    out = im.convert('RGBA')
    out.putalpha(mask)
    return out.crop(mask.getbbox())


def bokeh(d, W, H, col, n, rmin, rmax):
    for _ in range(n):
        cx, cy, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(rmin, rmax)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)


def poster(fig, W, H, bg, spot, band, crop=1.0, scale=0.86, name=None):
    im = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(im)
    bokeh(d, W, H, spot, 14, 40, 110)
    im = im.filter(ImageFilter.GaussianBlur(6))
    f = fig.crop((0, 0, fig.width, int(fig.height * crop)))
    h = int(H * scale)
    w = int(f.width * h / f.height)
    if w > W * 0.95:
        w = int(W * 0.95)
        h = int(f.height * w / f.width)
    f = f.resize((w, h), Image.LANCZOS)
    im.paste(f, ((W - w) // 2, H - h - (int(H * 0.1) if band else 0)), f)
    if band:
        d = ImageDraw.Draw(im)
        d.rectangle((0, H - int(H * 0.1), W, H), fill=band)
        d.rectangle((0, H - int(H * 0.1) - 6, W, H - int(H * 0.1)), fill=(255, 255, 255))
    im.save(TEX / name)
    return name


def tapestry(fig, name):
    W, H = 1000, 2800
    im = Image.new('RGB', (W, H), (226, 230, 236))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line((0, y, W, y), fill=(int(232 - 18 * t), int(236 - 16 * t), int(242 - 10 * t)))
    for k in range(0, W, 90):
        for (yy, flip) in ((70, 1), (H - 70, -1)):
            d.ellipse((k + 10, yy - 26, k + 62, yy + 26), outline=(250, 250, 252), width=5)
            d.line((k + 36, yy + 26 * flip, k + 36, yy + 60 * flip), fill=(250, 250, 252), width=4)
    d.rectangle((24, 24, W - 24, H - 24), outline=(250, 250, 252), width=6)
    h = int(H * 0.86)
    w = int(fig.width * h / fig.height)
    f = fig.resize((w, h), Image.LANCZOS)
    im.paste(f, ((W - w) // 2, int(H * 0.08)), f)
    im.save(TEX / name)
    return name


figs = {n: cutout(n) for n in ('amber', 'rose', 'teal', 'navy', 'burgundy', 'plum')}
out = [
    poster(figs['amber'], 840, 1188, (252, 212, 60), (255, 236, 130), (236, 120, 50), crop=0.62, scale=0.92, name='entry-poster-yellow.png'),
    poster(figs['rose'], 900, 1200, (236, 206, 180), (248, 226, 206), None, crop=0.55, scale=0.98, name='entry-portrait-panel.png'),
    poster(figs['amber'], 840, 1188, (250, 200, 96), (255, 226, 150), (230, 110, 60), name='shelf-wall-poster-1.png'),
    poster(figs['burgundy'], 840, 1188, (252, 180, 110), (255, 214, 160), (206, 70, 60), name='shelf-wall-poster-2.png'),
    poster(figs['teal'], 840, 1188, (248, 222, 140), (255, 240, 190), (226, 140, 60), name='shelf-wall-poster-3.png'),
    poster(figs['plum'], 900, 1260, (40, 44, 70), (70, 76, 120), None, crop=0.6, scale=0.96, name='shelf-top-frame-print.png'),
    tapestry(figs['navy'], 'tapestry-blue-dress.png'),
]
print(out)
