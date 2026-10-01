import math
from pathlib import Path

import bpy
from mathutils import Vector


def refine_mouse():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Mouse refinement requires production source in Object mode')
    body = bpy.data.objects['Mouse v2 body']
    if body.get('surfaceRefined'):
        raise RuntimeError('Mouse already refined')
    collection = body.users_collection[0]
    selected = list(bpy.context.selected_objects)
    active = bpy.context.view_layer.objects.active
    created = []

    def mesh(name, vertices, faces, material):
        data = bpy.data.meshes.new(name)
        data.from_pydata(vertices, [], faces)
        data.update()
        obj = bpy.data.objects.new(name, data)
        collection.objects.link(obj)
        obj.matrix_world = body.matrix_world.copy()
        data.materials.append(material)
        obj['roomTarget'] = 'typing'
        created.append(obj)
        return obj

    def box(name, low, high):
        vertices = [(x, y, z) for z in (low[2], high[2]) for y in (low[1], high[1]) for x in (low[0], high[0])]
        faces = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
        return mesh(name, vertices, faces, body.data.materials[0])

    try:
        bpy.ops.object.select_all(action='DESELECT')
        body.select_set(True)
        bpy.context.view_layer.objects.active = body
        for name, low, high in (
            ('Mouse centre seam cutter', (-0.064, -0.0004, 0.014), (-0.013, 0.0004, 0.060)),
            ('Mouse button seam cutter', (-0.0134, -0.040, 0.027), (-0.0126, 0.040, 0.060)),
            ('Mouse wheel recess cutter', (-0.044, -0.0045, 0.020), (-0.025, 0.0045, 0.060)),
        ):
            cutter = box(name, low, high)
            modifier = body.modifiers.new(name, 'BOOLEAN')
            modifier.operation = 'DIFFERENCE'
            modifier.solver = 'EXACT'
            modifier.object = cutter
            bpy.ops.object.modifier_apply(modifier=modifier.name)
            created.remove(cutter)
            bpy.data.objects.remove(cutter, do_unlink=True)

        outline = [(-0.047, -0.022), (-0.048, -0.033), (-0.040, -0.044), (-0.020, -0.051), (0.015, -0.054), (0.037, -0.049), (0.051, -0.037), (0.051, -0.024)]
        count = len(outline)
        vertices = [(x, y, z) for z in (-0.003, 0.004) for x, y in outline]
        faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
        faces.extend((i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count))
        shelf = mesh('Mouse v2 thumb shelf', vertices, faces, body.data.materials[0])
        bevel = shelf.modifiers.new('Soft thumb edge', 'BEVEL')
        bevel.width = 0.003
        bevel.segments = 3
        for face in shelf.data.polygons[2:]:
            face.use_smooth = True

        wheel_material = bpy.data.materials['Mouse wheel steel']
        for name, center, axis, radius, length in (
            ('Mouse v2 recessed wheel', Vector((-0.0345, 0, 0.026)), Vector((0, 1, 0)), 0.0075, 0.006),
            ('Mouse v2 horizontal thumb wheel', Vector((-0.002, -0.035, 0.019)), Vector((1, 0, 0)), 0.0045, 0.016),
        ):
            radial = Vector((0, 0, 1))
            tangent = axis.cross(radial)
            sides = 64
            vertices = []
            for depth in (-length / 2, length / 2):
                for i in range(sides):
                    angle = i * math.tau / sides
                    r = radius * (1 if i % 2 == 0 else 0.94)
                    vertices.append(center + axis * depth + r * (radial * math.cos(angle) + tangent * math.sin(angle)))
            faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
            faces.extend((i, (i + 1) % sides, (i + 1) % sides + sides, i + sides) for i in range(sides))
            wheel = mesh(name, vertices, faces, wheel_material)
            for face in wheel.data.polygons[2:]:
                face.use_smooth = True

        for name in ('Mouse v2 wheel', 'Mouse v2 thumb wheel'):
            obj = bpy.data.objects[name]
            obj.hide_render = True
            obj.hide_set(True)
        for i, x in enumerate((0.018, 0.032)):
            hit, point, normal, index = body.ray_cast(Vector((x, -0.08, 0.012)), Vector((0, 1, 0)))
            if not hit:
                raise RuntimeError('Mouse side button has no shell contact')
            center = Vector((x, point.y - 0.0007, 0.012))
            outline = []
            for cx, start in ((-0.0035, math.pi / 2), (0.0035, -math.pi / 2)):
                for j in range(9):
                    angle = start + j * math.pi / 8
                    outline.append((cx + 0.0016 * math.cos(angle), 0.0016 * math.sin(angle)))
            count = len(outline)
            vertices = [center + Vector((vx, y, vz)) for y in (-0.0012, 0.0012) for vx, vz in outline]
            faces = [tuple(range(count)), tuple(reversed(range(count, count * 2)))]
            faces.extend((j, j + count, (j + 1) % count + count, (j + 1) % count) for j in range(count))
            button = mesh(f'Mouse v2 inset side button {i}', vertices, faces, bpy.data.materials['Mouse button dark'])
            for face in button.data.polygons[2:]:
                face.use_smooth = True
            previous = bpy.data.objects[f'Mouse v2 side button {i}']
            previous.hide_render = True
            previous.hide_set(True)
        body['surfaceRefined'] = True
        bpy.context.view_layer.update()
        degenerate = [(o.name, p.index) for o in [body, *created] for p in o.data.polygons if p.area <= 1e-12]
        if degenerate:
            raise RuntimeError(str(degenerate))
        return {'created': [o.name for o in created], 'zero_area_faces': 0}
    finally:
        bpy.ops.object.select_all(action='DESELECT')
        for obj in selected:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = active


result = refine_mouse()
