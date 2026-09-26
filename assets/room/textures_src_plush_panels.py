import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent / 'textures'
W = H = 1024


def fabric_noise(im, amt=7, seed=1):
    rng = random.Random(seed)
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            n = rng.randint(-amt, amt)
            px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return im.filter(ImageFilter.GaussianBlur(0.8))


def fringe(d, y_base, x0, x1, hair, teeth, depth, seed):
    rng = random.Random(seed)
    pts = [(x0, 0), (x1, 0), (x1, y_base)]
    n = teeth
    xs = sorted([x0, x1] + [rng.uniform(x0, x1) for _ in range(n - 1)], reverse=True)
    for i, x in enumerate(xs):
        if i % 2:
            pts.append((x, y_base + depth * rng.uniform(0.7, 1.25)))
        else:
            pts.append((x, y_base - depth * rng.uniform(0.0, 0.25)))
    pts.append((x0, y_base))
    d.polygon(pts, fill=hair)


def lying_face(name, hair, skin, seed, eyes='closed'):
    im = Image.new('RGB', (W, H), hair)
    d = ImageDraw.Draw(im)
    d.ellipse((150, 430, 874, 1120), fill=skin)
    fringe(d, 560, 120, 904, hair, 13, 130, seed)
    ey = 800
    if eyes == 'closed':
        for cx in (360, 664):
            d.arc((cx - 95, ey - 70, cx + 95, ey + 20), 25, 155, fill=(30, 22, 26), width=13)
    for cx in (270, 754):
        d.ellipse((cx - 55, ey + 55, cx + 55, ey + 110), fill=(242, 168, 176))
    d.line((490, ey + 90, 512, ey + 106, 534, ey + 90), fill=(90, 40, 40), width=8)
    im = fabric_noise(im, seed=seed)
    im.save(OUT / f'plush-panel-{name}.png')


lying_face('lying-ginger', (196, 96, 44), (246, 232, 220), 11)
lying_face('lying-orange', (214, 112, 42), (248, 234, 222), 23)
lying_face('lying-dark', (58, 42, 38), (246, 232, 220), 37)
print('ok')


def anime_eye(d, cx, cy, iris, flip, w=250, h=280):
    d.ellipse((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), fill=(255, 255, 255))
    for step in range(30):
        t = step / 29
        col = tuple(int(iris[i] * (0.45 + 0.75 * t) if t < 0.8 else min(255, iris[i] + 60)) for i in range(3))
        iw, ih = w * 0.86 * (1 - 0.2 * t), h * 0.92 * (1 - 0.5 * t)
        oy = t * h * 0.18
        d.ellipse((cx - iw / 2, cy - ih / 2 + oy, cx + iw / 2, cy + ih / 2 + oy * 0.3), fill=col)
    d.ellipse((cx - w * 0.2, cy - h * 0.12, cx + w * 0.2, cy + h * 0.22), fill=(22, 30, 40))
    d.ellipse((cx - flip * w * 0.18 - 22, cy - h * 0.36, cx - flip * w * 0.18 + 22, cy - h * 0.08), fill=(255, 255, 255))
    d.arc((cx - w / 2 - 12, cy - h / 2 - 8, cx + w / 2 + 12, cy + h / 2 + 6), 190, 350, fill=(35, 25, 28), width=18)


def seated_face(name, skin, iris, mouth, seed):
    im = Image.new('RGB', (W, H), skin)
    d = ImageDraw.Draw(im)
    ey = 500
    if mouth == 'sleep':
        for cx in (330, 694):
            d.arc((cx - 90, ey - 50, cx + 90, ey + 40), 25, 155, fill=(35, 25, 28), width=14)
    else:
        anime_eye(d, 300, ey, iris, 1)
        anime_eye(d, 724, ey, iris, -1)
    for cx in (230, 794):
        for k in range(3):
            x = cx - 30 + k * 26
            d.line((x, 690, x - 10, 738), fill=(236, 120, 130), width=8)
    if mouth == 'open':
        d.chord((462, 690, 562, 780), 0, 180, fill=(120, 30, 40))
        d.chord((480, 725, 544, 778), 0, 180, fill=(236, 120, 130))
    else:
        d.arc((480, 690, 544, 730), 20, 160, fill=(110, 40, 45), width=8)
    im = fabric_noise(im, seed=seed)
    im.save(OUT / f'plush-panel-{name}.png')


seated_face('chibi-laugh-teal', (244, 224, 206), (70, 170, 160), 'open', 41)
seated_face('chibi-smile-blue', (246, 228, 212), (80, 120, 210), 'smile', 43)
seated_face('chibi-smile-violet', (246, 228, 212), (150, 100, 200), 'smile', 47)
seated_face('chibi-sleep', (246, 228, 212), (0, 0, 0), 'sleep', 53)
print('seated ok')


