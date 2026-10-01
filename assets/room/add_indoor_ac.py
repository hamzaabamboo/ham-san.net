from pathlib import Path

import bpy


def add_ac():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Indoor AC requires production source in Object mode')
    if bpy.data.objects.get('Indoor AC lower band'):
        raise RuntimeError('Indoor AC already exists')
    collection = bpy.data.objects['Monitor bezel'].users_collection[0]
    white = bpy.data.materials.new('Indoor AC ivory plastic')
    white.diffuse_color = (0.78, 0.79, 0.76, 1)
    white.use_nodes = True
    shader = white.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = white.diffuse_color
    shader.inputs['Roughness'].default_value = 0.27
    gray = bpy.data.materials.new('Indoor AC lower silver band')
    gray.diffuse_color = (0.35, 0.38, 0.37, 1)
    gray.use_nodes = True
    shader = gray.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = gray.diffuse_color
    shader.inputs['Roughness'].default_value = 0.36
    parts = []

    def box(name, location, dimensions, material, radius):
        bpy.ops.mesh.primitive_cube_add(size=1, location=location)
        obj = bpy.context.object
        obj.name = name
        obj.dimensions = dimensions
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        for current in list(obj.users_collection):
            current.objects.unlink(obj)
        collection.objects.link(obj)
        obj.data.materials.append(material)
        bevel = obj.modifiers.new('Moulded edge', 'BEVEL')
        bevel.width = radius
        bevel.segments = 4
        obj.modifiers.new('Surface normals', 'WEIGHTED_NORMAL')
        obj['indoorACPhotoReference'] = 'PXL_20260908_033239504.jpg'
        obj['dimensionsEstimated'] = True
        parts.append(obj.name)
        return obj

    box('Indoor AC lower band', (-1.559, 1.05, 2.052), (0.008, 0.74, 0.022), gray, 0.003)
    box('Indoor AC sensor', (-1.553, 1.05, 2.052), (0.006, 0.045, 0.013), bpy.data.materials['Black steel'], 0.002)
    bpy.context.view_layer.update()
    return {'parts': parts, 'estimated_dimensions': True}


result = add_ac()
