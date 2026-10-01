import math

import bmesh
import bpy


def refine_chair_surface():
    obj = bpy.data.objects['Chair shell']
    if obj.get('tuftedSeatCushion'):
        raise RuntimeError('Chair surface already refined')
    material_index = next(
        index for index, material in enumerate(obj.data.materials)
        if material.name == 'Chair v2 cushion linen'
    )
    mesh = bmesh.new()
    mesh.from_mesh(obj.data)
    caps = [face for face in mesh.faces if face.material_index == material_index and len(face.verts) > 4]
    bmesh.ops.poke(mesh, faces=caps)
    edges = {edge for face in mesh.faces if face.material_index == material_index for edge in face.edges}
    bmesh.ops.subdivide_edges(mesh, edges=list(edges), cuts=4, use_grid_fill=True)
    mesh.to_mesh(obj.data)
    mesh.free()
    bpy.context.view_layer.update()
    indices = {
        index for polygon in obj.data.polygons if polygon.material_index == material_index
        for index in polygon.vertices
    }
    points = [obj.matrix_world @ obj.data.vertices[index].co for index in indices]
    low = [min(point[axis] for point in points) for axis in range(3)]
    high = [max(point[axis] for point in points) for axis in range(3)]
    middle = [(a + b) / 2 for a, b in zip(low, high)]
    inverse = obj.matrix_world.inverted()
    for index in indices:
        point = obj.matrix_world @ obj.data.vertices[index].co
        if point.z <= middle[2]:
            continue
        depth = 0
        for x in (-0.22, 0.22):
            for y in (-0.22, 0.22):
                dx = (point.x - middle[0]) / (high[0] - low[0]) - x
                dy = (point.y - middle[1]) / (high[1] - low[1]) - y
                depth += math.exp(-(dx * dx + dy * dy) / 0.008)
        weight = min(1, (point.z - middle[2]) / (high[2] - middle[2]))
        point.z -= 0.007 * depth * weight
        obj.data.vertices[index].co = inverse @ point
    obj.data.update()
    degenerate = sum(polygon.area <= 1e-12 for polygon in obj.data.polygons)
    if degenerate:
        raise RuntimeError(f'Chair has {degenerate} zero-area faces')
    material = bpy.data.materials['Chair v2 leather cognac']
    material.node_tree.nodes['Normal Map'].inputs['Strength'].default_value = 0.08
    obj['tuftedSeatCushion'] = True
    return {'cushion_vertices': len(indices), 'zero_area_faces': degenerate}


result = refine_chair_surface()
