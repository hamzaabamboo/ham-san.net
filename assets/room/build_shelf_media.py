import os
import random

import bpy

HERE = os.path.dirname(bpy.data.filepath)
FRONT_X = 2.935
ROWS = (0.048, 0.388, 0.738)
BAYS = ((-0.112, 0.161), (0.179, 0.452), (0.488, 0.761), (0.779, 1.052))
KINDS = {
    'cd': {'atlas': 'Spines CDs', 'columns': 24, 'thick': (0.0104, 0.0104), 'height': (0.125, 0.125), 'depth': 0.142, 'body': 'CD jewel case'},
    'book': {'atlas': 'Spines manga', 'columns': 16, 'thick': (0.015, 0.024), 'height': (0.176, 0.19), 'depth': 0.128, 'body': 'Notes paper cream'},
    'bigbook': {'atlas': 'Spines books', 'columns': 16, 'thick': (0.012, 0.02), 'height': (0.25, 0.262), 'depth': 0.18, 'body': 'Notes paper cream'},
    'folder': {'atlas': 'Spines folders', 'columns': 16, 'thick': (0.036, 0.058), 'height': (0.295, 0.305), 'depth': 0.27, 'body': 'Notes paper cream'},
}
PLANS = (
    (('book', 9), ('cd', 7)),
    (('folder', 5),),
    (('cd', 22),),
    (('bigbook', 6), ('book', 5)),
    (('folder', 3), ('book', 6)),
    (('cd', 11), ('folder', 2)),
    (('book', 13),),
    (('cd', 12), ('bigbook', 5)),
    (('folder', 5),),
    (('book', 7), ('cd', 8)),
    (('cd', 21),),
    (('folder', 2), ('bigbook', 4), ('book', 3)),
)


def ensure_materials():
    image = bpy.data.images.load(os.path.join(HERE, 'art', 'baked', 'spines-cds.png'), check_existing=True)
    cds = bpy.data.materials.get('Spines CDs') or bpy.data.materials.new('Spines CDs')
    cds.use_nodes = True
    tree = cds.node_tree
    texture = tree.nodes.get('Image Texture') or tree.nodes.new('ShaderNodeTexImage')
    texture.image = image
    shader = tree.nodes['Principled BSDF']
    tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
    shader.inputs['Roughness'].default_value = 0.25
    jewel = bpy.data.materials.get('CD jewel case') or bpy.data.materials.new('CD jewel case')
    jewel.use_nodes = True
    jewel.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.78, 0.8, 0.83, 1)
    jewel.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.15


def build_bay(index):
    rng = random.Random(100 + index)
    z0 = ROWS[index // 4] + 0.0005
    y_start, y_end = BAYS[index % 4]
    y = y_start + 0.003
    verts, faces, face_uvs, face_mats, mats = [], [], [], [], []

    def material(name):
        if name not in mats:
            mats.append(name)
        return mats.index(name)

    for kind, count in PLANS[index]:
        spec = KINDS[kind]
        for _ in range(count):
            thick = rng.uniform(*spec['thick'])
            if y + thick > y_end - 0.003:
                break
            height = rng.uniform(*spec['height'])
            x0, x1 = FRONT_X, FRONT_X + spec['depth']
            y0, y1 = y, y + thick
            z1 = z0 + height
            base = len(verts)
            verts += [(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)]
            column = rng.randrange(spec['columns'])
            u0, u1 = column / spec['columns'], (column + 1) / spec['columns']
            faces.append((base, base + 3, base + 2, base + 1))
            face_uvs.append(((u1, 0), (u1, 1), (u0, 1), (u0, 0)))
            face_mats.append(material(spec['atlas']))
            for quad in ((4, 5, 6, 7), (0, 1, 5, 4), (3, 7, 6, 2), (0, 4, 7, 3), (1, 2, 6, 5)):
                faces.append(tuple(base + i for i in quad))
                face_uvs.append(((0, 0), (1, 0), (1, 1), (0, 1)))
                face_mats.append(material(spec['body']))
            y = y1 + 0.0008
        y += 0.005

    name = f'Bay media {index:02d}'
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    uv_layer = mesh.uv_layers.new(name='UVMap')
    for polygon, uvs, mat in zip(mesh.polygons, face_uvs, face_mats):
        polygon.material_index = mat
        for loop_index, uv in zip(polygon.loop_indices, uvs):
            uv_layer.data[loop_index].uv = uv
    for mat_name in mats:
        mesh.materials.append(bpy.data.materials[mat_name])
    mesh.validate()
    obj = bpy.data.objects.new(name, mesh)
    bpy.data.collections['Shelf books'].objects.link(obj)
    obj['roomTarget'] = 'hobbies'
    return name, len(faces) // 6
