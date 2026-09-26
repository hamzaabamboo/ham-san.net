import math
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

ROOT = Path(bpy.data.filepath).resolve().parents[2]
HOME = bpy.data.collections['RoomHome']


def fabric(name, rgb, image=None):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    for n in [n for n in nt.nodes if n.type == 'TEX_IMAGE']:
        nt.nodes.remove(n)
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = 0.95
    b.inputs['Sheen Weight'].default_value = 0.7
    if image:
        tex = nt.nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(str(ROOT / 'assets/room/textures' / image), check_existing=True)
        tex.image.reload()
        tex.image.pack()
        nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])
    else:
        b.inputs['Base Color'].default_value = (*rgb, 1)
    return mat


def soft_shape(bm, size, center, squash_bottom=0.0, cuts=5):
    tmp = bmesh.new()
    bmesh.ops.create_cube(tmp, size=1.0)
    bmesh.ops.subdivide_edges(tmp, edges=tmp.edges[:], cuts=cuts, use_grid_fill=True)
    for v in tmp.verts:
        c = v.co.copy()
        v.co = c * 0.3 + c.normalized() * 0.7
    lo = Vector([min(v.co[i] for v in tmp.verts) for i in range(3)])
    hi = Vector([max(v.co[i] for v in tmp.verts) for i in range(3)])
    for v in tmp.verts:
        q = Vector(((v.co.x - (lo.x + hi.x) / 2) / (hi.x - lo.x) * size[0],
                    (v.co.y - (lo.y + hi.y) / 2) / (hi.y - lo.y) * size[1],
                    (v.co.z - (lo.z + hi.z) / 2) / (hi.z - lo.z) * size[2]))
        if squash_bottom and q.z < -size[2] * (0.5 - squash_bottom):
            q.z = -size[2] * (0.5 - squash_bottom) - (-size[2] * (0.5 - squash_bottom) - q.z) * 0.3
        v.co = q + Vector(center)
    me = bpy.data.meshes.new('tmp soft shape')
    tmp.to_mesh(me)
    tmp.free()
    n0 = len(bm.verts)
    bm.from_mesh(me)
    bpy.data.meshes.remove(me)
    bm.verts.ensure_lookup_table()
    bm.faces.ensure_lookup_table()
    bm.normal_update()
    return list(bm.verts[n0:])


def assign(bm, verts, idx, uv=None, face_box=None):
    faces = {f for v in verts for f in v.link_faces}
    layer = bm.loops.layers.uv.get('UVMap') or bm.loops.layers.uv.new('UVMap')
    for f in faces:
        f.material_index = idx
        f.smooth = True
        for l in f.loops:
            if face_box and f.normal.y < -0.2:
                (x0, x1, z0, z1) = face_box
                p = l.vert.co
                l[layer].uv = ((p.x - x0) / (x1 - x0), (p.z - z0) / (z1 - z0))
            else:
                l[layer].uv = (0.02, 0.98)
    return faces


def strand(bm, idx, top, bottom, width, thick, bend=(0, -0.01)):
    ring = 8
    prev = None
    first = None
    steps = 7
    for k in range(steps):
        t = k / (steps - 1)
        c = top.lerp(bottom, t) + Vector((0, bend[1] * math.sin(t * math.pi), 0))
        c.x += bend[0] * math.sin(t * math.pi)
        r = width * (1 - 0.9 * t) + 0.002
        cur = [bm.verts.new(c + Vector((r * math.cos(a), thick * (1 - 0.6 * t) * math.sin(a), 0))) for a in [i * math.tau / ring for i in range(ring)]]
        if prev:
            for i in range(ring):
                f = bm.faces.new((prev[i], prev[(i + 1) % ring], cur[(i + 1) % ring], cur[i]))
                f.material_index = idx
                f.smooth = True
        else:
            first = cur
        prev = cur
    f = bm.faces.new(list(reversed(first)))
    f.material_index = idx
    tip = bm.verts.new(sum((v.co for v in prev), Vector()) / ring + Vector((0, 0, -0.008)))
    for i in range(ring):
        f = bm.faces.new((prev[i], prev[(i + 1) % ring], tip))
        f.material_index = idx
        f.smooth = True


