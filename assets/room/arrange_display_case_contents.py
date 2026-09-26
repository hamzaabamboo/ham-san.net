import bpy
from mathutils import Vector

source = bpy.data.collections['RoomHome']
bpy.context.view_layer.update()
for obj in source.all_objects:
    if obj.name.endswith(' contour print'):
        plate = bpy.data.objects.get(obj.name.replace(' contour print', ' contour clear plate'))
        if plate:
            plate.matrix_world = obj.matrix_world.copy()
bpy.context.view_layer.update()

for color, floor_name, depth in [
    ('teal', 'Middle clear display lid', 3.64),
    ('amber', 'Middle clear display lid', 3.53),
    ('plum', 'Right clear display lid', 3.64),
    ('rose', 'Right clear display lid', 3.53),
]:
    base = bpy.data.objects['Idol '+color+' oval acrylic base']
    floor = bpy.data.objects[floor_name]
    base_bounds = [base.matrix_world@Vector(corner) for corner in base.bound_box]
    floor_bounds = [floor.matrix_world@Vector(corner) for corner in floor.bound_box]
    dz = max(point.z for point in floor_bounds)+0.0005-min(point.z for point in base_bounds)
    dx = depth-sum(point.x for point in base_bounds)/8
    parts = [(obj, obj.matrix_world.copy()) for obj in source.all_objects if obj.type in {'MESH', 'CURVE'} and obj.name.startswith('Idol '+color+' ') and not obj.hide_render]
    for obj, matrix in parts:
        matrix.translation += Vector((dx, 0, dz))
        obj.matrix_world = matrix
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Complete standees seated inside both display cases')
