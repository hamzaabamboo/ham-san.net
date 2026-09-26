import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

TEX = Path(__file__).resolve().parent / 'textures'
rng = random.Random(20260926)


def cut_figure(atlas, idx):
    c = atlas.width // 4
    cell = atlas.crop(((idx % 4) * c, (idx // 4) * c, (idx % 4 + 1) * c, (idx // 4 + 1) * c)).convert('RGB')
    w, h = cell.size
    px = cell.load()
    bg = [[False] * w for _ in range(h)]
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or bg[y][x] or min(px[x, y]) < 236:
            continue
        bg[y][x] = True
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    seen = [[False] * w for _ in range(h)]
    best = []
    for sy in range(h):
        for sx in range(w):
            if bg[sy][sx] or seen[sy][sx]:
                continue
            comp, stack = [], [(sx, sy)]
            while stack:
                x, y = stack.pop()
                if x < 0 or y < 0 or x >= w or y >= h or bg[y][x] or seen[y][x]:
                    continue
                seen[y][x] = True
                comp.append((x, y))
                stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
            if len(comp) > len(best):
                best = comp
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    op = out.load()
    for x, y in best:
        op[x, y] = (*px[x, y], 255)
    alpha = out.getchannel('A').filter(ImageFilter.GaussianBlur(0.7))
    out.putalpha(alpha)
    return out.crop(out.getbbox())


def group_poster():
    W, H = 1400, 1750
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line((0, y, W, y), fill=(int(150 + 90 * t), int(200 + 40 * t), int(245 - 10 * t)))
    for _ in range(14):
        cx, cy, r = rng.uniform(0, W), rng.uniform(0, H * 0.55), rng.uniform(60, 150)
        for k in range(5):
            d.ellipse((cx - r + k * r * 0.35 - r, cy - r * 0.5, cx + k * r * 0.35, cy + r * 0.5), fill=(245, 248, 252))
    im = im.filter(ImageFilter.GaussianBlur(6))
    d = ImageDraw.Draw(im)
    candy = [(250, 170, 190), (255, 214, 120), (190, 160, 240), (150, 220, 200), (255, 150, 120)]
    for _ in range(46):
        cx, cy, r = rng.uniform(0, W), rng.uniform(H * 0.62, H * 0.98), rng.uniform(20, 70)
        col = rng.choice(candy)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
        d.arc((cx - r * 0.6, cy - r * 0.6, cx + r * 0.6, cy + r * 0.6), 200, 300, fill=(255, 255, 255), width=6)
    atlas = Image.open(TEX / 'acrylic-insert-minimal-atlas.png')
    slots = [(1, 250, 260, 520), (10, 700, 230, 540), (14, 1150, 280, 520), (0, 420, 700, 560),
             (6, 980, 690, 560), (13, 200, 1080, 560), (9, 700, 1030, 600)]
    for idx, cx, top, h in slots:
        fig = cut_figure(atlas, idx)
        w = int(fig.width * h / fig.height)
        fig = fig.resize((w, h), Image.LANCZOS)
        im.paste(fig, (int(cx - w / 2), int(top)), fig)
    d = ImageDraw.Draw(im)
    d.rectangle((0, H - 150, W, H), fill=(248, 250, 252))
    for i, (idx, bgc) in enumerate(((3, (250, 214, 226)), (8, (214, 230, 250)), (15, (250, 236, 200)))):
        x0 = 120 + i * 420
        d.rectangle((x0, H - 125, x0 + 330, H - 30), fill=bgc, outline=(120, 170, 225), width=6)
        th = cut_figure(atlas, idx)
        hh = 85
        ww = int(th.width * hh / th.height)
        th = th.resize((ww, hh), Image.LANCZOS)
        for j in range(3):
            im.paste(th, (x0 + 25 + j * 100, H - 120), th)
    return im.filter(ImageFilter.UnsharpMask(2, 80, 2))


def scribble(d, x, y, w, col, h=18):
    pts = []
    t = 0.0
    loop = rng.uniform(0.9, 1.4)
    while True:
        px = x + t * h * 0.55 + h * 0.28 * math.cos(t * 2.2)
        if px > x + w:
            break
        amp = h * (0.35 + 0.25 * math.sin(t * 0.7 + rng.random()))
        pts.append((px, y - amp * math.sin(t * 2.2 * loop)))
        t += 0.22
        if rng.random() < 0.035:
            if len(pts) > 1:
                d.line(pts, fill=col, width=3, joint='curve')
            pts = []
            t += 1.2
    if len(pts) > 1:
        d.line(pts, fill=col, width=3, joint='curve')


def heart(d, cx, cy, s, col):
    pts = [(cx + s * 10 * math.sin(t) ** 3, cy - s * 10 * (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)) / 16)
           for t in [i * 2 * math.pi / 60 for i in range(61)]]
    d.line(pts, fill=col, width=4)


def form_sheet():
    W, H = 1100, 1500
    im = Image.new('RGB', (W, H), (247, 245, 240))
    d = ImageDraw.Draw(im)
    red = (214, 96, 96)
    d.rectangle((90, 110, W - 90, H - 140), outline=red, width=5)
    y = 180
    for rows in (6, 1, 5, 1, 4):
        for r in range(rows):
            d.line((90, y, W - 90, y), fill=red, width=2)
            for xs in (250, 560, 760):
                d.line((xs, y, xs, y + 70), fill=red, width=2)
            if rng.random() < 0.8:
                scribble(d, rng.uniform(270, 320), y + 35, rng.uniform(120, 240), (60, 60, 70))
            if rng.random() < 0.6:
                scribble(d, rng.uniform(580, 620), y + 35, rng.uniform(80, 160), (60, 60, 70))
            y += 70
        y += 30
    for k in range(4):
        scribble(d, 160, H - 330 + k * 40, rng.uniform(300, 700), (70, 60, 80))
    heart(d, 850, H - 280, 3.2, (220, 90, 120))
    heart(d, 910, H - 330, 2.2, (220, 90, 120))
    d.ellipse((700, H - 310, 780, H - 230), outline=(70, 60, 80), width=4)
    d.ellipse((690, H - 350, 720, H - 300), outline=(70, 60, 80), width=4)
    d.ellipse((760, H - 350, 790, H - 300), outline=(70, 60, 80), width=4)
    return im.filter(ImageFilter.GaussianBlur(0.6))


def message_sheet():
    W, H = 1100, 1600
    im = Image.new('RGB', (W, H), (250, 250, 248))
    d = ImageDraw.Draw(im)
    inks = [(40, 40, 50), (50, 60, 110), (170, 60, 90), (40, 90, 70), (120, 60, 150)]
    y = 60
    while y < H - 260:
        col = rng.choice(inks)
        x = rng.uniform(40, 420)
        tilt = rng.uniform(-8, 8)
        for k in range(rng.randint(1, 3)):
            ln = rng.uniform(180, W - x - 60)
            scribble(d, x + rng.uniform(-20, 20), y + k * 38 + tilt, ln, col, rng.uniform(13, 20))
        if rng.random() < 0.35:
            heart(d, rng.uniform(80, W - 80), y + rng.uniform(0, 50), rng.uniform(2.0, 5.0), col)
        y += rng.uniform(90, 160)
    for _ in range(3):
        cx, cy = rng.uniform(150, W - 150), rng.uniform(H - 240, H - 90)
        d.ellipse((cx - 60, cy - 50, cx + 60, cy + 50), outline=(40, 40, 50), width=5)
        d.ellipse((cx - 50, cy - 110, cx - 20, cy - 40), outline=(40, 40, 50), width=5)
        d.ellipse((cx + 20, cy - 110, cx + 50, cy - 40), outline=(40, 40, 50), width=5)
    heart(d, W * 0.5, H - 150, 7.0, (200, 60, 100))
    return im.filter(ImageFilter.GaussianBlur(0.6))


group_poster().save(TEX / 'desk-group-poster-minimal.png')
form_sheet().save(TEX / 'desk-form-sheet.png')
message_sheet().save(TEX / 'desk-message-sheet.png')
print({'written': ['desk-group-poster-minimal.png', 'desk-form-sheet.png', 'desk-message-sheet.png']})


def form_landscape():
    W, H = 1500, 1070
    im = Image.new('RGB', (W, H), (247, 245, 240))
    d = ImageDraw.Draw(im)
    red = (214, 96, 96)
    d.rectangle((70, 90, W - 70, H - 90), outline=red, width=5)
    y = 150
    for _ in range(9):
        d.line((70, y, W - 70, y), fill=red, width=2)
        for xs in (300, 700, 1000, 1250):
            d.line((xs, y, xs, y + 80), fill=red, width=2)
        if rng.random() < 0.8:
            scribble(d, rng.uniform(320, 360), y + 42, rng.uniform(150, 300), (60, 60, 70))
        if rng.random() < 0.6:
            scribble(d, rng.uniform(720, 760), y + 42, rng.uniform(100, 220), (60, 60, 70))
        y += 85
    for k in range(2):
        scribble(d, 120, H - 180 + k * 40, rng.uniform(500, 800), (70, 60, 80))
    heart(d, 1250, H - 230, 3.0, (220, 90, 120))
    heart(d, 1310, H - 270, 2.0, (220, 90, 120))
    d.ellipse((1080, H - 270, 1160, H - 200), outline=(70, 60, 80), width=4)
    d.ellipse((1080, H - 320, 1105, H - 265), outline=(70, 60, 80), width=4)
    d.ellipse((1135, H - 320, 1160, H - 265), outline=(70, 60, 80), width=4)
    return im.filter(ImageFilter.GaussianBlur(0.6))


def chalk_mat():
    im = Image.new('RGB', (1024, 768), (22, 22, 24))
    d = ImageDraw.Draw(im)
    for _ in range(10):
        scribble(d, rng.uniform(40, 700), rng.uniform(60, 700), rng.uniform(120, 300), (225, 225, 220), 16)
    for _ in range(6):
        heart(d, rng.uniform(80, 940), rng.uniform(80, 690), rng.uniform(2.5, 4.5), (230, 230, 226))
    d.ellipse((650, 300, 800, 440), outline=(230, 230, 226), width=5)
    d.ellipse((660, 240, 700, 320), outline=(230, 230, 226), width=5)
    d.ellipse((750, 240, 790, 320), outline=(230, 230, 226), width=5)
    return im.filter(ImageFilter.GaussianBlur(0.8))


form_landscape().save(TEX / 'desk-form-sheet-landscape.png')
chalk_mat().save(TEX / 'desk-mat-chalk-doodles.png')
print({'written': ['desk-form-sheet-landscape.png', 'desk-mat-chalk-doodles.png']})


def shelf_wall_posters():
    atlas = Image.open(TEX / 'acrylic-insert-minimal-atlas.png')
    outs = []
    for k, (idx, bg, band) in enumerate(((0, (250, 214, 90), (236, 130, 50)), (2, (252, 196, 110), (220, 90, 60)), (11, (248, 226, 150), (236, 150, 60)))):
        W, H = 840, 1188
        im = Image.new('RGB', (W, H), bg)
        d = ImageDraw.Draw(im)
        for i in range(12):
            cx, cy = rng.uniform(0, W), rng.uniform(0, H * 0.7)
            d.ellipse((cx - 60, cy - 60, cx + 60, cy + 60), fill=tuple(min(255, c + 12) for c in bg))
        fig = cut_figure(atlas, idx)
        h = int(H * 0.72)
        w = int(fig.width * h / fig.height)
        fig = fig.resize((w, h), Image.LANCZOS)
        im.paste(fig, ((W - w) // 2, int(H * 0.08)), fig)
        d.rectangle((0, H - 190, W, H), fill=band)
        for j in range(3):
            d.rectangle((60, H - 160 + j * 45, 60 + rng.randint(300, 640), H - 140 + j * 45), fill=(255, 245, 230))
        name = f'shelf-wall-poster-{k + 1}.png'
        im.save(TEX / name)
        outs.append(name)
    return outs


print(shelf_wall_posters())


def entry_posters():
    atlas = Image.open(TEX / 'acrylic-insert-minimal-atlas.png')
    W, H = 840, 1188
    im = Image.new('RGB', (W, H), (252, 222, 70))
    d = ImageDraw.Draw(im)
    for i in range(10):
        cx, cy = rng.uniform(0, W), rng.uniform(0, H)
        d.ellipse((cx - 80, cy - 80, cx + 80, cy + 80), fill=(255, 234, 120))
    fig = cut_figure(atlas, 2)
    h = int(H * 0.8)
    w = int(fig.width * h / fig.height)
    fig = fig.resize((w, h), Image.LANCZOS)
    im.paste(fig, ((W - w) // 2, int(H * 0.06)), fig)
    d.rectangle((0, H - 130, W, H), fill=(255, 250, 235))
    d.rectangle((40, H - 100, 380, H - 80), fill=(236, 120, 60))
    im.save(TEX / 'entry-poster-yellow.png')
    W, H = 900, 1200
    im = Image.new('RGB', (W, H), (238, 214, 190))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line((0, y, W, y), fill=(int(240 - 30 * t), int(216 - 40 * t), int(190 - 50 * t)))
    fig = cut_figure(atlas, 7)
    h = int(H * 0.9)
    w = int(fig.width * h / fig.height)
    fig = fig.resize((w, h), Image.LANCZOS)
    im.paste(fig, ((W - w) // 2, int(H * 0.08)), fig)
    im.save(TEX / 'entry-portrait-panel.png')
    return ['entry-poster-yellow.png', 'entry-portrait-panel.png']


print(entry_posters())
