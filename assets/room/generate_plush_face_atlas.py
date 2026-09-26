from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

C = 512
OUT = Path(__file__).resolve().parent / 'textures' / 'plush-face-atlas.png'
SKIN = (250, 232, 220)
FACES = [
    ('chibi', SKIN, (70, 120, 210)),
    ('chibi', SKIN, (60, 160, 120)),
    ('smile', SKIN, None),
    ('chibi', SKIN, (190, 50, 70)),
    ('sleep', SKIN, None),
    ('cat', (168, 170, 178), None),
    ('cat', (244, 242, 238), None),
    ('bear', (150, 108, 76), None),
]


def blend(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def anime_eye(d, cx, cy, iris, flip, k=1.35):
    w, h = 78 * k, 104 * k
    d.ellipse((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), fill=(255, 255, 255))
    for step in range(40):
        t = step / 39
        col = blend(blend(iris, (20, 20, 40), 0.55), blend(iris, (255, 255, 255), 0.35), t)
        iw, ih = 64 * k * (1 - t * 0.15), 90 * k * (1 - t * 0.55)
        oy = t * 20 * k
        d.ellipse((cx - iw / 2, cy - ih / 2 + oy, cx + iw / 2, cy + ih / 2 + oy * 0.2), fill=col)
    d.ellipse((cx - 14 * k, cy - 12 * k, cx + 14 * k, cy + 18 * k), fill=(25, 20, 35))
    d.ellipse((cx - (22 * flip + 10) * k, cy - 38 * k, cx - (22 * flip - 10) * k, cy - 14 * k), fill=(255, 255, 255))
    d.ellipse((cx + (14 * flip - 5) * k, cy + 18 * k, cx + (14 * flip + 5) * k, cy + 28 * k), fill=(255, 255, 255))
    d.arc((cx - w / 2 - 8, cy - h / 2 - 6, cx + w / 2 + 8, cy + h / 2), 200, 340, fill=(40, 28, 30), width=11)


def blush(d, cy):
    for cx in (C * 0.24, C * 0.76):
        d.ellipse((cx - 44, cy - 16, cx + 44, cy + 16), fill=(246, 178, 182))


def face(kind, skin, iris):
    im = Image.new('RGB', (C, C), skin)
    d = ImageDraw.Draw(im)
    ey = C * 0.47
    if kind == 'chibi':
        blush(d, C * 0.66)
        anime_eye(d, C * 0.3, ey, iris, 1)
        anime_eye(d, C * 0.7, ey, iris, -1)
        d.arc((C * 0.46, C * 0.66, C * 0.54, C * 0.72), 20, 160, fill=(120, 50, 50), width=6)
    elif kind == 'smile':
        blush(d, C * 0.64)
        for cx in (C * 0.31, C * 0.69):
            d.arc((cx - 44, ey - 20, cx + 44, ey + 50), 200, 340, fill=(45, 30, 32), width=14)
        d.chord((C * 0.44, C * 0.62, C * 0.56, C * 0.74), 0, 180, fill=(190, 70, 80))
    elif kind == 'sleep':
        blush(d, C * 0.64)
        for cx in (C * 0.31, C * 0.69):
            d.arc((cx - 46, ey - 40, cx + 46, ey + 20), 20, 160, fill=(45, 30, 32), width=12)
        d.ellipse((C * 0.47, C * 0.66, C * 0.53, C * 0.71), fill=(150, 60, 60))
    elif kind == 'cat':
        for cx in (C * 0.32, C * 0.68):
            d.ellipse((cx - 30, ey - 38, cx + 30, ey + 38), fill=(30, 28, 34))
            d.ellipse((cx - 16, ey - 26, cx - 2, ey - 10), fill=(255, 255, 255))
        d.polygon([(C * 0.46, C * 0.6), (C * 0.54, C * 0.6), (C * 0.5, C * 0.65)], fill=(236, 150, 160))
        d.arc((C * 0.42, C * 0.6, C * 0.5, C * 0.7), 20, 160, fill=(60, 50, 55), width=5)
        d.arc((C * 0.5, C * 0.6, C * 0.58, C * 0.7), 20, 160, fill=(60, 50, 55), width=5)
        blush(d, C * 0.66)
    elif kind == 'bear':
        d.ellipse((C * 0.3, C * 0.5, C * 0.7, C * 0.82), fill=blend(skin, (240, 220, 190), 0.6))
        for cx in (C * 0.32, C * 0.68):
            d.ellipse((cx - 20, ey - 22, cx + 20, ey + 22), fill=(28, 22, 20))
            d.ellipse((cx - 10, ey - 14, cx - 2, ey - 6), fill=(255, 255, 255))
        d.ellipse((C * 0.44, C * 0.56, C * 0.56, C * 0.65), fill=(32, 24, 22))
        d.line((C * 0.5, C * 0.65, C * 0.5, C * 0.72), fill=(60, 40, 35), width=5)
    return im.filter(ImageFilter.GaussianBlur(1.1))


atlas = Image.new('RGB', (C * 4, C * 2))
for i, (kind, skin, iris) in enumerate(FACES):
    atlas.paste(face(kind, skin, iris), ((i % 4) * C, (i // 4) * C))
atlas.save(OUT)
print({'written': str(OUT), 'size': atlas.size})
