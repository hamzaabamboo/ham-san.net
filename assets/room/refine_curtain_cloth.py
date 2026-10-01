import math
from pathlib import Path

import bpy


def refine_cloth():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Curtain refinement requires production source in Object mode')
    panels = [bpy.data.objects[name] for name in ('Balcony curtain left', 'Balcony curtain right')]
    if any(panel.get('curtainClothRefined') for panel in panels):
        raise RuntimeError('Curtain cloth already refined')
    result = []
    for side, panel in enumerate(panels):
        uv = panel.data.uv_layers.active
        coordinates = {loop.vertex_index: tuple(uv.data[loop.index].uv) for loop in panel.data.loops}
        for key in panel.data.shape_keys.key_blocks:
            for index, vertex in enumerate(key.data):
                u, v = coordinates[index]
                phase = math.tau * (9 * u + 0.13 * math.sin(math.tau * 2.3 * u + side))
                drift = 0.23 * math.sin(v * 3.6 + u * 5 + side) * (1 - v)
                amplitude = 0.025 * (0.82 + 0.22 * math.sin(u * 13 + side))
                header = math.exp(-((v - 0.97) / 0.045) ** 2)
                lower = math.exp(-(v / 0.09) ** 2)
                vertex.co.y = 1.79 + amplitude * math.sin(phase + drift) + 0.004 * header * math.sin(phase * 2) - lower * (0.015 + 0.014 * math.sin(u * 9 + side) ** 2)
                vertex.co.z = max(0.006, vertex.co.z + lower * 0.012 * math.sin(u * 14 + side) ** 2)
        for vertex, basis in zip(panel.data.vertices, panel.data.shape_keys.key_blocks['Basis'].data):
            vertex.co = basis.co
        panel.data.update()
        panel['curtainClothRefined'] = True
        result.append({'name': panel.name, 'vertices': len(panel.data.vertices)})
    bpy.context.view_layer.update()
    return {'panels': result}


result = refine_cloth()
