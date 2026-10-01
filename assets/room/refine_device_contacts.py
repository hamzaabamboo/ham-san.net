import math
from pathlib import Path

import bpy
from mathutils import Vector


def refine_device_contacts():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Device contacts require the production source in Object mode')
    base = bpy.data.objects['Laptop base']
    tablet = bpy.data.objects['Tablet v2']
    stand = bpy.data.objects['Tablet v2 stand base']
    if base.get('rubberFeet'):
        raise RuntimeError('Device contacts already refined')
    bpy.context.view_layer.update()
    desk = bpy.data.objects['Desk top']
    desk_top = max((desk.matrix_world @ Vector(v)).z for v in desk.bound_box)
    points = [base.matrix_world @ Vector(v) for v in base.bound_box]
    low = Vector([min(p[i] for p in points) for i in range(3)])
    high = Vector([max(p[i] for p in points) for i in range(3)])
    height = low.z - desk_top
    if not 0 < height < 0.003:
        raise RuntimeError('Laptop support gap changed')
    material = bpy.data.materials['Laptop keycap charcoal'].copy()
    material.name = 'Laptop rubber feet'
    bsdf = next(n for n in material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Roughness'].default_value = 0.85
    created = []
    radius = 0.004
    sides = 16
    for x in (low.x + 0.018, high.x - 0.018):
        for y in (low.y + 0.022, high.y - 0.022):
            name = f'Laptop rubber foot {len(created) + 1}'
            vertices = [(x + radius * math.cos(i * math.tau / sides), y + radius * math.sin(i * math.tau / sides), z) for z in (desk_top, low.z) for i in range(sides)]
            faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
            faces.extend((i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides))
            data = bpy.data.meshes.new(name)
            data.from_pydata(vertices, [], faces)
            data.update()
            obj = bpy.data.objects.new(name, data)
            base.users_collection[0].objects.link(obj)
            data.materials.append(material)
            created.append(obj)
    stand_bottom = min((stand.matrix_world @ Vector(v)).z for v in stand.bound_box)
    shift = desk_top - stand_bottom
    if abs(shift) > 0.005:
        raise RuntimeError('Tablet support gap changed')
    matrix = tablet.matrix_world.copy()
    matrix.translation.z += shift
    tablet.matrix_world = matrix
    bpy.context.view_layer.update()
    degenerate = sum(p.area <= 1e-12 for o in created for p in o.data.polygons)
    if degenerate:
        raise RuntimeError('Laptop feet have zero-area faces')
    base['rubberFeet'] = True
    return {'feet': [o.name for o in created], 'foot_height': height, 'tablet_shift_z': shift, 'zero_area_faces': degenerate}


result = refine_device_contacts()
