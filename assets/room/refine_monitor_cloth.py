from pathlib import Path

import bpy


def refine_cloth():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Monitor cloth requires production source in Object mode')
    obj = bpy.data.objects['Monitor riser top']
    if obj.get('speakerClothRefined'):
        raise RuntimeError('Monitor cloth already refined')
    original = obj.data
    original.use_fake_user = True
    obj.data = original.copy()
    material = bpy.data.materials.new('Monitor broad unit woven cloth')
    material.use_nodes = True
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value = 0.9
    shader.inputs['Metallic'].default_value = 0
    image = material.node_tree.nodes.new('ShaderNodeTexImage')
    image.image = bpy.data.images.load(str(Path(bpy.data.filepath).parent / 'speaker-cloth-weave.png'), check_existing=True)
    image.extension = 'REPEAT'
    material.node_tree.links.new(image.outputs['Color'], shader.inputs['Base Color'])
    obj.data.materials.clear()
    obj.data.materials.append(material)
    uv = obj.data.uv_layers.active
    for face in obj.data.polygons:
        normal = face.normal
        axes = [i for i in range(3) if i != max(range(3), key=lambda i: abs(normal[i]))]
        for index in face.loop_indices:
            point = obj.matrix_world @ obj.data.vertices[obj.data.loops[index].vertex_index].co
            uv.data[index].uv = (point[axes[0]] / 0.05, point[axes[1]] / 0.05)
    obj['speakerClothRefined'] = True
    obj['clothOriginalMesh'] = original.name
    return {'object': obj.name, 'material': material.name, 'texture_tile_m': 0.05}


result = refine_cloth()
