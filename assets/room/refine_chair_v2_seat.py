import math

import bpy


def refine_chair_cushion():
    obj = bpy.data.objects['Chair shell']
    if obj.get('roundedSeatCushion'):
        raise RuntimeError('Chair cushion already refined')
    bpy.context.view_layer.update()
    material_index = next(
        index for index, material in enumerate(obj.data.materials)
        if material.name == 'Chair v2 cushion linen'
    )
    indices = {
        index for polygon in obj.data.polygons if polygon.material_index == material_index
        for index in polygon.vertices
    }
    other_indices = {
        index for polygon in obj.data.polygons if polygon.material_index != material_index
        for index in polygon.vertices
    }
    if indices & other_indices:
        raise RuntimeError('Cushion shares vertices with chair frame')
    points = [obj.matrix_world @ obj.data.vertices[index].co for index in indices]
    center_x = (min(p.x for p in points) + max(p.x for p in points)) / 2
    center_y = (min(p.y for p in points) + max(p.y for p in points)) / 2
    radius_x = (max(p.x for p in points) - min(p.x for p in points)) / 2
    radius_y = (max(p.y for p in points) - min(p.y for p in points)) / 2
    inverse = obj.matrix_world.inverted()
    for index in indices:
        point = obj.matrix_world @ obj.data.vertices[index].co
        x = (point.x - center_x) / radius_x
        y = (point.y - center_y) / radius_y
        radius = math.hypot(x, y)
        if radius > 1e-8:
            factor = radius / (x ** 4 + y ** 4) ** 0.25
            point.x = center_x + radius_x * x * factor
            point.y = center_y + radius_y * y * factor
            obj.data.vertices[index].co = inverse @ point
    obj.data.update()
    bpy.context.view_layer.update()
    degenerate = sum(p.area <= 1e-12 for p in obj.data.polygons)
    if degenerate:
        raise RuntimeError(f'Chair has {degenerate} zero-area faces')
    obj['roundedSeatCushion'] = True
    return {'vertices': len(indices), 'zero_area_faces': degenerate}


result = refine_chair_cushion()
