from math import exp, sin
from pathlib import Path

import bpy


def refine_drape():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Beanbag drape requires production source in Object mode')
    bag = bpy.data.objects['Beanbag']
    if bag.get('drapeRefined'):
        raise RuntimeError('Beanbag drape already refined')
    original = bag.data
    original.use_fake_user = True
    bag.data = original.copy()
    bag.data.name = 'Beanbag compressed drape'
    bag['drapeOriginalMesh'] = original.name
    for vertex in bag.data.vertices:
        x, y, z = vertex.co
        height = z + bag.matrix_world.translation.z
        upper = max(0, min(1, (height - 0.28) / 0.15))
        center = exp(-((x / 0.24) ** 2 + (y / 0.22) ** 2))
        vertex.co.z += 0.11 * center * upper
        front = max(0, min(1, (-y - 0.08) / 0.24))
        crease = exp(-((height - 0.23 - 0.025 * x) / 0.026) ** 2)
        vertex.co.y += 0.045 * front * crease
        vertex.co.z -= 0.009 * front * crease
        folds = exp(-((height - 0.43) / 0.13) ** 2) * front
        vertex.co.z += 0.006 * folds * sin(49 * x + 16 * y)
    bag.data.update()
    for seam in bpy.data.objects:
        if seam.name.startswith('Beanbag seam'):
            seam['drapePreviousRenderHidden'] = seam.hide_render
            seam.hide_render = True
            seam.hide_set(True)
    bag['drapeRefined'] = True
    bag['dimensionsEstimated'] = True
    bpy.context.view_layer.update()
    return {'beanbag': bag.name, 'vertices': len(bag.data.vertices), 'radial_seams_hidden': True}


result = refine_drape()
