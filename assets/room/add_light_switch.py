import bpy

source = bpy.data.collections['RoomHome']
if bpy.data.objects.get('Room light switch plate'):
    raise RuntimeError('Room light switch already exists')


def material(name, color, roughness):
    existing = bpy.data.materials.get(name)
    if existing:
        return existing
    value = bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1)
    value.use_nodes = True
    shader = value.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    return value


plate_material = material('Light switch ceramic', (0.82, 0.83, 0.79), 0.36)
toggle_material = material('Light switch toggle', (0.08, 0.09, 0.09), 0.24)
steel = material('Light switch screw', (0.42, 0.44, 0.43), 0.25)


def cube(name, location, dimensions, surface, bevel):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(surface)
    obj['roomTarget'] = 'light'
    modifier = obj.modifiers.new('Rounded switch edges', 'BEVEL')
    modifier.width = bevel
    modifier.segments = 4
    obj.modifiers.new('Switch weighted normals', 'WEIGHTED_NORMAL')
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    return obj


plate = cube('Room light switch plate', (-1.86, -2.447, 1.24), (0.17, 0.022, 0.27), plate_material, 0.012)
toggle = cube('Room light switch toggle', (-1.86, -2.426, 1.24), (0.055, 0.018, 0.105), toggle_material, 0.008)
toggle.rotation_euler.x = 0.18

for index, x in enumerate((-1.91, -1.81)):
    screw = cube(f'Room light switch screw {index + 1}', (x, -2.425, 1.335), (0.012, 0.008, 0.012), steel, 0.004)
    screw.rotation_euler.y = 0.785

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Room light switch added beside the entry door')
