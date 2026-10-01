from pathlib import Path

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree


def refine_contact():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Bag contact requires production source in Object mode')
    bag = bpy.data.objects['Camera bag']
    if bag.get('shelfContactRefined'):
        raise RuntimeError('Camera bag contact already refined')
    bpy.context.view_layer.update()
    shelf = bpy.data.objects['Entry rack shelf 1']
    points = [bag.matrix_world @ vertex.co for vertex in bag.data.vertices]
    low = [min(point[a] for point in points) for a in range(3)]
    high = [max(point[a] for point in points) for a in range(3)]
    support = [shelf.matrix_world @ vertex.co for vertex in shelf.data.vertices]
    tree = BVHTree.FromPolygons(support, [list(face.vertices) for face in shelf.data.polygons])
    xs = sorted(set(point.x for point in support if low[0] < point.x < high[0]))
    y = (low[1] + high[1]) / 2
    support = [tree.ray_cast(Vector((x, y, low[2] + 0.1)), Vector((0, 0, -1)), 0.2)[0] for x in xs]
    support = [point for point in support if point is not None]
    if not support:
        raise RuntimeError('No wire support under camera bag')
    height = max(point.z for point in support)
    delta = height - low[2]
    matrix = bag.matrix_world.copy()
    matrix.translation.z += delta
    bag.matrix_world = matrix
    bag['shelfContactRefined'] = True
    bpy.context.view_layer.update()
    return {'bag': bag.name, 'delta_z_m': delta, 'support_height_m': height}


result = refine_contact()
