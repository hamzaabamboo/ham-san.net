import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent / 'textures' / 'rug-kilim-teal.png'
W, H = 1024, 1536
rng = random.Random(9)
CREAM, TEAL, INK, MAROON, GOLD = (232, 224, 204), (22, 104, 112), (34, 32, 34), (130, 40, 44), (214, 170, 60)
im = Image.new('RGB', (W, H), CREAM)
d = ImageDraw.Draw(im)
d.rectangle((150, 150, W - 150, H - 150), fill=TEAL)
for inset, col, wd in ((40, INK, 18), (78, TEAL, 16), (112, INK, 10)):
    d.rectangle((inset, inset, W - inset, H - inset), outline=col, width=wd)


def step_diamond(cx, cy, s, col):
    for k in range(4):
        r = s * (4 - k) / 4
        d.rectangle((cx - r, cy - s * 0.18 * (k + 1), cx + r, cy + s * 0.18 * (k + 1)), fill=col)
        d.rectangle((cx - s * 0.18 * (k + 1), cy - r, cx + s * 0.18 * (k + 1), cy + r), fill=col)


for y in range(280, H - 200, 250):
    step_diamond(W // 2, y, 70, MAROON)
    step_diamond(W // 2, y, 26, CREAM)
    for x in (300, W - 300):
        d.polygon([(x - 30, y - 40), (x, y), (x + 30, y - 40), (x + 30, y - 10), (x, y + 30), (x - 30, y - 10)], fill=CREAM if (y // 250) % 2 else GOLD)
for x in range(60, W - 60, 60):
    d.rectangle((x, 12, x + 20, 30), fill=MAROON)
    d.rectangle((x, H - 30, x + 20, H - 12), fill=MAROON)
px = im.load()
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        n = rng.randint(-10, 10)
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
im.filter(ImageFilter.GaussianBlur(1.0)).save(OUT)
print('ok')
