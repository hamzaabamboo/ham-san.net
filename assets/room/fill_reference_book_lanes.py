import json

import bpy
from mathutils import Matrix, Vector

root = bpy.data.objects['Layout hobby shelving']
source = bpy.data.collections['RoomHome']
spine_material = bpy.data.materials['Reference shelf spine print']
edge_materials = [bpy.data.materials['Reference page edge warm'], bpy.data.materials['Reference page edge cool']]
divisions = [-0.47, 0.22, 0.88, 1.55, 2.20]
levels = [0.14, 0.49, 0.84, 1.19]

if not any(obj.name.startswith('Reference lane spine ') for obj in bpy.data.objects):
    existing = []
    prefixes = ('Shelf book', 'Collection album spine', 'Upper collection booklet', 'Record sleeve')
    for obj in bpy.data.objects:
        if obj.hide_render or obj.type != 'MESH' or not obj.name.startswith(prefixes):
            continue
        if any(obj.name == prefix or obj.name.startswith(prefix + ' ') for prefix in prefixes):
            if obj.name.endswith(' binding') or obj.name.endswith(' cover') or obj.name.endswith(' cover.001'):
                continue
            points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
            ymin = min(point.y for point in points)
            ymax = max(point.y for point in points)
            zmin = min(point.z for point in points)
            zmax = max(point.z for point in points)
            center_y = (ymin + ymax) / 2
            center_z = (zmin + zmax) / 2
            row = min(range(len(levels)), key=lambda index: abs(center_z - (levels[index] + 0.17)))
            existing.append((center_y, ymin, ymax, row))

    def add_box(name, position, dimensions, edge):
        bpy.ops.mesh.primitive_cube_add(size=1, location=position)
        obj = bpy.context.object
        obj.name = name
        obj.scale = dimensions
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        matrix = obj.matrix_world.copy()
        obj.parent = root
        obj.matrix_world = matrix
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        source.objects.link(obj)
        obj.data.materials.append(spine_material)
        obj.data.materials.append(edge)
        for polygon in obj.data.polygons:
            world_normal = (obj.matrix_world.to_3x3() @ polygon.normal).normalized()
            polygon.material_index = 0 if world_normal.x < -0.9 else 1
        bevel = obj.modifiers.new('Reference spine edge', 'BEVEL')
        bevel.width = 0.003
        bevel.segments = 2
        uv = obj.data.uv_layers.new(name='Reference lane UV')
        points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
        ymin = min(point.y for point in points)
        ymax = max(point.y for point in points)
        zmin = min(point.z for point in points)
        zmax = max(point.z for point in points)
        lane = int(name.rsplit('-', 1)[-1]) % 16
        umin = (lane + 0.08) / 16
        umax = (lane + 0.92) / 16
        for polygon in obj.data.polygons:
            world_normal = (obj.matrix_world.to_3x3() @ polygon.normal).normalized()
            if world_normal.x > -0.9:
                continue
            for loop in polygon.loop_indices:
                point = points[obj.data.loops[loop].vertex_index]
                uv.data[loop].uv = (
                    umin + (umax - umin) * (point.y - ymin) / max(ymax - ymin, 0.001),
                    (point.z - zmin) / max(zmax - zmin, 0.001),
                )
        return obj

    created = 0
    for bay, (low, high) in enumerate(zip(divisions, divisions[1:]), start=1):
        for row, bottom in enumerate(levels, start=1):
            intervals = [(ymin, ymax) for center, ymin, ymax, current_row in existing if current_row == row - 1 and low < center < high]
            candidates = [low + 0.055 + index * 0.085 for index in range(8)]
            for candidate in candidates:
                if created >= 96:
                    break
                width = 0.052
                if candidate + width / 2 > high - 0.035:
                    continue
                if any(candidate - width / 2 < upper + 0.018 and candidate + width / 2 > lower - 0.018 for lower, upper in intervals):
                    continue
                height = 0.25 + ((bay + row) % 3) * 0.022
                name = f'Reference lane spine {bay}-{row}-{created + 1}'
                add_box(name, (3.385, candidate, bottom + 0.024 + height / 2), (0.014, width / 2, height / 2), edge_materials[(bay + row) % 2])
                intervals.append((candidate - width / 2, candidate + width / 2))
                created += 1

root['roomBookReferenceLaneFill'] = created
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print(json.dumps({'lane_spines_added': created}))
