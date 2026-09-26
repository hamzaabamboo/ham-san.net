import json
import re

import bpy
from mathutils import Matrix, Vector

root = bpy.data.objects['Layout hobby shelving']
source = bpy.data.collections['RoomHome']
image_path = bpy.path.abspath('//textures/book-spine-reference-atlas.png')
image = bpy.data.images.get('book-spine-reference-atlas')
if image is None:
    width, height, lanes = 1024, 512, 16
    image = bpy.data.images.new('book-spine-reference-atlas', width=width, height=height, alpha=False)
    palette = [
        (0.88, 0.86, 0.78), (0.94, 0.92, 0.86), (0.82, 0.86, 0.84), (0.93, 0.89, 0.80),
        (0.78, 0.82, 0.84), (0.95, 0.93, 0.89), (0.86, 0.84, 0.78), (0.91, 0.88, 0.84),
    ]
    bands = [(0.33, 0.48, 0.55), (0.62, 0.29, 0.32), (0.24, 0.40, 0.46), (0.70, 0.55, 0.26)]
    pixels = [0.0] * (width * height * 4)

    def fill(x0, y0, x1, y1, color):
        for y in range(max(0, y0), min(height, y1)):
            start = (y * width + max(0, x0)) * 4
            end = (y * width + min(width, x1)) * 4
            for index in range(start, end, 4):
                pixels[index:index + 4] = [color[0], color[1], color[2], 1.0]

    def line(x0, y0, x1, y1, color):
        fill(x0, y0, x1, y1, color)

    lane_width = width // lanes
    for lane in range(lanes):
        x0 = lane * lane_width + 2
        x1 = (lane + 1) * lane_width - 2
        base = palette[lane % len(palette)]
        accent = bands[lane % len(bands)]
        fill(x0, 0, x1, height, base)
        fill(x0, 0, x1, 10, (0.63, 0.63, 0.58))
        fill(x0, height - 15, x1, height, accent)
        if lane % 3 == 0:
            fill(x0, 58, x1, 67, accent)
        if lane % 4 == 0:
            fill(x0, 225, x1, 235, (0.25, 0.29, 0.30))
        if lane % 5 == 0:
            fill(x0 + 8, 292, x1 - 8, 338, accent)
        mark = (lane * 17) % 21
        for row in range(7):
            y = 88 + row * 45 + mark
            mark_width = 10 + ((lane + row) % 4) * 5
            fill(x0 + 10, y, min(x1 - 6, x0 + 10 + mark_width), y + 3, (0.18, 0.20, 0.20))
            if row % 2 == lane % 2:
                fill(x0 + 29, y + 9, min(x1 - 5, x0 + 29 + mark_width // 2), y + 12, (0.35, 0.37, 0.36))
        fill(x0 + 3, 0, x0 + 6, height, (0.70, 0.69, 0.64))
        fill(x1 - 4, 0, x1 - 1, height, (0.70, 0.69, 0.64))
    image.pixels = pixels
    image.filepath_raw = image_path
    image.file_format = 'PNG'
    image.save()
    image.pack()

material = bpy.data.materials.get('Reference shelf spine print') or bpy.data.materials.new('Reference shelf spine print')
material.use_nodes = True
nodes = material.node_tree.nodes
links = material.node_tree.links
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
shader = nodes.new('ShaderNodeBsdfPrincipled')
shader.inputs['Roughness'].default_value = 0.82
texture = nodes.new('ShaderNodeTexImage')
texture.name = 'Reference shelf spine atlas'
texture.image = image
texture.interpolation = 'Linear'
links.new(texture.outputs['Color'], shader.inputs['Base Color'])
links.new(shader.outputs['BSDF'], output.inputs['Surface'])

edge_materials = []
for name, color in [
    ('Reference page edge warm', (0.78, 0.76, 0.70, 1.0)),
    ('Reference page edge cool', (0.70, 0.75, 0.75, 1.0)),
]:
    edge = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    edge.diffuse_color = color
    edge.use_nodes = True
    bsdf = edge.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = 0.9
    edge_materials.append(edge)

patterns = [
    ('book', re.compile(r'^Shelf book(?:\.\d+)?$'), 0.12),
    ('album', re.compile(r'^Collection album spine(?:\.\d+)?$'), 0.13),
    ('booklet', re.compile(r'^Upper collection booklet(?:\.\d+)?$'), 0.11),
    ('record', re.compile(r'^Record sleeve(?:\.\d+)?$'), 0.22),
]

groups = []
for category, pattern, target in patterns:
    for base in sorted([o for o in bpy.data.objects if pattern.fullmatch(o.name) and not o.hide_render], key=lambda o: o.name):
        parts = [o for o in bpy.data.objects if not o.hide_render and (o is base or o.name.startswith(base.name + ' '))]
        corners = [part.matrix_world @ Vector(corner) for part in parts for corner in part.bound_box]
        minimum = Vector(min(point[i] for point in corners) for i in range(3))
        maximum = Vector(max(point[i] for point in corners) for i in range(3))
        current_width = maximum.y - minimum.y
        if current_width > 0.001:
            variation = 1.0 + ((len(groups) % 5) - 2) * 0.08
            desired = target * variation
            center = (minimum + maximum) / 2
            transform = Matrix.Translation(center) @ Matrix.Diagonal((1, desired / current_width, 1, 1)) @ Matrix.Translation(-center)
            for part in parts:
                part.matrix_world = transform @ part.matrix_world
        groups.append((category, base, parts))

for index, (_, base, parts) in enumerate(groups):
    for part in parts:
        if not part.type == 'MESH':
            continue
        if 'binding' in part.name:
            if material.name not in part.data.materials:
                part.data.materials.append(material)
            material_index = list(part.data.materials).index(material)
            uv = part.data.uv_layers.active or part.data.uv_layers.new(name='Reference spine UV')
            points = [part.matrix_world @ vertex.co for vertex in part.data.vertices]
            ymin = min(point.y for point in points)
            ymax = max(point.y for point in points)
            zmin = min(point.z for point in points)
            zmax = max(point.z for point in points)
            lane = index % 16
            umin = (lane + 0.08) / 16
            umax = (lane + 0.92) / 16
            for polygon in part.data.polygons:
                world_normal = (part.matrix_world.to_3x3() @ polygon.normal).normalized()
                if world_normal.x > -0.9:
                    continue
                polygon.material_index = material_index
                for loop in polygon.loop_indices:
                    point = points[part.data.loops[loop].vertex_index]
                    v = (point.z - zmin) / max(zmax - zmin, 0.001)
                    u = umin + (umax - umin) * (point.y - ymin) / max(ymax - ymin, 0.001)
                    uv.data[loop].uv = (u, v)
        elif 'cover' in part.name:
            for material_index, slot in enumerate(part.data.materials):
                if slot and slot.name in {'Book blue', 'Muted coral', 'Dart felt', 'Honey oak'}:
                    part.data.materials[material_index] = edge_materials[index % 2]

back_materials = [
    ('Shelf bay teal backing', (0.07, 0.30, 0.33, 1.0)),
    ('Shelf bay blue backing', (0.14, 0.32, 0.38, 1.0)),
    ('Shelf bay muted backing', (0.25, 0.34, 0.34, 1.0)),
    ('Shelf bay pale backing', (0.70, 0.74, 0.71, 1.0)),
]
for name, color in back_materials:
    back = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    back.diffuse_color = color
    back.use_nodes = True
    bsdf = back.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = 0.86

def box(name, position, dimensions, material_name):
    existing = bpy.data.objects.get(name)
    if existing:
        return existing
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
    obj.data.materials.append(bpy.data.materials[material_name])
    bevel = obj.modifiers.new('Shelf backing edge', 'BEVEL')
    bevel.width = 0.004
    bevel.segments = 2
    return obj

divisions = [-0.47, 0.22, 0.88, 1.55, 2.20]
for column, (low, high) in enumerate(zip(divisions, divisions[1:])):
    box(
        f'Shelf bay backing {column + 1}',
        (3.828, (low + high) / 2, 0.92),
        (0.006, high - low - 0.055, 1.48),
        back_materials[column % len(back_materials)][0],
    )

root['roomBookReferenceRepair'] = 'shelf-detail-v2'
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print(json.dumps({'groups_scaled': len(groups), 'bindings_textured': sum(1 for _, _, parts in groups for part in parts if part.name.endswith(' binding')), 'back_panels': 4, 'atlas': image.name}))