def animal_face(name, fur, muzzle, kind, seed):
    im = Image.new('RGB', (W, H), fur)
    d = ImageDraw.Draw(im)
    ey = 470
    if kind in ('cat-grey', 'cat-white'):
        if kind == 'cat-grey':
            d.polygon([(512, 130), (420, 470), (604, 470)], fill=(245, 243, 238))
            d.ellipse((330, 470, 694, 900), fill=(245, 243, 238))
        for cx in (360, 664):
            d.ellipse((cx - 44, ey - 52, cx + 44, ey + 52), fill=(28, 26, 32))
            d.ellipse((cx - 26, ey - 36, cx - 2, ey - 10), fill=(255, 255, 255))
        d.polygon([(486, 590), (538, 590), (512, 622)], fill=(232, 140, 150))
        d.arc((440, 600, 512, 680), 20, 160, fill=(70, 55, 60), width=7)
        d.arc((512, 600, 584, 680), 20, 160, fill=(70, 55, 60), width=7)
        for s in (-1, 1):
            for k in range(3):
                d.line((512 + s * 120, 620 + k * 22, 512 + s * 250, 600 + k * 34), fill=(120, 110, 115), width=4)
    elif kind == 'bear':
        d.ellipse((370, 520, 654, 800), fill=muzzle)
        for cx in (380, 644):
            d.ellipse((cx - 30, ey - 32, cx + 30, ey + 32), fill=(24, 18, 16))
            d.ellipse((cx - 14, ey - 20, cx - 2, ey - 8), fill=(255, 255, 255))
        d.ellipse((470, 560, 554, 630), fill=(40, 28, 24))
        d.arc((460, 620, 564, 720), 30, 150, fill=(60, 40, 34), width=7)
    elif kind == 'dog':
        for cx in (370, 654):
            d.ellipse((cx - 50, ey - 56, cx + 50, ey + 56), fill=(30, 24, 28))
            d.ellipse((cx - 30, ey - 40, cx - 6, ey - 14), fill=(255, 255, 255))
        d.ellipse((472, 580, 552, 640), fill=(60, 40, 36))
        d.chord((462, 630, 562, 720), 0, 180, fill=(200, 70, 80))
        for cx in (250, 774):
            d.ellipse((cx - 50, 620, cx + 50, 680), fill=(246, 170, 170))
    elif kind == 'mochi':
        for cx in (400, 624):
            d.ellipse((cx - 22, ey - 26, cx + 22, ey + 26), fill=(26, 24, 28))
        d.arc((470, 520, 554, 580), 20, 160, fill=(40, 34, 36), width=8)
        for cx in (300, 724):
            d.ellipse((cx - 44, 530, cx + 44, 574), fill=(246, 188, 196))
    elif kind == 'creature':
        for cx in (380, 644):
            d.ellipse((cx - 48, ey - 58, cx + 48, ey + 58), fill=(30, 24, 22))
            d.ellipse((cx - 28, ey - 42, cx - 4, ey - 16), fill=(255, 255, 255))
        d.ellipse((330, 560, 694, 860), fill=(250, 214, 150))
        d.arc((452, 600, 572, 680), 20, 160, fill=(80, 40, 30), width=9)
        for cx in (230, 794):
            d.ellipse((cx - 60, 560, cx + 60, 620), fill=(240, 150, 110))
    im = fabric_noise(im, seed=seed)
    im.save(OUT / f'plush-panel-{name}.png')


def stripe_knit(name, a, b, seed):
    im = Image.new('RGB', (W, H), a)
    d = ImageDraw.Draw(im)
    for y in range(0, H, 128):
        d.rectangle((0, y, W, y + 64), fill=b)
    for y in range(0, H, 16):
        for x in range(0, W, 16):
            d.line((x, y, x + 8, y + 12), fill=tuple(max(0, c - 18) for c in (a if (y // 64) % 2 else b)), width=2)
    im = fabric_noise(im, seed=seed)
    im.save(OUT / f'plush-panel-{name}.png')


animal_face('cat-grey', (178, 176, 180), None, 'cat-grey', 61)
animal_face('cat-white', (244, 242, 236), None, 'cat-white', 63)
animal_face('bear', (176, 138, 98), (226, 198, 160), 'bear', 67)
animal_face('dog', (240, 200, 60), None, 'dog', 71)
animal_face('mochi', (246, 246, 242), None, 'mochi', 73)
animal_face('creature', (232, 132, 40), None, 'creature', 79)
stripe_knit('knit-stripe', (40, 38, 40), (226, 218, 200), 83)
print('animal ok')


def floral_banner(name, seed):
    rng = random.Random(seed)
    im = Image.new('RGB', (1024, 512), (238, 190, 214))
    d = ImageDraw.Draw(im)
    for _ in range(46):
        cx, cy, r = rng.uniform(0, 1024), rng.uniform(0, 430), rng.uniform(22, 54)
        col = rng.choice([(250, 236, 244), (214, 120, 176), (170, 120, 210), (255, 214, 120), (130, 190, 230)])
        for k in range(5):
            a = k / 5 * math.tau + rng.random()
            d.ellipse((cx + math.cos(a) * r * 0.55 - r * 0.45, cy + math.sin(a) * r * 0.55 - r * 0.45, cx + math.cos(a) * r * 0.55 + r * 0.45, cy + math.sin(a) * r * 0.55 + r * 0.45), fill=col)
        d.ellipse((cx - r * 0.25, cy - r * 0.25, cx + r * 0.25, cy + r * 0.25), fill=(255, 240, 160))
    for _ in range(18):
        x, y = rng.uniform(0, 1024), rng.uniform(0, 420)
        d.line((x, y, x + rng.uniform(-40, 40), y + rng.uniform(20, 60)), fill=(110, 170, 110), width=6)
    d.rectangle((700, 0, 1024, 430), fill=(236, 214, 236))
    for k in range(-10, 20):
        d.line((700 + k * 40, 0, 700 + k * 40 + 430, 430), fill=(150, 90, 170), width=10)
        d.line((700 + k * 40, 430, 700 + k * 40 + 430, 0), fill=(150, 90, 170), width=10)
    d.rectangle((0, 430, 1024, 512), fill=(246, 240, 244))
    for x in range(0, 1024, 48):
        d.pieslice((x, 400, x + 48, 460), 0, 180, fill=(246, 240, 244))
        d.ellipse((x + 16, 470, x + 32, 486), outline=(214, 170, 196), width=3)
    im = fabric_noise(im, seed=seed)
    im.save(OUT / f'plush-panel-{name}.png')


floral_banner('dart-banner', 91)
print('banner ok')
