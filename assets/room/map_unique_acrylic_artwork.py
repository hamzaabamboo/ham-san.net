import bpy
import json
import numpy as np
from collections import deque
from pathlib import Path

root = Path(bpy.data.filepath).resolve().parents[2]
artwork = []
diagnostics = []

for key in 'abcd':
    image = bpy.data.images['acrylic-unique-' + key + '.png']
    width, height = image.size
    pixels = np.empty(len(image.pixels), dtype=np.float32)
    image.pixels.foreach_get(pixels)
    pixels = pixels.reshape(height, width, 4)[::-1]
    mask = pixels[:, :, 3] > 0.5 if pixels[:, :, 3].min() < 0.5 else pixels[:, :, :3].min(axis=2) < 0.95
    remaining = mask.copy()
    components = []
    for y, x in np.argwhere(mask):
        if not remaining[y, x]:
            continue
        remaining[y, x] = False
        queue = deque([(int(x), int(y))])
        count = 0
        lo_x = hi_x = int(x)
        lo_y = hi_y = int(y)
        while queue:
            px, py = queue.popleft()
            count += 1
            lo_x, hi_x = min(lo_x, px), max(hi_x, px)
            lo_y, hi_y = min(lo_y, py), max(hi_y, py)
            for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                if 0 <= nx < width and 0 <= ny < height and remaining[ny, nx]:
                    remaining[ny, nx] = False
                    queue.append((nx, ny))
        if count > 1500 and hi_y - lo_y > height * 0.15:
            components.append({'bounds': [lo_x, lo_y, hi_x + 1, hi_y + 1], 'pixels': count})
    components.sort(key=lambda c: (round(((c['bounds'][1] + c['bounds'][3]) * 0.5 - height * 0.125) / (height * 0.25)), c['bounds'][0]))
    diagnostics.append({'image': image.name, 'components': len(components), 'sizes': [c['pixels'] for c in components]})
    for index, component in enumerate(components):
        artwork.append({'id': f'{key}-{index + 1:02d}', 'image': image.name, **component})

path = root / 'assets/room/textures/acrylic-unique-map.json'
path.write_text(json.dumps({'artwork': artwork, 'diagnostics': diagnostics}, indent=2) + '\n')
result = {'path': str(path), 'artwork_count': len(artwork), 'diagnostics': diagnostics}
