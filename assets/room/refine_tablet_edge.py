import math
from pathlib import Path

import bpy


def refine_tablet_edge():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Tablet refinement requires the production source in Object mode')
    body = bpy.data.objects['Tablet v2 body']
    if bpy.data.objects.get('Tablet v2 blue edge'):
        raise RuntimeError('Tablet edge already exists')
    front = max(v.co.z for v in body.data.vertices)
    back = min(v.co.z for v in body.data.vertices)
    perimeter = [(v.co.x, v.co.y) for v in body.data.vertices if abs(v.co.z - front) < 1e-8]
    perimeter.sort(key=lambda p: math.atan2(p[1], p[0]))
    if len(perimeter) != 28:
        raise RuntimeError('Tablet perimeter topology changed')
    vertices = [(x * scale, y * scale, z) for z in (back, front) for scale in (1.0006, 1.008) for x, y in perimeter]
    count = len(perimeter)
    faces = []
    for i in range(count):
        j = (i + 1) % count
        faces.extend([
            (i, j, j + count, i + count),
            (i + count * 2, i + count * 3, j + count * 3, j + count * 2),
            (i, i + count * 2, j + count * 2, j),
            (i + count, j + count, j + count * 3, i + count * 3)
        ])
    data = bpy.data.meshes.new('Tablet v2 blue edge')
    data.from_pydata(vertices, [], faces)
    data.update()
    edge = bpy.data.objects.new('Tablet v2 blue edge', data)
    body.users_collection[0].objects.link(edge)
    edge.parent = body
    material = bpy.data.materials.new('Tablet blue edge')
    material.use_nodes = True
    bsdf = next(n for n in material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = (0.045, 0.18, 0.28, 1)
    bsdf.inputs['Metallic'].default_value = 0.45
    bsdf.inputs['Roughness'].default_value = 0.38
    data.materials.append(material)
    bpy.context.view_layer.update()
    degenerate = sum(p.area <= 1e-12 for p in data.polygons)
    if degenerate:
        raise RuntimeError('Tablet edge has zero-area faces')
    return {'created': edge.name, 'zero_area_faces': degenerate}


result = refine_tablet_edge()
