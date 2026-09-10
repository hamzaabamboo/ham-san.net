import bpy
import json
import os
import re
from mathutils import Vector

REPO = os.path.abspath(os.path.join(os.path.dirname(bpy.data.filepath), '..', '..'))
OUT = os.path.join(REPO, 'tools', 'room-harness', 'build', 'physics-latest.json')
home = bpy.data.collections['RoomHome']

def _b(name_pred):
    for o in home.all_objects:
        if o.type == 'MESH' and name_pred(o.name):
            c = [o.matrix_world @ Vector(v) for v in o.bound_box]
            return [min(v[i] for v in c) for i in range(3)], [max(v[i] for v in c) for i in range(3)]
    return None
_r = _b(lambda n: n == 'Right wall'); _l = _b(lambda n: n == 'Left continuous desk wall'); _e = _b(lambda n: n == 'Entry wall'); _w = _b(lambda n: n == 'Window wall central pier')
_floor = _b(lambda n: n == 'Floor base')
WALL = {'xmin': (_l[1][0] if _l else -3.965), 'xmax': (_r[0][0] if _r else 3.94), 'ymin': (_e[1][1] if _e else -2.53), 'ymax': (_w[0][1] if _w else 2.535), 'zmin': -0.005, 'zmax': 2.92}
EXTERIOR = re.compile(r'^(Balcony|Condenser|Rear frosted|Raised window|Window wall|Right wall|Entry wall|Left continuous|Room ceiling|Floor|Web |Skirting|Genkan|Closet|Wall AC|Room light|Ceiling diffuser|Penlight spill|Light$|Balcony gathered)', re.I)
SHELL = re.compile(r'wall|ceiling|floor|skirting|plinth|board|upright|frame|shelf|rack|stand |riser|case c\d l\d (floor|back|left|right|front|lid)|track|rail|grid|mount|desk straight top|Standing desk|Low hobby table|Darts stand|Display cabinet|Modular shelf|sill|lintel|jamb|threshold|mat\b|rug|beanbag|curtain|tapestry|poster|print|note|sheet|card|towel|pennant|uchiwa|glass|panel|clip|hook|lanyard|strap|cable|grommet|outlet', re.I)


def aabb(o):
    c = [o.matrix_world @ Vector(v) for v in o.bound_box]
    return [min(v[i] for v in c) for i in range(3)], [max(v[i] for v in c) for i in range(3)]


objs = []
for o in home.all_objects:
    if o.type not in ('MESH', 'CURVE') or o.hide_render:
        continue
    lo, hi = aabb(o)
    objs.append({'name': o.name, 'lo': lo, 'hi': hi, 'vol': max((hi[0]-lo[0])*(hi[1]-lo[1])*(hi[2]-lo[2]), 1e-9), 'curve': o.type == 'CURVE'})

def overlap1(a0, a1, b0, b1):
    return max(0.0, min(a1, b1) - max(a0, b0))

def xy_overlap_frac(a, b):
    ox = overlap1(a['lo'][0], a['hi'][0], b['lo'][0], b['hi'][0]); oy = overlap1(a['lo'][1], a['hi'][1], b['lo'][1], b['hi'][1])
    area = max((a['hi'][0]-a['lo'][0])*(a['hi'][1]-a['lo'][1]), 1e-9)
    return ox*oy/area

floating, wall_pen, intersections = [], [], []
for a in objs:
    if EXTERIOR.match(a['name']):
        continue
    # wall penetration
    p = []
    if a['lo'][0] < WALL['xmin'] - 0.01: p.append('x-')
    if a['hi'][0] > WALL['xmax'] + 0.01: p.append('x+')
    if a['lo'][1] < WALL['ymin'] - 0.01: p.append('y-')
    if a['hi'][1] > WALL['ymax'] + 0.01: p.append('y+')
    if a['lo'][2] < WALL['zmin'] - 0.01: p.append('z-')
    if p: wall_pen.append({'name': a['name'], 'sides': p, 'lo': [round(v,3) for v in a['lo']], 'hi': [round(v,3) for v in a['hi']]})
    # support: bottom must rest on floor or on another object's top within tolerance, with >=25% footprint overlap
    bottom = a['lo'][2]
    if bottom > 0.02 and not re.search(r'keychain|lanyard|hanging|^Piano .*key', a['name'], re.I):
        supported = False
        for b in objs:
            if b is a: continue
            if abs(b['hi'][2] - bottom) <= 0.02 and xy_overlap_frac(a, b) >= 0.25:
                supported = True; break
            # hanging / wall-mounted objects: touching a wall plane counts
        if not supported:
            near_wall = (a['hi'][0] > WALL['xmax'] - 0.06) or (a['lo'][0] < WALL['xmin'] + 0.06) or (a['hi'][1] > WALL['ymax'] - 0.06) or (a['lo'][1] < WALL['ymin'] + 0.06)
            # objects embedded inside a larger object (contents inside cases/cabinets) count as supported by that container floor
            inside = any(b is not a and b['lo'][0] <= a['lo'][0] + 0.02 and b['hi'][0] >= a['hi'][0] - 0.02 and b['lo'][1] <= a['lo'][1] + 0.02 and b['hi'][1] >= a['hi'][1] - 0.02 and b['lo'][2] <= bottom + 0.02 and b['hi'][2] >= a['hi'][2] - 0.05 for b in objs)
            if not near_wall and not inside:
                floating.append({'name': a['name'], 'bottom': round(bottom, 3), 'lo': [round(v,3) for v in a['lo']], 'hi': [round(v,3) for v in a['hi']]})

