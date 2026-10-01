from pathlib import Path

import bpy


def refine_fabric():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Beanbag fabric requires production source in Object mode')
    bag = bpy.data.objects['Beanbag']
    if bag.get('fabricRefined'):
        raise RuntimeError('Beanbag fabric already refined')
    original = bag.data.materials[0]
    original.use_fake_user = True
    material = original.copy()
    material.name = 'Beanbag pale cream canvas'
    material.node_tree.nodes['SeamMix'].inputs['Color1'].default_value = (0.65, 0.62, 0.56, 1)
    material.node_tree.nodes['SeamMix'].inputs[0].default_value = 0.2
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value = 0.95
    shader.inputs['Specular IOR Level'].default_value = 0.2
    bag.data.materials[0] = material
    bag['fabricOriginalMaterial'] = original.name
    seam_material = bpy.data.materials['Beanbag seam'].copy()
    seam_material.name = 'Beanbag subtle cream seam'
    shader = seam_material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (0.56, 0.53, 0.48, 1)
    shader.inputs['Roughness'].default_value = 0.95
    shader.inputs['Specular IOR Level'].default_value = 0.2
    seams = [o for o in bpy.data.objects if o.name.startswith('Beanbag seam')]
    for seam in seams:
        seam['fabricOriginalRadius'] = seam.data.bevel_depth
        seam['fabricOriginalMaterial'] = seam.data.materials[0].name
        seam.data.bevel_depth = 0.0007
        seam.data.materials[0] = seam_material
    bag['fabricRefined'] = True
    bpy.context.view_layer.update()
    return {'beanbag': bag.name, 'seams': len(seams), 'seam_radius_m': 0.0007}


result = refine_fabric()
