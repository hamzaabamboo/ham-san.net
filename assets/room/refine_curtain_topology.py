import math
from pathlib import Path

import bpy
from mathutils.bvhtree import BVHTree


def refine_topology():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Curtain retopology requires production source in Object mode')
    panels = [bpy.data.objects[name] for name in ('Balcony curtain left', 'Balcony curtain right')]
    if any(panel.get('curtainTopologyRefined') for panel in panels):
        raise RuntimeError('Curtain topology already refined')
    plans = []
    for panel in panels:
        source = panel.data
        count = math.isqrt(len(source.vertices))
        if count * count != len(source.vertices):
            raise RuntimeError('Curtain must have a square source grid')
        uv = source.uv_layers.active
        grid = {}
        for loop in source.loops:
            point = uv.data[loop.index].uv
            cell = (round(point.x * (count - 1)), round(point.y * (count - 1)))
            if cell in grid and grid[cell] != loop.vertex_index:
                raise RuntimeError('Curtain UV grid is ambiguous')
            grid[cell] = loop.vertex_index
        if len(grid) != count * count:
            raise RuntimeError('Curtain UV grid is incomplete')
        rows = list(range(0, count, 4))
        if rows[-1] != count - 1:
            rows.append(count - 1)
        indices = [grid[(x, y)] for y in rows for x in range(count)]
        faces = [(j * count + i, j * count + i + 1, (j + 1) * count + i + 1, (j + 1) * count + i) for j in range(len(rows) - 1) for i in range(count - 1)]
        errors = {}
        for key in source.shape_keys.key_blocks:
            tree = BVHTree.FromPolygons([key.data[index].co for index in indices], faces)
            error = max(tree.find_nearest(vertex.co)[3] for vertex in key.data)
            if error > 0.00025:
                raise RuntimeError(f'Curtain surface deviation exceeds tolerance: {panel.name} {key.name} {error}')
            errors[key.name] = error
        plans.append((panel, source, count, rows, indices, faces, errors))
    result = []
    for panel, source, count, rows, indices, faces, errors in plans:
        mesh = bpy.data.meshes.new(f'{source.name} vertical retopology')
        mesh.from_pydata([source.vertices[index].co for index in indices], [], faces)
        mesh.update()
        for material in source.materials:
            mesh.materials.append(material)
        layer = mesh.uv_layers.new(name=source.uv_layers.active.name)
        for loop in mesh.loops:
            index = loop.vertex_index
            layer.data[loop.index].uv = (index % count / (count - 1), rows[index // count] / (count - 1))
        smooth = source.polygons[0].use_smooth
        for face in mesh.polygons:
            face.use_smooth = smooth
        source.use_fake_user = True
        panel.data = mesh
        for original in source.shape_keys.key_blocks:
            key = panel.shape_key_add(name=original.name, from_mix=False)
            for target, index in zip(key.data, indices):
                target.co = original.data[index].co
            key.value = original.value
            key.slider_min = original.slider_min
            key.slider_max = original.slider_max
            key.interpolation = original.interpolation
        panel['curtainOriginalMesh'] = source.name
        panel['curtainTopologyRefined'] = True
        result.append({'name': panel.name, 'vertices_before': len(source.vertices), 'vertices_after': len(mesh.vertices), 'surface_deviation_m': errors})
    bpy.context.view_layer.update()
    return {'panels': result}


result = refine_topology()
