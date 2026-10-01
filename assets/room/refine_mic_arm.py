import math

import bpy
from mathutils import Vector


def refine_mic_arm():
    if bpy.data.objects.get('Mic arm lower rail 1'):
        raise RuntimeError('Mic arm detail already exists')
    bpy.context.view_layer.update()
    originals = [bpy.data.objects[name] for name in ('Mic arm lower', 'Mic arm upper')]
    material = originals[0].data.materials[0]
    collection = originals[0].users_collection[0]
    segments = []
    for obj in originals:
        low = min(v[2] for v in obj.bound_box)
        high = max(v[2] for v in obj.bound_box)
        segments.append((obj.matrix_world @ Vector((0, 0, low)), obj.matrix_world @ Vector((0, 0, high))))
    normal = (segments[0][1] - segments[0][0]).cross(segments[1][1] - segments[1][0]).normalized()
    created = []

    def mesh(name, vertices, faces):
        data = bpy.data.meshes.new(name)
        data.from_pydata(vertices, [], faces)
        data.update()
        obj = bpy.data.objects.new(name, data)
        collection.objects.link(obj)
        data.materials.append(material)
        created.append(obj)
        return obj

    def tube(name, points, radius, sides=8):
        vertices = []
        for index, point in enumerate(points):
            tangent = points[min(index + 1, len(points) - 1)] - points[max(index - 1, 0)]
            tangent.normalize()
            basis = tangent.cross(normal)
            if basis.length < 0.01:
                basis = tangent.cross(Vector((0, 0, 1)))
            basis.normalize()
            other = tangent.cross(basis).normalized()
            for side in range(sides):
                angle = side * math.tau / sides
                vertices.append(point + radius * (basis * math.cos(angle) + other * math.sin(angle)))
        faces = []
        for ring in range(len(points) - 1):
            for side in range(sides):
                a = ring * sides + side
                b = ring * sides + (side + 1) % sides
                faces.append((a, b, b + sides, a + sides))
        faces.extend([tuple(reversed(range(sides))), tuple((len(points) - 1) * sides + side for side in range(sides))])
        obj = mesh(name, vertices, faces)
        for polygon in obj.data.polygons:
            polygon.use_smooth = len(polygon.vertices) == 4
        return obj

    for index, (start, end) in enumerate(segments):
        label = 'lower' if index == 0 else 'upper'
        direction = (end - start).normalized()
        lateral = normal.cross(direction).normalized()
        for rail, sign in enumerate((-1, 1), 1):
            offset = lateral * sign * 0.014
            vertices = []
            for point in (start, end):
                for x, y in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                    vertices.append(point + offset + lateral * x * 0.004 + normal * y * 0.003)
            obj = mesh('Mic arm ' + label + ' rail ' + str(rail), vertices, [
                (3, 2, 1, 0), (4, 5, 6, 7), (0, 1, 5, 4),
                (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)
            ])
            bevel = obj.modifiers.new('Manufactured edges', 'BEVEL')
            bevel.width = 0.0007
            bevel.segments = 2
        spring_start = start.lerp(end, 0.18) + normal * 0.008
        spring_end = start.lerp(end, 0.79) + normal * 0.008
        points = []
        steps = 160
        for step in range(steps + 1):
            amount = step / steps
            angle = amount * math.tau * 20
            points.append(spring_start.lerp(spring_end, amount) + 0.004 * (normal * math.cos(angle) + lateral * math.sin(angle)))
        tube('Mic arm ' + label + ' tension spring', points, 0.0008)
        for end_index, (spring_point, rail_point) in enumerate(((points[0], start), (points[-1], end)), 1):
            tube('Mic arm ' + label + ' spring hook ' + str(end_index), [spring_point, rail_point + normal * 0.008], 0.0008)
        originals[index].hide_render = True
        originals[index].hide_set(True)

    for index, point in enumerate((segments[0][0], segments[0][1], segments[1][1]), 1):
        tube('Mic arm pivot ' + str(index), [point - normal * 0.018, point + normal * 0.018], 0.019, 24)
    bpy.data.objects['Mic arm elbow'].hide_render = True
    bpy.data.objects['Mic arm elbow'].hide_set(True)
    bpy.context.view_layer.update()
    degenerate = [(obj.name, polygon.index) for obj in created for polygon in obj.data.polygons if polygon.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    return {'created': [obj.name for obj in created], 'zero_area_faces': len(degenerate)}


result = refine_mic_arm()
