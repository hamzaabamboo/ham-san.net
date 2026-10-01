import math

import bmesh
import bpy
from mathutils import Vector


def fan_vent_shell(material, slots=48):
    normal = Vector((math.cos(math.radians(8)), 0, math.sin(math.radians(8))))
    horizontal = Vector((0, 1, 0))
    vertical = normal.cross(horizontal)
    center = Vector((-0.008, 0, 0.064))
    vertices = []
    faces = []

    count = slots * 2
    angles = [(index + 0.5 + side * 0.22) * math.tau / slots for index in range(slots) for side in (-1, 1)]
    profile = ((0.060, 0.056, 0.013), (0.0599, 0.0558, 0.010), (0.0591, 0.0542, -0.012), (0.059, 0.054, -0.015))
    for layer in range(2):
        for outer, inner, depth in profile:
            radius = outer if layer == 0 else inner
            vertices.extend(center + normal * depth + radius * (horizontal * math.cos(angle) + vertical * math.sin(angle)) for angle in angles)

    def vertex(layer, ring, angle):
        return layer * 4 * count + ring * count + angle % count

    for angle in range(count):
        following = (angle + 1) % count
        gap = angle % 2 == 1
        for layer in range(2):
            for ring in range(3):
                if gap and ring == 1:
                    continue
                faces.append((vertex(layer, ring, angle), vertex(layer, ring, following), vertex(layer, ring + 1, following), vertex(layer, ring + 1, angle)))
        for ring in (0, 3):
            faces.append((vertex(0, ring, angle), vertex(1, ring, angle), vertex(1, ring, following), vertex(0, ring, following)))
        if gap:
            for ring in (1, 2):
                faces.append((vertex(0, ring, angle), vertex(1, ring, angle), vertex(1, ring, following), vertex(0, ring, following)))
            for edge in (angle, following):
                faces.append((vertex(0, 1, edge), vertex(0, 2, edge), vertex(1, 2, edge), vertex(1, 1, edge)))
    mesh = bpy.data.meshes.new('Desk fan vented housing')
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=1e-8)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    for polygon in mesh.polygons:
        polygon.use_smooth = len({index // (4 * count) for index in polygon.vertices}) == 1
    return mesh
