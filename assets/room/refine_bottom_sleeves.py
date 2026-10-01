from pathlib import Path

import bpy
from mathutils import Vector


def refine_bottom_sleeves():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Bottom sleeves require production source in Object mode')
    obj = bpy.data.objects['Books U4 bottom']
    if obj.get('bottomSleevesRefined'):
        raise RuntimeError('Bottom sleeves already refined')
    original = obj.data
    if len(original.vertices) != 152 or obj.modifiers or original.shape_keys:
        raise RuntimeError('Unexpected bottom book topology')
    materials = [bpy.data.materials[name] for name in (
        'Reference Dark stacked album cover', 'Reference Light gray album cover',
        'Reference Cream album cover', 'Reference Ivory album cover',
        'Reference Pale album cover', 'Reference exposed book pages',
    )]
    vertices, faces, slots = [], [], []

    def album(origin, depth, width, height, slot, lean=0):
        axes = (Vector((depth, 0, 0)), Vector((0, width, 0)), Vector((0, lean, height)))
        values = ((0, 0.006 / depth, 1), (0, 0.0006 / width, 1 - 0.0006 / width, 1), (0, 1))
        indices = {}
        for x in range(3):
            for y in range(4):
                for z in range(2):
                    indices[x, y, z] = len(vertices)
                    vertices.append(origin + sum((axes[i] * values[i][key] for i, key in enumerate((x, y, z))), Vector()))
        for axis, u, v in ((0, 1, 2), (1, 2, 0), (2, 0, 1)):
            for boundary in (0, len(values[axis]) - 1):
                for a in range(len(values[u]) - 1):
                    for b in range(len(values[v]) - 1):
                        corners = []
                        for du, dv in ((0, 0), (1, 0), (1, 1), (0, 1)):
                            key = [0, 0, 0]
                            key[axis], key[u], key[v] = boundary, a + du, b + dv
                            corners.append(tuple(key))
                        if boundary == 0:
                            corners.reverse()
                        faces.append(tuple(indices[key] for key in corners))
                        page = axis == 0 and boundary != 0 and a == 1 or axis == 2 and a == 1 and b == 1
                        slots.append(5 if page else slot)

    x = min(v.co.x for v in original.vertices)
    base = min(v.co.z for v in original.vertices)
    high = max(v.co.y for v in original.vertices)
    album(Vector((x, high - 0.023, base)), 0.23, 0.018, 0.285, 0, lean=-0.026)
    cursor = high - 0.056
    specifications = []
    for index, (width, height) in enumerate(zip((0.095, 0.085, 0.085, 0.072), (0.30, 0.255, 0.31, 0.295))):
        origin = Vector((x, cursor - width, base + 0.0006))
        album(origin, 0.23, width, height, index + 1)
        specifications.append((origin, width, height))
        cursor -= width + 0.003
    mesh = bpy.data.meshes.new('Bottom broad album sleeves')
    mesh.from_pydata(vertices, [], faces)
    for material in materials:
        mesh.materials.append(material)
    for polygon, slot in zip(mesh.polygons, slots):
        polygon.material_index = slot
    mesh.update()
    if any(p.area <= 1e-12 for p in mesh.polygons):
        raise RuntimeError('Degenerate album geometry')
    bag_vertices, bag_faces = [], []
    for origin, width, height in specifications:
        offset = len(bag_vertices)
        xmin, ymin, zmin = origin.x - 0.0009, origin.y - 0.0009, base
        xmax, ymax, top = origin.x + 0.2309, origin.y + width + 0.0009, origin.z + height + 0.008
        for inset in (0, 0.0004):
            for z in (zmin + inset, top):
                bag_vertices.extend(((xmin + inset, ymin + inset, z), (xmax - inset, ymin + inset, z), (xmax - inset, ymax - inset, z), (xmin + inset, ymax - inset, z)))
        for side in range(4):
            nxt = (side + 1) % 4
            bag_faces.extend(((offset + side, offset + nxt, offset + nxt + 4, offset + side + 4), (offset + side + 8, offset + side + 12, offset + nxt + 12, offset + nxt + 8), (offset + side + 4, offset + nxt + 4, offset + nxt + 12, offset + side + 12)))
        bag_faces.extend(((offset + 3, offset + 2, offset + 1, offset), (offset + 8, offset + 9, offset + 10, offset + 11)))
    bag_mesh = bpy.data.meshes.new('Bottom open protective sleeve covers')
    bag_mesh.from_pydata(bag_vertices, [], bag_faces)
    bag_mesh.update()
    if any(p.area <= 1e-12 for p in bag_mesh.polygons):
        raise RuntimeError('Degenerate protective covers')
    material = bpy.data.materials['Reference cloudy binder plastic'].copy()
    material.name = 'Reference clear protective album sleeves'
    shader = material.node_tree.nodes['Principled BSDF']
    shader.inputs['Base Color'].default_value = (0.88, 0.91, 0.92, 1)
    shader.inputs['Transmission Weight'].default_value = 0.75
    shader.inputs['Roughness'].default_value = 0.25
    bag_mesh.materials.append(material)
    bag = bpy.data.objects.new('Bottom album protective covers', bag_mesh)
    obj.users_collection[0].objects.link(bag)
    bag.parent = obj
    bag['albumProtectiveCovers'] = True
    original.use_fake_user = True
    obj.data = mesh
    obj['bottomSleevesRefined'] = True
    obj['bottomSleevesOriginalMesh'] = original.name
    obj['bottomSleevesDimensionsEstimated'] = True
    obj['bottomSleevesPhoto'] = 'PXL_20260907_015010154.jpg'
    bpy.context.view_layer.update()
    return {'broad_sleeves': 4, 'dark_leaning_items': 1, 'inventory_interpretation': True}


result = refine_bottom_sleeves()
