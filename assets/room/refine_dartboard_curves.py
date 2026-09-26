import bpy
from math import atan2, cos, hypot, pi, sin
from mathutils import Vector

body = bpy.data.objects['Dartboard body']
points = [body.matrix_world @ vertex.co for vertex in body.data.vertices]
cx = (min(point.x for point in points) + max(point.x for point in points)) / 2
cz = (min(point.z for point in points) + max(point.z for point in points)) / 2


def replace_mesh(obj, vertices, faces, curved_faces=0):
    previous = obj.data
    previous.use_fake_user = True
    mesh = bpy.data.meshes.new(obj.name + ' circular surface')
    inverse = obj.matrix_world.inverted()
    mesh.from_pydata([inverse @ Vector(point) for point in vertices], [], faces)
    for material in previous.materials:
        mesh.materials.append(material)
    for polygon in mesh.polygons[:curved_faces]:
        polygon.use_smooth = True
    mesh.update()
    obj.data = mesh


for name in ['Dartboard body', 'Dartboard bull']:
    obj = bpy.data.objects[name]
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    radius = max(hypot(point.x - cx, point.z - cz) for point in points)
    near = min(point.y for point in points)
    far = max(point.y for point in points)
    count = 128
    vertices = [(cx + radius * sin(i * 2 * pi / count), y, cz + radius * cos(i * 2 * pi / count)) for y in [near, far] for i in range(count)]
    faces = [(i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count)]
    faces.extend([tuple(reversed(range(count))), tuple(range(count, 2 * count))])
    replace_mesh(obj, vertices, faces, count)

segments = [obj for obj in bpy.data.collections['RoomHome'].all_objects if obj.name.startswith('Dartboard segment')]
assert len(segments) == 80
for obj in segments:
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    radii = [hypot(point.x - cx, point.z - cz) for point in points]
    angles = [atan2(point.x - cx, point.z - cz) for point in points]
    start = angles[0]
    angles = [start + (angle - start + pi) % (2 * pi) - pi for angle in angles]
    lower, upper = min(angles), max(angles)
    near = sum(point.y for point in points) / len(points)
    steps = 8
    vertices = [(cx + radius * sin(lower + (upper - lower) * i / steps), near, cz + radius * cos(lower + (upper - lower) * i / steps)) for radius in [min(radii), max(radii)] for i in range(steps + 1)]
    faces = [(i, i + 1, i + steps + 2, i + steps + 1) for i in range(steps)]
    replace_mesh(obj, vertices, faces)
bpy.context.view_layer.update()
print({'curved_segments': len(segments), 'body_sides': 128})
