import math
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

ROOT = Path(bpy.data.filepath).resolve().parents[2]
HOME = bpy.data.collections['RoomHome']


def panel_material(name, image_name):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    for n in [n for n in nt.nodes if n.type == 'TEX_IMAGE']:
        nt.nodes.remove(n)
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(str(ROOT / 'assets/room/textures' / image_name), check_existing=True)
    tex.image.reload()
    tex.image.pack()
    bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = 0.95
    bsdf.inputs['Sheen Weight'].default_value = 0.7
    bsdf.inputs['Sheen Tint'].default_value = (1, 1, 1, 1)
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return mat


def plain(name, rgb):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = 0.95
    b.inputs['Sheen Weight'].default_value = 0.7
    return mat


def pillow(name, size, panel, hair_rgb, lock_side=-1):
    sx, sy, sz = size
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=6, use_grid_fill=True)
    for v in bm.verts:
        c = v.co.copy()
        v.co = c * 0.35 + c.normalized() * 0.65
    lo = Vector([min(v.co[i] for v in bm.verts) for i in range(3)])
    hi = Vector([max(v.co[i] for v in bm.verts) for i in range(3)])
    for v in bm.verts:
        q = Vector(((v.co.x - (lo.x + hi.x) / 2) / (hi.x - lo.x) * sx,
                    (v.co.y - (lo.y + hi.y) / 2) / (hi.y - lo.y) * sy,
                    (v.co.z - lo.z) / (hi.z - lo.z) * sz))
        if q.z < sz * 0.18:
            q.z = sz * 0.18 - (sz * 0.18 - q.z) * 0.35
        v.co = q
    z0 = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= z0
    zt = max(v.co.z for v in bm.verts)
    uv = bm.loops.layers.uv.new('UVMap')
    for f in bm.faces:
        for l in f.loops:
            p = l.vert.co
            if f.normal.y < -0.05:
                l[uv].uv = (0.5 + p.x / (sx * 1.04), 0.82 * p.z / zt)
            else:
                l[uv].uv = (0.05 + 0.1 * (p.x / sx + 0.5), 0.05)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(panel)
    for p in me.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, me)
    HOME.objects.link(obj)
    sub = obj.modifiers.new('Plush subdivision', 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 2
    hair = plain(f'Room/Plush hair lock {name}', hair_rgb)
    lock = bpy.data.meshes.new(f'{name} side lock')
    lb = bmesh.new()
    prev = None
    ring = 8
    for k in range(7):
        t = k / 6
        cx = lock_side * sx * (0.43 - 0.03 * t)
        cy = -sy * (0.3 + 0.08 * math.sin(t * 1.5))
        cz = sz * (0.78 - 0.8 * t)
        r = sz * 0.15 * (1 - 0.95 * t) + 0.0015
        cur = [lb.verts.new((cx + r * math.cos(a), cy + r * 0.22 * math.sin(a), cz)) for a in [i * math.tau / ring for i in range(ring)]]
        if prev:
            for i in range(ring):
                lb.faces.new((prev[i], prev[(i + 1) % ring], cur[(i + 1) % ring], cur[i]))
        if k == 0:
            lb.faces.new(list(reversed(cur)))
        prev = cur
    tip = lb.verts.new((prev[0].co + prev[ring // 2].co) / 2 + Vector((0, 0, -0.012)))
    for i in range(ring):
        lb.faces.new((prev[i], prev[(i + 1) % ring], tip))
    bmesh.ops.recalc_face_normals(lb, faces=lb.faces)
    lb.to_mesh(lock)
    lb.free()
    lock.materials.append(hair)
    for p in lock.polygons:
        p.use_smooth = True
    lo = bpy.data.objects.new(f'{name} side lock', lock)
    HOME.objects.link(lo)
    ls = lo.modifiers.new('Plush subdivision', 'SUBSURF')
    ls.levels = 1
    ls.render_levels = 2
    lo.parent = obj
    return obj, lo


def place(obj, loc, yaw, tilt=0.0):
    obj.rotation_euler = (tilt, 0, yaw)
    obj.location = loc
    bpy.context.view_layer.update()
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    obj.location.z += loc[2] - min(p.z for p in pts) + 0.002
    bpy.context.view_layer.update()
