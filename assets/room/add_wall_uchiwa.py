import bpy
import math
from mathutils import Vector

source = bpy.data.collections['RoomHome']
if bpy.data.objects.get('Live wall uchiwa face'):
    raise RuntimeError('Wall uchiwa already exists')
paper = bpy.data.materials['Paper']
plastic = bpy.data.materials['Warm painted white']
steel = bpy.data.materials['Brushed steel']
ink = bpy.data.materials.new('Uchiwa original navy illustration')
ink.use_nodes = True
shader = ink.node_tree.nodes.get('Principled BSDF')
shader.inputs['Roughness'].default_value = 0.52
texture = ink.node_tree.nodes.new('ShaderNodeTexImage')
texture.image = bpy.data.images.load(bpy.path.abspath('//textures/acrylic-idol-navy.png'), check_existing=True)
ink.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
center = Vector((3.865, -0.620, 2.345))
outline = [(0.134*math.cos(i*math.tau/128), 0.126*math.sin(i*math.tau/128)) for i in range(128)]


def link(obj, material):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.data.materials.append(material)
    obj['roomTarget'] = 'events'
    return obj


def skin(name, depth, material, reverse=False):
    vertices = [(center.x+depth,center.y+y,center.z+z) for y,z in outline]
    mesh = bpy.data.meshes.new(name)
    indices = tuple(range(len(vertices)))
    mesh.from_pydata(vertices, [], [indices if reverse else indices[::-1]])
    mesh.uv_layers.new(name='Uchiwa artwork UV')
    for polygon in mesh.polygons:
        for loop in polygon.loop_indices:
            y,z = outline[mesh.loops[loop].vertex_index]
            mesh.uv_layers.active.data[loop].uv = (0.5-y/0.268*0.66,0.78+z/0.252*0.44)
    obj = bpy.data.objects.new(name,mesh)
    source.objects.link(obj)
    return link(obj,material)


def tube(name, points, radius, material, closed=False):
    curve = bpy.data.curves.new(name,'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    spline = curve.splines.new('POLY')
    spline.points.add(len(points)-1)
    for point,position in zip(spline.points,points):
        point.co = (*position,1)
    spline.use_cyclic_u = closed
    obj = bpy.data.objects.new(name,curve)
    source.objects.link(obj)
    return link(obj,material)


skin('Live wall uchiwa face',-0.0018,ink)
skin('Live wall uchiwa reverse',0.003,paper,True)
tube('Live wall uchiwa molded rim',[(center.x,center.y+y,center.z+z) for y,z in outline],0.0024,plastic,True)
for i in range(19):
    angle = math.pi*0.05+i*math.pi*0.9/18
    tube('Live wall uchiwa reverse rib',[(center.x+0.002,center.y,center.z-0.119),(center.x+0.002,center.y+0.128*math.cos(angle),center.z+0.120*math.sin(angle))],0.0007,plastic)
bpy.ops.mesh.primitive_cube_add(size=1,location=(center.x,center.y,center.z-0.183))
handle = bpy.context.object
handle.name = 'Live wall uchiwa tapered handle'
handle.scale = (0.006,0.024,0.155)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
for vertex in handle.data.vertices:
    vertex.co.y *= 0.78 if vertex.co.z < 0 else 1
link(handle,plastic)
bevel = handle.modifiers.new('Rounded grip edges','BEVEL')
bevel.width = 0.003
bevel.segments = 5
handle.modifiers.new('Grip normals','WEIGHTED_NORMAL')
tube('Live wall uchiwa suspension loop',[(center.x,center.y+0.012*math.cos(i*math.tau/48),center.z+0.135+0.014*math.sin(i*math.tau/48)) for i in range(48)],0.0008,paper,True)
tube('Live wall uchiwa wall hook',[(3.907,center.y,center.z+0.15),(3.869,center.y,center.z+0.15),(3.859,center.y,center.z+0.145),(3.859,center.y,center.z+0.156)],0.0016,steel)
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Wall uchiwa added in the clear strip between shelving and penlight grid')
