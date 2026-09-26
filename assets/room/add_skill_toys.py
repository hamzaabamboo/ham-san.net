import bpy
import json
import math
from mathutils import Matrix, Vector

source = bpy.data.collections['RoomHome']
if bpy.data.objects.get('Skill toy yoyo'):
    raise RuntimeError('Skill toys already exist')
paper = bpy.data.materials['Paper']
wood = bpy.data.materials['Chair warm plywood']
steel = bpy.data.materials['Brushed steel']
black = bpy.data.materials['Graphite']


def material(name, color, roughness, metallic=0):
    result = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    result.use_nodes = True
    shader = result.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color,1)
    shader.inputs['Roughness'].default_value = roughness
    shader.inputs['Metallic'].default_value = metallic
    return result


blue = material('Yo-yo anodised aluminium',(0.025,0.10,0.19),0.24,0.85)
red = material('Skill toy burgundy lacquer',(0.24,0.016,0.024),0.28)
rubber = material('Pen grip silicone',(0.015,0.019,0.023),0.8)
roots = {}
current = None


def assembly(target, y):
    global current
    current = bpy.data.objects.new('Skill toy '+target,None)
    source.objects.link(current)
    current.matrix_world = Matrix(((0,1,0,3.49),(-1,0,0,y),(0,0,1,1.202),(0,0,0,1)))
    current['roomTarget'] = target
    roots[target] = current


def finish(obj, name, mat):
    obj.name = current.name+' '+name
    local = obj.matrix_basis.copy()
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.parent = current
    obj.matrix_parent_inverse = Matrix.Identity(4)
    obj.matrix_basis = local
    obj.data.materials.append(mat)
    obj['roomTarget'] = current['roomTarget']
    return obj


def box(name, position, size, mat, radius=0.001):
    bpy.ops.mesh.primitive_cube_add(size=1,location=position)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    finish(obj,name,mat)
    bevel = obj.modifiers.new('Rounded manufactured edge','BEVEL')
    bevel.width = radius
    bevel.segments = 3
    obj.modifiers.new('Surface normals','WEIGHTED_NORMAL')
    return obj


