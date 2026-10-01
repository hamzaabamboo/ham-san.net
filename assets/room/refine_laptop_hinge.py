import math
from pathlib import Path

import bpy
from mathutils import Vector


def refine_laptop_hinge():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Laptop hinge refinement requires the production source in Object mode')
    base = bpy.data.objects['Laptop base']
    lid = bpy.data.objects['Laptop lid']
    screen = bpy.data.objects['Laptop screen image']
    if base.get('hingeDetail') or bpy.data.objects.get('Laptop hinge barrel'):
        raise RuntimeError('Laptop hinge already refined')
    if any(o.parent or o.children for o in (lid, screen)):
        raise RuntimeError('Laptop display hierarchy changed')
    bpy.context.view_layer.update()
    base_points = [base.matrix_world @ Vector(v) for v in base.bound_box]
    low = Vector([min(p[i] for p in base_points) for i in range(3)])
    high = Vector([max(p[i] for p in base_points) for i in range(3)])
    points = [lid.matrix_world @ v.co for v in lid.data.vertices]
    bottom = min(p.z for p in points)
    edge = [p for p in points if p.z <= bottom + (high.z - low.z)]
    old_x = sum(p.x for p in edge) / len(edge)
    hinge_x = low.x + (high.x - low.x) * 0.08
    offset = Vector((hinge_x - old_x, 0, high.z + 0.0004 - bottom))
    for obj in (lid, screen):
        matrix = obj.matrix_world.copy()
        matrix.translation += offset
        obj.matrix_world = matrix
    radius = (high.y - low.y) * 0.011
    sides = 32
    margin = (high.y - low.y) * 0.055
    vertices = [
        (hinge_x + radius * math.cos(i * math.tau / sides), y, high.z + radius * math.sin(i * math.tau / sides))
        for y in (low.y + margin, high.y - margin) for i in range(sides)
    ]
    faces = [tuple(range(sides)), tuple(reversed(range(sides, sides * 2)))]
    faces.extend((i, i + sides, (i + 1) % sides + sides, (i + 1) % sides) for i in range(sides))
    data = bpy.data.meshes.new('Laptop hinge barrel')
    data.from_pydata(vertices, [], faces)
    data.update()
    hinge = bpy.data.objects.new('Laptop hinge barrel', data)
    base.users_collection[0].objects.link(hinge)
    data.materials.append(base.data.materials[0])
    for polygon in data.polygons:
        polygon.use_smooth = len(polygon.vertices) == 4
    bpy.context.view_layer.update()
    degenerate = sum(p.area <= 1e-12 for p in data.polygons)
    if degenerate:
        raise RuntimeError('Hinge has zero-area faces')
    base['hingeDetail'] = True
    return {'offset': list(offset), 'hinge': hinge.name, 'zero_area_faces': degenerate}


result = refine_laptop_hinge()
