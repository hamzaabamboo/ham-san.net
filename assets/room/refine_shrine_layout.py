import bpy
from mathutils import Matrix, Vector

assert bpy.data.filepath == '/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend'
scene = bpy.context.scene
assert not scene.get('roomShrineLayoutVersion'), 'Shrine layout already applied'
source = bpy.data.collections['RoomHome']
bpy.context.view_layer.update()


def bounds(objects):
    points = [obj.matrix_world @ Vector(c) for obj in objects
              if obj.type in {'MESH', 'CURVE'} for c in obj.bound_box]
    return (Vector([min(p[i] for p in points) for i in range(3)]),
            Vector([max(p[i] for p in points) for i in range(3)]))


def remember(obj):
    if 'roomShrineOriginalMatrix' not in obj:
        obj['roomShrineOriginalMatrix'] = [value for row in obj.matrix_world for value in row]
        obj['roomShrineOriginalParent'] = obj.parent.name if obj.parent else ''


def move_group(objects, transform, parent=None):
    roots = [obj for obj in objects if obj.parent not in objects]
    matrices = {obj.name: transform @ obj.matrix_world for obj in roots}
    for obj in roots:
        remember(obj)
        if parent is not None:
            obj.parent = parent
            obj.matrix_parent_inverse = parent.matrix_world.inverted()
        obj.matrix_world = matrices[obj.name]
    bpy.context.view_layer.update()


def box(name, lo, hi, material):
    assert bpy.data.objects.get(name) is None
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(x, y, z) for z in (lo[2], hi[2]) for y in (lo[1], hi[1])
                     for x in (lo[0], hi[0])], [],
                    ((0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
                     (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)))
    mesh.materials.append(material)
    obj = bpy.data.objects.new(name, mesh)
    source.objects.link(obj)
    bevel = obj.modifiers.new('Finished shelf edge', 'BEVEL')
    bevel.width = 0.0008
    bevel.segments = 1
    return obj


left_shelf = bpy.data.objects['Modular shelf board.014']
middle_shelf = bpy.data.objects['Display cabinet shelf.003']
right_shelf = bpy.data.objects['Modular shelf board.019']
left_lo, left_hi = bounds([left_shelf])
middle_lo, middle_hi = bounds([middle_shelf])
right_lo, right_hi = bounds([right_shelf])
upper_lo, upper_hi = bounds([bpy.data.objects['Modular shelf board tall unit 2']])
display_objects = [obj for obj in source.all_objects
                   if obj.name.startswith(('Idol u2r4 ', 'Acrylic riser u2r4 '))]
display_offset = Vector((0, (left_lo.y + left_hi.y - upper_lo.y - upper_hi.y) * 0.5,
                         left_hi.z - upper_hi.z))
move_group(display_objects, Matrix.Translation(display_offset))
for obj in display_objects:
    if obj.name.endswith(' print'):
        obj['roomAcrylicPlacementOffset'] = list(display_offset)

cap_z = max(middle_hi.z, right_hi.z)
cap_top = cap_z + 0.011
material = right_shelf.data.materials[0]
box('Clear display shared shelf cap', (middle_lo.x, middle_lo.y, cap_z),
    (right_hi.x, right_hi.y, cap_top), material)
box('Clear display shelf leveling support', (middle_lo.x + 0.008, middle_lo.y + 0.008, middle_hi.z),
    (middle_hi.x - 0.008, middle_hi.y - 0.008, cap_z), material)

case_frames = [obj for obj in source.all_objects if obj.name.startswith('Clear case ')
               and obj.name.endswith(' frame')]
case_lo, case_hi = bounds(case_frames)
case_floor = case_lo.z
target_y0 = middle_lo.y + 0.005
target_y1 = right_hi.y - 0.007
stretch = Matrix.Diagonal((2.0, (target_y1 - target_y0) / (case_hi.y - case_lo.y), 1.0, 1.0))
mapping = (Matrix.Translation((right_hi.x, target_y0, cap_top)) @ stretch
           @ Matrix.Translation((-case_hi.x, -case_lo.y, -case_floor)))
structure_suffixes = (' floor', ' back', ' left', ' right', ' front', ' lid', ' frame', ' rear step')
case_structure = [obj for obj in source.all_objects if obj.name.startswith('Clear case ')
                  and obj.name.endswith(structure_suffixes)]
move_group(case_structure, mapping)

