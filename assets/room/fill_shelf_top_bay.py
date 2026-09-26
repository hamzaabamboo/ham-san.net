import bpy

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']
materials = {name: bpy.data.materials[name] for name in [
    'Book blue',
    'Cube green',
    'Cube orange',
    'Cube red',
    'Cube yellow',
    'Illustrated paper book spines',
    'Paper',
]}

if bpy.data.objects.get('Shelf top bay book 001'):
    raise RuntimeError('Shelf top bay fill already applied')


def box(name, location, dimensions, material, bevel=0.004):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj['roomDecorative'] = True
    modifier = obj.modifiers.new('Shelf top softened edge', 'BEVEL')
    modifier.width = bevel
    modifier.segments = 3
    obj.modifiers.new('Shelf top weighted normals', 'WEIGHTED_NORMAL')
    return obj


specs = [
    (0.27, 0.24, 0.18, 0.27, 0.046, 'Cube orange', -0.01),
    (0.35, 0.23, 0.18, 0.30, 0.039, 'Book blue', 0.01),
    (0.74, 0.22, 0.18, 0.29, 0.045, 'Cube green', -0.015),
    (0.82, 0.25, 0.18, 0.26, 0.04, 'Cube red', 0.01),
    (1.62, 0.22, 0.18, 0.28, 0.046, 'Cube yellow', -0.01),
    (1.70, 0.25, 0.18, 0.29, 0.037, 'Illustrated paper book spines', 0.015),
]

for index, (y, z, width, height, depth, material, tilt) in enumerate(specs, 1):
    spine = box(f'Shelf top bay book {index:03d}', (3.49, y, 1.22 + height / 2), (depth, width, height), materials[material], 0.006)
    spine.rotation_euler[2] = tilt
    box(f'Shelf top bay book {index:03d} top', (3.49, y, 1.22 + height - 0.006), (depth + 0.008, width + 0.008, 0.008), materials['Paper'], 0.002)
    box(f'Shelf top bay book {index:03d} band', (3.398, y, 1.22 + height * 0.30), (0.006, width * 0.7, 0.012), materials['Paper'], 0.001)

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'top_bay_books': len(specs)})
