import math
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector

ROOT = Path(bpy.data.filepath).resolve().parents[2]
ATLAS = ROOT / 'assets/room/textures/plush-face-atlas.png'
HOME = bpy.data.collections['RoomHome']
PREFIX = 'Nesoberi rack plush'
BOT, MID, TOP, BASKET = 0.174, 0.525, 0.9, 1.131


def fabric(name, rgb, sheen=0.6):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*rgb, 1)
    bsdf.inputs['Roughness'].default_value = 0.92
    bsdf.inputs['Sheen Weight'].default_value = sheen
    return mat


def face_material():
    mat = bpy.data.materials.get('Room/Plush face atlas')
    if mat:
        return mat
    mat = bpy.data.materials.new('Room/Plush face atlas')
    mat.use_nodes = True
    nt = mat.node_tree
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(str(ATLAS), check_existing=True)
    tex.image.pack()
    bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = 0.9
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return mat


class Plush:
    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.uv = self.bm.loops.layers.uv.new('UVMap')
        self.mats = []

    def slot(self, mat):
        if mat not in self.mats:
            self.mats.append(mat)
        return self.mats.index(mat)

    def blob(self, mat, center, radii, seg=(16, 10), keep=None):
        res = bmesh.ops.create_uvsphere(self.bm, u_segments=seg[0], v_segments=seg[1], radius=1.0)
        verts = res['verts']
        if keep:
            doomed = [v for v in verts if not keep(v.co)]
            bmesh.ops.delete(self.bm, geom=doomed, context='VERTS')
            verts = [v for v in verts if v.is_valid]
        for v in verts:
            v.co = Vector((v.co.x * radii[0] + center[0], v.co.y * radii[1] + center[1], v.co.z * radii[2] + center[2]))
        idx = self.slot(mat)
        faces = {f for v in verts for f in v.link_faces}
        for f in faces:
            f.material_index = idx
            f.smooth = True
        return verts

    def face(self, cell, center, radii, th=52, top=26, bottom=-36, nx=10, ny=8):
        idx = self.slot(face_material())
        col, row = cell % 4, cell // 4
        u0, v0 = col * 0.25, 0.5 - row * 0.5
        grid = []
        for j in range(ny + 1):
            phi = math.radians(bottom + (top - bottom) * j / ny)
            line = []
            for i in range(nx + 1):
                t = math.radians(-th + 2 * th * i / nx)
                d = Vector((math.sin(t) * math.cos(phi), -math.cos(t) * math.cos(phi), math.sin(phi)))
                p = Vector((d.x * radii[0] * 1.012, d.y * radii[1] * 1.012, d.z * radii[2] * 1.012)) + Vector(center)
                line.append((self.bm.verts.new(p), (u0 + 0.25 * i / nx, v0 + 0.5 * j / ny)))
            grid.append(line)
        for j in range(ny):
            for i in range(nx):
                quad = (grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i])
                f = self.bm.faces.new([q[0] for q in quad])
                f.material_index = idx
                f.smooth = True
                for loop, q in zip(f.loops, quad):
                    loop[self.uv].uv = q[1]

    def finish(self, location, yaw, props, stack=False, tilt=(0, 0), ceil=9):
        me = bpy.data.meshes.new(self.name)
        bmesh.ops.recalc_face_normals(self.bm, faces=self.bm.faces)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        obj = bpy.data.objects.new(self.name, me)
        HOME.objects.link(obj)
        obj.rotation_euler = (tilt[0], tilt[1], yaw)
        obj['roomStackCeil'] = ceil
        obj.location = location
        bpy.context.view_layer.update()
        low = min((obj.matrix_world @ v.co).z for v in me.vertices)
        base = location[2]
        if stack:
            base = support_top(obj)
        obj.location.z += base - low + 0.001
        for k, v in props.items():
            obj[k] = v
        return obj


def support_top(obj):
    pts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    x0, x1 = min(p.x for p in pts), max(p.x for p in pts)
    y0, y1 = min(p.y for p in pts), max(p.y for p in pts)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    top = 0.0
    for o in HOME.objects:
        if o is obj or not o.get('roomRackPlush') or o.type != 'MESH':
            continue
        for v in o.data.vertices:
            q = o.matrix_world @ v.co
            if q.z < obj.get('roomStackCeil', 9) and abs(q.x - cx) < (x1 - x0) * 0.3 and abs(q.y - cy) < (y1 - y0) * 0.3:
                top = max(top, q.z)
    return top - 0.012


