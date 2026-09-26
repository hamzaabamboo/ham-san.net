import bpy
from mathutils import Matrix, Vector

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']
materials = {name: bpy.data.materials[name] for name in [
    'Book blue',
    'Cube blue',
    'Cube green',
    'Cube orange',
    'Cube red',
    'Cube yellow',
    'Illustrated paper book spines',
    'Paper',
]}

if bpy.data.objects.get('Shelf upper book 001'):
    raise RuntimeError('Shelf bay fill already applied')


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
    modifier = obj.modifiers.new('Shelf upper softened edge', 'BEVEL')
    modifier.width = bevel
    modifier.segments = 3
    obj.modifiers.new('Shelf upper weighted normals', 'WEIGHTED_NORMAL')
    return obj


def book(index, y, z, width, height, depth, material, tilt):
    spine = box(f'Shelf upper book {index:03d}', (3.49, y, z + height / 2), (depth, width, height), material, 0.006)
    spine.rotation_euler[2] = tilt
    box(f'Shelf upper book {index:03d} top', (3.49, y, z + height - 0.006), (depth + 0.008, width + 0.008, 0.008), materials['Paper'], 0.002)
    box(f'Shelf upper book {index:03d} band', (3.398, y, z + height * 0.30), (0.006, width * 0.7, 0.012), materials['Paper'], 0.001)


specs = [
    (0.28, 0.53, 0.19, 0.27, 0.045, 'Cube orange', -0.01),
    (0.36, 0.53, 0.18, 0.31, 0.038, 'Book blue', 0.01),
    (0.44, 0.53, 0.19, 0.28, 0.05, 'Cube green', -0.015),
    (0.52, 0.53, 0.16, 0.29, 0.04, 'Cube red', 0.01),
    (0.60, 0.53, 0.18, 0.25, 0.05, 'Illustrated paper book spines', -0.01),
    (0.68, 0.53, 0.17, 0.30, 0.036, 'Cube yellow', 0.015),
    (0.32, 0.87, 0.18, 0.26, 0.044, 'Cube blue', -0.01),
    (0.40, 0.87, 0.17, 0.31, 0.039, 'Cube orange', 0.01),
    (0.48, 0.87, 0.19, 0.28, 0.047, 'Cube red', -0.015),
    (0.56, 0.87, 0.18, 0.30, 0.04, 'Book blue', 0.01),
    (0.64, 0.87, 0.16, 0.26, 0.05, 'Cube green', -0.01),
    (0.72, 0.87, 0.18, 0.29, 0.037, 'Illustrated paper book spines', 0.015),
]

for index, (y, z, width, height, depth, material, tilt) in enumerate(specs, 1):
    book(index, y, z, width, height, depth, materials[material], tilt)

originals = [bpy.data.objects[name] for name in ['Figure plinth', 'Figure head', 'Figure torso']]
origin = originals[0].matrix_world.translation.copy()
delta = Vector((3.43, 0.56, 0.535)) - origin
for original in originals:
    duplicate = original.copy()
    duplicate.data = original.data
    duplicate.name = f'Shelf upper figure {original.name.removeprefix("Figure ")}'
    duplicate.parent = None
    source.objects.link(duplicate)
    duplicate.matrix_world = Matrix.Translation(delta) @ original.matrix_world
    duplicate.pop('roomTarget', None)
    duplicate['roomDecorative'] = True

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'upper_books': len(specs), 'upper_figure': True})
