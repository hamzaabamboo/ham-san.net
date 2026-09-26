import bpy
import math
from mathutils import Vector

source = bpy.data.collections['RoomHome']
if bpy.data.objects.get('Layout balcony'):
    raise RuntimeError('Balcony already exists')
root = bpy.data.objects.new('Layout balcony', None)
source.objects.link(root)
root['reference'] = 'PXL_20260907_015010154.jpg; PXL_20260907_014827641.PANO.jpg'
root['dimension_status'] = 'Visual approximation; exterior depth and far boundary are not measured'
root['walkable'] = False


def material(name, color, roughness, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    return mat


slab = material('Balcony mineral grey', (0.38, 0.39, 0.37), 0.91)
paint = material('Balcony warm exterior coating', (0.69, 0.68, 0.60), 0.82)
metal = material('Balcony satin aluminium', (0.49, 0.52, 0.51), 0.34, 0.72)
enamel = material('Condenser ivory enamel', (0.72, 0.73, 0.65), 0.39, 0.12)
dark = bpy.data.materials['Graphite']


def finish(obj, name, mat):
    obj.name = name
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.parent = root
    obj.data.materials.append(mat)
    return obj


def box(name, center, size, mat, radius=0.003):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = finish(bpy.context.object, name, mat)
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new('Edge radius', 'BEVEL')
    bevel.width = radius
    bevel.segments = 3
    obj.modifiers.new('Face normals', 'WEIGHTED_NORMAL')
    return obj


def rod(name, start, end, radius, mat):
    start, end = Vector(start), Vector(end)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=(end-start).length, location=(start+end)/2)
    obj = finish(bpy.context.object, name, mat)
    obj.rotation_euler = (end-start).to_track_quat('Z', 'Y').to_euler()
    for face in obj.data.polygons:
        face.use_smooth = len(face.vertices) == 4
    return obj


def ring(name, center, radius, wire, mat):
    bpy.ops.mesh.primitive_torus_add(major_segments=64, minor_segments=8, location=center, rotation=(math.pi/2, 0, 0), major_radius=radius, minor_radius=wire)
    obj = finish(bpy.context.object, name, mat)
    for face in obj.data.polygons:
        face.use_smooth = True
    return obj


left, right = -3.95, -0.55
front, back = 2.65, 3.66
box('Balcony slab edge', ((left+right)/2, (front+back)/2, -0.10), (right-left, back-front, 0.16), slab, 0.012)
box('Balcony waterproof floor', ((left+right)/2, (front+back)/2, -0.009), (right-left-0.035, back-front-0.015, 0.022), slab)
box('Balcony parapet infill', ((left+right)/2, back-0.035, 0.40), (right-left, 0.065, 0.78), paint)
box('Balcony parapet cap', ((left+right)/2, back-0.035, 0.803), (right-left+0.012, 0.085, 0.026), metal)
box('Balcony top rail', ((left+right)/2, back-0.035, 1.065), (right-left+0.012, 0.055, 0.055), metal, 0.009)
for x in [left+0.065, (left+right)/2, right-0.065]:
    box('Balcony rail post', (x, back-0.035, 0.54), (0.045, 0.045, 1.05), metal, 0.004)
    box('Balcony post footplate', (x, back-0.035, 0.025), (0.095, 0.085, 0.012), metal)
    for dx in [-0.033, 0.033]:
        rod('Balcony anchor bolt', (x+dx, back-0.035, 0.032), (x+dx, back-0.035, 0.04), 0.005, metal)
for i in range(20):
    x = left+0.15+i*(right-left-0.3)/19
    box('Balcony rail baluster', (x, back-0.035, 0.926), (0.013, 0.023, 0.224), metal, 0.002)
box('Balcony drainage channel', ((left+right)/2, back-0.105, 0.005), (right-left-0.1, 0.048, 0.008), dark)
for i in range(14):
    box('Balcony drain grate', (right-0.19+i*0.007, back-0.105, 0.011), (0.003, 0.044, 0.004), metal, 0.001)

cx, cy = -1.14, 3.16
for x in [cx-0.26, cx+0.26]:
    box('Condenser floor support', (x, cy, 0.06), (0.075, 0.39, 0.11), paint, 0.007)
    box('Condenser isolation pad', (x, cy, 0.12), (0.09, 0.30, 0.014), dark)
box('Balcony AC condenser casing', (cx, cy, 0.418), (0.74, 0.29, 0.58), enamel, 0.018)
box('Condenser top folded lid', (cx, cy, 0.714), (0.758, 0.304, 0.018), enamel, 0.006)
box('Condenser service panel seam', (cx+0.227, cy-0.147, 0.417), (0.002, 0.002, 0.537), dark, 0.0005)
fanx, fany, fanz = cx-0.095, cy-0.155, 0.42
rod('Condenser fan recess', (fanx, fany+0.003, fanz), (fanx, fany-0.003, fanz), 0.228, dark)
for r in [0.055, 0.092, 0.129, 0.166, 0.203, 0.225]:
    ring('Condenser concentric fan guard', (fanx, fany-0.013, fanz), r, 0.0022, enamel)
for i in range(12):
    angle = i*math.tau/12
    rod('Condenser radial grille wire', (fanx, fany-0.016, fanz), (fanx+math.cos(angle)*0.227, fany-0.016, fanz+math.sin(angle)*0.227), 0.0021, enamel)
rod('Condenser fan hub', (fanx, fany-0.015, fanz), (fanx, fany-0.027, fanz), 0.037, enamel)
for i in range(18):
    box('Condenser side ventilation slot', (cx+0.371, cy, 0.21+i*0.022), (0.003, 0.20, 0.009), dark, 0.002)
for x in [cx-0.338, cx+0.338]:
    for z in [0.164, 0.67]:
        rod('Condenser panel screw', (x, cy-0.148, z), (x, cy-0.152, z), 0.004, metal)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'balcony_parts': len(root.children), 'depth_status': root['dimension_status']})