def hair_keep(fringe_phi, back_low):
    def keep(co):
        phi = math.degrees(math.asin(max(-1, min(1, co.z))))
        horiz = math.degrees(math.atan2(co.x, -co.y))
        if phi < back_low:
            return False
        if abs(horiz) < 78:
            jag = fringe_phi + 5 * abs(math.sin(math.radians(horiz) * 6)) + 0.12 * abs(horiz)
            return phi > jag
        return True
    return keep


def chibi(name, cell, r, hair, outfit, tails=False, lying=False):
    p = Plush(name)
    skin = fabric('Room/Plush skin', (0.96, 0.86, 0.8), 0.4)
    hc = fabric(f'Room/Plush hair {hair[0]}', hair[1])
    oc = fabric(f'Room/Plush outfit {outfit[0]}', outfit[1])
    head = (0, 0, r * 1.25) if not lying else (0, 0, r * 0.95)
    hr = (r, r * 0.92, r * 0.9)
    p.blob(skin, head, hr)
    p.face(cell, head, hr)
    p.blob(hc, (head[0], head[1] + r * 0.03, head[2] + r * 0.04), (r * 1.025, r * 0.96, r * 0.95), (18, 12), hair_keep(1, -52))
    for s in (-1, 1):
        p.blob(hc, (s * r * 0.86, -r * 0.22, head[2] - r * 0.28), (r * 0.2, r * 0.2, r * 0.52), (10, 8))
    if tails:
        for s in (-1, 1):
            p.blob(hc, (s * r * 1.02, r * 0.12, head[2] - r * 0.35), (r * 0.32, r * 0.3, r * 0.62), (10, 8))
    if lying:
        p.blob(oc, (0, r * 1.05, r * 0.42), (r * 0.62, r * 1.05, r * 0.42))
        for s in (-1, 1):
            p.blob(oc, (s * r * 0.42, -r * 0.62, r * 0.18), (r * 0.2, r * 0.3, r * 0.16), (10, 8))
            p.blob(skin, (s * r * 0.38, r * 2.0, r * 0.2), (r * 0.2, r * 0.26, r * 0.18), (10, 8))
    else:
        p.blob(oc, (0, r * 0.05, r * 0.36), (r * 0.66, r * 0.55, r * 0.42))
        for s in (-1, 1):
            p.blob(oc, (s * r * 0.66, -r * 0.08, r * 0.42), (r * 0.2, r * 0.2, r * 0.3), (10, 8))
            p.blob(skin, (s * r * 0.3, -r * 0.5, r * 0.14), (r * 0.2, r * 0.32, r * 0.15), (10, 8))
    return p


def animal(name, cell, r, body, ear, kind):
    p = Plush(name)
    bc = fabric(f'Room/Plush fur {body[0]}', body[1])
    ec = fabric(f'Room/Plush accent {ear[0]}', ear[1])
    head = (0, 0, r * 1.2)
    hr = (r, r * 0.9, r * 0.86)
    p.blob(bc, head, hr)
    p.face(cell, head, hr, th=46, top=20, bottom=-40)
    for s in (-1, 1):
        if kind == 'cat':
            p.blob(bc, (s * r * 0.55, r * 0.05, head[2] + r * 0.78), (r * 0.26, r * 0.14, r * 0.34), (8, 6))
            p.blob(ec, (s * r * 0.55, -r * 0.03, head[2] + r * 0.76), (r * 0.16, r * 0.06, r * 0.22), (8, 6))
        else:
            p.blob(bc, (s * r * 0.72, r * 0.05, head[2] + r * 0.62), (r * 0.3, r * 0.16, r * 0.3), (10, 8))
            p.blob(ec, (s * r * 0.72, -r * 0.05, head[2] + r * 0.62), (r * 0.18, r * 0.06, r * 0.18), (8, 6))
        p.blob(bc, (s * r * 0.3, -r * 0.45, r * 0.14), (r * 0.22, r * 0.32, r * 0.16), (10, 8))
        p.blob(bc, (s * r * 0.62, -r * 0.12, r * 0.42), (r * 0.2, r * 0.22, r * 0.3), (10, 8))
    p.blob(bc, (0, r * 0.05, r * 0.4), (r * 0.7, r * 0.6, r * 0.46))
    if kind == 'cat':
        p.blob(bc, (r * 0.55, r * 0.6, r * 0.2), (r * 0.14, r * 0.5, r * 0.14), (8, 6))
    return p


