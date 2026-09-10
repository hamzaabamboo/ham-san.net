import bpy
import bmesh
import math
import numpy as np
from collections import Counter, deque
from mathutils import Matrix, Vector
from mathutils.geometry import delaunay_2d_cdt

family = globals().get('ACRYLIC_FAMILY', 'Idol u2r3 r3 s2')
profile_scale = globals().get('ACRYLIC_PROFILE_SCALE', bpy.data.objects[family + ' print'].get('roomAcrylicProfileScale', 1.0))
assert bpy.data.filepath == '/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend'
source = bpy.data.collections['RoomHome']
names = [family + ' ' + suffix for suffix in ('print', 'plate', 'base')]
assert all(name in source.all_objects for name in names)
assert all(bpy.data.objects[name].parent is None for name in names)
archive = bpy.data.collections.get('Room acrylic before refinement')
if archive is None:
    archive = bpy.data.collections.new('Room acrylic before refinement')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
originals = {}
for name in names:
    backup_name = name + ' before contour refinement'
    backup = bpy.data.objects.get(backup_name)
    if backup is None:
        obj = bpy.data.objects[name]
        backup = obj.copy()
        backup.data = obj.data.copy()
        backup.name = backup_name
        backup.hide_render = True
        backup.hide_viewport = True
        archive.objects.link(backup)
        if obj.get('roomShrineOriginalMatrix'):
            values = obj['roomShrineOriginalMatrix']
            backup.matrix_world = Matrix([values[i:i + 4] for i in range(0, 16, 4)])
    originals[name] = backup

original = originals[family + ' print']
basis = original.matrix_world.copy()
artwork = globals().get('ACRYLIC_ARTWORK')
if artwork:
    row, column = divmod(int(artwork['id'].split('-')[-1]) - 1, 8)
    image = bpy.data.images[artwork['image']]
    x0, y0, x1, y1 = artwork['bounds']
else:
    uv = original.data.uv_layers.active.data
    column = min(3, int((min(p.uv.x for p in uv) + max(p.uv.x for p in uv)) * 2))
    row = min(3, int((1 - (min(p.uv.y for p in uv) + max(p.uv.y for p in uv)) * 0.5) * 4))
    image = bpy.data.images['acrylic-insert-minimal-atlas.png']
    columns = (0, 313, 627, 941, 1254)
    rows = (0, 337, 672, 986, 1254)
    x0, x1 = columns[column:column + 2]
    y0, y1 = rows[row:row + 2]
width, height = image.size
assert (width, height) == (1254, 1254)
pixels = np.empty(len(image.pixels), dtype=np.float32)
image.pixels.foreach_get(pixels)
pixels = pixels.reshape(height, width, 4)[::-1]
padding = 8
crop = pixels[y0:y1, x0:x1]
mask = np.pad(crop[:, :, 3] > 0.5 if pixels[:, :, 3].min() < 0.5 else crop[:, :, :3].min(axis=2) < 0.95, padding)


def dominant(value):
    remaining = value.copy()
    largest = []
    h, w = value.shape
    for y, x in np.argwhere(value):
        if not remaining[y, x]:
            continue
        remaining[y, x] = False
        queue = deque([(int(x), int(y))])
        points = []
        while queue:
            px, py = queue.popleft()
            points.append((px, py))
            for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                if 0 <= nx < w and 0 <= ny < h and remaining[ny, nx]:
                    remaining[ny, nx] = False
                    queue.append((nx, ny))
        if len(points) > len(largest):
            largest = points
    result = np.zeros_like(value)
    for x, y in largest:
        result[y, x] = True
    return result


def dilate(value):
    padded = np.pad(value, 1)
    return np.logical_or.reduce([padded[y:y + value.shape[0], x:x + value.shape[1]]
                                 for y in range(3) for x in range(3)])


def erode(value):
    padded = np.pad(value, 1)
    return np.logical_and.reduce([padded[y:y + value.shape[0], x:x + value.shape[1]]
                                  for y in range(3) for x in range(3)])


def outline(value):
    padded = np.pad(value, 1)
    edges = {}
    for side, neighbor in enumerate((padded[:-2, 1:-1], padded[1:-1, 2:],
                                     padded[2:, 1:-1], padded[1:-1, :-2])):
        for y, x in np.argwhere(value & ~neighbor):
            corners = ((int(x), int(y)), (int(x + 1), int(y)),
                       (int(x + 1), int(y + 1)), (int(x), int(y + 1)))
            edges.setdefault(corners[side], []).append(corners[(side + 1) % 4])
    paths = []
    while edges:
        start = next(iter(edges))
        path = [start]
        current = start
        while current in edges:
            following = edges[current].pop()
            if not edges[current]:
                del edges[current]
            if following == start:
                paths.append(path)
                break
            path.append(following)
            current = following
    if not paths:
        raise RuntimeError('Atlas figure has no closed contour')
    return max(paths, key=lambda p: abs(sum(a[0] * b[1] - b[0] * a[1]
                                           for a, b in zip(p, p[1:] + p[:1]))))


