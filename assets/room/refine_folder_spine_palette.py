from pathlib import Path

import bpy


def refine_spines():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Folder spines require production source in Object mode')
    original = bpy.data.materials['Spines folders']
    if bpy.data.materials.get('Reference pale folder spines'):
        raise RuntimeError('Folder spine palette already refined')
    image_path = Path(bpy.data.filepath).parent / 'textures' / 'folder-spines-pale.png'
    image = bpy.data.images.load(str(image_path), check_existing=True)
    image.pack()
    material = original.copy()
    material.name = 'Reference pale folder spines'
    material.node_tree.nodes['Image Texture'].image = image
    material.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.86
    original.use_fake_user = True
    changed = []
    for obj in bpy.data.objects:
        if obj.type != 'MESH' or obj.hide_render:
            continue
        for index, slot in enumerate(obj.data.materials):
            if slot == original:
                obj.data.materials[index] = material
                obj['folderSpinePaletteRefined'] = True
                obj['folderSpineOriginalMaterial'] = original.name
                changed.append(obj.name)
    bpy.context.view_layer.update()
    return {'objects': changed, 'atlas': str(image_path), 'geometry_unchanged': True}


result = refine_spines()
