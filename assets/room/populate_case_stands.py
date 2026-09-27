import os
import random

import bmesh
import bpy

GEN = os.path.join(os.path.dirname(bpy.data.filepath), 'art', 'gen')
COLLECTION = bpy.data.collections['Display cases']
STAND_HEIGHT = 0.19
STAND_WIDTH = STAND_HEIGHT * 2 / 3
ROWS = ((3.00, 0.0), (3.10, 0.034), (3.20, 0.074))


def stand_material(index):
    name = f'Stand art {index:02d}'
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    for node in list(nodes):
        if node.type not in ('BSDF_PRINCIPLED', 'OUTPUT_MATERIAL'):
            nodes.remove(node)
    bsdf = nodes['Principled BSDF']
    texture = nodes.new('ShaderNodeTexImage')
    texture.image = bpy.data.images.load(os.path.join(GEN, f'stand-{index:02d}.png'), check_existing=True)
    material.node_tree.links.new(texture.outputs['Color'], bsdf.inputs['Base Color'])
    material.node_tree.links.new(texture.outputs['Alpha'], bsdf.inputs['Alpha'])
    bsdf.inputs['Roughness'].default_value = 0.3
    material.surface_render_method = 'DITHERED'
    return material


def stand(name, x, y, z, scale, index):
    height = STAND_HEIGHT * scale
    width = STAND_WIDTH * scale
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new('UVMap')
    corners = [(y + width / 2, z), (y - width / 2, z), (y - width / 2, z + height), (y + width / 2, z + height)]
    face = bm.faces.new([bm.verts.new((x, cy, cz)) for cy, cz in corners])
    for loop, coords in zip(face.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop[uv].uv = coords
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    COLLECTION.objects.link(obj)
    mesh.materials.append(stand_material(index))
    obj['roomTarget'] = 'hobbies'
    return obj


def populate():
    for obj in list(COLLECTION.objects):
        if obj.name.startswith('Case stand'):
            bpy.data.objects.remove(obj, do_unlink=True)
    count = len([f for f in os.listdir(GEN) if f.startswith('stand-') and f.endswith('.png')])
    cases = sorted(
        (o for o in COLLECTION.objects if o.name.startswith('Cube case') and o.name.count(' ') == 2),
        key=lambda o: o.name,
    )
    rng = random.Random(4)
    art = list(range(1, count + 1))
    per_case = -(-count // len(cases))
    placed = 0
    for case_index, case in enumerate(cases):
        ys = [(case.matrix_world @ v.co).y for v in case.data.vertices]
        zs = [(case.matrix_world @ v.co).z for v in case.data.vertices]
        y0, y1, z0 = min(ys), max(ys), min(zs)
        batch = art[case_index * per_case:(case_index + 1) * per_case]
        for slot, index in enumerate(batch):
            row = slot % 3
            x, lift = ROWS[row]
            column = slot // 3
            columns = max(1, -(-len(batch) // 3))
            y = y0 + 0.05 + (y1 - y0 - 0.10) * ((column + 0.5 + 0.25 * (row % 2)) / columns)
            scale = rng.uniform(0.9, 1.1)
            stand(f'Case stand {index:02d}', x - 0.002 * row, y, z0 + 0.004 + lift, scale, index)
            placed += 1
    return placed


result = {'placed': populate()}
