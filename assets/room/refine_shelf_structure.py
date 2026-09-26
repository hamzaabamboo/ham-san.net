import bpy
import json
import re
from mathutils import Vector, Matrix

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Layout hobby shelving']
if bpy.data.objects.get('Modular shelf continuous back'):
    raise RuntimeError('Shelf structure already refined')
white = bpy.data.materials['Warm painted white']
metal = bpy.data.materials['Brushed steel']
archive = bpy.data.collections.new('Room superseded sparse bookcases')
bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
old = list(root.children)
for obj in old:
    if obj.name.startswith(('Magazine bookcase', 'Tankobon bookcase', 'Display cabinet')):
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        archive.objects.link(obj)
        obj.hide_render = True


def box(name, position, dimensions, material, radius=0.002):
    bpy.ops.mesh.primitive_cube_add(size=1, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.scale = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    matrix = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = matrix
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.data.materials.append(material)
    edge = obj.modifiers.new('Laminated board edge', 'BEVEL')
    edge.width = radius
    edge.segments = 3
    obj.modifiers.new('Cabinet normals', 'WEIGHTED_NORMAL')
    obj['roomTarget'] = 'hobbies'
    return obj


front, back = 3.345, 3.835
divisions = [-0.47, 0.22, 0.88, 1.55, 2.20]
levels = [0.14, 0.49, 0.84, 1.19, 1.69]
box('Modular shelf continuous back', (back, 0.865, 0.855), (0.008, 2.67, 1.67), white)
for y in divisions:
    box('Modular shelf upright', ((front+back)/2, y, 0.855), (back-front, 0.025, 1.67), white)
for low, high in zip(divisions, divisions[1:]):
    center = (low+high)/2
    box('Modular shelf recessed plinth', (3.66, center, 0.078), (0.30, high-low-0.025, 0.105), white)
    for z in levels:
        box('Modular shelf board', ((front+back)/2, center, z), (back-front, high-low-0.025, 0.023), white)
    for y in [low+0.018, high-0.018]:
        for z in levels[1:-1]:
            for x in [front+0.05, back-0.045]:
                box('Shelf support pin', (x, y, z-0.018), (0.011, 0.008, 0.008), metal, 0.003)

base_pattern = re.compile(r'^(Shelf book|Collection album spine|Upper collection booklet)(\.\d+)?$')
books = [o for o in old if base_pattern.fullmatch(o.name)]
books.sort(key=lambda o: o.name)
slots = [(column, row) for column in [3, 2, 0] for row in range(3)]
assert len(books) <= len(slots)*6
for index, base in enumerate(books):
    group = [o for o in old if o.name == base.name or o.name.startswith(base.name+' ')]
    column, row = slots[(index//6) % len(slots)]
    lane = index % 6
    low, high = divisions[column:column+2]
    corners = [o.matrix_world@Vector(c) for o in group for c in o.bound_box]
    minimum = Vector([min(c[i] for c in corners) for i in range(3)])
    maximum = Vector([max(c[i] for c in corners) for i in range(3)])
    center = (minimum+maximum)/2
    height = min(maximum.z-minimum.z, 0.29+(index%3)*0.012)
    width = [0.028, 0.034, 0.045, 0.025, 0.052, 0.037][lane]
    scaling = Matrix.Diagonal((1, width/(maximum.y-minimum.y), height/(maximum.z-minimum.z), 1))
    target = Vector((3.59, low+0.055+lane*0.078, levels[row]+0.013+height/2))
    transform = Matrix.Translation(target)@scaling@Matrix.Translation(-center)
    for obj in group:
        obj.matrix_world = transform@obj.matrix_world

for obj in old:
    if obj.name.startswith('Record sleeve'):
        corners = [obj.matrix_world@Vector(c) for c in obj.bound_box]
        bottom = min(c.z for c in corners)
        height = max(c.z for c in corners)-bottom
        transform = Matrix.Translation((0, 0, 0.855))@Matrix.Diagonal((1, 1, 0.30/height, 1))@Matrix.Translation((0, 0, -bottom))
        obj.matrix_world = transform@obj.matrix_world
    if obj.name.startswith('Right clear display'):
        matrix = obj.matrix_world.copy()
        matrix.translation.z += 0.178
        obj.matrix_world = matrix

for prefix, delta in [('Idol rose', -0.3233476), ('Idol amber', -0.5010954), ('Idol plum', 0.178)]:
    parts = [(obj, obj.matrix_world.copy()) for obj in source.all_objects if obj.name.startswith(prefix) and obj.type == 'MESH' and not obj.hide_render]
    for obj, matrix in parts:
        matrix.translation.z += delta
        obj.matrix_world = matrix

for name in ['Top display photo frame.004', 'Top display photo mount.004', 'Framed idol portrait plum']:
    obj = bpy.data.objects[name]
    matrix = obj.matrix_world.copy()
    matrix.translation.z += 0.178
    obj.matrix_world = matrix

navigation = json.loads(bpy.data.objects['Floor base']['roomNavigation'])
for collider in navigation['colliders']:
    if collider['id'] == 'shelf':
        collider.update(minX=3.3325, maxX=3.8475, minZ=-2.2125, maxZ=0.4825)
bpy.data.objects['Floor base']['roomNavigation'] = json.dumps(navigation)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Shelf structure rebuilt and existing books redistributed')
