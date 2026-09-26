import bpy
from math import sin, cos, pi
from mathutils import Vector

source = bpy.data.collections['RoomHome']
archive = bpy.data.collections.get('Room superseded curtains') or bpy.data.collections.new('Room superseded curtains')
if archive.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(source.all_objects):
    if any(label in obj.name for label in [' curtain hook', ' rail carrier', ' Header seam', ' Weighted hem', 'rail wall bracket']):
        bpy.data.objects.remove(obj, do_unlink=True)


def keep(obj):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    return obj


def tube(name, points, radius, material):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new('POLY')
    spline.points.add(len(points) - 1)
    for point, coordinate in zip(spline.points, points):
        point.co = (*coordinate, 1)
    obj = bpy.data.objects.new(name, curve)
    source.objects.link(obj)
    curve.materials.append(material)
    return obj


blue = bpy.data.materials['Golden linen'].copy()
blue.name = 'Blue woven curtain cloth'
shader = blue.node_tree.nodes.get('Principled BSDF')
for link in list(shader.inputs['Base Color'].links):
    blue.node_tree.links.remove(link)
shader.inputs['Base Color'].default_value = (0.19, 0.33, 0.39, 1)
shader.inputs['Roughness'].default_value = 0.88
shader.inputs['Sheen Weight'].default_value = 0.3
steel = bpy.data.materials['Brushed steel']
white = bpy.data.materials['Warm painted white']
panels = [
    ('Balcony gathered curtain desk side', -3.9193, -3.1476, 0.1053, 'Golden linen', 8),
    ('Balcony gathered curtain stand side', -1.4365, -0.7776, 0.1053, 'Golden linen', 7),
    ('Raised window gathered curtain stand side', 0.9981, 1.3739, 0.8953, blue.name, 5),
    ('Raised window gathered curtain far side', 2.8775, 3.6242, 0.8953, blue.name, 8),
]
for name, left, right, bottom, material_name, folds in panels:
    old = bpy.data.objects[name]
    for collection in list(old.users_collection):
        collection.objects.unlink(old)
    archive.objects.link(old)
    old.name = name + ' archived'
    top = 2.529
    width = right - left
    center = (left + right) / 2

    def surface(u, v):
        phase = u * folds * 2 * pi + 0.4 * sin(u * 13) * v + 0.13 * sin(v * 7 + u * 9)
        amplitude = (0.021 + 0.013 * sin(v * pi / 2)) * (1 + 0.17 * sin(u * 19))
        gather = 0.85 + 0.15 * v
        x = center + (u - 0.5) * width * gather
        y = 2.405 - amplitude * (cos(phase) + 0.24 * cos(phase * 2)) - 0.014 * sin(v * pi)
        z = top - v * (top - bottom) - 0.008 * sin(phase / 2) ** 2 * v ** 7
        return (x, y, z)

    nx, ny = 128, 64
    vertices = [surface(x / nx, y / ny) for y in range(ny + 1) for x in range(nx + 1)]
    faces = [(y * (nx + 1) + x, y * (nx + 1) + x + 1, (y + 1) * (nx + 1) + x + 1, (y + 1) * (nx + 1) + x) for y in range(ny) for x in range(nx)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.uv_layers.new(name='Cloth UV')
    for polygon in mesh.polygons:
        polygon.use_smooth = True
        for loop_index in polygon.loop_indices:
            index = mesh.loops[loop_index].vertex_index
            mesh.uv_layers.active.data[loop_index].uv = (index % (nx + 1) / nx, 1 - index // (nx + 1) / ny)
    obj = bpy.data.objects.new(name, mesh)
    source.objects.link(obj)
    material = bpy.data.materials[material_name]
    mesh.materials.append(material)
    solid = obj.modifiers.new('Fabric thickness', 'SOLIDIFY')
    solid.thickness = 0.0012
    for label, v in [('Header seam', 0.025), ('Weighted hem', 0.978)]:
        tube(name + ' ' + label, [(x, y - 0.001, z) for x, y, z in [surface(i / nx, v) for i in range(nx + 1)]], 0.00065, material)
    for i in range(folds + 1):
        x, y, z = surface(i / folds, 0)
        tube(name + ' curtain hook', [(x, y, z - 0.008), (x, y, 2.535), (x, 2.383, 2.539), (x, 2.376, 2.543)], 0.0018, steel)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=1, location=(x, 2.38, 2.538))
        carrier = keep(bpy.context.object)
        carrier.name = name + ' rail carrier'
        carrier.scale = (0.006, 0.007, 0.005)
        carrier.data.materials.append(white)

for name, left, right in [('Balcony curtain rail', -3.97, -0.48), ('Rear curtain rail', 0.68, 3.73)]:
    old = bpy.data.objects[name]
    for collection in list(old.users_collection):
        collection.objects.unlink(old)
    archive.objects.link(old)
    old.name = name + ' archived'
    bpy.ops.mesh.primitive_cube_add(size=1, location=((left + right) / 2, 2.389, 2.553))
    rail = keep(bpy.context.object)
    rail.name = name
    rail.scale = (right - left, 0.022, 0.023)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    rail.data.materials.append(white)
    bevel = rail.modifiers.new('Rail edge', 'BEVEL')
    bevel.width = 0.002
    bevel.segments = 3
    for x in [left + 0.08, (left + right) / 2, right - 0.08]:
        tube(name + ' wall bracket', [(x, 2.48, 2.56), (x, 2.394, 2.56)], 0.006, white)
print('Four cloth panels, seams, carriers and rails rebuilt')
