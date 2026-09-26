import bpy

source = bpy.data.collections['RoomHome']
material = bpy.data.materials['Illustrated paper book spines']
image = bpy.data.images['book-spine-atlas.png']
edges = [0, 114, 218, 327, 435, 540, 639, 751, 852, 960, 1063, 1156, 1230]
prefixes = ('Shelf density book ', 'Shelf upper book ', 'Shelf top bay book ')
books = sorted(
    [
        obj
        for obj in source.all_objects
        if obj.type == 'MESH' and obj.name.startswith(prefixes) and ' top' not in obj.name and ' band' not in obj.name
    ],
    key=lambda obj: obj.name,
)

for index, obj in enumerate(books):
    if material.name not in obj.data.materials:
        obj.data.materials.append(material)
    material_index = list(obj.data.materials).index(material)
    uv = obj.data.uv_layers.active or obj.data.uv_layers.new(name='Book spine UV')
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    ymin, ymax = min(point.y for point in points), max(point.y for point in points)
    zmin, zmax = min(point.z for point in points), max(point.z for point in points)
    column = index % 12
    umin, umax = (edges[column] + 3) / 1230, (edges[column + 1] - 3) / 1230
    stripe_ratio = (umax - umin) * image.size[0] / image.size[1]
    coverage = min(1, stripe_ratio / ((ymax - ymin) / (zmax - zmin)))
    normal_matrix = obj.matrix_world.to_3x3().inverted().transposed()
    for polygon in obj.data.polygons:
        if (normal_matrix @ polygon.normal).normalized().x > -0.9:
            continue
        polygon.material_index = material_index
        for loop in polygon.loop_indices:
            point = points[obj.data.loops[loop].vertex_index]
            uv.data[loop].uv = (
                umin + (umax - umin) * (ymax - point.y) / (ymax - ymin),
                0.5 + ((point.z - zmin) / (zmax - zmin) - 0.5) * coverage,
            )

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'textured_remaining_books': len(books), 'atlas': image.name})
