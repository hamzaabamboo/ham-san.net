import bpy


def bounds(obj):
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    return [(min(point[axis] for point in points), max(point[axis] for point in points)) for axis in range(3)]


def reshape(obj, target):
    original = bounds(obj)
    inverse = obj.matrix_world.inverted()
    for vertex in obj.data.vertices:
        point = obj.matrix_world @ vertex.co
        for axis, (lower, upper) in enumerate(target):
            old_lower, old_upper = original[axis]
            point[axis] = lower + (point[axis] - old_lower) / (old_upper - old_lower) * (upper - lower)
        vertex.co = inverse @ point
    obj.data.update()


room = bpy.data.collections['RoomHome']
pier = bpy.data.objects['Window wall central pier']
sill = bounds(bpy.data.objects['Rear window sill wall'])
edge = bounds(bpy.data.objects['Window wall left edge'])
ceiling_bottom = bounds(bpy.data.objects['Room ceiling'])[2][0]
pier_bounds = bounds(pier)
reshape(pier, [(pier_bounds[0][0], sill[0][0]), edge[1], (edge[2][0], ceiling_bottom)])
for obj in room.all_objects:
    if obj.type != 'MESH' or obj == pier or obj.name == 'Room ceiling':
        continue
    if not any(material and material.name == 'Room plaster' for material in obj.data.materials):
        continue
    current = bounds(obj)
    if 2.75 < current[2][1] < ceiling_bottom:
        reshape(obj, [current[0], current[1], (current[2][0], ceiling_bottom)])
bpy.context.view_layer.update()
assert abs(bounds(pier)[0][1] - sill[0][0]) < 0.00001
assert abs(bounds(pier)[1][0] - edge[1][0]) < 0.00001
print({'pier': bounds(pier), 'ceiling_bottom': ceiling_bottom})
