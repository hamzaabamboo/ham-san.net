import bpy
import numpy as np
from collections import deque
from mathutils import Matrix, Vector
from mathutils.geometry import tessellate_polygon


def silhouette(image, step=4):
    width, height = image.size
    pixels = np.array(image.pixels[:], dtype=np.float32).reshape(height, width, 4)[::step, ::step]
    ink = pixels[:, :, :3].min(axis=2) < 0.90
    rows, cols = ink.shape
    visited = np.zeros_like(ink)
    largest = []
    for y, x in zip(*np.where(ink)):
        if visited[y, x]:
            continue
        component = []
        queue = deque([(int(x), int(y))])
        visited[y, x] = True
        while queue:
            cx, cy = queue.popleft()
            component.append((cx, cy))
            for nx, ny in [(cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)]:
                if 0 <= nx < cols and 0 <= ny < rows and ink[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((nx, ny))
        if len(component) > len(largest):
            largest = component
    mask = np.zeros_like(ink)
    for x, y in largest:
        mask[y, x] = True
    return mask


def outline(mask):
    rows, cols = mask.shape
    edges = {}
    for y, x in zip(*np.where(mask)):
        x, y = int(x), int(y)
        for outside, a, b in [
            (y == 0 or not mask[y - 1, x], (x, y), (x + 1, y)),
            (x == cols - 1 or not mask[y, x + 1], (x + 1, y), (x + 1, y + 1)),
            (y == rows - 1 or not mask[y + 1, x], (x + 1, y + 1), (x, y + 1)),
            (x == 0 or not mask[y, x - 1], (x, y + 1), (x, y)),
        ]:
            if outside:
                edges.setdefault(a, []).append(b)
    loops = []
    while edges:
        start = next(iter(edges))
        current = start
        loop = []
        while current in edges:
            loop.append(current)
            choices = edges[current]
            following = choices.pop()
            if not choices:
                del edges[current]
            current = following
            if current == start:
                break
        if len(loop) > 3:
            loops.append(loop)
    return max(loops, key=lambda loop: abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(loop, loop[1:] + loop[:1]))))


def simplify(points, tolerance=0.65):
    if len(points) <= 2:
        return points
    a, b = np.array(points[0]), np.array(points[-1])
    delta = b - a
    distance = np.linalg.norm(delta)
    values = [abs(np.cross(delta, np.array(p) - a)) / distance if distance else np.linalg.norm(np.array(p) - a) for p in points]
    index = int(np.argmax(values))
    if values[index] <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


source = bpy.data.collections['RoomHome']
spec = globals().get('STAND_SPEC', {'name': 'navy', 'height': 0.28, 'position': (3.412, 1.487, 1.704)})
name = spec['name']
position = spec['position']
image_path = f'//textures/acrylic-idol-{name}.png'
image = bpy.data.images.load(bpy.path.abspath(image_path), check_existing=True)
image.filepath = image_path
mask = silhouette(image)
rows, cols = mask.shape
shape = outline(mask)
shape = simplify(shape + shape[:1])[:-1]
expanded = mask.copy()
for _ in range(3):
    padded = np.pad(expanded, 1)
    expanded = np.logical_or.reduce([padded[dy:dy + rows, dx:dx + cols] for dy in range(3) for dx in range(3)])
edge = outline(expanded)
edge = simplify(edge + edge[:1])[:-1]
bottom = min(y for x, y in shape)
height = spec['height']
scale = height / (max(y for x, y in shape) - bottom)
center = (min(x for x, y in shape) + max(x for x, y in shape)) / 2


def point(value, depth=0):
    x, y = value
    return Vector(((x - center) * scale, (y - bottom) * scale + 0.01, depth))


root = bpy.data.objects.new(f'Contour acrylic idol {name}', None)
source.objects.link(root)
root.matrix_world = Matrix(((0, 0, -1, position[0]), (-1, 0, 0, position[1]), (0, 1, 0, position[2]), (0, 0, 0, 1)))
root['artwork_height'] = height
root['acrylic_thickness'] = 0.003
root['outline_margin'] = 3 * scale
root['roomTarget'] = 'hobbies'
clear = bpy.data.materials['Display acrylic']
curve = bpy.data.curves.new(f'Idol {name} contour acrylic profile', 'CURVE')
curve.dimensions = '2D'
curve.fill_mode = 'BOTH'
curve.extrude = 0.0015
curve.bevel_depth = 0.00035
curve.bevel_resolution = 3
spline = curve.splines.new('POLY')
spline.points.add(len(edge) - 1)
for vertex, coordinate in zip(spline.points, edge):
    vertex.co = (*point(coordinate), 1)
spline.use_cyclic_u = True
plate = bpy.data.objects.new(f'Idol {name} contour clear plate', curve)
source.objects.link(plate)
plate.parent = root
curve.materials.append(clear)
vertices = [point(coordinate, 0.0019) for coordinate in shape]
faces = tessellate_polygon([vertices])
mesh = bpy.data.meshes.new(f'Idol {name} contour printed surface')
mesh.from_pydata(vertices, [], faces)
mesh.uv_layers.new(name='Artwork UV')
for polygon in mesh.polygons:
    for index in polygon.loop_indices:
        x, y = shape[mesh.loops[index].vertex_index]
        mesh.uv_layers.active.data[index].uv = (x / cols, y / rows)
material = bpy.data.materials.new(f'Idol {name} printed ink')
material.use_nodes = True
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Roughness'].default_value = 0.40
texture = material.node_tree.nodes.new('ShaderNodeTexImage')
texture.image = image
material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
mesh.materials.append(material)
printed = bpy.data.objects.new(f'Idol {name} contour print', mesh)
source.objects.link(printed)
printed.parent = root
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=1, depth=1, location=(position[0], position[1], position[2] + 0.004))
base = bpy.context.object
base.name = f'Idol {name} oval acrylic base'
base.scale = (0.040, 0.060, 0.008)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
for collection in list(base.users_collection):
    collection.objects.unlink(base)
source.objects.link(base)
base.data.materials.append(clear)
bevel = base.modifiers.new('Polished base edge', 'BEVEL')
bevel.width = 0.001
bevel.segments = 3
for obj in [plate, printed, base]:
    obj['roomTarget'] = 'hobbies'
print({'print_vertices': len(shape), 'clear_edge_vertices': len(edge), 'height': height})