# pairwise intersections among content objects (skip shell-like names)
content = [o for o in objs if not SHELL.search(o['name']) and not EXTERIOR.match(o['name'])]
content.sort(key=lambda o: o['lo'][0])
for i, a in enumerate(content):
    for b in content[i+1:]:
        if b['lo'][0] > a['hi'][0]: break
        ox = overlap1(a['lo'][0], a['hi'][0], b['lo'][0], b['hi'][0]); oy = overlap1(a['lo'][1], a['hi'][1], b['lo'][1], b['hi'][1]); oz = overlap1(a['lo'][2], a['hi'][2], b['lo'][2], b['hi'][2])
        v = ox*oy*oz
        if v <= 0: continue
        frac = v / min(a['vol'], b['vol'])
        # same-family sub-parts (e.g. "Nesoberi v3 s1 r1 1" parts, "Idol ... print/plate/base") are one assembly
        ra = re.sub(r' (print|plate|base|hair|handle|tube|strap|ring|button|face|body|leg.*|arm.*|step \d)$', '', a['name']); rb = re.sub(r' (print|plate|base|hair|handle|tube|strap|ring|button|face|body|leg.*|arm.*|step \d)$', '', b['name'])
        if ra == rb: continue
        if a['name'].startswith('Piano ') and b['name'].startswith('Piano '): continue
        if frac > 0.30:
            intersections.append({'a': a['name'], 'b': b['name'], 'frac': round(frac, 2)})

STRUCT = re.compile(r'upright|pole|Clear case .* (front|left|right|back|lid)$|Display cabinet side|unit side|shelf side', re.I)
structs = [o for o in objs if STRUCT.search(o['name'])]
for a in content:
    for b in structs:
        ox = overlap1(a['lo'][0], a['hi'][0], b['lo'][0], b['hi'][0]); oy = overlap1(a['lo'][1], a['hi'][1], b['lo'][1], b['hi'][1]); oz = overlap1(a['lo'][2], a['hi'][2], b['lo'][2], b['hi'][2])
        v = ox*oy*oz
        if v <= 0: continue
        frac = v / b['vol']
        if frac > 0.05 and min(ox, oy, oz) > 0.004:
            intersections.append({'a': a['name'], 'b': b['name'], 'frac': round(frac, 2), 'kind': 'structure'})

SURF = re.compile(r'shelf|board|desk .*top|table top|plinth|Floor base|riser|step|panel|top$|lid$', re.I)
surfs = [o for o in objs if SURF.search(o['name'])]
sinks = []
for a in objs:
    if SURF.search(a['name']) or EXTERIOR.match(a['name']) or a.get('curve'): continue
    for b in surfs:
        ox = overlap1(a['lo'][0], a['hi'][0], b['lo'][0], b['hi'][0]); oy = overlap1(a['lo'][1], a['hi'][1], b['lo'][1], b['hi'][1]); oz = overlap1(a['lo'][2], a['hi'][2], b['lo'][2], b['hi'][2])
        if min(ox, oy, oz) <= 0.004: continue
        sink = b['hi'][2] - a['lo'][2]
        if sink > 0.004 and a['hi'][2] > b['hi'][2] + 0.01 and a['lo'][2] > b['lo'][2] - 0.005:
            sinks.append({'a': a['name'], 'b': b['name'], 'sink': round(sink, 3)})
sinks.sort(key=lambda x: -x['sink'])

FURN = re.compile(r'^(Desk straight top|Low hobby table|Modular shelf (board|upright|continuous back)|Display cabinet (shelf|side|back)|Darts stand (shelf|upright)|Wire rack (shelf \d|upright)|Monitor riser$|Standing desk|Closet interior|Clear case c\d l\d (floor|lid|left|right|back|front)|Keyboard playing)', re.I)
FURN_SKIP = re.compile(r'wall|ceiling|floor|Skirting|curtain|Genkan|Room |Web |grid|cable|string|tether|cord|lanyard|strap|clip|hook|Balcony|Window|Entry|Closet|Idol|Clear case|Acrylic|Modular|Display cabinet|Darts stand|Wire rack|Standing desk|Keyboard playing|Monitor riser|Monitor shelf foot|Low hobby table|Desk straight|plinth|teal back|riser|step|seam|shell|brace|Chair leg|Piano|support pin', re.I)
furn = [o for o in objs if FURN.match(o['name'])]
for a in objs:
    if FURN_SKIP.search(a['name']): continue
    for b in furn:
        ox = overlap1(a['lo'][0], a['hi'][0], b['lo'][0], b['hi'][0]); oy = overlap1(a['lo'][1], a['hi'][1], b['lo'][1], b['hi'][1]); oz = overlap1(a['lo'][2], a['hi'][2], b['lo'][2], b['hi'][2])
        if min(ox, oy, oz) > 0.005:
            intersections.append({'a': a['name'], 'b': b['name'], 'frac': round(min(ox, oy, oz), 3), 'kind': 'furniture'})

