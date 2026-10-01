import math
from pathlib import Path

import bpy
from mathutils import Vector


def refine_handy_fan():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Handy fan refinement requires the production source in Object mode')
    root = bpy.data.objects['Desk fan']
    if root.get('handyFanDeskMode'):
        raise RuntimeError('Handy fan already refined')
    plastic = bpy.data.materials['Desk fan pink plastic']
    collection = root.users_collection[0]
    normal = Vector((math.cos(math.radians(8)), 0, math.sin(math.radians(8))))
    horizontal = Vector((0, 1, 0))
    vertical = normal.cross(horizontal)
    center = Vector((-0.008, 0, 0.064))
    created = []

    def mesh(name, vertices, faces):
        data = bpy.data.meshes.new(name)
        data.from_pydata(vertices, [], faces)
        data.update()
        obj = bpy.data.objects.new(name, data)
        collection.objects.link(obj)
        obj.parent = root
        data.materials.append(plastic)
        created.append(obj)
        return obj

    outline = []
    for x, start in ((-0.030, -math.pi / 2), (-0.087, math.pi / 2)):
        for i in range(17):
            angle = start + i * math.pi / 16
            outline.append((x + 0.012 * math.cos(angle), 0.012 * math.sin(angle)))
    count = len(outline)
    vertices = [(x, y, z) for z in (0, 0.012) for x, y in outline]
    faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
    faces.extend((i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count))
    handle = mesh('Desk fan folded handle', vertices, faces)
    bevel = handle.modifiers.new('Soft grip edges', 'BEVEL')
    bevel.width = 0.0015
    bevel.segments = 3
    sides = 32
    hinge_center = Vector((-0.019, 0, 0.012))
    vertices = [hinge_center + Vector((0.008 * math.cos(i * math.tau / sides), y, 0.008 * math.sin(i * math.tau / sides))) for y in (-0.014, 0.014) for i in range(sides)]
    faces = [tuple(range(sides)), tuple(reversed(range(sides, sides * 2)))]
    faces.extend((i, i + sides, (i + 1) % sides + sides, (i + 1) % sides) for i in range(sides))
    mesh('Desk fan folding hinge', vertices, faces)
    vertices = []
    faces = []
    for blade in range(5):
        angle = blade * math.tau / 5
        outline = [(0.011, 0), (0.035, 0.06), (0.051, 0.30), (0.049, 0.72), (0.027, 0.90), (0.011, 0.55)]
        offset = len(vertices)
        for depth in (-0.001, 0.001):
            for radius, sweep in outline:
                vertices.append(radius * (horizontal * math.cos(angle + sweep) + vertical * math.sin(angle + sweep)) + normal * depth)
        faces.extend([tuple(offset + i for i in reversed(range(6))), tuple(offset + i for i in range(6, 12))])
        faces.extend((offset + i, offset + (i + 1) % 6, offset + (i + 1) % 6 + 6, offset + i + 6) for i in range(6))
    rotor = mesh('Desk fan rotor', vertices, faces)
    rotor.location = center - normal * 0.004
    rotor['fanAxis'] = list(normal)
    rotor_material = plastic.copy()
    rotor_material.name = 'Desk fan rotor plastic'
    next(n for n in rotor_material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value = (0.38, 0.27, 0.34, 1)
    rotor.data.materials[0] = rotor_material
    vertices = [center + normal * depth + 0.0115 * (horizontal * math.cos(i * math.tau / sides) + vertical * math.sin(i * math.tau / sides)) for depth in (-0.010, 0.013) for i in range(sides)]
    faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
    faces.extend((i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides))
    mesh('Desk fan motor hub', vertices, faces)
    for side in (1, 2):
        for label in ('folding support', 'pivot'):
            obj = bpy.data.objects[f'Desk fan {label} {side}']
            obj.hide_render = True
            obj.hide_set(True)
        foot = bpy.data.objects[f'Desk fan foot {side}']
        sign = -1 if side == 1 else 1
        for vertex in foot.data.vertices:
            vertex.co.x += 0.039
            vertex.co.y += sign * -0.010
            vertex.co.z *= 3.125
        foot.data.update()
    bpy.context.view_layer.update()
    degenerate = [(o.name, p.index) for o in created for p in o.data.polygons if p.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    root['handyFanDeskMode'] = True
    root['sourceRotorLayoutUnresolved'] = False
    return {'created': [o.name for o in created], 'zero_area_faces': len(degenerate)}


result = refine_handy_fan()
