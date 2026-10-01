from pathlib import Path

import bpy
from mathutils import Vector


def refine_lower_albums():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Lower albums require production source in Object mode')
    obj = bpy.data.objects['Binders U4 lower']
    if obj.get('lowerAlbumsRefined'):
        raise RuntimeError('Lower albums already refined')
    original = obj.data
    if len(original.vertices) != 64 or obj.modifiers or original.shape_keys:
        raise RuntimeError('Unexpected lower album topology')
    colors = (
        ('Pale album cover', (0.72, 0.70, 0.65, 1)),
        ('Burgundy album cover', (0.24, 0.045, 0.055, 1)),
        ('Red album cover', (0.37, 0.065, 0.07, 1)),
        ('Gray album cover', (0.22, 0.23, 0.22, 1)),
        ('Cream album cover', (0.69, 0.66, 0.55, 1)),
        ('Ivory album cover', (0.76, 0.74, 0.66, 1)),
        ('Olive album cover', (0.40, 0.43, 0.30, 1)),
        ('Light gray album cover', (0.60, 0.62, 0.57, 1)),
        ('Dark stacked album cover', (0.045, 0.043, 0.039, 1)),
        ('Brown stacked album cover', (0.22, 0.16, 0.11, 1)),
    )
    materials = []
    for name, color in colors:
        material = bpy.data.materials['Notes paper cream'].copy()
        material.name = 'Reference ' + name
        material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = color
        material.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.91
        materials.append(material)
    materials.append(bpy.data.materials['Reference exposed book pages'])
    vertices, faces, slots = [], [], []

    def book(origin, axes, cover, horizontal=False):
        values = ((0, 0.006 / axes[0].length, 1), (0, 1), (0, 0.0006 / axes[2].length, 1 - 0.0006 / axes[2].length, 1)) if horizontal else ((0, 0.006 / axes[0].length, 1), (0, 0.0006 / axes[1].length, 1 - 0.0006 / axes[1].length, 1), (0, 1))
        indices = {}
        for x in range(len(values[0])):
            for y in range(len(values[1])):
                for z in range(len(values[2])):
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
                        thickness = 2 if horizontal else 1
                        page = boundary != 0 and axis == 0 and (b if horizontal else a) == 1 or axis not in (0, thickness) and a == 1 and b == 1
                        slots.append(len(materials) - 1 if page else cover)

    low_x = min(v.co.x for v in original.vertices)
    base = min(v.co.z for v in original.vertices)
    cursor = max(v.co.y for v in original.vertices)
    widths = (0.042, 0.022, 0.028, 0.025, 0.066, 0.055, 0.085, 0.102)
    heights = (0.30, 0.29, 0.30, 0.28, 0.20, 0.225, 0.23, 0.24)
    for index, (width, height) in enumerate(zip(widths, heights)):
        depth = 0.27 if index < 4 else 0.16
        start_x = low_x if index < 4 else low_x + 0.11
        book(Vector((start_x, cursor - width, base)), (Vector((depth, 0, 0)), Vector((0, width, 0)), Vector((0, 0, height))), index)
        cursor -= width + 0.0012
    stack_base = base
    for index, height in enumerate((0.014, 0.011, 0.018, 0.009, 0.016, 0.028)):
        width = (0.25, 0.245, 0.256, 0.24, 0.252, 0.26)[index]
        book(Vector((low_x, cursor + 0.01 + (0.26 - width) / 2, stack_base)), (Vector((0.10, 0, 0)), Vector((0, width, 0)), Vector((0, 0, height))), 8 if index == 5 else 9 if index == 0 else 5, horizontal=True)
        stack_base += height + 0.0002
    mesh = bpy.data.meshes.new('Lower mixed albums and stacked paper')
    mesh.from_pydata(vertices, [], faces)
    for material in materials:
        mesh.materials.append(material)
    for polygon, slot in zip(mesh.polygons, slots):
        polygon.material_index = slot
    mesh.update()
    if any(p.area <= 1e-12 for p in mesh.polygons):
        raise RuntimeError('Degenerate lower album geometry')
    original.use_fake_user = True
    obj.data = mesh
    obj['lowerAlbumsRefined'] = True
    obj['lowerAlbumsOriginalMesh'] = original.name
    obj['lowerAlbumsDimensionsEstimated'] = True
    obj['lowerAlbumsPhoto'] = 'PXL_20260907_015010154.jpg'
    bpy.context.view_layer.update()
    return {'upright': 8, 'stacked': 6, 'inventory_interpretation': True, 'vertices': len(vertices), 'faces': len(faces)}


result = refine_lower_albums()
