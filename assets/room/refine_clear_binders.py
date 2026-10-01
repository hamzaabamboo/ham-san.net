import math
from pathlib import Path

import bpy


def refine_clear_binders():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Clear binders require production source in Object mode')
    obj = bpy.data.objects['Clear files U4 middle']
    if obj.get('clearBindersRefined'):
        raise RuntimeError('Clear binders already refined')
    original = obj.data
    if len(original.vertices) != 176 or len(original.polygons) != 132:
        raise RuntimeError('Unexpected clear binder topology')
    data = original.copy()
    data.name = 'Clear binder gray covers'
    front = bpy.data.materials['Reference pale folder spines'].copy()
    front.name = 'Reference gray album binder spines'
    image = bpy.data.images.load(str(Path(bpy.data.filepath).parent / 'textures/clear-binder-spines.png'), check_existing=True)
    image.pack()
    front.node_tree.nodes['Image Texture'].image = image
    shader = front.node_tree.nodes['Principled BSDF']
    shader.inputs['Roughness'].default_value = 0.48
    shader.inputs['Transmission Weight'].default_value = 0.08
    shader.inputs['IOR'].default_value = 1.46
    body = bpy.data.materials['Notes paper cream'].copy()
    body.name = 'Reference cloudy binder plastic'
    shader = body.node_tree.nodes['Principled BSDF']
    shader.inputs['Base Color'].default_value = (0.63, 0.68, 0.70, 1)
    shader.inputs['Roughness'].default_value = 0.48
    shader.inputs['Transmission Weight'].default_value = 0.08
    shader.inputs['IOR'].default_value = 1.46
    for index, material in enumerate(data.materials):
        data.materials[index] = front if material.name == 'Reference pale folder spines' else body
    strap = bpy.data.materials.new('Reference binder charcoal straps')
    strap.use_nodes = True
    shader = strap.node_tree.nodes['Principled BSDF']
    shader.inputs['Base Color'].default_value = (0.035, 0.042, 0.045, 1)
    shader.inputs['Roughness'].default_value = 0.91
    metal = bpy.data.materials.new('Reference binder metal snaps')
    metal.use_nodes = True
    shader = metal.node_tree.nodes['Principled BSDF']
    shader.inputs['Base Color'].default_value = (0.58, 0.48, 0.31, 1)
    shader.inputs['Metallic'].default_value = 0.82
    shader.inputs['Roughness'].default_value = 0.32
    strap_vertices, strap_faces, snap_vertices, snap_faces = [], [], [], []

    def folded_strap(x, y, top, width):
        outline = ((x - 0.0012, top - 0.055), (x, top - 0.055), (x, top), (x + 0.025, top), (x + 0.025, top + 0.0008), (x - 0.0012, top + 0.0008))
        base = len(strap_vertices)
        strap_vertices.extend((px, side, pz) for side in (y - width / 2, y + width / 2) for px, pz in outline)
        strap_faces.extend((tuple(base + i for i in range(6)), tuple(base + i for i in reversed(range(6, 12)))))
        strap_faces.extend((base + i, base + i + 6, base + (i + 1) % 6 + 6, base + (i + 1) % 6) for i in range(6))

    for start in range(0, len(data.vertices), 8):
        points = [v.co for v in list(data.vertices)[start:start + 8]]
        x = min(p.x for p in points)
        y = (min(p.y for p in points) + max(p.y for p in points)) / 2
        top = max(p.z for p in points)
        width = (max(p.y for p in points) - min(p.y for p in points)) * 0.60
        folded_strap(x, y, top, width)
        base = len(snap_vertices)
        radius = min(0.0028, width * 0.30)
        for depth in (x - 0.0018, x - 0.0012):
            for index in range(12):
                angle = index * math.tau / 12
                snap_vertices.append((depth, y + radius * math.cos(angle), top - 0.047 + radius * math.sin(angle)))
        snap_faces.extend((tuple(base + i for i in reversed(range(12))), tuple(base + i for i in range(12, 24))))
        snap_faces.extend((base + i, base + (i + 1) % 12, base + (i + 1) % 12 + 12, base + i + 12) for i in range(12))
    created = []
    for name, vertices, faces, material in (('Clear binder top straps', strap_vertices, strap_faces, strap), ('Clear binder metal snaps', snap_vertices, snap_faces, metal)):
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata(vertices, [], faces)
        mesh.materials.append(material)
        mesh.update()
        if any(p.area <= 1e-12 for p in mesh.polygons):
            raise RuntimeError(f'Degenerate binder part: {name}')
        part = bpy.data.objects.new(name, mesh)
        obj.users_collection[0].objects.link(part)
        part.parent = obj
        part['binderReferenceDetail'] = True
        created.append(name)
    original.use_fake_user = True
    obj.data = data
    obj['clearBindersRefined'] = True
    obj['clearBinderOriginalMesh'] = original.name
    obj['clearBinderDimensionsEstimated'] = True
    bpy.context.view_layer.update()
    return {'count_preserved': 22, 'created': created, 'dimensions_estimated': True}


result = refine_clear_binders()
