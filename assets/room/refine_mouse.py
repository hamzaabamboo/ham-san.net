import bpy
import bmesh
import math
from pathlib import Path
from mathutils import Matrix, Vector

expected = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend')
if Path(bpy.data.filepath).resolve() != expected:
    raise RuntimeError('Open the room source before refining the mouse')

source = bpy.data.collections['RoomHome']
originals = ('Mouse', 'Mouse scroll wheel', 'Mouse button split')
for name in originals:
    if name not in source.all_objects or bpy.data.objects[name].type != 'MESH':
        raise RuntimeError('Missing source mouse mesh: ' + name)

bpy.context.view_layer.update()


def bounds(obj):
    corners = [obj.matrix_world @ Vector(point) for point in obj.bound_box]
    return tuple(Vector(values) for values in (
        [min(point[axis] for point in corners) for axis in range(3)],
        [max(point[axis] for point in corners) for axis in range(3)],
    ))


mouse = bpy.data.objects['Mouse']
desk_lo, desk_hi = bounds(bpy.data.objects['Desk straight top'])
mouse_lo, mouse_hi = bounds(mouse)
span = mouse_hi - mouse_lo
if not (0.10 < span.x < 0.15 and 0.055 < span.y < 0.095):
    raise RuntimeError('Mouse dimensions changed; inspect the native source')
if not all(desk_lo[axis] < mouse_lo[axis] < mouse_hi[axis] < desk_hi[axis] for axis in (0, 1)):
    raise RuntimeError('Mouse is outside its desk support')

archive = bpy.data.collections.get('Room mouse before refinement')
if archive is None:
    archive = bpy.data.collections.new('Room mouse before refinement')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for name in originals:
    backup_name = name + ' before refinement'
    if backup_name not in bpy.data.objects:
        original = bpy.data.objects[name]
        backup = original.copy()
        backup.data = original.data.copy()
        backup.name = backup_name
        backup.matrix_world = original.matrix_world.copy()
        backup.hide_render = True
        backup.hide_viewport = True
        archive.objects.link(backup)

reference_lo, reference_hi = bounds(bpy.data.objects['Mouse before refinement'])
center = (reference_lo + reference_hi) * 0.5
length = reference_hi.x - reference_lo.x
width = reference_hi.y - reference_lo.y
height = 0.049
base = desk_hi.z
made = []


def material(name, color, roughness, metallic=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1.0)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    mat.diffuse_color = (*color, 1.0)
    return mat


shell = material('Mouse charcoal shell', (0.027, 0.031, 0.033), 0.48)
rubber = material('Mouse thumb grip', (0.012, 0.014, 0.015), 0.76)
recess = material('Mouse recessed plastic', (0.006, 0.007, 0.008), 0.62)
metal = material('Mouse scroll metal', (0.24, 0.26, 0.27), 0.29, 0.75)
skate = material('Mouse underside skates', (0.075, 0.080, 0.082), 0.38)


