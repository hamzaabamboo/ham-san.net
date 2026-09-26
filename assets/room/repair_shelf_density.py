import bpy
from mathutils import Matrix, Vector

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']
materials = {name: bpy.data.materials[name] for name in [
    'Display acrylic',
    'Idol amber printed ink',
    'Idol burgundy printed ink',
    'Idol rose printed ink',
    'Idol teal printed ink',
]}


def remove_prefix(prefixes):
    targets = [obj for obj in bpy.data.objects if obj.name.startswith(prefixes)]
    for obj in targets:
        bpy.data.objects.remove(obj, do_unlink=True)


remove_prefix(('Shelf density acrylic', 'Shelf density contour'))


def cylinder(name, location, radius, depth, material):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj['roomDecorative'] = True
    edge = obj.modifiers.new('Polished shelf base edge', 'BEVEL')
    edge.width = 0.002
    edge.segments = 3
    obj.modifiers.new('Shelf base weighted normals', 'WEIGHTED_NORMAL')


def duplicate_contour(index, original, target):
    original_root = bpy.data.objects[original]
    children = [child for child in original_root.children if child.type in {'MESH', 'CURVE'}]
    points = [child.matrix_world @ Vector(corner) for child in children for corner in child.bound_box]
    group_min = Vector((min(point[i] for point in points) for i in range(3)))
    group_max = Vector((max(point[i] for point in points) for i in range(3)))
    group_center = (group_min + group_max) / 2
    delta = Matrix.Translation(Vector((target[0] - group_center.x, target[1] - group_center.y, target[2] + 0.01 - group_min.z)))
    for child in children:
        duplicate = child.copy()
        duplicate.data = child.data
        duplicate.name = f'Shelf density contour {index:03d} {child.name.rsplit(".", 1)[0]}'
        duplicate.parent = None
        source.objects.link(duplicate)
        duplicate.matrix_world = delta @ child.matrix_world
        duplicate.pop('roomTarget', None)
        duplicate['roomDecorative'] = True
    cylinder(f'Shelf density contour {index:03d} base', (3.425, target[1], target[2] + 0.004), 0.043, 0.008, materials['Display acrylic'])


duplicate_contour(1, 'Contour acrylic idol teal', (3.42, 0.52, 0.53))
duplicate_contour(2, 'Contour acrylic idol rose', (3.42, 0.72, 0.53))
duplicate_contour(3, 'Contour acrylic idol amber', (3.42, -0.24, 1.22))
duplicate_contour(4, 'Contour acrylic idol burgundy', (3.42, 1.72, 1.22))

for index, delta in [(1, Vector((0.0, 0.0, 0.055))), (2, Vector((0.0, 0.0, 0.02)))]:
    for obj in bpy.data.objects:
        if obj.name.startswith(f'Shelf density figure {index:03d}'):
            obj.matrix_world = Matrix.Translation(delta) @ obj.matrix_world

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'removed_misplaced_acrylics': True, 'corrected_contours': 4, 'figure_clearance': True})