families = sorted(obj.name[:-6] for obj in source.all_objects
                  if obj.name.startswith('Idol case ') and obj.name.endswith(' print'))
for family in families:
    base = bpy.data.objects[family + ' base']
    anchor = base.matrix_world.translation.copy()
    offset = mapping @ anchor - anchor
    objects = [obj for obj in source.all_objects if obj.name.startswith(family + ' ')]
    move_group(objects, Matrix.Translation(offset))
    printed = bpy.data.objects[family + ' print']
    printed['roomAcrylicPlacementOffset'] = list(offset)

for obj in [obj for obj in source.all_objects if obj.name.startswith('Clear case ')
            and (' postcard' in obj.name or ' badge ' in obj.name)]:
    lo, hi = bounds([obj])
    anchor = (lo + hi) * 0.5
    move_group([obj], Matrix.Translation(mapping @ anchor - anchor))

lid_top = bounds([bpy.data.objects['Clear case c1 l2 lid']])[1].z
plush = []
for name, factor, fraction in (('Shelf top plush orange mascot', 0.40, 0.15),
                               ('Shelf top plush cream mascot', 0.32, 0.86)):
    obj = bpy.data.objects[name]
    lo, hi = bounds([obj])
    anchor = Vector(((lo.x + hi.x) * 0.5, (lo.y + hi.y) * 0.5, lo.z))
    target = Vector((3.075, target_y0 + (target_y1 - target_y0) * fraction, lid_top))
    transform = Matrix.Translation(target) @ Matrix.Scale(factor, 4) @ Matrix.Translation(-anchor)
    move_group([obj], transform)
    plush.append({'name': name, 'dimensions': list(obj.dimensions)})

frame_names = ['Top display photo frame' + suffix for suffix in ('', '.001', '.002', '.003')]
for index, name in enumerate(frame_names):
    objects = [bpy.data.objects[name], bpy.data.objects[name + ' print']]
    lo, hi = bounds(objects)
    target = Vector((3.208, target_y0 + 0.12 + index * 0.225, lid_top))
    anchor = Vector(((lo.x + hi.x) * 0.5, (lo.y + hi.y) * 0.5, lo.z))
    move_group(objects, Matrix.Translation(target - anchor))

table = bpy.data.objects['Low hobby table top']
table_lo, table_hi = bounds([table])
placements = (
    ('Skill toy kendama', (1.77, 0.78)),
    ('Skill toy yoyo', (1.94, 0.80)),
    ('Skill toy cardistry', (1.77, 0.43)),
    ('Skill toy penspinning', (1.975, 0.405)),
    ('Desk Rubik', (2.16, 0.78)),
)
hobbies = []
for prefix, xy in placements:
    objects = [obj for obj in source.all_objects if obj.name.startswith(prefix) and not obj.hide_render]
    lo, hi = bounds(objects)
    anchor = Vector(((lo.x + hi.x) * 0.5, (lo.y + hi.y) * 0.5, lo.z))
    target = Vector((xy[0], xy[1], table_hi.z))
    scale = Matrix.Scale(0.5 if prefix == 'Desk Rubik' else 1.0, 4)
    move_group(objects, Matrix.Translation(target) @ scale @ Matrix.Translation(-anchor), table.parent)
    hobbies.append({'prefix': prefix, 'objects': len(objects)})

obsolete = ['Modular shelf back extension tall unit', 'Modular shelf board tall unit 2',
            'Shelf mesh strip 13']
obsolete.extend(obj.name for obj in source.all_objects if obj.name.startswith('Magazine run 5-'))
for name in obsolete:
    obj = bpy.data.objects[name]
    obj['roomShrineArchived'] = True
    obj.hide_render = True
    obj.hide_set(True)
for name in ('Modular shelf upright.003', 'Modular shelf upright.004'):
    obj = bpy.data.objects[name]
    lo, hi = bounds([obj])
    ratio = (cap_z - lo.z) / (hi.z - lo.z)
    transform = Matrix.Translation((0, 0, lo.z)) @ Matrix.Diagonal((1, 1, ratio, 1)) @ Matrix.Translation((0, 0, -lo.z))
    move_group([obj], transform)

scene['roomShrineLayoutVersion'] = 1
bpy.context.view_layer.update()
result = {'case_span_y': [target_y0, target_y1], 'case_lid_top': lid_top,
          'plush': plush, 'hobbies': hobbies, 'saved': False}
