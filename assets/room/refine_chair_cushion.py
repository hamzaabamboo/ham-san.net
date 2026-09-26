import bpy
import math
from mathutils import Vector

pad = bpy.data.objects['Chair cream back pad']
if pad.get('cloth_refined'):
    raise RuntimeError('Chair cushion already refined')
archive = bpy.data.collections.new('Room superseded flat chair pad')
bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
old = pad.copy()
old.data = pad.data.copy()
old.name = 'Chair cream back pad archived'
archive.objects.link(old)
old.hide_render = True
matrix = pad.matrix_world.copy()
inverse = matrix.inverted()
world = [matrix@vertex.co for vertex in pad.data.vertices]
lo_y, hi_y = min(v.y for v in world), max(v.y for v in world)
lo_z, hi_z = min(v.z for v in world), max(v.z for v in world)
for vertex, point in zip(pad.data.vertices, world):
    u = (point.y-lo_y)/(hi_y-lo_y)
    v = (point.z-lo_z)/(hi_z-lo_z)
    envelope = math.sin(math.pi*u)*math.sin(math.pi*v)
    point.x -= 0.032*envelope
    point.x += 0.004*math.sin(u*math.pi*9+v*3)*envelope
    point.z += 0.003*math.sin(u*math.pi*5)*math.sin(math.pi*v)
    vertex.co = inverse@point
for modifier in pad.modifiers:
    if modifier.type == 'SOLIDIFY':
        modifier.name = 'Soft cushion thickness'
        modifier.thickness = 0.012
    elif modifier.type == 'BEVEL':
        modifier.name = 'Sewn perimeter radius'
        modifier.width = 0.004
        modifier.segments = 3
for polygon in pad.data.polygons:
    polygon.use_smooth = True
pad['cloth_refined'] = True
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Chair cushion reshaped with padded centre and cloth creases')
