from pathlib import Path

import bpy


def refine_page_edges():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Book edges require production source in Object mode')
    names = ('Magazines U1 top', 'Books U1 shelf 2', 'Photobooks U1 shelf 1')
    objects = [bpy.data.objects[name] for name in names]
    if any(obj.get('bookPageEdgesRefined') for obj in objects):
        raise RuntimeError('Book page edges already refined')
    for obj in objects:
        if obj.data.shape_keys or obj.modifiers or len(obj.data.vertices) % 8:
            raise RuntimeError(f'Unexpected book topology: {obj.name}')
        if len(obj.data.polygons) != len(obj.data.vertices) // 8 * 6:
            raise RuntimeError(f'Unexpected book faces: {obj.name}')
    paper = bpy.data.materials['Notes paper cream'].copy()
    paper.name = 'Reference exposed book pages'
    paper.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.81, 0.80, 0.75, 1)
    paper.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.94
    reports = []
    for obj in objects:
        original = obj.data
        vertices, faces, materials, uvs = [], [], [], []
        cover_index = list(original.materials).index(bpy.data.materials['Notes paper cream'])
        page_index = len(original.materials)
        for start in range(0, len(original.vertices), 8):
            points = [original.vertices[start + i].co.copy() for i in range(8)]
            origin = points[0]
            axes = (points[1] - origin, points[3] - origin, points[4] - origin)
            xs = (0, min(0.006 / axes[0].length, 0.1), 1)
            lip = min(0.00045 / axes[1].length, 0.1)
            ys = (0, lip, 1 - lip, 1)
            values = (xs, ys, (0, 1))
            indices = {}
            for x in range(3):
                for y in range(4):
                    for z in range(2):
                        indices[x, y, z] = len(vertices)
                        vertices.append(origin + axes[0] * xs[x] + axes[1] * ys[y] + axes[2] * z)
            spine_face = original.polygons[start // 8 * 6]
            spine_uv = {original.loops[loop].vertex_index - start: original.uv_layers.active.data[loop].uv.copy() for loop in spine_face.loop_indices}
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
                            if axis == 0 and boundary == 0:
                                materials.append(spine_face.material_index)
                                face_uv = []
                                for key in corners:
                                    y, z = ys[key[1]], key[2]
                                    face_uv.append(spine_uv[0] * (1 - y) * (1 - z) + spine_uv[3] * y * (1 - z) + spine_uv[4] * (1 - y) * z + spine_uv[7] * y * z)
                                uvs.append(face_uv)
                            else:
                                page = axis == 0 and a == 1 or axis == 2 and a == 1 and b == 1
                                materials.append(page_index if page else cover_index)
                                uvs.append(((0, 0), (1, 0), (1, 1), (0, 1)))
        data = bpy.data.meshes.new(obj.name + ' cover and page edges')
        data.from_pydata(vertices, [], faces)
        for material in original.materials:
            data.materials.append(material)
        data.materials.append(paper)
        uv = data.uv_layers.new(name=original.uv_layers.active.name)
        for polygon, material, face_uv in zip(data.polygons, materials, uvs):
            polygon.material_index = material
            for loop, value in zip(polygon.loop_indices, face_uv):
                uv.data[loop].uv = value
        data.update()
        if any(p.area <= 1e-12 for p in data.polygons):
            raise RuntimeError(f'Degenerate book edge: {obj.name}')
        original.use_fake_user = True
        obj.data = data
        obj['bookPageEdgesRefined'] = True
        obj['bookPageOriginalMesh'] = original.name
        reports.append({'name': obj.name, 'books': len(original.vertices) // 8, 'vertices': len(data.vertices), 'faces': len(data.polygons)})
    bpy.context.view_layer.update()
    return {'objects': reports, 'cover_lip_m': 0.00045, 'binding_depth_m': 0.006, 'dimensions_estimated': True}


result = refine_page_edges()
