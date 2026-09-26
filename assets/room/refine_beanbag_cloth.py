import bpy
import math
from mathutils import Vector

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout beanbag']
if bpy.data.objects.get('Beanbag tailored shell'):
    raise RuntimeError('Beanbag already refined')
cloth = bpy.data.objects['Beanbag'].data.materials[0]
archive = bpy.data.collections.new('Room superseded inflated beanbag')
bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(root.children):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    archive.objects.link(obj)
    obj.hide_render = True

profile = [(0, 0.027), (0.66, 0.035), (0.91, 0.085), (1, 0.18), (0.97, 0.29), (0.90, 0.40), (0.77, 0.50), (0.61, 0.55), (0.43, 0.52), (0.22, 0.43), (0, 0.397)]
segments = 144
rows = 81
center = Vector((1.921, -0.784, 0))


def sample(t):
    s = t*(len(profile)-1)
    i = min(int(s), len(profile)-2)
    f = s-i
    points = [profile[max(0, min(len(profile)-1, i+k))] for k in [-1, 0, 1, 2]]
    return [0.5*((2*points[1][axis])+(-points[0][axis]+points[2][axis])*f+(2*points[0][axis]-5*points[1][axis]+4*points[2][axis]-points[3][axis])*f*f+(-points[0][axis]+3*points[1][axis]-3*points[2][axis]+points[3][axis])*f*f*f) for axis in range(2)]


def surface(t, angle):
    radius, height = sample(t)
    radius = max(0, radius)
    shoulder = math.exp(-((t-0.57)/0.24)**2)
    crease = 0
    for direction, depth, width in [(0.2, 0.075, 0.11), (1.05, 0.045, 0.16), (2.15, 0.065, 0.12), (3.45, 0.09, 0.14), (4.55, 0.05, 0.13), (5.6, 0.07, 0.12)]:
        delta = math.atan2(math.sin(angle-direction-0.24*t), math.cos(angle-direction-0.24*t))
        crease -= depth*math.exp(-(delta/width)**2)*shoulder
    ripple = 0.009*math.sin(angle*19+t*13)*math.sin(math.pi*t)**2
    radius *= 1+crease+ripple+0.045*math.sin(angle*3+0.8)
    x = 0.68*radius*math.cos(angle)+0.095*t*t
    y = 0.565*radius*math.sin(angle)+0.07*t*t
    height += 0.09*math.sin(angle+0.65)*math.sin(math.pi*t)**2
    height += 0.022*math.sin(angle*8+t*19)*shoulder*radius
    return center+Vector((x, y, max(0.027, height)))


vertices = [surface(row/(rows-1), col/segments*math.tau) for row in range(rows) for col in range(segments)]
faces = []
for row in range(rows-1):
    for col in range(segments):
        nxt = (col+1)%segments
        faces.append((row*segments+col, row*segments+nxt, (row+1)*segments+nxt, (row+1)*segments+col))
mesh = bpy.data.meshes.new('Beanbag sewn cloth surface')
mesh.from_pydata(vertices, [], faces)
mesh.update()
uv = mesh.uv_layers.new(name='Fabric UV')
for polygon in mesh.polygons:
    polygon.use_smooth = True
    for loop in polygon.loop_indices:
        index = mesh.loops[loop].vertex_index
        row, col = divmod(index, segments)
        u = col/segments
        if polygon.index%segments == segments-1 and col == 0:
            u = 1
        uv.data[loop].uv = (u*3, row/(rows-1)*2)
obj = bpy.data.objects.new('Beanbag tailored shell', mesh)
source.objects.link(obj)
matrix = obj.matrix_world.copy()
obj.parent = root
obj.matrix_world = matrix
mesh.materials.append(cloth)

curve = bpy.data.curves.new('Beanbag stitched side seam', 'CURVE')
curve.dimensions = '3D'
curve.bevel_depth = 0.0018
curve.bevel_resolution = 3
spline = curve.splines.new('POLY')
spline.points.add(segments-1)
for i, point in enumerate(spline.points):
    angle = i/segments*math.tau
    position = surface(0.39, angle)+Vector((math.cos(angle)*0.002, math.sin(angle)*0.002, 0))
    point.co = (*position, 1)
spline.use_cyclic_u = True
seam = bpy.data.objects.new('Beanbag stitched side seam', curve)
source.objects.link(seam)
matrix = seam.matrix_world.copy()
seam.parent = root
seam.matrix_world = matrix
curve.materials.append(cloth)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Asymmetric cloth shell, seat depression, folds and side seam saved')
