import math
from pathlib import Path

import bpy
from mathutils import Matrix


def refine_tote():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Tote refinement requires production source in Object mode')
    obj = bpy.data.objects['Striped tote']
    if obj.get('foldedToteRefined'):
        raise RuntimeError('Striped tote already refined')
    original = obj.data
    original.use_fake_user = True
    material = original.materials[0]
    vertices = []
    width_samples = 24
    rows = 17
    for side in range(2):
        for row in range(rows):
            v = row / (rows - 1)
            for column in range(width_samples):
                u = column / (width_samples - 1)
                width = 0.235 + 0.045 * v
                x = 0.30 + (u - 0.5) * width
                fold = 0.006 * math.sin(u * math.tau * 3 + v * 2) * math.sin(math.pi * u)
                depth = 0.014 + 0.025 * v
                y = -1.357 + (1 if side == 0 else -1) * depth + fold
                z = 0.445 + 0.39 * v - 0.012 * v ** 8 * math.sin(math.pi * u)
                vertices.append((x, y, z))
    faces = []
    block = width_samples * rows
    for side in range(2):
        for row in range(rows - 1):
            for column in range(width_samples - 1):
                i = side * block + row * width_samples + column
                face = (i, i + 1, i + width_samples + 1, i + width_samples)
                faces.append(face if side == 0 else tuple(reversed(face)))
    for row in range(rows - 1):
        for column in (0, width_samples - 1):
            i = row * width_samples + column
            faces.append((i, i + width_samples, i + width_samples + block, i + block))
    for column in range(width_samples - 1):
        faces.append((column, column + block, column + block + 1, column + 1))
    mesh = bpy.data.meshes.new('Striped tote open cloth')
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update()
    uv = mesh.uv_layers.new(name='UVMap')
    for loop in mesh.loops:
        index = loop.vertex_index % block
        uv.data[loop.index].uv = (index % width_samples / (width_samples - 1), index // width_samples / (rows - 1))
    for face in mesh.polygons:
        face.use_smooth = True
    obj.data = mesh
    obj.matrix_world = Matrix.Identity(4)
    obj.modifiers.clear()
    solidify = obj.modifiers.new('Canvas thickness', 'SOLIDIFY')
    solidify.thickness = 0.0012
    collection = obj.users_collection[0]
    handles = []
    for side in range(2):
        vertices = []
        y = -1.357 + (1 if side == 0 else -1) * 0.039
        for step in range(33):
            angle = math.pi * step / 32
            x = 0.30 - 0.070 * math.cos(angle)
            z = 0.832 + 0.145 * math.sin(angle)
            strap_y = y - 0.12 * math.sin(angle)
            vertices.extend(((x - 0.007, strap_y, z), (x + 0.007, strap_y, z)))
        faces = [(2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2) for i in range(32)]
        data = bpy.data.meshes.new(f'Striped tote handle {side + 1}')
        data.from_pydata(vertices, [], faces)
        data.materials.append(bpy.data.materials['Tote canvas white'])
        data.update()
        handle = bpy.data.objects.new(data.name, data)
        collection.objects.link(handle)
        handle.parent = obj
        modifier = handle.modifiers.new('Canvas strap thickness', 'SOLIDIFY')
        modifier.thickness = 0.0015
        handles.append(handle.name)
    obj['foldedToteRefined'] = True
    obj['toteOriginalMesh'] = original.name
    bpy.context.view_layer.update()
    return {'body_vertices': len(mesh.vertices), 'handles': handles, 'original_mesh': original.name}


result = refine_tote()
