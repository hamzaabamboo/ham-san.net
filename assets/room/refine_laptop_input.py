from pathlib import Path

import bpy
from mathutils import Vector


def refine_laptop_input():
    if Path(bpy.data.filepath).name != 'room-v2.blend':
        raise RuntimeError('Laptop refinement requires the production source')
    base = bpy.data.objects['Laptop base']
    deck = bpy.data.objects['Laptop keyboard deck']
    if bpy.context.mode != 'OBJECT' or base.get('inputDetail'):
        raise RuntimeError('Laptop refinement requires an unrefined base in Object mode')
    if base.data.users != 1 or deck.data.users != 1:
        raise RuntimeError('Laptop meshes must be single-user')
    bpy.context.view_layer.update()
    points = [base.matrix_world @ Vector(v) for v in base.bound_box]
    low = Vector([min(p[i] for p in points) for i in range(3)])
    high = Vector([max(p[i] for p in points) for i in range(3)])
    size = high - low
    center_y = (low.y + high.y) / 2
    top = high.z
    collection = base.users_collection[0]
    aluminium = base.data.materials[0]
    black = deck.data.materials[0]
    if aluminium.use_nodes:
        body_bsdf = next(n for n in aluminium.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        body_bsdf.inputs['Base Color'].default_value = (0.085, 0.09, 0.10, 1)
        body_bsdf.inputs['Metallic'].default_value = 0.75
        body_bsdf.inputs['Roughness'].default_value = 0.45
    created = []

    def mesh(name, vertices, faces, material):
        data = bpy.data.meshes.new(name)
        data.from_pydata(vertices, [], faces)
        data.update()
        obj = bpy.data.objects.new(name, data)
        collection.objects.link(obj)
        data.materials.append(material)
        created.append(obj)
        return obj

    def prism(name, outline, bottom, height, material, bevel=0):
        count = len(outline)
        vertices = [(x, y, z) for z in (bottom, bottom + height) for x, y in outline]
        faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
        faces.extend((i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count))
        obj = mesh(name, vertices, faces, material)
        if bevel:
            modifier = obj.modifiers.new('Manufactured edges', 'BEVEL')
            modifier.width = bevel
            modifier.segments = 3
        return obj

    def box(name, x, y, depth, width, bottom, height, material, bevel=0):
        return prism(name, [(x, y), (x + depth, y), (x + depth, y + width), (x, y + width)], bottom, height, material, bevel)

    def recess(name, x, y, depth, width, bottom):
        cutter = box(name, x, y, depth, width, bottom, top + 0.01 - bottom, aluminium)
        cutter.hide_render = True
        cutter.hide_set(True)
        cutter.display_type = 'WIRE'
        modifier = base.modifiers.new(name, 'BOOLEAN')
        modifier.operation = 'DIFFERENCE'
        modifier.solver = 'EXACT'
        modifier.object = cutter
        return cutter

    rear = low.x + size.x * 0.20
    depth = size.x * 0.44
    width = size.y * 0.84
    left = center_y - width / 2
    inverse = deck.matrix_world.inverted()
    old_points = [deck.matrix_world @ v.co for v in deck.data.vertices]
    old_low = Vector([min(p[i] for p in old_points) for i in range(3)])
    old_high = Vector([max(p[i] for p in old_points) for i in range(3)])
    for vertex, point in zip(deck.data.vertices, old_points):
        point.x = rear + (point.x - old_low.x) / (old_high.x - old_low.x) * depth
        point.y = left + (point.y - old_low.y) / (old_high.y - old_low.y) * width
        point.z = top - 0.0018 + (point.z - old_low.z) / (old_high.z - old_low.z) * 0.0006
        vertex.co = inverse @ point
    deck.data.update()
    recess('Laptop keyboard well cutter', rear, left, depth, width, top - 0.002)
    row_depth = depth / 6
    unit = width / 14.5
    gap = unit * 0.09
    strip = box('Laptop top control strip', rear + gap, left + gap, row_depth * 0.42, width - gap * 2, top - 0.0011, 0.0004, black, 0.0003)
    key_material = black.copy()
    key_material.name = 'Laptop keycap charcoal'
    if key_material.use_nodes:
        bsdf = next(n for n in key_material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        bsdf.inputs['Base Color'].default_value = (0.012, 0.013, 0.015, 1)
        bsdf.inputs['Roughness'].default_value = 0.62
        bsdf.inputs['Metallic'].default_value = 0.0
    rows = [
        [1] * 13 + [1.5],
        [1.5] + [1] * 11,
        [1.75] + [1] * 11,
        [1.25] + [1] * 11 + [2.25],
        [1, 1, 1, 1.25, 1, 3, 1, 1.25, 1]
    ]
    for row, widths in enumerate(rows):
        x = rear + row_depth * (row + 1)
        cursor = left
        for index, units in enumerate(widths):
            box(f'Laptop key {row + 1}-{index + 1}', x + gap / 2, cursor + gap / 2, row_depth - gap, units * unit - gap, top - 0.0011, 0.0015, key_material, 0.0006)
            cursor += units * unit
    upper_x = rear + row_depth * 2 + gap / 2
    lower_x = rear + row_depth * 4 - gap / 2
    upper_left = left + unit * 12.5 + gap / 2
    lower_left = left + unit * 12.75 + gap / 2
    right = left + width - gap / 2
    middle_x = rear + row_depth * 3
    prism('Laptop tall Return key', [(upper_x, upper_left), (middle_x, upper_left), (middle_x, lower_left), (lower_x, lower_left), (lower_x, right), (upper_x, right)], top - 0.0011, 0.0015, key_material, 0.0006)
    arrow_x = rear + row_depth * 5 + gap / 2
    arrow_y = left + unit * 11.5
    for index in range(3):
        box(f'Laptop arrow lower {index + 1}', arrow_x + row_depth / 2, arrow_y + index * unit + gap / 2, row_depth / 2 - gap, unit - gap, top - 0.0011, 0.0015, key_material, 0.0005)
    box('Laptop arrow upper', arrow_x, arrow_y + unit + gap / 2, row_depth / 2 - gap, unit - gap, top - 0.0011, 0.0015, key_material, 0.0005)
    pad_depth = size.x * 0.24
    pad_width = size.y * 0.49
    pad_x = high.x - size.x * 0.055 - pad_depth
    pad_y = center_y - pad_width / 2
    recess('Laptop trackpad well cutter', pad_x, pad_y, pad_depth, pad_width, top - 0.0011)
    box('Laptop trackpad inset', pad_x + 0.0005, pad_y + 0.0005, pad_depth - 0.001, pad_width - 0.001, top - 0.001, 0.0006, aluminium, 0.00025)
    bpy.context.view_layer.update()
    degenerate = [(o.name, p.index) for o in created for p in o.data.polygons if p.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    base['inputDetail'] = True
    strip['sourceControlLayoutUnresolved'] = True
    return {'created': [o.name for o in created], 'zero_area_faces': len(degenerate)}


result = refine_laptop_input()
