from pathlib import Path

import bpy


def refine_top_magazines():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Magazines require production source in Object mode')
    obj = bpy.data.objects['Magazines U1 top']
    if obj.get('topMagazinesRefined'):
        raise RuntimeError('Top magazines already refined')
    original = obj.data
    if len(original.vertices) != 720 or not obj.get('bookPageEdgesRefined'):
        raise RuntimeError('Unexpected magazine page topology')
    widths = (1.4, 0.8, 0.6, 1.1, 1.7, 0.7, 1.3, 0.6, 1.0, 1.6, 0.7, 0.8, 1.2, 0.6, 1.8, 0.7, 1.0, 0.6, 1.4, 0.8, 0.7, 1.2, 0.6, 1.5, 0.8, 1.0, 0.7, 1.3, 0.8, 1.1)
    heights = (0.98, 0.96, 1.0, 0.97, 0.92, 0.98, 0.94, 0.99, 0.96, 0.95, 0.98, 0.91, 0.97, 0.99, 0.95, 0.96, 0.98, 0.93, 0.99, 0.95, 0.97, 0.99, 0.94, 0.96, 0.98, 0.92, 0.99, 0.97, 0.95, 0.98)
    lanes = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 2, 5, 1, 7, 9, 3, 10, 14, 4, 15, 8, 13, 2)
    high = max(v.co.y for v in original.vertices)
    low = min(v.co.y for v in original.vertices)
    gap = 0.0012
    unit = (high - low - gap * 29) / sum(widths)
    data = original.copy()
    data.name = 'Magazines U1 varied reference proportions'
    old_spine = bpy.data.materials['Reference pale book spines']
    spine_index = list(data.materials).index(old_spine)
    material = old_spine.copy()
    material.name = 'Reference top magazine spines'
    image = bpy.data.images.load(str(Path(bpy.data.filepath).parent / 'textures/top-magazine-spines.png'), check_existing=True)
    image.pack()
    material.node_tree.nodes['Image Texture'].image = image
    data.materials[spine_index] = material
    cursor = high
    report = []
    for index, weight in enumerate(widths):
        vertices = list(data.vertices)[index * 24:(index + 1) * 24]
        ymin, ymax = min(v.co.y for v in vertices), max(v.co.y for v in vertices)
        zmin, zmax = min(v.co.z for v in vertices), max(v.co.z for v in vertices)
        width = weight * unit
        for vertex in vertices:
            vertex.co.y = cursor - width + (vertex.co.y - ymin) / (ymax - ymin) * width
            vertex.co.z = zmin + (vertex.co.z - zmin) * heights[index]
        spine_faces = [p for p in list(data.polygons)[index * 22:(index + 1) * 22] if p.material_index == spine_index]
        loops = [loop for p in spine_faces for loop in p.loop_indices]
        uv = data.uv_layers.active
        umin, umax = min(uv.data[l].uv.x for l in loops), max(uv.data[l].uv.x for l in loops)
        for loop in loops:
            u = (uv.data[loop].uv.x - umin) / (umax - umin)
            uv.data[loop].uv.x = (lanes[index] + 0.04 + u * 0.92) / 16
        report.append({'index': index, 'width_m': width, 'height_m': (zmax - zmin) * heights[index]})
        cursor -= width + gap
    data.update()
    if any(p.area <= 1e-12 for p in data.polygons):
        raise RuntimeError('Degenerate magazine geometry')
    original.use_fake_user = True
    obj.data = data
    obj['topMagazinesRefined'] = True
    obj['topMagazineOriginalMesh'] = original.name
    obj['topMagazineDimensionsEstimated'] = True
    bpy.context.view_layer.update()
    return {'books': report, 'gap_m': gap, 'original_count_preserved': True}


result = refine_top_magazines()