def bird(name, r):
    p = Plush(name)
    bc = fabric('Room/Plush fur sky blue', (0.16, 0.55, 0.78))
    ac = fabric('Room/Plush accent beak yellow', (0.98, 0.72, 0.16))
    p.blob(bc, (0, 0, r), (r, r * 0.95, r * 0.92))
    eye = fabric('Room/Plush accent bead black', (0.03, 0.03, 0.04), 0.1)
    for s in (-1, 1):
        p.blob(eye, (s * r * 0.34, -r * 0.88, r * 1.12), (r * 0.1, r * 0.06, r * 0.13), (8, 6))
    p.blob(ac, (0, -r * 0.98, r * 0.86), (r * 0.18, r * 0.2, r * 0.1), (8, 6))
    for s in (-1, 1):
        p.blob(bc, (s * r * 0.92, r * 0.1, r * 0.9), (r * 0.18, r * 0.45, r * 0.32), (8, 6))
    return p


def creature(name, r):
    p = Plush(name)
    bc = fabric('Room/Plush fur marigold', (0.93, 0.5, 0.1))
    tc = fabric('Room/Plush accent teal', (0.1, 0.52, 0.5))
    p.blob(bc, (0, 0, r * 0.95), (r, r * 0.8, r * 0.95))
    p.face(4, (0, 0, r * 1.05), (r * 0.9, r * 0.72, r * 0.8), th=40, top=18, bottom=-30)
    for s in (-1, 1):
        p.blob(bc, (s * r * 0.55, r * 0.05, r * 2.05), (r * 0.26, r * 0.14, r * 0.75), (12, 8))
        p.blob(tc, (s * r * 0.55, -r * 0.08, r * 2.1), (r * 0.15, r * 0.05, r * 0.45), (10, 6))
        p.blob(bc, (s * r * 0.45, -r * 0.55, r * 0.16), (r * 0.26, r * 0.34, r * 0.18), (10, 8))
    p.blob(bc, (r * 0.2, r * 0.9, r * 0.5), (r * 0.5, r * 0.3, r * 0.35), (10, 8))
    return p


def mochi(name, r):
    p = Plush(name)
    bc = fabric('Room/Plush fur mochi white', (0.95, 0.95, 0.93))
    p.blob(bc, (0, 0, r * 0.55), (r * 1.1, r * 0.95, r * 0.6), (20, 12))
    p.face(4, (0, 0, r * 0.62), (r * 1.1, r * 0.95, r * 0.6), th=40, top=18, bottom=-16, nx=8, ny=6)
    return p


def dog(name, r):
    p = Plush(name)
    bc = fabric('Room/Plush fur lemon', (0.96, 0.8, 0.2))
    bow = fabric('Room/Plush accent bow pink', (0.95, 0.45, 0.6))
    head = (0, 0, r * 1.2)
    p.blob(bc, head, (r, r * 0.9, r * 0.86))
    p.face(7, head, (r, r * 0.9, r * 0.86), th=40, top=18, bottom=-40)
    for s in (-1, 1):
        p.blob(bc, (s * r * 0.95, r * 0.05, head[2] - r * 0.1), (r * 0.22, r * 0.14, r * 0.5), (10, 8))
        p.blob(bow, (s * r * 0.18, -r * 0.2, head[2] + r * 0.85), (r * 0.22, r * 0.1, r * 0.15), (8, 6))
        p.blob(bc, (s * r * 0.3, -r * 0.45, r * 0.14), (r * 0.22, r * 0.32, r * 0.16), (10, 8))
    p.blob(bc, (0, r * 0.05, r * 0.4), (r * 0.7, r * 0.6, r * 0.46))
    return p


