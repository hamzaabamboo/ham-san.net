import math
from pathlib import Path

import bpy


def refine_drape():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Tote drape requires production source in Object mode')
    obj = bpy.data.objects['Striped tote']
    if obj.get('toteDrapeRefined') or len(obj.data.vertices) != 816:
        raise RuntimeError('Unexpected tote mesh or refinement already applied')
    original = obj.data
    original.use_fake_user = True
    obj.data = original.copy()
    obj.data.name = 'Striped tote relaxed cloth'
    for vertex in obj.data.vertices:
        index = vertex.index % 408
        u = index % 24 / 23
        v = index // 24 / 16
        side = 1 if vertex.index < 408 else -1
        envelope = math.sin(math.pi * u)
        lower = (1 - v) ** 1.4
        vertex.co.x += 0.009 * lower * math.sin(v * 5 + u * 3) - (u - 0.5) * 0.018 * lower
        vertex.co.y += 0.008 * envelope * math.sin(u * math.tau * 4 + v * 5) * (0.25 + 0.75 * lower)
        vertex.co.z += 0.010 * lower * math.sin(u * 7 + 0.4)
        mouth = math.exp(-((u - 0.5) / 0.19) ** 2)
        vertex.co.y -= side * 0.018 * v ** 7 * mouth
        vertex.co.z -= 0.027 * v ** 8 * mouth
    obj.data.update()
    obj['toteDrapeRefined'] = True
    obj['toteDrapeOriginalMesh'] = original.name
    bpy.context.view_layer.update()
    return {'vertices': len(obj.data.vertices), 'zero_area': sum(p.area < 1e-12 for p in obj.data.polygons)}


result = refine_drape()
