import math
from pathlib import Path

import bpy


def refine_drape():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Curtain drape requires production source in Object mode')
    panels = [bpy.data.objects[name] for name in ('Balcony curtain left', 'Balcony curtain right')]
    if any(panel.get('curtainDrapeRefined') for panel in panels):
        raise RuntimeError('Curtain drape already refined')
    result = []
    for side, panel in enumerate(panels):
        backup = panel.data.copy()
        backup.name = f'{panel.data.name} before drape'
        backup.use_fake_user = True
        uv = panel.data.uv_layers.active
        coordinates = {loop.vertex_index: tuple(uv.data[loop.index].uv) for loop in panel.data.loops}
        for key in panel.data.shape_keys.key_blocks:
            for index, vertex in enumerate(key.data):
                u, v = coordinates[index]
                taper = math.sin(math.pi * u)
                sag = (1 - v) ** 2
                lower = math.exp(-(v / 0.14) ** 2)
                vertex.co.x += taper * (0.024 * sag * math.sin(u * 7 + side) + 0.022 * lower * math.sin(u * 11 + side))
                phase = math.tau * (9 * u + 0.13 * math.sin(math.tau * 2.3 * u + side))
                drift = 0.85 * sag * math.sin(u * 8 + side) + 0.6 * lower * math.sin(u * 13 + side)
                amplitude = 0.025 * (0.82 + 0.22 * math.sin(u * 13 + side))
                header = math.exp(-((v - 0.97) / 0.045) ** 2)
                vertex.co.y = 1.79 + amplitude * (1 + 0.35 * lower) * math.sin(phase + drift) + 0.004 * header * math.sin(phase * 2) - lower * (0.035 + 0.028 * math.sin(u * 9 + side) ** 2)
        for vertex, basis in zip(panel.data.vertices, panel.data.shape_keys.key_blocks['Basis'].data):
            vertex.co = basis.co
        panel.data.update()
        panel['curtainDrapeRefined'] = True
        panel['curtainDrapeBackup'] = backup.name
        result.append({'name': panel.name, 'backup': backup.name})
    bpy.context.view_layer.update()
    return {'panels': result}


result = refine_drape()