def sweater_bear(name, r):
    p = animal(name, 7, r, ('bear brown', (0.5, 0.34, 0.22)), ('bear inner', (0.8, 0.66, 0.5)), 'bear')
    dark = fabric('Room/Plush knit charcoal', (0.12, 0.12, 0.13))
    light = fabric('Room/Plush knit cream', (0.9, 0.86, 0.78))
    for k in range(4):
        p.blob(dark if k % 2 == 0 else light, (0, r * 0.05, r * (0.2 + 0.16 * k)), (r * 0.76, r * 0.66, r * 0.1), (16, 6))
    return p


def hat_plush(name, r):
    p = Plush(name)
    oc = fabric('Room/Plush fur marigold', (0.93, 0.5, 0.1))
    gc = fabric('Room/Plush accent leaf green', (0.2, 0.55, 0.22))
    yc = fabric('Room/Plush accent beak yellow', (0.98, 0.72, 0.16))
    for k in range(14):
        a = k / 14 * math.tau
        p.blob(gc, (math.cos(a) * r * 1.15, math.sin(a) * r * 1.15, r * 0.3), (r * 0.28, r * 0.28, r * 0.12), (8, 5))
    p.blob(oc, (0, 0, r * 0.3), (r * 1.2, r * 1.2, r * 0.16), (20, 8))
    p.blob(yc, (0, 0, r * 0.62), (r * 0.5, r * 0.5, r * 0.5), (14, 10))
    return p


def tote(name, w, d, h):
    p = Plush(name)
    clear = bpy.data.materials.get('Room/Clear vinyl tote') or bpy.data.materials.new('Room/Clear vinyl tote')
    clear.use_nodes = True
    b = clear.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.95, 0.97, 1.0, 1)
    b.inputs['Transmission Weight'].default_value = 0.92
    b.inputs['Roughness'].default_value = 0.12
    b.inputs['IOR'].default_value = 1.4
    strap = fabric('Room/Tote strap black', (0.03, 0.03, 0.03), 0.1)
    idx = p.slot(clear)
    res = bmesh.ops.create_cube(p.bm, size=1.0)
    top = [f for f in {f for v in res['verts'] for f in v.link_faces} if f.normal.z > 0.9]
    for v in res['verts']:
        v.co = Vector((v.co.x * w, v.co.y * d, (v.co.z + 0.5) * h))
    bmesh.ops.delete(p.bm, geom=top, context='FACES')
    for f in {f for v in res['verts'] if v.is_valid for f in v.link_faces}:
        f.material_index = idx
    for s in (-1, 1):
        p.blob(strap, (0, s * d * 0.5, h * 0.55), (w * 0.35, 0.004, h * 0.5), (12, 6), keep=lambda co: co.z > -0.2)
    return p


HAIR = {
    'orange': ('orange', (0.93, 0.45, 0.12)),
    'ginger': ('ginger', (0.82, 0.38, 0.18)),
    'blonde': ('blonde', (0.95, 0.8, 0.45)),
    'brown': ('brown', (0.45, 0.3, 0.2)),
    'dark': ('dark', (0.16, 0.12, 0.12)),
    'pinkorange': ('pink orange', (0.96, 0.58, 0.45)),
}
OUT = {
    'white': ('white', (0.93, 0.93, 0.92)),
    'navy': ('navy', (0.15, 0.2, 0.42)),
    'lilac': ('lilac', (0.7, 0.62, 0.86)),
    'pink': ('pink', (0.95, 0.66, 0.74)),
    'cream': ('cream', (0.95, 0.9, 0.78)),
    'orange': ('orange', (0.93, 0.45, 0.12)),
}

