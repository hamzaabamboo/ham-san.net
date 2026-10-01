import math
from pathlib import Path

import bpy
from mathutils import Vector


def add_desk_fan():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Desk fan requires the production source in Object mode')
    if bpy.data.objects.get('Desk fan'):
        raise RuntimeError('Desk fan already exists')
    bpy.context.view_layer.update()
    riser = bpy.data.objects['Monitor riser top']
    points = [riser.matrix_world @ Vector(v) for v in riser.bound_box]
    support_z = max(p.z for p in points)
    collection = riser.users_collection[0]
    root = bpy.data.objects.new('Desk fan', None)
    collection.objects.link(root)
    root.location = (-1.65, min(p.y for p in points) + 0.059, support_z)
    root['sourceRotorLayoutUnresolved'] = True
    pink = bpy.data.materials.new('Desk fan pink plastic')
    pink.use_nodes = True
    bsdf = next(n for n in pink.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = (0.55, 0.38, 0.48, 1)
    bsdf.inputs['Roughness'].default_value = 0.4
    hub_material = pink.copy()
    hub_material.name = 'Desk fan pale hub'
    next(n for n in hub_material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value = (0.72, 0.62, 0.70, 1)
    normal = Vector((math.cos(math.radians(8)), 0, math.sin(math.radians(8))))
    horizontal = Vector((0, 1, 0))
    vertical = normal.cross(horizontal)
    center = Vector((-0.008, 0, 0.064))
    created = []

    def mesh(name, vertices, faces, material=pink):
        data = bpy.data.meshes.new(name)
        data.from_pydata(vertices, [], faces)
        data.update()
        obj = bpy.data.objects.new(name, data)
        collection.objects.link(obj)
        obj.parent = root
        data.materials.append(material)
        created.append(obj)
        return obj

    def shell():
        sides = 64
        profile = [(0.060, 0.013), (0.056, 0.013), (0.054, -0.015), (0.059, -0.015)]
        vertices = [center + normal * depth + radius * (horizontal * math.cos(i * math.tau / sides) + vertical * math.sin(i * math.tau / sides)) for radius, depth in profile for i in range(sides)]
        faces = []
        for ring in range(len(profile)):
            next_ring = (ring + 1) % len(profile)
            faces.extend((ring * sides + i, ring * sides + (i + 1) % sides, next_ring * sides + (i + 1) % sides, next_ring * sides + i) for i in range(sides))
        obj = mesh('Desk fan shell', vertices, faces)
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
        return obj

    def tube(name, points, radius, sides=6):
        vertices = []
        for i, point in enumerate(points):
            tangent = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
            basis = tangent.cross(normal)
            if basis.length < 1e-5:
                basis = tangent.cross(horizontal)
            basis.normalize()
            other = tangent.cross(basis).normalized()
            vertices.extend(point + radius * (basis * math.cos(j * math.tau / sides) + other * math.sin(j * math.tau / sides)) for j in range(sides))
        faces = [tuple(reversed(range(sides))), tuple((len(points) - 1) * sides + j for j in range(sides))]
        for i in range(len(points) - 1):
            faces.extend((i * sides + j, i * sides + (j + 1) % sides, (i + 1) * sides + (j + 1) % sides, (i + 1) * sides + j) for j in range(sides))
        obj = mesh(name, vertices, faces)
        for polygon in obj.data.polygons:
            polygon.use_smooth = len(polygon.vertices) == 4
        return obj

    def cylinder(name, origin, axis, radius, length, material=pink, sides=32):
        direction = axis.normalized()
        basis = direction.cross(Vector((0, 0, 1)))
        if basis.length < 1e-5:
            basis = direction.cross(horizontal)
        basis.normalize()
        other = direction.cross(basis).normalized()
        vertices = [origin + direction * d + radius * (basis * math.cos(i * math.tau / sides) + other * math.sin(i * math.tau / sides)) for d in (-length / 2, length / 2) for i in range(sides)]
        faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
        faces.extend((i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides))
        return mesh(name, vertices, faces, material)

    shell()
    for spoke in range(28):
        points = []
        for step in range(13):
            amount = step / 12
            radius = 0.015 + amount * 0.041
            angle = spoke * math.tau / 28 + (1 - amount) * 0.68
            points.append(center + normal * (0.013 + 0.0015 * math.sin(amount * math.pi)) + radius * (horizontal * math.cos(angle) + vertical * math.sin(angle)))
        tube(f'Desk fan grille {spoke + 1}', points, 0.0012)
    cylinder('Desk fan center hub', center + normal * 0.014, normal, 0.0157, 0.004, hub_material)
    for side, sign in enumerate((-1, 1), 1):
        foot = Vector((-0.028, sign * 0.035, 0.002))
        joint = Vector((-0.016, sign * 0.044, 0.026))
        cylinder(f'Desk fan foot {side}', foot, Vector((0, 0, 1)), 0.008, 0.004)
        tube(f'Desk fan folding support {side}', [foot + Vector((0, 0, 0.002)), joint], 0.0045, 12)
        cylinder(f'Desk fan pivot {side}', joint, horizontal, 0.006, 0.005, sides=24)
    cup = bpy.data.objects['Desk pen cup']
    pens = [bpy.data.objects[f'Desk pen {i}'] for i in range(1, 5)]
    if any(o.parent for o in [cup, *pens]):
        raise RuntimeError('Pen cup hierarchy changed')
    for obj in [cup, *pens]:
        obj.location.y += 0.06
    bpy.context.view_layer.update()
    degenerate = [(o.name, p.index) for o in created for p in o.data.polygons if p.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    return {'root': root.name, 'created': len(created), 'zero_area_faces': len(degenerate), 'support_z': support_z}


result = add_desk_fan()
