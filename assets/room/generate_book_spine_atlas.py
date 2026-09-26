import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent / 'textures'
W, H, N = 1024, 512, 16
LOGO = [(226, 84, 120), (40, 52, 110), (234, 120, 44), (40, 140, 150), (150, 90, 170), (200, 40, 50), (90, 160, 210), (246, 170, 190), (240, 196, 60)]
WHITE = [(246, 244, 238), (240, 238, 232), (250, 249, 246), (236, 236, 232)]
DARK = [(30, 30, 36), (40, 44, 60), (70, 30, 40), (24, 40, 60)]


def glyphs(d, cx, y0, y1, w, ink, rng):
    y = y0
    g = w * 0.42
    while y + g < y1:
        if rng.random() < 0.1:
            y += g * 0.8
            continue
        for _ in range(rng.randint(2, 4)):
            if rng.random() < 0.5:
                yy = y + rng.uniform(0, g)
                xa = cx - g / 2 + rng.uniform(0, g * 0.3)
                d.line((xa, yy, xa + rng.uniform(g * 0.4, g), yy), fill=ink, width=2)
            else:
                xx = cx - g / 2 + rng.uniform(0, g)
                ya = y + rng.uniform(0, g * 0.3)
                d.line((xx, ya, xx, ya + rng.uniform(g * 0.4, g)), fill=ink, width=2)
        y += g * 1.2


def spine(d, x0, x1, rng):
    w = x1 - x0
    kind = rng.random()
    if kind < 0.62:
        base = rng.choice(WHITE)
        ink = (40, 38, 44)
        logo = rng.choice(LOGO)
    elif kind < 0.85:
        base = rng.choice(LOGO)
        ink = (250, 248, 244)
        logo = rng.choice(WHITE)
    else:
        base = rng.choice(DARK)
        ink = (236, 232, 224)
        logo = rng.choice(LOGO)
    d.rectangle((x0, 0, x1, H), fill=base)
    lt = rng.randint(24, 60)
    d.rectangle((x0, lt, x1, lt + rng.randint(40, 80)), fill=logo)
    glyphs(d, (x0 + x1) / 2, lt + 110, H - 130, w, ink, rng)
    if rng.random() < 0.7:
        glyphs(d, x0 + w * 0.8, lt + 140, lt + 260, w * 0.45, ink, rng)
    d.rectangle((x0 + w * 0.2, H - 110, x1 - w * 0.2, H - 110 + w * 0.6), fill=logo)
    d.rectangle((x0 + w * 0.36, H - 100, x1 - w * 0.36, H - 110 + w * 0.5), fill=base)
    d.line((x0, 0, x0, H), fill=tuple(max(0, c - 55) for c in base), width=2)
    d.line((x1 - 1, 0, x1 - 1, H), fill=tuple(max(0, c - 30) for c in base), width=2)


for name, seed in (('book-spine-atlas-a.png', 101), ('book-spine-atlas-b.png', 202)):
    rng = random.Random(seed)
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    for i in range(N):
        spine(d, i * W // N, (i + 1) * W // N, rng)
    im.filter(ImageFilter.GaussianBlur(0.5)).save(OUT / name)
print('ok')
