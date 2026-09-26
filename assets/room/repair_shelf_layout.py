import json
import re

import bpy
from mathutils import Matrix, Vector

patterns = [
    ('book', re.compile(r'^Shelf book(?:\.\d+)?$')),
    ('album', re.compile(r'^Collection album spine(?:\.\d+)?$')),
    ('booklet', re.compile(r'^Upper collection booklet(?:\.\d+)?$')),
    ('sleeve', re.compile(r'^Record sleeve(?:\.\d+)?$')),
]


def suffix_index(name):
    match = re.search(r'\.(\d+)$', name)
    return int(match.group(1)) if match else 0


def group_parts(root):
    return [
        obj
        for obj in bpy.data.objects
        if obj.name == root.name or obj.name.startswith(root.name + ' ')
    ]


def group_bounds(parts):
    corners = [part.matrix_world @ Vector(corner) for part in parts for corner in part.bound_box]
    minimum = Vector(min(point[i] for point in corners) for i in range(3))
    maximum = Vector(max(point[i] for point in corners) for i in range(3))
    return minimum, maximum


groups = []
for category, pattern in patterns:
    roots = sorted(
        [obj for obj in bpy.data.objects if pattern.fullmatch(obj.name)],
        key=lambda obj: suffix_index(obj.name),
    )
    for index, root in enumerate(roots):
        groups.append({'category': category, 'index': index, 'parts': group_parts(root)})

by_category = {category: [] for category, _ in patterns}
for group in groups:
    by_category[group['category']].append(group)
ordered = []
for index in range(max(len(items) for items in by_category.values())):
    for category, _ in patterns:
        if index < len(by_category[category]):
            ordered.append(by_category[category][index])

divisions = [-0.47, 0.22, 0.88, 1.55, 2.20]
levels = [0.14, 0.49, 0.84, 1.19]
slots = [(column, row) for row in range(len(levels)) for column in range(len(divisions) - 1)]
slot_size = (len(ordered) + len(slots) - 1) // len(slots)
widths = {'book': 0.085, 'album': 0.092, 'booklet': 0.080, 'sleeve': 0.112}
spine_materials = [
    bpy.data.materials['Paper'],
    bpy.data.materials['Book blue'],
    bpy.data.materials['Muted coral'],
    bpy.data.materials['Paper'],
]

for index, group in enumerate(ordered):
    column, row = slots[min(index // slot_size, len(slots) - 1)]
    lane = index % slot_size
    low, high = divisions[column:column + 2]
    lane_step = (high - low - 0.12) / max(slot_size - 1, 1)
    target_y = low + 0.06 + lane * lane_step
    minimum, maximum = group_bounds(group['parts'])
    center = (minimum + maximum) / 2
    height = maximum.z - minimum.z
    current_width = maximum.y - minimum.y
    target_width = widths[group['category']] * (1 + (group['index'] % 3) * 0.08)
    target_bottom = levels[row] + 0.028
    target_center = Vector((3.56, target_y, target_bottom + height / 2))
    transform = Matrix.Translation(target_center) @ Matrix.Diagonal((1, target_width / current_width, 1, 1)) @ Matrix.Translation(-center)
    for part in group['parts']:
        if 'roomShelfRepairOriginalMatrix' not in part:
            part['roomShelfRepairOriginalMatrix'] = json.dumps([list(row) for row in part.matrix_world])
        part.matrix_world = transform @ part.matrix_world
        for material_index, material in enumerate(part.data.materials):
            if material and material.name == 'Illustrated paper book spines':
                part.data.materials[material_index] = spine_materials[(group['index'] + index) % len(spine_materials)]
        part['roomShelfRepairCategory'] = group['category']
        part['roomShelfRepairSlot'] = f'{column}-{row}'

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'groups': len(ordered), 'slot_size': slot_size, 'rows': len(levels), 'columns': len(divisions) - 1})
