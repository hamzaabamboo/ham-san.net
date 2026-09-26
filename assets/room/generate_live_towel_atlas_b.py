import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

W, H = 256, 1536
OUT = Path(__file__).resolve().parent / 'textures' / 'live-towel-atlas-b.png'
rng = random.Random(20260925)


def heart(d, cx, cy, s, fill):
    d.ellipse((cx - s, cy - s * 0.9, cx, cy + s * 0.1), fill=fill)
    d.ellipse((cx, cy - s * 0.9, cx + s, cy + s * 0.1), fill=fill)
    d.polygon([(cx - s * 0.98, cy - s * 0.25), (cx + s * 0.98, cy - s * 0.25), (cx, cy + s * 1.05)], fill=fill)


def star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


def red_heart():
    im = Image.new('RGB', (W, H), (246, 242, 238))
    d = ImageDraw.Draw(im)
    for k in range(7):
        y = 120 + k * 210
        d.polygon([(0, y), (W, y - 90), (W, y - 40), (0, y + 50)], fill=(214, 38, 64))
    for k in range(9):
        heart(d, 70 + (k % 2) * 110, 90 + k * 165, 30, (228, 70, 104))
    d.rectangle((0, 0, W, 34), fill=(214, 38, 64))
    d.rectangle((0, H - 34, W, H), fill=(214, 38, 64))
    return im


def tri_stripe():
    im = Image.new('RGB', (W, H), (248, 248, 244))
    d = ImageDraw.Draw(im)
    for x0, col in ((20, (70, 176, 96)), (100, (84, 170, 226)), (180, (236, 102, 150))):
        d.rectangle((x0, 0, x0 + 58, H), fill=col)
    for y in range(40, H, 96):
        for x0 in (49, 129, 209):
            d.ellipse((x0 - 9, y - 9, x0 + 9, y + 9), fill=(248, 248, 244))
    d.rectangle((0, H - 120, W, H - 70), fill=(236, 102, 150))
    return im


def royal_wave():
    im = Image.new('RGB', (W, H), (28, 58, 156))
    d = ImageDraw.Draw(im)
    for side in (0, 1):
        pts = []
        for y in range(0, H + 1, 8):
            x = 22 + 10 * math.sin(y / 38.0)
            pts.append((x if side == 0 else W - x, y))
        edge = 0 if side == 0 else W
        d.polygon([(edge, 0)] + pts + [(edge, H)], fill=(238, 240, 246))
    for k in range(14):
        star(d, W / 2 + rng.uniform(-50, 50), 80 + k * 102, rng.uniform(12, 22), (238, 240, 246))
    d.rectangle((0, 0, W, 40), fill=(206, 34, 48))
    d.rectangle((0, H - 40, W, H), fill=(206, 34, 48))
    return im


def pink_lace():
    im = Image.new('RGB', (W, H), (250, 244, 244))
    d = ImageDraw.Draw(im)
    for y in range(0, H, 64):
        for x in range(0, W + 64, 64):
            ox = 32 if (y // 64) % 2 else 0
            d.ellipse((x - ox - 18, y - 18, x - ox + 18, y + 18), outline=(236, 170, 184), width=4)
            d.ellipse((x - ox - 5, y - 5, x - ox + 5, y + 5), fill=(236, 170, 184))
    d.rectangle((0, H - 150, W, H), fill=(240, 150, 170))
    for x in range(0, W, 32):
        d.pieslice((x, H - 170, x + 32, H - 130), 0, 180, fill=(240, 150, 170))
    return im


def weave(im):
    px = im.load()
    for y in range(H):
        for x in range(W):
            n = ((x * 7 + y * 3) % 5 - 2) * 2 + rng.randint(-4, 4)
            r, g, b = px[x, y]
            px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return im.filter(ImageFilter.GaussianBlur(0.6))


atlas = Image.new('RGB', (W * 4, H))
for i, make in enumerate((red_heart, tri_stripe, royal_wave, pink_lace)):
    atlas.paste(weave(make()), (i * W, 0))
atlas.save(OUT)
print({'written': str(OUT), 'size': atlas.size})