def chibi(name, head_w, face_img, hair_rgb, top_rgb, collar_rgb, skirt_rgb, leg_rgb, locks=((-1, 0.9), (1, 0.9)), tails=0, fringe_teeth=9, seed=0):
    import random
    rng = random.Random(seed)
    bm = bmesh.new()
    mats = [fabric(f'Room/Plush face {face_img}', None, f'plush-panel-{face_img}.png'),
            fabric(f'Room/Plush hair {name}', hair_rgb),
            fabric(f'Room/Plush top {name}', top_rgb),
            fabric(f'Room/Plush collar {name}', collar_rgb),
            fabric(f'Room/Plush skirt {name}', skirt_rgb),
            fabric('Room/Plush skin mitt', (0.93, 0.82, 0.74)),
            fabric(f'Room/Plush legs {name}', leg_rgb)]
    hw = head_w
    hh = hw * 0.86
    hd = hw * 0.8
    hz = hw * 0.46 + hh / 2
    head = soft_shape(bm, (hw, hd, hh), (0, 0, hz))
    assign(bm, head, 0, face_box=(-hw * 0.5, hw * 0.5, hz - hh * 0.5, hz + hh * 0.5))
    hair = soft_shape(bm, (hw * 1.1, hd * 1.1, hh * 1.08), (0, hd * 0.03, hz + hh * 0.03), cuts=7)
    front = [v for v in hair if v.co.y < -hd * 0.1]
    doomed = []
    for v in front:
        u = (v.co.x / (hw * 0.55))
        edge = hz + hh * (0.06 + 0.11 * abs(math.sin(u * fringe_teeth * 1.6 + rng.random()))) - hh * 0.6 * u ** 4
        if v.co.z < edge:
            doomed.append(v)
    back_cut = [v for v in hair if v.co.z < hz - hh * 0.32 and v.co.y > -hd * 0.1]
    bmesh.ops.delete(bm, geom=list(set(doomed + back_cut)), context='VERTS')
    hair = [v for v in hair if v.is_valid]
    assign(bm, hair, 1)
    for side, drop in locks:
        strand(bm, 1, Vector((side * hw * 0.5, -hd * 0.2, hz + hh * 0.1)), Vector((side * hw * 0.56, -hd * 0.32, hz - hh * drop * 0.7)), hw * 0.11, hw * 0.035, (side * 0.01, -0.01))
    for k in range(tails):
        s = -1 if k == 0 else 1
        strand(bm, 1, Vector((s * hw * 0.52, hd * 0.1, hz + hh * 0.2)), Vector((s * hw * 0.72, hd * 0.2, hz - hh * 0.7)), hw * 0.16, hw * 0.1, (s * 0.03, 0.0))
    body_h = hw * 0.55
    torso = soft_shape(bm, (hw * 0.62, hd * 0.55, body_h * 0.62), (0, 0, body_h * 0.62), cuts=4)
    assign(bm, torso, 2)
    collar = soft_shape(bm, (hw * 0.36, hd * 0.12, body_h * 0.34), (0, -hd * 0.26, body_h * 0.72), cuts=3)
    assign(bm, collar, 3)
    skirt = soft_shape(bm, (hw * 0.72, hd * 0.64, body_h * 0.34), (0, 0, body_h * 0.28), cuts=4)
    assign(bm, skirt, 4)
    for s in (-1, 1):
        arm = soft_shape(bm, (hw * 0.17, hw * 0.17, body_h * 0.5), (s * hw * 0.36, -hd * 0.08, body_h * 0.66), cuts=3)
        assign(bm, arm, 2)
        mitt = soft_shape(bm, (hw * 0.16, hw * 0.16, hw * 0.14), (s * hw * 0.37, -hd * 0.14, body_h * 0.36), cuts=3)
        assign(bm, mitt, 5)
        leg = soft_shape(bm, (hw * 0.19, hw * 0.34, hw * 0.17), (s * hw * 0.16, -hd * 0.42, hw * 0.085), cuts=3)
        assign(bm, leg, 6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    obj = bpy.data.objects.new(name, me)
    HOME.objects.link(obj)
    sub = obj.modifiers.new('Plush subdivision', 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 2
    return obj


def place(obj, loc, yaw, tilt=(0.0, 0.0), support=None):
    obj.rotation_euler = (tilt[0], tilt[1], yaw)
    obj.location = loc
    bpy.context.view_layer.update()
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    z = loc[2]
    if support:
        cx = sum(p.x for p in pts) / len(pts)
        cy = sum(p.y for p in pts) / len(pts)
        tops = [(s.matrix_world @ v.co).z for s in support for v in s.data.vertices
                if abs((s.matrix_world @ v.co).x - cx) < 0.04 and abs((s.matrix_world @ v.co).y - cy) < 0.06]
        if tops:
            z = max(tops) - 0.01
    obj.location.z += z - min(p.z for p in pts) + 0.002
    bpy.context.view_layer.update()


def wrap_uv(bm, verts, idx):
    layer = bm.loops.layers.uv.get('UVMap') or bm.loops.layers.uv.new('UVMap')
    zs = [v.co.z for v in verts]
    z0, z1 = min(zs), max(zs)
    for f in {f for v in verts for f in v.link_faces}:
        f.material_index = idx
        f.smooth = True
        for l in f.loops:
            p = l.vert.co
            l[layer].uv = (0.5 + math.atan2(p.x, -p.y) / math.tau, (p.z - z0) / max(z1 - z0, 1e-6))


def animal(name, kind, hw, panel, fur_rgb, inner_rgb, sweater=None):
    bm = bmesh.new()
    mats = [fabric(f'Room/Plush face {panel}', None, f'plush-panel-{panel}.png'),
            fabric(f'Room/Plush fur {name}', fur_rgb),
            fabric(f'Room/Plush inner {name}', inner_rgb)]
    if sweater:
        mats.append(fabric(f'Room/Plush sweater {sweater}', None, f'plush-panel-{sweater}.png'))
    hh = hw * 0.84
    hd = hw * 0.82
    hz = hw * 0.5 + hh / 2
    head = soft_shape(bm, (hw, hd, hh), (0, 0, hz))
    assign(bm, head, 0, face_box=(-hw * 0.5, hw * 0.5, hz - hh * 0.5, hz + hh * 0.5))
    for s in (-1, 1):
        if kind == 'cat':
            ear = soft_shape(bm, (hw * 0.3, hw * 0.14, hw * 0.3), (s * hw * 0.3, hd * 0.02, hz + hh * 0.46), cuts=3)
            for v in ear:
                if v.co.z > hz + hh * 0.5:
                    k = (v.co.z - hz - hh * 0.5) / (hw * 0.15)
                    v.co.x = s * hw * 0.3 + (v.co.x - s * hw * 0.3) * max(0.1, 1 - k * 0.8)
                    v.co.z += hw * 0.1 * k
            assign(bm, ear, 1)
            inner = soft_shape(bm, (hw * 0.16, hw * 0.03, hw * 0.16), (s * hw * 0.3, -hw * 0.05, hz + hh * 0.5), cuts=2)
            assign(bm, inner, 2)
        elif kind == 'bear':
            ear = soft_shape(bm, (hw * 0.28, hw * 0.14, hw * 0.26), (s * hw * 0.38, hd * 0.05, hz + hh * 0.42), cuts=3)
            assign(bm, ear, 1)
            inner = soft_shape(bm, (hw * 0.15, hw * 0.03, hw * 0.14), (s * hw * 0.38, -hw * 0.03, hz + hh * 0.42), cuts=2)
            assign(bm, inner, 2)
        elif kind == 'dog':
            strand(bm, 1, Vector((s * hw * 0.44, 0, hz + hh * 0.36)), Vector((s * hw * 0.56, -hd * 0.1, hz - hh * 0.3)), hw * 0.16, hw * 0.06, (s * 0.01, -0.01))
            bow = soft_shape(bm, (hw * 0.2, hw * 0.08, hw * 0.12), (s * hw * 0.1 - hw * 0.18, -hd * 0.3, hz + hh * 0.44), cuts=2)
            assign(bm, bow, 2)
        elif kind == 'creature':
            ear = soft_shape(bm, (hw * 0.3, hw * 0.12, hw * 1.0), (s * hw * 0.3, hd * 0.05, hz + hh * 0.5 + hw * 0.42), cuts=4)
            for v in ear:
                v.co.x += s * (v.co.z - hz) * 0.28
            assign(bm, ear, 1)
            inner = soft_shape(bm, (hw * 0.16, hw * 0.03, hw * 0.7), (s * hw * 0.3, -hw * 0.04, hz + hh * 0.5 + hw * 0.42), cuts=3)
            for v in inner:
                v.co.x += s * (v.co.z - hz) * 0.28
            assign(bm, inner, 2)
    if kind in ('bear', 'dog'):
        snout = soft_shape(bm, (hw * 0.36, hw * 0.16, hw * 0.28), (0, -hd * 0.46, hz - hh * 0.14), cuts=3)
        assign(bm, snout, 0, face_box=(-hw * 0.5, hw * 0.5, hz - hh * 0.5, hz + hh * 0.5))
    bh = hw * 0.52
    body = soft_shape(bm, (hw * 0.7, hd * 0.62, bh), (0, hd * 0.02, bh * 0.5), cuts=4)
    if sweater:
        wrap_uv(bm, body, 3)
    else:
        assign(bm, body, 1)
    for s in (-1, 1):
        arm = soft_shape(bm, (hw * 0.2, hw * 0.2, bh * 0.62), (s * hw * 0.36, -hd * 0.12, bh * 0.52), cuts=3)
        if sweater:
            wrap_uv(bm, arm, 3)
        else:
            assign(bm, arm, 1)
        foot = soft_shape(bm, (hw * 0.24, hw * 0.34, hw * 0.18), (s * hw * 0.18, -hd * 0.38, hw * 0.09), cuts=3)
        assign(bm, foot, 1)
        pad = soft_shape(bm, (hw * 0.14, hw * 0.03, hw * 0.1), (s * hw * 0.18, -hd * 0.55, hw * 0.09), cuts=2)
        assign(bm, pad, 2)
    if kind == 'cat':
        strand(bm, 1, Vector((hw * 0.25, hd * 0.3, hw * 0.1)), Vector((hw * 0.5, -hd * 0.1, hw * 0.06)), hw * 0.07, hw * 0.07, (0.02, 0.0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    obj = bpy.data.objects.new(name, me)
    HOME.objects.link(obj)
    sub = obj.modifiers.new('Plush subdivision', 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 2
    return obj


def mochi(name, w, panel):
    bm = bmesh.new()
    mats = [fabric(f'Room/Plush face {panel}', None, f'plush-panel-{panel}.png')]
    h = w * 0.5
    body = soft_shape(bm, (w, w * 0.8, h), (0, 0, h / 2), squash_bottom=0.15, cuts=6)
    assign(bm, body, 0, face_box=(-w * 0.5, w * 0.5, -h * 0.1, h * 1.1))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mats[0])
    obj = bpy.data.objects.new(name, me)
    HOME.objects.link(obj)
    sub = obj.modifiers.new('Plush subdivision', 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 2
    return obj
