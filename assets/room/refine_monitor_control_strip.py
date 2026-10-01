from pathlib import Path

import bpy


def refine_strip():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Control strip refinement requires production source in Object mode')
    obj = bpy.data.objects['Monitor soundbar']
    if obj.get('compactControlStripRefined'):
        raise RuntimeError('Control strip already refined')
    original = obj.data
    original.use_fake_user = True
    obj.data = original.copy()
    obj.data.name = 'Monitor compact control strip'
    for vertex in obj.data.vertices:
        vertex.co.x = -1.600 + (vertex.co.x + 1.585) * (0.048 / 0.070)
        vertex.co.y = 0.84 + (vertex.co.y - 0.84) / 3
        vertex.co.z = 0.859 + (vertex.co.z - 0.849) * (0.018 / 0.058)
    obj.data.update()
    obj['compactControlStripRefined'] = True
    obj['controlStripOriginalMesh'] = original.name
    obj['dimensionsEstimated'] = True
    bpy.context.view_layer.update()
    return {'dimensions_m': [0.048, 0.18, 0.018], 'identity_unconfirmed': True}


result = refine_strip()
