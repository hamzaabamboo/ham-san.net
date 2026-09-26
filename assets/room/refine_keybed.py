import bpy

source = bpy.data.collections['RoomHome']
archive = bpy.data.collections.get('Room superseded piano keys') or bpy.data.collections.new('Room superseded piano keys')
if archive.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(source.all_objects):
    if obj.name.startswith(('Piano white key', 'Piano black key')):
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        archive.objects.link(obj)


def key(name, profile, bottom, top, material):
    size = len(profile)
    vertices = [(x, y, z) for z in [bottom, top] for x, y in profile]
    faces = [tuple(reversed(range(size))), tuple(range(size, size * 2))]
    faces += [(i, (i + 1) % size, (i + 1) % size + size, i + size) for i in range(size)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    obj = bpy.data.objects.new(name, mesh)
    source.objects.link(obj)
    bevel = obj.modifiers.new('Key edge radius', 'BEVEL')
    bevel.width = 0.0007
    bevel.segments = 3
    obj['roomTarget'] = 'piano'


white = bpy.data.materials['Warm painted white']
black = bpy.data.materials['Graphite']
pitch = 1.20 / 36
start = -1.46
black_gaps = [i for i in range(35) if i % 7 in [0, 1, 3, 4, 5]]
for i in range(36):
    left = start + i * pitch + 0.0006
    right = start + (i + 1) * pitch - 0.0006
    inset_left = 0.0098 if i - 1 in black_gaps else 0
    inset_right = 0.0098 if i in black_gaps else 0
    profile = [(-3.505, left), (-3.505, right), (-3.635, right), (-3.636, right - inset_right), (-3.79, right - inset_right), (-3.79, left + inset_left), (-3.636, left + inset_left), (-3.635, left)]
    key('Piano sculpted white key', profile, 0.812, 0.833, white)
for i in black_gaps:
    center = start + (i + 1) * pitch
    key('Piano raised black key', [(-3.64, center - 0.0088), (-3.64, center + 0.0088), (-3.785, center + 0.0088), (-3.785, center - 0.0088)], 0.831, 0.86, black)
print('61-key keybed, 36 shaped white keys and 25 black keys, player-facing +X')
