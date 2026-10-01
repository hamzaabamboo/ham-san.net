from pathlib import Path

import bpy


def refine_binder_group():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Binder grouping requires production source in Object mode')
    body = bpy.data.objects['Clear files U4 middle']
    if body.get('binderGroupRefined'):
        raise RuntimeError('Binder grouping already refined')
    straps = bpy.data.objects['Clear binder top straps']
    snaps = bpy.data.objects['Clear binder metal snaps']
    if (len(body.data.vertices), len(straps.data.vertices), len(snaps.data.vertices)) != (176, 264, 528):
        raise RuntimeError('Unexpected binder detail topology')
    original = body.data
    low = min(v.co.y for v in original.vertices)
    high = max(v.co.y for v in original.vertices)
    weights = (0.9, 1.1, 1.1, 1.2, 1.3, 0.9)
    gap = 0.0012
    unit = (high - low - gap * 5) / sum(weights)
    cursor = high
    transforms = []
    for index, weight in enumerate(weights):
        vertices = list(original.vertices)[index * 8:(index + 1) * 8]
        ymin, ymax = min(v.co.y for v in vertices), max(v.co.y for v in vertices)
        width = unit * weight
        transforms.append((ymin, ymax, cursor - width, cursor))
        cursor -= width + gap
    materials = []
    for name, color in (
        ('Reference binder gray strap', (0.21, 0.24, 0.27, 1)),
        ('Reference binder purple strap', (0.32, 0.20, 0.43, 1)),
        ('Reference binder blue strap', (0.22, 0.49, 0.62, 1)),
        ('Reference binder charcoal straps', None),
        ('Reference binder gold strap', (0.55, 0.43, 0.24, 1)),
    ):
        material = bpy.data.materials['Reference binder charcoal straps']
        if color:
            material = material.copy()
            material.name = name
            material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = color
        materials.append(material)

    def regroup(obj, count, vertices_per_item, faces_per_item, keep_radius=False):
        source = obj.data
        vertices, faces, slots, uv_values = [], [], [], []
        for index in range(count):
            ymin, ymax, new_min, new_max = transforms[index]
            old_mid, new_mid = (ymin + ymax) / 2, (new_min + new_max) / 2
            offset = len(vertices)
            for vertex in list(source.vertices)[index * vertices_per_item:(index + 1) * vertices_per_item]:
                point = vertex.co.copy()
                point.y = point.y - old_mid + new_mid if keep_radius else new_min + (point.y - ymin) / (ymax - ymin) * (new_max - new_min)
                vertices.append(point)
            for polygon in list(source.polygons)[index * faces_per_item:(index + 1) * faces_per_item]:
                faces.append(tuple(offset + vertex - index * vertices_per_item for vertex in polygon.vertices))
                slots.append(index if obj is straps else polygon.material_index)
                uv_values.append([source.uv_layers.active.data[loop].uv.copy() for loop in polygon.loop_indices] if source.uv_layers.active else None)
        mesh = bpy.data.meshes.new(obj.name + ' six album grouping')
        mesh.from_pydata(vertices, [], faces)
        for material in materials if obj is straps else source.materials:
            mesh.materials.append(material)
        uv = mesh.uv_layers.new(name=source.uv_layers.active.name) if source.uv_layers.active else None
        for polygon, slot, values in zip(mesh.polygons, slots, uv_values):
            polygon.material_index = slot
            if uv:
                for loop, value in zip(polygon.loop_indices, values):
                    uv.data[loop].uv = value
        if obj is body:
            paper_index = list(mesh.materials).index(bpy.data.materials['Reference cloudy binder plastic'])
            for polygon in list(mesh.polygons)[30:36]:
                polygon.material_index = paper_index
        mesh.update()
        if any(p.area <= 1e-12 for p in mesh.polygons):
            raise RuntimeError(f'Degenerate album group: {obj.name}')
        return obj, source, mesh

    changes = [regroup(body, 6, 8, 6), regroup(straps, 5, 12, 8), regroup(snaps, 5, 24, 14, keep_radius=True)]
    for obj, source, mesh in changes:
        source.use_fake_user = True
        obj.data = mesh
        obj['binderGroupOriginalMesh'] = source.name
    body['binderGroupRefined'] = True
    body['binderVisibleSpines'] = 6
    body['binderCountSource'] = '015010154 and 033141015 visible shelf group'
    bpy.context.view_layer.update()
    return {'visible_spines': 6, 'closures': 5, 'widths_m': [b - a for _, _, a, b in transforms], 'widths_estimated': True}


result = refine_binder_group()
