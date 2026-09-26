import bpy

source = bpy.data.collections['RoomHome']
wood = bpy.data.materials['Honey oak']
metal = bpy.data.materials['Brushed steel']
dark = bpy.data.materials['Graphite']


def box(name, location, size, material, radius=0.002):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.data.materials.append(material)
    bevel = obj.modifiers.new('Manufactured edge', 'BEVEL')
    bevel.width = radius
    bevel.segments = 3
    return obj


for name, front in [('Closet sliding panel', -2.426), ('Closet sliding panel.001', -2.469)]:
    obj = bpy.data.objects[name]
    matrix = obj.matrix_world.copy()
    matrix.translation.y = front
    obj.matrix_world = matrix
    obj['sliding_leaf_depth'] = front

for x in [0.882, 3.931]:
    box('Closet wood jamb', (x, -2.451, 1.243), (0.046, 0.119, 2.446), wood)
box('Closet wood header', (2.4065, -2.451, 2.452), (3.095, 0.119, 0.07), wood)
box('Closet threshold', (2.4065, -2.457, 0.025), (3.05, 0.105, 0.018), wood)
for y in [-2.414, -2.467]:
    box('Closet upper track', (2.4065, y, 2.422), (3.003, 0.011, 0.018), dark, 0.001)
    box('Closet lower guide', (2.4065, y, 0.04), (3.003, 0.008, 0.008), metal, 0.001)

archive = bpy.data.collections.get('Room superseded closet hardware') or bpy.data.collections.new('Room superseded closet hardware')
if archive.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for name, y in [('Closet pull', -2.398), ('Closet pull.001', -2.441)]:
    old = bpy.data.objects[name]
    x = old.matrix_world.translation.x
    for collection in list(old.users_collection):
        collection.objects.unlink(old)
    archive.objects.link(old)
    old.name = name + ' archived'
    for z in [0.982, 1.124]:
        box(name + ' mounting plate', (x, y, z), (0.014, 0.004, 0.023), metal, 0.002)
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = 0.0045
    curve.bevel_resolution = 4
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(3)
    for point, coordinate in zip(spline.bezier_points, [(x,y,0.982),(x,y+0.018,1.006),(x,y+0.018,1.10),(x,y,1.124)]):
        point.co = coordinate
        point.handle_left_type = 'AUTO'
        point.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    source.objects.link(obj)
    curve.materials.append(metal)
print('Sliding leaf depth, jambs, header, tracks and curved pulls updated')
