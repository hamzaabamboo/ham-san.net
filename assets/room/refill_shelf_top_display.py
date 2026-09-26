import bpy

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']
materials = {name: bpy.data.materials[name] for name in [
    'Book blue',
    'Cube green',
    'Cube orange',
    'Cube red',
    'Cube yellow',
]}

for obj in list(bpy.data.objects):
    if obj.name.startswith('Shelf display volume'):
        bpy.data.objects.remove(obj, do_unlink=True)


def box(name, location, dimensions, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    modifier = obj.modifiers.new('Shelf display softened edge', 'BEVEL')
    modifier.width = 0.006
    modifier.segments = 3
    obj.modifiers.new('Shelf display weighted normals', 'WEIGHTED_NORMAL')
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj['roomDecorative'] = True
    return obj


specs = [
    (0.27, 0.18, 0.28, 0.046, 'Cube orange', -0.01),
    (0.35, 0.18, 0.30, 0.039, 'Book blue', 0.01),
    (0.74, 0.18, 0.29, 0.045, 'Cube green', -0.015),
    (0.82, 0.18, 0.26, 0.04, 'Cube red', 0.01),
    (1.62, 0.18, 0.28, 0.046, 'Cube yellow', -0.01),
    (1.70, 0.18, 0.29, 0.037, 'Book blue', 0.015),
]

for index, (y, width, height, depth, material, tilt) in enumerate(specs, 1):
    book = box(f'Shelf display volume {index:03d}', (3.49, y, 1.22 + height / 2), (depth, width, height), materials[material])
    book.rotation_euler[2] = tilt

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'restored_top_display_volumes': len(specs)})