intersections.sort(key=lambda x: -x['frac'])
COLLIDER_SOURCES = {
    'desk': ['Desk straight top', 'Standing desk T foot', 'Standing desk T foot.001'],
    'chair': ['Chair moulded shell', 'Chair leg front left', 'Chair leg rear right'],
    'chair-2': ['Chair moulded shell 2', 'Chair leg front left 2', 'Chair leg rear right 2'],
    'wire-rack': ['Wire rack upright 1', 'Wire rack upright 4'],
    'box-tall': ['Cardboard box tall'],
    'boxes': ['Cardboard box large'],
    'darts-stand': ['Darts stand upright', 'Darts stand upright.001', 'Darts stand shelf'],
    'floor-table': ['Low hobby table top'],
    'beanbag': ['Beanbag tailored shell'],
    'piano': ['Piano case'],
    'desk-end-rack': ['Desk end wire rack upright 1', 'Desk end wire rack upright 4'],
    'foam-roller': ['Foam roller'],
}
collider_drift = []
_fb = bpy.data.objects.get('Floor base')
if _fb is not None and 'roomNavigation' in _fb:
    _nav = json.loads(_fb['roomNavigation'])
    _cols = {c['id']: c for c in _nav.get('colliders', [])}
    _by = {o['name']: o for o in objs}
    for cid, names in COLLIDER_SOURCES.items():
        src = [_by[n] for n in names if n in _by]
        if not src: continue
        x0 = min(o['lo'][0] for o in src); x1 = max(o['hi'][0] for o in src); y0 = min(o['lo'][1] for o in src); y1 = max(o['hi'][1] for o in src)
        c = _cols.get(cid)
        if c is None:
            collider_drift.append({'id': cid, 'missing': True}); continue
        d = max(abs(c['minX'] - x0), abs(c['maxX'] - x1), abs(c['minZ'] + y1), abs(c['maxZ'] + y0))
        if d > 0.02: collider_drift.append({'id': cid, 'drift': round(d, 3)})

CURVE_THIN = re.compile(r'string|tether|cord|lanyard|strap|wire|grid|cable|hook|ring$|clip|Floor base|oak floor|Room |wall|ceiling|Skirting|curtain|Genkan|seam|uchiwa|Microphone|yoyo|grommet|bracket|pull', re.I)
_dg = bpy.context.evaluated_depsgraph_get()
_solids = [(o['name'], o['lo'], o['hi']) for o in objs if not o['curve'] and not CURVE_THIN.search(o['name'])]
curve_hits = []
for _cv in home.all_objects:
    if _cv.type != 'CURVE' or _cv.hide_render or not re.search(r'cable|drop|bundle|string|tether|cord', _cv.name, re.I): continue
    _ev = _cv.evaluated_get(_dg); _me = _ev.to_mesh(); _vs = [_ev.matrix_world @ v.co for v in _me.vertices]; _ev.to_mesh_clear()
    _fam = re.sub(r' (string|tether|cord|lanyard|cable|bundle).*$', '', _cv.name)
    for n, lo, hi in _solids:
        if _fam and n.startswith(_fam): continue
        k = sum(1 for v in _vs if lo[0]+0.002 < v.x < hi[0]-0.002 and lo[1]+0.002 < v.y < hi[1]-0.002 and lo[2]+0.002 < v.z < hi[2]-0.002)
        if k: curve_hits.append({'curve': _cv.name, 'solid': n, 'verts': k})
    if _vs and (min(v.x for v in _vs) < WALL['xmin'] - 0.001 or max(v.x for v in _vs) > WALL['xmax'] + 0.001 or min(v.y for v in _vs) < WALL['ymin'] - 0.001 or max(v.y for v in _vs) > WALL['ymax'] + 0.001 or min(v.z for v in _vs) < 0.013):
        curve_hits.append({'curve': _cv.name, 'solid': 'wall/floor', 'verts': 1})

payload = {'objects': len(objs), 'floating': floating, 'wall_penetration': wall_pen, 'intersections': intersections, 'sinks': sinks, 'collider_drift': collider_drift, 'curve_hits': curve_hits}
with open(OUT, 'w', encoding='utf-8') as h:
    json.dump(payload, h, indent=1)
result = {'floating': len(floating), 'wall_penetration': len(wall_pen), 'intersections': len(intersections), 'sinks': len(sinks), 'collider_drift': len(collider_drift), 'curve_hits': len(curve_hits), 'written': OUT}