def lathe(name, profile, position, mat, axis='Z'):
    count = 80
    mesh = bpy.data.meshes.new(name)
    vertices = [(r*math.cos(i*math.tau/count),r*math.sin(i*math.tau/count),z) for r,z in profile for i in range(count)]
    faces = [(j*count+i,j*count+(i+1)%count,(j+1)*count+(i+1)%count,(j+1)*count+i) for j in range(len(profile)-1) for i in range(count)]
    mesh.from_pydata(vertices,[],faces)
    mesh.uv_layers.new(name='Turned surface UV')
    for polygon in mesh.polygons:
        polygon.use_smooth = True
        for loop in polygon.loop_indices:
            index = mesh.loops[loop].vertex_index
            mesh.uv_layers.active.data[loop].uv = ((index%count)/count,(index//count)/(len(profile)-1))
    obj = bpy.data.objects.new(name,mesh)
    source.objects.link(obj)
    obj.location = position
    if axis == 'Y':
        obj.rotation_euler.x = math.pi/2
    if axis == 'X':
        obj.rotation_euler.y = math.pi/2
    return finish(obj,name,mat)


def cord(name, points, radius, mat):
    curve = bpy.data.curves.new(name,'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points)-1)
    for point,position in zip(spline.bezier_points,points):
        point.co = position
        point.handle_left_type = 'AUTO'
        point.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name,curve)
    source.objects.link(obj)
    return finish(obj,name,mat)


assembly('yoyo',1.30)
profile = [(0,0),(0.008,0),(0.01,0.003),(0.024,0.008),(0.028,0.012),(0.029,0.018),(0.028,0.021),(0.022,0.0215),(0.019,0.018),(0.01,0.01),(0.006,0.008),(0,0.008)]
lathe('front butterfly cup',profile,(0,-0.002,0.031),blue,'Y')
lathe('rear butterfly cup',[(r,-z) for r,z in reversed(profile)],(0,0.002,0.031),blue,'Y')
lathe('bearing axle',[(0,-0.004),(0.005,-0.004),(0.005,0.004),(0,0.004)],(0,0,0.031),steel,'Y')
cord('cotton string',[(0,0,0.031),(0.038,0.013,0.005),(0.068,0.018,0.001),(0.07,-0.018,0.001),(0.032,-0.016,0.001),(0.023,0,0.003)],0.0005,paper)
box('display cradle',(0,0,0.002),(0.038,0.037,0.004),rubber,0.002)

assembly('penspinning',1.07)
lathe('balanced barrel',[(0,-0.085),(0.004,-0.085),(0.0045,-0.075),(0.0045,0.075),(0.004,0.085),(0,0.085)],(0,0,0.015),paper,'X')
for sign in [-1,1]:
    profile=[(0,0.075),(0.006,0.075),(0.0063,0.088),(0.0055,0.101),(0.003,0.109),(0,0.11)]
    profile=[(r,sign*x) for r,x in (profile if sign>0 else reversed(profile))]
    lathe('weighted grip',profile,(0,0,0.015),rubber,'X')
    for i in range(7):
        x=sign*(0.078+i*0.003)
        lathe('grip rib',[(0.006,x),(0.0066,x+0.0004),(0.0066,x+0.001),(0.006,x+0.0014)],(0,0,0.015),rubber,'X')
    lathe('metal tip',[(0,sign*0.103),(0.004,sign*0.103),(0.0016,sign*0.112),(0,sign*0.112)],(0,0,0.015),steel,'X')
for x in [-0.05,0.05]:
    box('pen rest',(x,0,0.005),(0.012,0.028,0.01),wood,0.002)

assembly('kendama',0.55)
lathe('turned ken',[(0,0),(0.017,0),(0.019,0.004),(0.016,0.012),(0.010,0.026),(0.009,0.066),(0.012,0.082),(0.01,0.106),(0.003,0.139),(0,0.14)],(0,0,0),wood)
lathe('cup crosspiece',[(0.016,-0.047),(0.021,-0.047),(0.021,-0.043),(0.018,-0.035),(0.009,-0.026),(0.009,0.028),(0.016,0.035),(0.018,0.043),(0.017,0.047),(0.012,0.047),(0.005,0.037),(0,0.037)],(0,0,0.095),wood,'X')
ball_profile=[(0.006,-0.025)]+[(0.027*math.sin(math.pi*i/40),-0.027*math.cos(math.pi*i/40)) for i in range(4,41)]
lathe('lacquered tama',ball_profile,(0.059,-0.015,0.03),red)
cord('tether',[(0,0,0.081),(0.018,0.021,0.045),(0.066,0.026,0.01),(0.079,-0.004,0.023),(0.059,-0.015,0.031)],0.0005,paper)

assembly('cardistry',-0.10)
for i in range(52):
    box('deck card',(0,0,0.00035+i*0.00030),(0.063,0.088,0.00028),paper,0.0025)
box('printed back',(0,0,0.0159),(0.053,0.078,0.00015),red,0.001)
for i in range(7):
    for j in range(11):
        mark=box('back lozenge',((i-3)*0.0065,(j-5)*0.0065,0.01605),(0.0024,0.0024,0.0001),paper,0)
        mark.rotation_euler.z=math.pi/4
for i in range(5):
    card=box('spread card',(0.042+i*0.014,0.006+i*0.004,0.0003+i*0.00035),(0.063,0.088,0.0003),paper,0.002)
    card.rotation_euler.z=-0.12*i

bpy.context.view_layer.update()
navigation=json.loads(bpy.data.objects['Floor base']['roomNavigation'])
for target,root in roots.items():
    points=[obj.matrix_world@Vector(corner) for obj in root.children if obj.type in {'MESH','CURVE'} for corner in obj.bound_box]
    center=Vector([(min(p[i] for p in points)+max(p[i] for p in points))/2 for i in range(3)])
    navigation['targets'][target]={'position':[min(p.x for p in points)-0.002,center.z,-center.y],'camera':[2.88,1.37,-center.y]}
bpy.data.objects['Floor base']['roomNavigation']=json.dumps(navigation)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Four skill toys added with individual navigation metadata')
