from pathlib import Path

import bpy


def refine_bezel():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Monitor refinement requires production source in Object mode')
    obj = bpy.data.objects['Monitor screen image']
    if obj.get('thinBezelRefined') or len(obj.data.vertices) != 4:
        raise RuntimeError('Unexpected monitor screen or refinement already applied')
    original = obj.data
    original.use_fake_user = True
    obj.data = original.copy()
    obj.data.name = 'Monitor asymmetric bezel screen'
    for vertex in obj.data.vertices:
        vertex.co.y = 0.528 if vertex.co.y < 0.84 else 1.152
        vertex.co.z = 0.980 if vertex.co.z < 1.15 else 1.331
    obj.data.update()
    obj['thinBezelRefined'] = True
    obj['bezelOriginalMesh'] = original.name
    bpy.context.view_layer.update()
    return {'side_margin_m': 0.008, 'top_margin_m': 0.008, 'bottom_margin_m': 0.021}


result = refine_bezel()