def simplify(points, tolerance):
    if len(points) <= 2:
        return points
    a = np.array(points[0], dtype=float)
    b = np.array(points[-1], dtype=float)
    line = b - a
    length = float(np.linalg.norm(line))
    distances = [abs(line[0] * (p[1] - a[1]) - line[1] * (p[0] - a[0])) / length
                 if length else float(np.linalg.norm(np.array(p) - a)) for p in points]
    index = int(np.argmax(distances))
    if distances[index] <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


def closed_simplify(points, tolerance):
    start = np.array(points[0])
    opposite = max(range(len(points)), key=lambda i: float(np.linalg.norm(np.array(points[i]) - start)))
    return (simplify(points[:opposite + 1], tolerance)[:-1]
            + simplify(points[opposite:] + points[:1], tolerance)[:-1])


mask = erode(erode(dilate(dilate(dominant(mask)))))
ink = outline(mask)
pixel_lo = np.min(ink, axis=0)
pixel_hi = np.max(ink, axis=0)
foreground_y = np.where(mask)[0]
assert pixel_hi[1] - pixel_lo[1] >= (foreground_y.max() - foreground_y.min()) * 0.9
old_z = [v.co.z for v in original.data.vertices]
pixel_scale = (max(old_z) - min(old_z)) * profile_scale / (pixel_hi[1] - pixel_lo[1])
pixel_center = (pixel_lo[0] + pixel_hi[0]) * 0.5
center_y = (min(v.co.y for v in original.data.vertices) + max(v.co.y for v in original.data.vertices)) * 0.5
clear_mask = mask.copy()
margin_pixels = max(1, math.ceil(0.00065 / (pixel_scale * basis.to_scale().z)))
for _ in range(margin_pixels):
    clear_mask = dilate(clear_mask)
ink = closed_simplify(ink, 2.4)
edge = closed_simplify(outline(clear_mask), 3.0)
plate_original = originals[family + ' plate']
plate_points = [basis.inverted() @ plate_original.matrix_world @ v.co for v in plate_original.data.vertices]
front_x = min(p.x for p in plate_points)
back_x = max(p.x for p in plate_points)


def material(name, original_name):
    result = bpy.data.materials.get(name)
    if result is None:
        result = bpy.data.materials[original_name].copy()
        result.name = name
    return result


clear = material('Room/AcrylicClear contour', 'Display acrylic')
shader = clear.node_tree.nodes.get('Principled BSDF')
shader.inputs['Alpha'].default_value = 1.0
shader.inputs['Transmission Weight'].default_value = 1.0
shader.inputs['Roughness'].default_value = 0.025
shader.inputs['IOR'].default_value = 1.46
shader.inputs['Coat Weight'].default_value = 0.05
clear.surface_render_method = 'DITHERED'
ink_material = material('Room/AcrylicPrint unique ' + artwork['id'][0] if artwork else 'Room/AcrylicPrint contour', 'Room/AcrylicPrint atlas')
if artwork:
    texture = next(node for node in ink_material.node_tree.nodes if node.type == 'TEX_IMAGE')
    texture.image = image
    shader = ink_material.node_tree.nodes.get('Principled BSDF')
    ink_material.node_tree.links.new(texture.outputs['Alpha'], shader.inputs['Alpha'])


def build(name, contour, x_values, mat, textured):
    coordinates = [Vector((center_y + (x - pixel_center) * pixel_scale,
                           min(old_z) + (pixel_hi[1] - y) * pixel_scale)) for x, y in contour]
    indices = list(range(len(coordinates)))
    area = sum(a.x * b.y - b.x * a.y for a, b in zip(coordinates, coordinates[1:] + coordinates[:1]))
    if area < 0:
        indices.reverse()
    triangulation = delaunay_2d_cdt(coordinates, [], [indices], 1, 1e-7, False)
    points = [Vector((x_values[0], p.x, p.y)) for p in triangulation[0]]
    triangles = [list(tri) for tri in triangulation[2]]
    for tri in triangles:
        a, b, c = (points[i] for i in tri)
        if (b - a).cross(c - a).x > 0:
            tri.reverse()
    vertices = [tuple(p) for p in points]
    faces = [tuple(tri) for tri in triangles]
    count = len(points)
    if len(x_values) == 2:
        vertices.extend((x_values[1], p.y, p.z) for p in points)
        faces.extend(tuple(i + count for i in reversed(tri)) for tri in triangles)
        edges = [(tri[i], tri[(i + 1) % 3]) for tri in triangles for i in range(3)]
        uses = Counter(tuple(sorted(edge)) for edge in edges)
        faces.extend((b, a, a + count, b + count) for a, b in edges if uses[tuple(sorted((a, b)))] == 1)
    mesh = bpy.data.meshes.new(name + ' atlas contour')
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    if len(x_values) == 2:
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
        bm.to_mesh(mesh)
        bm.free()
    if textured:
        layer = mesh.uv_layers.new(name='Atlas UV')
        for loop in mesh.loops:
            point = points[loop.vertex_index % count]
            x = (point.y - center_y) / pixel_scale + pixel_center
            y = pixel_hi[1] - (point.z - min(old_z)) / pixel_scale
            layer.data[loop.index].uv = ((x0 + x - padding) / width, 1 - (y0 + y - padding) / height)
    obj = bpy.data.objects[name]
    transform = originals[name].matrix_world.copy()
    mesh.transform(transform.inverted() @ basis)
    obj.data = mesh
    obj.matrix_world = transform
    obj['roomAcrylicContour'] = 1
    obj['roomAcrylicAtlasCell'] = row * 4 + column
    obj['roomAcrylicProfileScale'] = profile_scale
    if artwork:
        obj['roomAcrylicArtworkId'] = artwork['id']
        obj['roomAcrylicAtlasImage'] = image.name
    if any(p.area < 1e-12 for p in mesh.polygons):
        raise RuntimeError('Degenerate acrylic contour: ' + name)
    return obj


