import math
from pathlib import Path

import bpy


def refine_blue_curtains():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Blue curtain refinement requires production source in Object mode')
    panels = [bpy.data.objects[name] for name in ('Window curtain left', 'Window curtain right')]
    if any(panel.get('blueCurtainRefined') for panel in panels):
        raise RuntimeError('Blue curtains already refined')
    result = []
    for side, panel in enumerate(panels):
        source = panel.data
        count = math.isqrt(len(source.vertices))
        if count * count != len(source.vertices):
            raise RuntimeError('Expected square curtain grid')
        grid = {}
        for loop in source.loops:
            u, v = source.uv_layers.active.data[loop.index].uv
            cell = (round(u * (count - 1)), round(v * (count - 1)))
            if cell in grid and grid[cell] != loop.vertex_index:
                raise RuntimeError('Ambiguous curtain UV grid')
            grid[cell] = loop.vertex_index
        if len(grid) != count * count:
            raise RuntimeError('Incomplete curtain UV grid')
        rows = list(range(0, count, 3))
        if rows[-1] != count - 1:
            rows.append(count - 1)
        indices = [grid[(x, y)] for y in rows for x in range(count)]
        faces = [(j * count + i, j * count + i + 1, (j + 1) * count + i + 1, (j + 1) * count + i) for j in range(len(rows) - 1) for i in range(count - 1)]
        mesh = bpy.data.meshes.new(f'{source.name} blue drape')
        mesh.from_pydata([source.vertices[index].co for index in indices], [], faces)
        mesh.update()
        for material in source.materials:
            mesh.materials.append(material)
        layer = mesh.uv_layers.new(name=source.uv_layers.active.name)
        for loop in mesh.loops:
            index = loop.vertex_index
            layer.data[loop.index].uv = (index % count / (count - 1), rows[index // count] / (count - 1))
        for face in mesh.polygons:
            face.use_smooth = True
        source.use_fake_user = True
        panel.data = mesh
        for original in source.shape_keys.key_blocks:
            key = panel.shape_key_add(name=original.name, from_mix=False)
            for index, (vertex, source_index) in enumerate(zip(key.data, indices)):
                vertex.co = original.data[source_index].co
                u = index % count / (count - 1)
                v = rows[index // count] / (count - 1)
                header = math.exp(-((v - 0.95) / 0.06) ** 2)
                phase = math.tau * (7 * u + 0.12 * math.sin(u * 11 + side))
                drift = 0.9 * (1 - v) ** 2 * math.sin(u * 8 + side)
                amplitude = 0.024 * (0.9 + 0.25 * math.sin(u * 13 + side))
                vertex.co.x += 0.015 * math.sin(math.pi * u) * (1 - v) ** 2 * math.sin(u * 6 + side)
                vertex.co.y = 1.79 + amplitude * math.sin(phase + drift) + 0.009 * header * math.sin(phase * 2)
                vertex.co.z = 0.12 + 2.10 * v - 0.025 * header * math.sin(phase) ** 2 + 0.015 * (1 - v) ** 10 * math.sin(u * 12 + side) ** 2
            key.value = original.value
            key.slider_min = original.slider_min
            key.slider_max = original.slider_max
            key.interpolation = original.interpolation
        for vertex, basis in zip(mesh.vertices, mesh.shape_keys.key_blocks['Basis'].data):
            vertex.co = basis.co
        mesh.update()
        panel['blueCurtainRefined'] = True
        panel['curtainOriginalMesh'] = source.name
        result.append({'name': panel.name, 'vertices_before': len(source.vertices), 'vertices_after': len(mesh.vertices)})
    bpy.context.view_layer.update()
    return {'panels': result}


result = refine_blue_curtains()
