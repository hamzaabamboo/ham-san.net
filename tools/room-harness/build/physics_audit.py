import bpy
import json
import os
import re
import hashlib
from datetime import datetime, timezone
from mathutils import Vector

REPO = os.path.abspath(os.path.join(os.path.dirname(bpy.data.filepath), '..', '..'))
OUT = os.path.join(REPO, 'tools', 'room-harness', 'build', 'physics-latest.json')
SCOPE = globals().get('AUDIT_SCOPE', 'collection')
if SCOPE not in {'collection', 'scene'}:
    raise ValueError(f'Unknown audit scope: {SCOPE}')
home = bpy.context.scene.collection if SCOPE == 'scene' else bpy.data.collections.get('RoomHome')
if home is None:
    raise RuntimeError('Physical audit source collection is absent')
EXCLUDED_COLLECTIONS = {'Blockout', 'Plush v4', 'Plush v5 nesoberi'}
bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()
source_hash = hashlib.sha256()
with open(bpy.data.filepath, 'rb') as handle:
    for chunk in iter(lambda: handle.read(1024 * 1024), b''):
        source_hash.update(chunk)

def _b(name_pred):
    for o in home.all_objects:
        if o.type == 'MESH' and name_pred(o.name):
            c = [o.matrix_world @ Vector(v) for v in o.bound_box]
            return [min(v[i] for v in c) for i in range(3)], [max(v[i] for v in c) for i in range(3)]
    return None
shell = bpy.data.objects.get('Room shell')
floor = bpy.data.objects.get('Floor')
if shell is None or floor is None:
    raise RuntimeError('Production shell and floor are required for room boundaries')
shell_points = [shell.matrix_world @ v.co for v in shell.data.vertices]
floor_points = [floor.matrix_world @ v.co for v in floor.data.vertices]
WALL = {
    'xmin': min(v.x for v in shell_points), 'xmax': max(v.x for v in shell_points),
    'ymin': min(v.y for v in shell_points), 'ymax': max(v.y for v in shell_points),
    'zmin': max(v.z for v in floor_points), 'zmax': max(v.z for v in shell_points),
}
EXTERIOR = re.compile(r'^(Room shell$|Outdoor AC|Backdrop |Balcony|Condenser|Rear frosted|Raised window|Window wall|Right wall|Entry wall|Left continuous|Room ceiling|Floor|Web |Skirting|Genkan|Closet|Wall AC|Room light|Ceiling diffuser|Penlight spill|Light$|Balcony gathered)', re.I)
SHELL = re.compile(r'wall|ceiling|floor|skirting|plinth|board|upright|frame|shelf|rack|stand |riser|case c\d l\d (floor|back|left|right|front|lid)|track|rail|grid|mount|desk straight top|Standing desk|Low hobby table|Darts stand|Display cabinet|Modular shelf|sill|lintel|jamb|threshold|mat\b|rug|beanbag|curtain|tapestry|poster|print|note|sheet|card|towel|pennant|uchiwa|glass|panel|clip|hook|lanyard|strap|cable|grommet|outlet', re.I)


def aabb(o):
    evaluated = o.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    try:
        points = [evaluated.matrix_world @ v.co for v in mesh.vertices]
        if not points:
            raise RuntimeError(f'Physical audit mesh has no vertices: {o.name}')
        return [min(v[i] for v in points) for i in range(3)], [max(v[i] for v in points) for i in range(3)]
    finally:
        evaluated.to_mesh_clear()


objs = []
for o in home.all_objects:
    if o.type not in ('MESH', 'CURVE') or o.hide_render:
        continue
    if any(c.name in EXCLUDED_COLLECTIONS for c in o.users_collection):
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
            if not near_wall:
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

SURF = re.compile(r'shelf|board|desk .*top|table top|plinth|^Floor$|riser|step|panel|top$|lid$', re.I)
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

FURN = re.compile(r'^(Desk top|Desk column|Desk crossbar|Desk foot|Low table (top|leg)|Shelf U|Dart rack|Monitor riser|Cube case .* (floor|lid|left|right|back|front)|Keyboard (body|stand))', re.I)
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
    'desk': lambda n: n.startswith('Desk ') and not n.startswith(('Desk rug', 'Desk wall', 'Desk headphone')),
    'chair': lambda n: n.startswith('Chair '),
    'shelf': lambda n: n.startswith('Shelf U'),
    'darts-stand': lambda n: n.startswith(('Dart rack', 'Dart board cabinet')),
    'floor-table': lambda n: n.startswith('Low table'),
    'beanbag': lambda n: n.startswith('Beanbag'),
    'piano': lambda n: n.startswith(('Keyboard body', 'Keyboard stand')),
    'penlight-rack': lambda n: n.startswith('Penlight wire grid'),
    'closet': lambda n: n.startswith(('Closet side wall', 'Closet door')),
}
collider_drift = []
_fb = floor
if 'roomNavigation' in _fb:
    _nav = json.loads(_fb['roomNavigation'])
    _cols = {c['id']: c for c in _nav.get('colliders', [])}
    _by = {o['name']: o for o in objs}
    for cid, predicate in COLLIDER_SOURCES.items():
        src = [o for o in objs if predicate(o['name'])]
        if not src:
            collider_drift.append({'id': cid, 'source_missing': True})
            continue
        points = [bpy.data.objects[o['name']].matrix_world @ Vector(corner) for o in src for corner in bpy.data.objects[o['name']].bound_box]
        x0 = min(v.x for v in points); x1 = max(v.x for v in points); y0 = min(v.y for v in points); y1 = max(v.y for v in points)
        c = _cols.get(cid)
        if c is None:
            collider_drift.append({'id': cid, 'missing': True}); continue
        d = max(abs(c['minX'] - (x0 - 0.03)), abs(c['maxX'] - (x1 + 0.03)), abs(c['minZ'] + y1 + 0.03), abs(c['maxZ'] + y0 - 0.03))
        if d > 0.001: collider_drift.append({'id': cid, 'drift': round(d, 4)})
else:
    collider_drift.append({'id': 'navigation', 'missing': True})

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

payload = {
    'source_file': bpy.data.filepath,
    'source_sha256': source_hash.hexdigest(),
    'source_is_dirty': bpy.data.is_dirty,
    'source_scope': SCOPE,
    'source_collection': home.name,
    'source_present': True,
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'method': 'aabb-screening',
    'room_bounds': WALL,
    'excluded_collections': sorted(EXCLUDED_COLLECTIONS),
    'objects': len(objs), 'floating': floating, 'wall_penetration': wall_pen,
    'intersections': intersections, 'sinks': sinks,
    'collider_drift': collider_drift, 'curve_hits': curve_hits
}
with open(OUT, 'w', encoding='utf-8') as h:
    json.dump(payload, h, indent=1)
result = {'floating': len(floating), 'wall_penetration': len(wall_pen), 'intersections': len(intersections), 'sinks': len(sinks), 'collider_drift': len(collider_drift), 'curve_hits': len(curve_hits), 'written': OUT}