ink_thickness = max(v.co.x for v in original.data.vertices) - min(v.co.x for v in original.data.vertices)
printed = build(family + ' print', ink,
                (front_x - 0.000025, front_x - 0.000025 + ink_thickness), ink_material, True)
plate = build(family + ' plate', edge, (front_x, back_x), clear, False)
base = bpy.data.objects[family + ' base']
base.matrix_world = originals[base.name].matrix_world.copy()
slot_center = basis @ Vector(((front_x + back_x) * 0.5, center_y, min(old_z)))
base.location.x = slot_center.x
base.location.y = slot_center.y
old_base = originals[base.name]
base_lo = Vector([min(v.co[i] for v in old_base.data.vertices) for i in range(3)])
base_hi = Vector([max(v.co[i] for v in old_base.data.vertices) for i in range(3)])
base_center = (base_lo + base_hi) * 0.5
base_radius = (base_hi - base_lo) * 0.5
base_radius.x *= profile_scale
base_radius.y *= profile_scale
segments = 32
rim = 0.0002
vertices = [(base_center.x + (base_radius.x - inset) * math.cos(math.tau * i / segments),
             base_center.y + (base_radius.y - inset) * math.sin(math.tau * i / segments), z)
            for z, inset in ((base_lo.z, 0), (base_hi.z - rim, 0), (base_hi.z, rim))
            for i in range(segments)]
faces = [tuple(reversed(range(segments))), tuple(range(segments * 2, segments * 3))]
faces.extend((i + ring * segments, (i + 1) % segments + ring * segments,
              (i + 1) % segments + (ring + 1) * segments, i + (ring + 1) * segments)
             for ring in range(2) for i in range(segments))
mesh = bpy.data.meshes.new(base.name + ' slotted base')
mesh.from_pydata(vertices, [], faces)
for mat in old_base.data.materials:
    mesh.materials.append(mat)
for polygon in mesh.polygons:
    polygon.use_smooth = polygon.index >= 2
base.data = mesh
for modifier in list(base.modifiers):
    base.modifiers.remove(modifier)
bpy.context.view_layer.update()
base_top = max((base.matrix_world @ v.co).z for v in base.data.vertices)
feet = [plate.matrix_world @ v.co for v in plate.data.vertices
        if (plate.matrix_world @ v.co).z < base_top + 0.0004]
assert feet
lo = Vector([min(p[i] for p in feet) for i in range(3)]) - Vector((0.0001, 0.00015, 0.00004))
hi = Vector([max(p[i] for p in feet) for i in range(3)]) + Vector((0.0001, 0.00015, 0.0001))
hi.z = base_top + 0.0005
vertices = [(x, y, z) for z in (lo.z, hi.z) for y in (lo.y, hi.y) for x in (lo.x, hi.x)]
mesh = bpy.data.meshes.new(family + ' slot tool')
mesh.from_pydata(vertices, [], ((0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4),
                               (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)))
cutter = bpy.data.objects.get(family + ' slot cutter')
if cutter is None:
    cutter = bpy.data.objects.new(family + ' slot cutter', mesh)
    source.objects.link(cutter)
else:
    cutter.data = mesh
cutter.matrix_world = Matrix.Identity(4)
cutter.hide_render = True
cutter.hide_set(True)
modifier = base.modifiers.new('Plate insertion slot', 'BOOLEAN')
modifier.operation = 'DIFFERENCE'
modifier.object = cutter
modifier.solver = 'EXACT'
modifier = base.modifiers.new('Slot seam cleanup', 'WELD')
modifier.merge_threshold = 0.0000001
offset = Vector(printed.get('roomAcrylicPlacementOffset', (0, 0, 0)))
for obj in (printed, plate, base, cutter):
    obj.location += offset
bpy.context.view_layer.update()
result = {'family': family, 'cell': [row, column], 'ink_vertices': len(ink),
          'plate_vertices': len(edge), 'margin_pixels': margin_pixels,
          'printed_dimensions': list(printed.dimensions), 'artwork': artwork['id'] if artwork else None, 'saved': False}