def mesh_object(name, vertices, faces, mat, smooth=False):
    obj = bpy.data.objects.get(name)
    if obj is not None and name not in originals and obj.get('roomMouseRefinement') != 1:
        raise RuntimeError('Refusing to replace an unrelated object: ' + name)
    mesh = bpy.data.meshes.new(name + ' refined mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.validate()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    if any(face.area < 1e-12 for face in mesh.polygons):
        raise RuntimeError('Degenerate mouse geometry: ' + name)
    mesh.materials.append(mat)
    for face in mesh.polygons:
        face.use_smooth = smooth
    if obj is None:
        obj = bpy.data.objects.new(name, mesh)
        source.objects.link(obj)
    else:
        obj.data = mesh
    obj.parent = None
    transform = (bpy.data.objects[name + ' before refinement'].matrix_world.copy()
                 if name in originals else Matrix.Identity(4))
    mesh.transform(transform.inverted())
    obj.matrix_world = transform
    obj.hide_render = False
    obj.hide_viewport = False
    obj['roomMouseRefinement'] = 1
    for modifier in list(obj.modifiers):
        obj.modifiers.remove(modifier)
    made.append(name)
    return obj


def box(name, midpoint, size, mat, bevel=0.0):
    vertices = [tuple(midpoint[axis] + signs[axis] * size[axis] * 0.5 for axis in range(3))
                for signs in ((-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1),
                              (-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1))]
    obj = mesh_object(name, vertices, ((0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
                                      (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)), mat)
    if bevel:
        modifier = obj.modifiers.new('Manufactured edge', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 3
    return obj


profile = ((-0.50, 0.24, 0.23), (-0.46, 0.60, 0.35), (-0.36, 0.82, 0.50),
           (-0.24, 0.90, 0.66), (-0.10, 0.96, 0.85), (0.06, 1.00, 1.00),
           (0.22, 0.98, 0.95), (0.36, 0.82, 0.70), (0.46, 0.50, 0.32),
           (0.50, 0.14, 0.12))
section = ((-0.45, 0.0), (0.30, 0.0), (0.44, 0.08), (0.49, 0.32),
           (0.44, 0.68), (0.29, 0.91), (0.04, 1.0), (-0.13, 0.94),
           (-0.27, 0.74), (-0.28, 0.47), (-0.24, 0.31), (-0.39, 0.20),
           (-0.50, 0.08))
vertices = [(center.x + x * length, center.y + y * width * breadth,
             base + 0.0012 + z * height * crown)
            for x, breadth, crown in profile for y, z in section]
count = len(section)
faces = [tuple(reversed(range(count))), tuple(range(len(vertices) - count, len(vertices)))]
for row in range(len(profile) - 1):
    for column in range(count):
        next_column = (column + 1) % count
        faces.append((row * count + column, row * count + next_column,
                      (row + 1) * count + next_column, (row + 1) * count + column))
body = mesh_object('Mouse', vertices, faces, shell, True)
body.data.materials.append(rubber)
for face in body.data.polygons:
    if face.index >= 2 and (face.index - 2) % count in (8, 9, 10, 11):
        face.material_index = 1
subdivision = body.modifiers.new('Sculpted palm and thumb rest', 'SUBSURF')
subdivision.levels = 2
subdivision.render_levels = 2


def cut(name, midpoint, size, bevel=0.0):
    cutter = box(name, midpoint, size, recess, bevel)
    cutter.hide_render = True
    cutter.hide_set(True)
    modifier = body.modifiers.new(name, 'BOOLEAN')
    modifier.operation = 'DIFFERENCE'
    modifier.solver = 'EXACT'
    modifier.object = cutter
    return cutter


cut('Mouse wheel recess cutter', (center.x - 0.034, center.y, base + 0.044),
    (0.024, 0.009, 0.040), 0.0012)
cut('Mouse central button channel', (center.x - 0.040, center.y, base + 0.044),
    (0.046, 0.0012, 0.054))
cut('Mouse rear button channel', (center.x - 0.012, center.y, base + 0.046),
    (0.0011, 0.080, 0.042))
box('Mouse button split', (center.x - 0.038, center.y, base + 0.008),
    (0.030, 0.003, 0.001), recess)
box('Mouse wheel recess lining', (center.x - 0.034, center.y, base + 0.017),
    (0.021, 0.008, 0.001), recess, 0.0004)


def roller(name, midpoint, axis, radius, depth, mat):
    sides = 64
    radial_axes = [index for index in range(3) if index != axis]
    points = []
    for offset in (-depth * 0.5, depth * 0.5):
        for index in range(sides):
            angle = math.tau * index / sides
            grip_radius = radius * (1.0 if index % 2 else 0.95)
            point = list(midpoint)
            point[axis] += offset
            point[radial_axes[0]] += grip_radius * math.cos(angle)
            point[radial_axes[1]] += grip_radius * math.sin(angle)
            points.append(point)
    polygons = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
    polygons += [(index, (index + 1) % sides, (index + 1) % sides + sides, index + sides)
                 for index in range(sides)]
    return mesh_object(name, points, polygons, mat)


roller('Mouse scroll wheel', (center.x - 0.034, center.y, base + 0.0315),
       1, 0.0064, 0.005, metal)
roller('Mouse thumb scroll wheel', (center.x - 0.004, center.y - 0.021, base + 0.027),
       0, 0.0034, 0.014, metal)
for index, x in enumerate((0.009, 0.023), 1):
    box('Mouse thumb button ' + str(index), (center.x + x, center.y - 0.022, base + 0.019),
        (0.011, 0.004, 0.004), rubber, 0.001)
bpy.context.view_layer.update()
evaluated = body.evaluated_get(bpy.context.evaluated_depsgraph_get())
inverse = body.matrix_world.inverted()
hit, point, normal, face = evaluated.ray_cast(
    inverse @ Vector((center.x - 0.007, center.y + 0.002, base + 0.10)),
    inverse.to_3x3() @ Vector((0, 0, -1)))
if not hit:
    raise RuntimeError('Mouse mode button has no shell support')
point = body.matrix_world @ point
box('Mouse wheel mode button', (point.x, point.y, point.z + 0.0005),
    (0.007, 0.005, 0.002), recess, 0.001)
for index, x in enumerate((-0.039, 0.035), 1):
    box('Mouse underside skate ' + str(index), (center.x + x, center.y, base + 0.0006),
        (0.012, 0.026, 0.0012), skate, 0.0004)

bpy.context.view_layer.update()
result = {
    'modified': made,
    'backup_collection': archive.name,
    'source_photo': 'PXL_20260908_033233767.jpg',
    'saved': False,
    'verification': 'Native front, side and top views plus physics are required before save/export',
}
