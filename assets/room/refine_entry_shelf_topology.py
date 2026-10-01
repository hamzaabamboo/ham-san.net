import math
from pathlib import Path

import bpy
from mathutils import Vector


def refine_shelves():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Shelf refinement requires production source in Object mode')
    shelves = [bpy.data.objects[f'Entry rack shelf {i}'] for i in range(1, 5)]
    if any(o.get('roundWireShelfRefined') for o in shelves):
        raise RuntimeError('Entry shelves already refined')
    result = []
    for obj in shelves:
        source = obj.data
        xs = sorted(set(round(v.co.x, 6) for v in source.vertices))
        ys = sorted(set(round(v.co.y, 6) for v in source.vertices))
        zs = sorted(set(round(v.co.z, 6) for v in source.vertices))
        if len(xs) != 101 or len(ys) != 101 or len(zs) != 5:
            raise RuntimeError('Unexpected source wire grid')
        vertices = []
        faces = []
        smooth = []
        mapping = {}
        for face in source.polygons:
            if max(abs(v) for v in face.normal) < 0.99:
                continue
            indices = []
            for index in face.vertices:
                if index not in mapping:
                    mapping[index] = len(vertices)
                    vertices.append(tuple(source.vertices[index].co))
                indices.append(mapping[index])
            faces.append(tuple(indices))
            smooth.append(False)
        radius = (zs[3] - zs[1]) / 2
        center_z = zs[2]

        def wire(start, end):
            start, end = Vector(start), Vector(end)
            axis = (end - start).normalized()
            horizontal = Vector((0, 0, 1))
            vertical = axis.cross(horizontal)
            offset = len(vertices)
            for center in (start, end):
                for i in range(8):
                    angle = math.tau * i / 8
                    vertices.append(tuple(center + radius * (horizontal * math.cos(angle) + vertical * math.sin(angle))))
            faces.extend((tuple(offset + i for i in reversed(range(8))), tuple(offset + i for i in range(8, 16))))
            smooth.extend((False, False))
            for i in range(8):
                faces.append((offset + i, offset + (i + 1) % 8, offset + (i + 1) % 8 + 8, offset + i + 8))
                smooth.append(True)

        for i in range(33):
            x = xs[2 + i * 3]
            y = ys[2 + i * 3]
            wire((x, ys[2], center_z), (x, ys[-3], center_z))
            wire((xs[2], y, center_z), (xs[-3], y, center_z))
        mesh = bpy.data.meshes.new(f'{source.name} round wire grid')
        mesh.from_pydata(vertices, [], faces)
        for material in source.materials:
            mesh.materials.append(material)
        mesh.update()
        for face, value in zip(mesh.polygons, smooth):
            face.use_smooth = value
        if any(face.area <= 1e-12 for face in mesh.polygons):
            raise RuntimeError('Degenerate wire geometry')
        source.use_fake_user = True
        obj.data = mesh
        obj['roundWireShelfRefined'] = True
        obj['shelfOriginalMesh'] = source.name
        result.append({'name': obj.name, 'triangles_before': sum(len(p.vertices) - 2 for p in source.polygons), 'triangles_after': sum(len(p.vertices) - 2 for p in mesh.polygons), 'wire_radius': radius})
    bpy.context.view_layer.update()
    return {'shelves': result}


result = refine_shelves()
