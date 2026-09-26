import bpy
import json
import math
from mathutils import Vector

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Skill toy kendama']
old = bpy.data.objects.get('Skill toy kendama cup crosspiece')
wood = bpy.data.materials['Chair warm plywood']

if bpy.data.objects.get('Skill toy kendama large cup'):
    raise RuntimeError('Kendama cups already refined')

if old:
    old.name = 'Archive kendama cup crosspiece'
    old.hide_render = True
    old.hide_viewport = True


def finish(obj, name):
    obj.name = 'Skill toy kendama ' + name
    local = obj.matrix_basis.copy()
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.parent = root
    obj.matrix_parent_inverse.identity()
    obj.matrix_basis = local
    obj['roomTarget'] = 'kendama'
    obj.data.materials.append(wood)
    return obj


def cylinder(name, radius, depth, location, rotation=(0, 0, 0), vertices=64):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation
    )
    obj = finish(bpy.context.object, name)
    bevel = obj.modifiers.new('Turned edge', 'BEVEL')
    bevel.width = min(radius * 0.22, 0.0018)
    bevel.segments = 3
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return obj


def lathe(name, profile, center):
    segments = 96
    vertices = []
    faces = []
    for radius, z in profile:
        for index in range(segments):
            angle = math.tau * index / segments
            vertices.append((radius * math.cos(angle), radius * math.sin(angle), z))
    for row in range(len(profile) - 1):
        for index in range(segments):
            next_index = (index + 1) % segments
            faces.append((row * segments + index, row * segments + next_index,
                          (row + 1) * segments + next_index, (row + 1) * segments + index))
    mesh = bpy.data.meshes.new('Kendama cup turned mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.uv_layers.new(name='Kendama wood UV')
    for polygon in mesh.polygons:
        polygon.use_smooth = True
        for loop in polygon.loop_indices:
            vertex_index = mesh.loops[loop].vertex_index
            mesh.uv_layers.active.data[loop].uv = (
                (vertex_index % segments) / segments,
                (vertex_index // segments) / (len(profile) - 1)
            )
    obj = bpy.data.objects.new(name, mesh)
    source.objects.link(obj)
    obj.location = center
    obj = finish(obj, name)
    bevel = obj.modifiers.new('Cups edge softness', 'BEVEL')
    bevel.width = 0.0012
    bevel.segments = 3
    obj.modifiers.new('Cups weighted normals', 'WEIGHTED_NORMAL')
    return obj


def cup(name, radius, center_y, bottom_z):
    rim_z = bottom_z + 0.041
    profile = [
        (0, bottom_z),
        (radius * 0.28, bottom_z + 0.002),
        (radius * 0.72, bottom_z + 0.010),
        (radius, bottom_z + 0.026),
        (radius * 0.98, rim_z),
        (radius * 0.84, rim_z),
        (radius * 0.70, bottom_z + 0.031),
        (radius * 0.52, bottom_z + 0.021),
        (radius * 0.22, bottom_z + 0.012),
        (0, bottom_z + 0.010)
    ]
    obj = lathe(name, profile, (0, center_y, 0))
    cylinder(name + ' rim', 0.0019, math.tau * radius * 0.46,
             (0, center_y, rim_z), rotation=(math.pi / 2, 0, 0), vertices=64)
    return obj


cylinder('bridge', 0.006, 0.090, (0, 0, 0.067), rotation=(math.pi / 2, 0, 0))
cylinder('center collar', 0.012, 0.015, (0, 0, 0.095), vertices=64)
cup('large cup', 0.030, -0.034, 0.058)
cup('small cup', 0.024, 0.034, 0.063)

bpy.context.view_layer.update()
navigation = json.loads(bpy.data.objects['Floor base']['roomNavigation'])
points = [
    root.matrix_world @ Vector(corner)
    for obj in root.children
    if not obj.hide_render and obj.type in {'MESH', 'CURVE'}
    for corner in obj.bound_box
]
center = Vector([
    (min(point[index] for point in points) + max(point[index] for point in points)) / 2
    for index in range(3)
])
navigation['targets']['kendama'] = {
    'position': [min(point.x for point in points) - 0.002, center.z, -center.y],
    'camera': [2.88, 1.37, -center.y]
}
bpy.data.objects['Floor base']['roomNavigation'] = json.dumps(navigation)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print(json.dumps({
    'target': 'kendama',
    'children': [obj.name for obj in root.children if not obj.hide_render],
    'bounds': [[min(point[index] for point in points), max(point[index] for point in points)] for index in range(3)],
    'navigation': navigation['targets']['kendama']
}, ensure_ascii=False))
