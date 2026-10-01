from math import exp
from pathlib import Path

import bpy


def refine_folds():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Beanbag folds require production source in Object mode')
    bag = bpy.data.objects['Beanbag']
    if bag.get('foldsRefined'):
        raise RuntimeError('Beanbag folds already refined')
    original = bag.data
    original.use_fake_user = True
    bag.data = original.copy()
    bag.data.name = 'Beanbag gathered fabric'
    bag['foldsOriginalMesh'] = original.name
    folds = [(-0.23, 0.011), (-0.16, 0.009), (-0.085, 0.014), (-0.02, 0.008), (0.05, 0.006)]
    for vertex in bag.data.vertices:
        x, y, z = vertex.co
        height = z + bag.matrix_world.translation.z
        upper = max(0, min(1, (height - 0.30) / 0.13))
        patch = exp(-((x - 0.10) / 0.28) ** 4)
        for offset, depth in folds:
            distance = y + 0.38 * x - offset - 0.09 * x * x
            groove = exp(-(distance / 0.014) ** 2)
            shoulder = exp(-((distance - 0.024) / 0.025) ** 2)
            vertex.co.z += upper * patch * depth * (0.45 * shoulder - groove)
    bag.data.update()
    bag['foldsRefined'] = True
    bpy.context.view_layer.update()
    return {'beanbag': bag.name, 'fold_paths': len(folds), 'dimensions_estimated': True}


result = refine_folds()
