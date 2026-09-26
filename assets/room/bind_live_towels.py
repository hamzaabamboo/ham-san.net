import bpy
import json
from mathutils import Vector

bpy.context.view_layer.update()
towels = [bpy.data.objects[name] for name in ['Folded towel 1', 'Folded towel 2']]
display = towels + [obj for obj in bpy.data.collections['RoomHome'].all_objects if obj.name.startswith('Live wall uchiwa') and obj.type in {'MESH', 'CURVE'}]
points = [obj.matrix_world @ Vector(corner) for obj in display for corner in obj.bound_box]
center = Vector([(min(point[i] for point in points) + max(point[i] for point in points)) / 2 for i in range(3)])
for obj in towels:
    obj['roomTarget'] = 'events'
    obj['merchandise_kind'] = 'live-event towel'
floor = bpy.data.objects['Floor base']
navigation = json.loads(floor['roomNavigation'])
navigation['targets']['events'] = {
    'position': [min(point.x for point in points) - 0.002, center.z, -center.y],
    'camera': [1.5, 1.8, 1.35],
}
floor['roomNavigation'] = json.dumps(navigation)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print(navigation['targets']['events'])