XL, XR = 0.47, 1.12
LAYOUT = [
    ('01 lying ginger big', lambda n: chibi(n, 4, 0.1, HAIR['ginger'], OUT['orange'], lying=True), (0.56, 1.62, MID), 0.15, (0, 0), 9),
    ('02 mochi white', lambda n: mochi(n, 0.13), (0.75, 1.66, MID), -0.1, (0, 0), 9),
    ('03 lying orange sleep', lambda n: chibi(n, 4, 0.095, HAIR['orange'], OUT['cream'], lying=True), (1.02, 1.62, MID), -0.2, (0, 0), 9),
    ('04 bear sweater', lambda n: sweater_bear(n, 0.075), (0.8, 1.54, MID), 0.1, (0.12, 0), 9),
    ('05 sitting brown', lambda n: chibi(n, 1, 0.078, HAIR['brown'], OUT['lilac']), (0.66, 1.55, MID), 0.2, (0, 0.08), 9),
    ('06 sitting pink orange', lambda n: chibi(n, 3, 0.07, HAIR['pinkorange'], OUT['pink'], tails=True), (0.96, 1.72, None), -0.15, (0.1, 0), 0.85),
    ('07 grey cat', lambda n: animal(n, 5, 0.07, ('cat grey', (0.6, 0.61, 0.65)), ('ear pink', (0.93, 0.66, 0.7)), 'cat'), (0.66, 1.62, TOP), 0.1, (0, 0), 9),
    ('08 white cat', lambda n: animal(n, 6, 0.07, ('cat white', (0.94, 0.94, 0.92)), ('ear pink', (0.93, 0.66, 0.7)), 'cat'), (0.8, 1.63, TOP), -0.05, (0, 0), 9),
    ('09 yellow dog', lambda n: dog(n, 0.066), (0.53, 1.62, TOP), 0.25, (0, 0), 9),
    ('10 lying dark', lambda n: chibi(n, 4, 0.075, HAIR['dark'], OUT['white'], lying=True), (0.72, 1.56, TOP), 0.3, (0, 0), 9),
    ('11 sitting blonde', lambda n: chibi(n, 0, 0.068, HAIR['blonde'], OUT['navy']), (0.9, 1.56, TOP), -0.2, (0, -0.1), 9),
    ('12 sitting orange small', lambda n: chibi(n, 2, 0.058, HAIR['orange'], OUT['pink']), (0.99, 1.62, TOP), -0.3, (0, 0), 9),
    ('13 blue ball', lambda n: bird(n, 0.075), (1.08, 1.6, TOP), -0.4, (0, 0.2), 9),
    ('14 marigold creature big', lambda n: creature(n, 0.13), (1.12, 1.66, TOP), -0.5, (0, -0.25), 9),
    ('15 hat plush', lambda n: hat_plush(n, 0.085), (1.2, 1.52, None), -0.6, (0.9, -0.3), 1.3),
    ('16 tote', lambda n: tote(n, 0.5, 0.26, 0.24), (0.72, 1.64, BASKET), 0.0, (0, 0), 9),
    ('17 tote orange', lambda n: chibi(n, 2, 0.07, HAIR['orange'], OUT['white']), (0.6, 1.64, BASKET), 0.1, (0.1, 0), 9),
    ('18 tote ginger laugh', lambda n: chibi(n, 2, 0.068, HAIR['ginger'], OUT['pink']), (0.74, 1.62, BASKET), -0.1, (0, 0.1), 9),
    ('19 tote pink', lambda n: chibi(n, 1, 0.066, HAIR['pinkorange'], OUT['cream'], tails=True), (0.86, 1.66, BASKET), 0.0, (0, 0), 9),
    ('20 top orange laugh', lambda n: chibi(n, 2, 0.075, HAIR['orange'], OUT['orange']), (0.58, 1.66, None), 0.15, (0.15, 0.1), 1.5),
    ('21 top ginger', lambda n: chibi(n, 0, 0.07, HAIR['ginger'], OUT['navy'], tails=True), (0.74, 1.66, None), -0.1, (0.1, 0), 1.5),
    ('22 top brown', lambda n: chibi(n, 1, 0.062, HAIR['brown'], OUT['white']), (0.88, 1.68, None), -0.2, (0, -0.1), 1.5),
    ('23 bottom lying pillow', lambda n: chibi(n, 4, 0.09, HAIR['ginger'], OUT['orange'], lying=True), (0.62, 1.62, BOT), 0.0, (0, 0), 9),
]

made = []
for label, make, loc, yaw, tilt, ceil in LAYOUT:
    num, words = label.split(' ', 1)
    name = f'Nesoberi {words} {num}'
    if bpy.data.objects.get(name):
        continue
    obj = make(name).finish(loc if loc[2] is not None else (loc[0], loc[1], 0.0), yaw, {'roomTarget': 'hobbies', 'merchandise_kind': 'plush', 'roomRackPlush': 1}, stack=loc[2] is None, tilt=tilt, ceil=ceil)
    made.append(obj.name)
result = {'made': made}
