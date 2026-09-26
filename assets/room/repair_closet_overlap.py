import bpy

front = bpy.data.objects['Closet sliding panel']
rear = bpy.data.objects['Closet sliding panel.001']
front_points = [front.matrix_world @ vertex.co for vertex in front.data.vertices]
rear_points = [rear.matrix_world @ vertex.co for vertex in rear.data.vertices]
left = min(point.x for point in rear_points)
right = max(point.x for point in rear_points)
front_left = min(point.x for point in front_points)
target_right = front_left + 0.03
inverse = rear.matrix_world.inverted()
for vertex, point in zip(rear.data.vertices, rear_points):
    point.x = left + (point.x - left) / (right - left) * (target_right - left)
    vertex.co = inverse @ point
rear.data.update()
bpy.context.view_layer.update()
overlap = max((rear.matrix_world @ vertex.co).x for vertex in rear.data.vertices) - front_left
clearance = min(point.y for point in front_points) - max(point.y for point in rear_points)
assert abs(overlap - 0.03) < 0.00001
assert clearance > 0
print({'overlap': overlap, 'track_clearance': clearance})
