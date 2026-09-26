import bpy
from mathutils import Matrix, Vector

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']

if bpy.data.objects.get('Shelf density book 001'):
    raise RuntimeError('Shelf density already applied')

materials = {name: bpy.data.materials[name] for name in [
    'Book blue',
    'Cube blue',
    'Cube green',
    'Cube orange',
    'Cube red',
    'Cube white',
    'Cube yellow',
    'Display acrylic',
    'Graphite',
    'Illustrated paper book spines',
    'Paper',
    'Plush cream',
]}


def finish(obj, name, material, bevel=0.004):
    obj.name = name
    if material:
        obj.data.materials.append(material)
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj['roomDecorative'] = True
    if bevel and obj.type == 'MESH':
        modifier = obj.modifiers.new('Shelf softened edge', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 3
        obj.modifiers.new('Shelf weighted normals', 'WEIGHTED_NORMAL')
    return obj


def box(name, location, dimensions, material, bevel=0.004):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.scale = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, material, bevel)


def cylinder(name, location, radius, depth, material):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth, location=location)
    return finish(bpy.context.object, name, material, 0.002)


def book(index, y, z, width, height, depth, material, tilt=0.0):
    spine = box(f'Shelf density book {index:03d}', (3.49, y, z + height / 2), (depth, width, height), material, 0.006)
    spine.rotation_euler[2] = tilt
    box(f'Shelf density book {index:03d} top', (3.49, y, z + height - 0.006), (depth + 0.008, width + 0.008, 0.008), materials['Paper'], 0.002)
    box(f'Shelf density book {index:03d} band', (3.398, y, z + height * 0.28), (0.006, width * 0.7, 0.012), materials['Cube white'], 0.001)


def magazine_stack(index, y, z, width=0.21):
    colors = [materials['Cube red'], materials['Cube blue'], materials['Cube yellow']]
    for layer, material in enumerate(colors):
        thickness = 0.019
        box(f'Shelf density magazine {index:03d} {layer}', (3.46, y + layer * 0.006, z + thickness / 2 + layer * thickness), (0.18, width, thickness), material, 0.003)
        box(f'Shelf density magazine {index:03d} {layer} edge', (3.366, y + layer * 0.006, z + thickness / 2 + layer * thickness), (0.006, width * 0.72, thickness * 0.56), materials['Paper'], 0.001)


def duplicate_contour(index, original, target, scale=0.82):
    original_root = bpy.data.objects[original]
    duplicate_root = bpy.data.objects.new(f'Shelf density acrylic {index:03d}', None)
    source.objects.link(duplicate_root)
    duplicate_root.matrix_world = original_root.matrix_world.copy()
    duplicate_root.matrix_world.translation = Vector(target)
    duplicate_root.scale = (scale, scale, scale)
    duplicate_root['roomDecorative'] = True
    local_root = original_root.matrix_world.inverted()
    for child in original_root.children:
        if child.type not in {'MESH', 'CURVE'}:
            continue
        duplicate = child.copy()
        duplicate.data = child.data
        source.objects.link(duplicate)
        duplicate.parent = duplicate_root
        duplicate.matrix_world = duplicate_root.matrix_world @ (local_root @ child.matrix_world)
        duplicate.pop('roomTarget', None)
        duplicate['roomDecorative'] = True
    cylinder(f'Shelf density acrylic {index:03d} base', (3.425, target[1], target[2] + 0.004), 0.043 * scale, 0.008, materials['Display acrylic'])


def duplicate_figure(index, target):
    originals = [bpy.data.objects[name] for name in ['Figure plinth', 'Figure head', 'Figure torso']]
    origin = originals[0].matrix_world.translation.copy()
    delta = Vector(target) - origin
    for original in originals:
        duplicate = original.copy()
        duplicate.data = original.data
        duplicate.name = f'Shelf density figure {index:03d} {original.name.removeprefix("Figure ")}'
        source.objects.link(duplicate)
        duplicate.matrix_world = Matrix.Translation(delta) @ original.matrix_world
        duplicate.pop('roomTarget', None)
        duplicate['roomDecorative'] = True


divisions = [-0.47, 0.22, 0.88, 1.55, 2.20]
levels = [0.14, 0.49, 0.84, 1.19, 1.69]

book_specs = [
    (-0.36, 0.16, 0.29, 0.19, 0.045, 'Cube orange', -0.01),
    (-0.28, 0.16, 0.31, 0.19, 0.038, 'Cube blue', 0.01),
    (-0.20, 0.16, 0.27, 0.19, 0.048, 'Cube green', -0.02),
    (0.30, 0.16, 0.30, 0.19, 0.042, 'Book blue', 0.01),
    (0.38, 0.16, 0.28, 0.19, 0.052, 'Cube red', -0.01),
    (0.46, 0.16, 0.32, 0.19, 0.034, 'Illustrated paper book spines', 0.015),
    (0.71, 0.16, 0.26, 0.19, 0.045, 'Cube yellow', -0.015),
    (0.79, 0.16, 0.31, 0.19, 0.035, 'Cube blue', 0.01),
    (0.87, 0.16, 0.29, 0.19, 0.05, 'Cube orange', -0.01),
    (1.62, 0.16, 0.28, 0.19, 0.047, 'Cube red', 0.01),
    (1.70, 0.16, 0.32, 0.19, 0.036, 'Book blue', -0.01),
    (1.78, 0.16, 0.27, 0.19, 0.05, 'Cube green', 0.015),
]

for index, (y, _, height, width, depth, material, tilt) in enumerate(book_specs, 1):
    z = 0.14 if index <= 3 else 0.49 if index <= 6 else 0.84 if index <= 9 else 1.19
    book(index, y, z, width, height, depth, materials[material], tilt)

magazine_stack(1, 0.48, 0.15, 0.22)
magazine_stack(2, 1.02, 0.50, 0.19)
magazine_stack(3, 1.72, 1.20, 0.18)

duplicate_contour(1, 'Contour acrylic idol teal', (3.42, 0.52, 0.53), 0.78)
duplicate_contour(2, 'Contour acrylic idol rose', (3.42, 0.72, 0.53), 0.76)
duplicate_contour(3, 'Contour acrylic idol amber', (3.42, -0.24, 1.22), 0.76)
duplicate_contour(4, 'Contour acrylic idol burgundy', (3.42, 1.72, 1.22), 0.78)

duplicate_figure(1, (3.43, -0.14, 0.485))
duplicate_figure(2, (3.43, 1.85, 1.225))

for index, (y, z) in enumerate([(-0.12, 1.20), (0.05, 1.20), (1.86, 1.20)], 1):
    box(f'Shelf density framed print {index}', (3.405, y, z + 0.12), (0.025, 0.14, 0.24), materials['Display acrylic'], 0.003)
    box(f'Shelf density framed print {index} artwork', (3.388, y, z + 0.12), (0.005, 0.11, 0.20), materials['Illustrated paper book spines'], 0.001)

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'books': len(book_specs), 'magazine_stacks': 3, 'acrylics': 4, 'figures': 2, 'framed_prints': 3})
