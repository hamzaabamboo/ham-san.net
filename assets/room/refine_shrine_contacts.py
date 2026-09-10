import bpy
from mathutils import Matrix, Vector

source = bpy.data.collections['RoomHome']
bpy.context.view_layer.update()


def bounds(objects):
    points = [obj.matrix_world @ Vector(c) for obj in objects for c in obj.bound_box]
    return (Vector([min(p[i] for p in points) for i in range(3)]),
            Vector([max(p[i] for p in points) for i in range(3)]))


def translate(objects, offset, parent=None):
    matrices = {obj.name: Matrix.Translation(offset) @ obj.matrix_world for obj in objects}
    for obj in objects:
        if parent is not None:
            obj.parent = parent
            obj.matrix_parent_inverse = parent.matrix_world.inverted()
        obj.matrix_world = matrices[obj.name]
    bpy.context.view_layer.update()


families = sorted(obj.name[:-6] for obj in source.all_objects
                  if obj.name.startswith('Idol case ') and obj.name.endswith(' print') and not obj.hide_render)
for family in families:
    parts = family.split()
    prefix = 'Clear case ' + parts[2] + ' ' + parts[3]
    support = bpy.data.objects[prefix + (' rear step' if parts[4] == 'r3' else ' floor')]
    base = bpy.data.objects[family + ' base']
    offset = Vector((0, 0, bounds([support])[1].z - bounds([base])[0].z))
    objects = [obj for obj in source.all_objects if obj.name.startswith(family + ' ')]
    translate(objects, offset)
    printed = bpy.data.objects[family + ' print']
    printed['roomAcrylicPlacementOffset'] = list(Vector(printed.get('roomAcrylicPlacementOffset', (0, 0, 0))) + offset)

table = bpy.data.objects['Low hobby table top']
table_top = bounds([table])[1].z
cup = [obj for obj in source.all_objects if obj.name.startswith('Desk pen') and 'noodle' in obj.name]
lo, hi = bounds(cup)
anchor = Vector(((lo.x + hi.x) * 0.5, (lo.y + hi.y) * 0.5, lo.z))
translate(cup, Vector((2.18, 0.39, table_top)) - anchor, table.parent)

ticket = [bpy.data.objects[name] for name in ('Event ticket', 'Ticket print')]
lo, hi = bounds(ticket)
anchor = Vector(((lo.x + hi.x) * 0.5, (lo.y + hi.y) * 0.5, lo.z))
albums = [obj for obj in source.all_objects if obj.name.startswith('Low table album stack') and not obj.hide_render]
album_top = bounds(albums)[1].z
translate(ticket, Vector((1.94, 0.596, album_top)) - anchor, table.parent)

ball_lo, ball_hi = bounds([bpy.data.objects['Skill toy kendama lacquered tama']])
ball = (ball_lo + ball_hi) * 0.5
ken_lo, ken_hi = bounds([bpy.data.objects['Skill toy kendama turned ken']])
anchor = Vector(((ken_lo.x + ken_hi.x) * 0.5, (ken_lo.y + ken_hi.y) * 0.5, ken_lo.z))
start = ball + Vector((0.012, 0, -0.008)) - anchor
coordinates = [start, (-0.010, 0.022, 0.073), (0.019, 0.044, 0.030),
               (0.024, 0.026, 0.008), (0.012, 0.009, 0.045), (0.002, 0, 0.056)]
string = bpy.data.objects['Skill toy kendama tether']
old = string.data
curve = bpy.data.curves.new('Kendama connected shrine tabletop tether', 'CURVE')
curve.dimensions = '3D'
curve.resolution_u = 12
curve.bevel_depth = 0.00025
curve.bevel_resolution = 2
for material in old.materials:
    curve.materials.append(material)
spline = curve.splines.new('BEZIER')
spline.bezier_points.add(len(coordinates) - 1)
for point, co in zip(spline.bezier_points, coordinates):
    point.co = co
    point.handle_left_type = 'AUTO'
    point.handle_right_type = 'AUTO'
string.data = curve
string.matrix_world = Matrix.Translation(anchor)
bpy.context.view_layer.update()
result = {'case_supports': len(families), 'cup_on_table': True, 'ticket_on_albums': True,
          'kendama_tether_clear_of_cards': True, 'saved': False}
