import bpy

source = bpy.data.collections['RoomHome']
root = bpy.data.objects['Skill toy cardistry']
paper = bpy.data.materials['Paper']

if bpy.data.objects.get('Skill toy cardistry face rank 1'):
    raise RuntimeError('Card faces already refined')


def material(name, color):
    result = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    result.use_nodes = True
    shader = result.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = 0.55
    return result


black = material('Card face ink black', (0.012, 0.014, 0.018))
red = material('Card face ink red', (0.62, 0.018, 0.025))


def finish(obj, name, mat):
    obj.name = 'Skill toy cardistry ' + name
    local = obj.matrix_basis.copy()
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    source.objects.link(obj)
    obj.parent = root
    obj.matrix_parent_inverse.identity()
    obj.matrix_basis = local
    obj['roomTarget'] = 'cardistry'
    obj.data.materials.append(mat)
    return obj


def text(name, value, location, angle, mat, size):
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = value
    curve.align_x = 'CENTER'
    curve.align_y = 'CENTER'
    curve.size = size
    curve.extrude = 0.00014
    curve.resolution_u = 10
    obj = bpy.data.objects.new(name, curve)
    source.objects.link(obj)
    obj.location = location
    obj.rotation_euler.z = angle
    return finish(obj, name, mat)


faces = [('A', 'S', black), ('7', 'H', red), ('Q', 'D', red), ('3', 'C', black), ('K', 'H', red)]
for index, (rank, suit, mat) in enumerate(faces, 1):
    angle = -0.12 * (index - 1)
    x = 0.042 + 0.014 * (index - 1)
    y = 0.006 + 0.004 * (index - 1)
    text(f'face rank {index}', rank, (x - 0.021, y - 0.031, 0.00072 + 0.00035 * (index - 1)), angle, mat, 0.014)
    text(f'face suit {index}', suit, (x - 0.021, y - 0.045, 0.00073 + 0.00035 * (index - 1)), angle, mat, 0.010)
    text(f'face rank lower {index}', rank, (x + 0.021, y + 0.031, 0.00074 + 0.00035 * (index - 1)), angle + 3.14159265, mat, 0.014)

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Five card faces added with ranks and suits')
