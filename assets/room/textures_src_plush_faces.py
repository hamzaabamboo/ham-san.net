import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent / 'textures'
SIZE = 1024

FACES = {
    'blonde': {
        'skin': (240, 208, 184),
        'iris': ((250, 196, 70), (120, 72, 30)),
        'mouth': 'cat',
        'blush': False,
        'eye': 'half',
    },
    'pink': {
        'skin': (246, 214, 196),
        'iris': ((236, 118, 128), (104, 26, 44)),
        'mouth': 'curve',
        'blush': True,
        'eye': 'round',
    },
    'oval': {
        'skin': (244, 218, 196),
        'iris': None,
        'mouth': 'open',
        'blush': True,
        'eye': 'oval',
    },
    'sleep': {
        'skin': (246, 214, 196),
        'iris': None,
        'mouth': 'dot',
        'blush': True,
        'eye': 'closed',
    },
    'brown': {
        'skin': (244, 212, 190),
        'iris': ((196, 150, 210), (90, 50, 110)),
        'mouth': 'curve',
        'blush': True,
        'eye': 'round',
    },
}


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def oval_eye(draw, cx, cy):
    draw.ellipse([cx - 120, cy - 140, cx + 120, cy + 140], fill=(250, 248, 244), outline=(30, 22, 20), width=16)


def eye(draw, cx, cy, spec, mirror):
    if spec['eye'] == 'closed':
        draw.arc([cx - 110, cy - 60, cx + 110, cy + 40], 20, 160, fill=(30, 22, 20), width=18)
        return
    if spec['eye'] == 'oval':
        oval_eye(draw, cx, cy)
        return
    w, h = 210, 230 if spec['eye'] == 'round' else 170
    top = cy - h // 2
    light, dark = spec['iris']
    for row in range(h):
        t = row / h
        span = w / 2 * (1 - abs(1 - 2 * t) ** 2.2) ** 0.5
        draw.line([(cx - span, top + row), (cx + span, top + row)], fill=lerp(dark, light, min(1, t * 1.4)))
    draw.ellipse([cx - 44, cy - 26, cx + 44, cy + 50], fill=(40, 22, 20))
    hx = cx - 26 if not mirror else cx + 26
    draw.ellipse([hx - 28, top + 24, hx + 28, top + 80], fill=(255, 255, 255))
    draw.ellipse([cx + (22 if not mirror else -22) - 9, cy + 30, cx + (22 if not mirror else -22) + 9, cy + 48], fill=(255, 255, 255))
    lash = [(cx - w / 2 - 14, top + 16), (cx - w / 4, top - 10), (cx + w / 4, top - 12), (cx + w / 2 + 16, top + 8)]
    if mirror:
        lash = [(2 * cx - x, y) for x, y in reversed(lash)]
    draw.line(lash, fill=(28, 18, 16), width=28, joint='curve')
    flick = (cx + w / 2 + 16, top + 8) if not mirror else (cx - w / 2 - 16, top + 8)
    tip = (flick[0] + (26 if not mirror else -26), flick[1] - 6)
    draw.line([flick, tip], fill=(28, 18, 16), width=14)
    draw.arc([cx - w / 2, top, cx + w / 2, top + h], 20, 160, fill=(28, 18, 16), width=6)


def face(name, spec):
    image = Image.new('RGB', (SIZE, SIZE), spec['skin'])
    draw = ImageDraw.Draw(image)
    cy = 560
    eye(draw, 318, cy, spec, False)
    eye(draw, 706, cy, spec, True)
    if spec['blush']:
        blush = Image.new('L', (SIZE, SIZE), 0)
        ImageDraw.Draw(blush).ellipse([180, cy + 110, 320, cy + 170], fill=150)
        ImageDraw.Draw(blush).ellipse([704, cy + 110, 844, cy + 170], fill=150)
        blush = blush.filter(ImageFilter.GaussianBlur(18))
        image = Image.composite(Image.new('RGB', image.size, (240, 150, 150)), image, blush)
        draw = ImageDraw.Draw(image)
    if spec['mouth'] == 'cat':
        draw.line([(472, cy + 150), (492, cy + 166), (512, cy + 150), (532, cy + 166), (552, cy + 150)], fill=(120, 50, 40), width=8, joint='curve')
    elif spec['mouth'] == 'dot':
        draw.ellipse([496, cy + 130, 528, cy + 150], fill=(200, 90, 110))
    elif spec['mouth'] == 'open':
        draw.chord([452, cy + 110, 572, cy + 200], 0, 180, fill=(236, 120, 150), outline=(30, 22, 20), width=10)
        draw.line([(452, cy + 155), (572, cy + 155)], fill=(30, 22, 20), width=10)
    elif spec['mouth'] == 'curve':
        draw.arc([482, cy + 120, 542, cy + 172], 20, 160, fill=(120, 50, 40), width=9)
    else:
        draw.chord([472, cy + 120, 552, cy + 180], 0, 180, fill=(170, 60, 60))
    image.save(OUT / f'plush-face-{name}.png')


if __name__ == '__main__':
    for key in sys.argv[1:] or FACES:
        face(key, FACES[key])
