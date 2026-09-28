import json
import os

import bpy
from mathutils import Vector

REPO = os.path.dirname(os.path.dirname(os.path.dirname(bpy.data.filepath)))
OUT = os.path.join(REPO, 'assets', 'room', 'room-v2-web.glb')
EXCLUDED_COLLECTIONS = {'Blockout', 'Plush v4', 'Plush v5 nesoberi'}


def world_bounds(objects):
    points = [o.matrix_world @ Vector(corner) for o in objects for corner in o.bound_box]
    low = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    high = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    return low, high


def gltf(v):
    return [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]


def meshes(prefix):
    return [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith(prefix) and not o.hide_render]


def collider(identifier, objects, pad=0.03):
    low, high = world_bounds(objects)
    return {
        'id': identifier,
        'minX': round(low.x - pad, 4),
        'maxX': round(high.x + pad, 4),
        'minZ': round(-high.y - pad, 4),
        'maxZ': round(-low.y + pad, 4),
    }


def navigation():
    groups = {}
    for o in bpy.data.objects:
        target = o.get('roomTarget')
        if target and target != 'light' and o.type == 'MESH' and not o.hide_render and not o.get('roomNavIgnore'):
            groups.setdefault(target, []).append(o)
    room_centre = Vector((0.75, 0.0, 1.1))
    targets = {}
    for target, objects in groups.items():
        low, high = world_bounds(objects)
        centre = (low + high) / 2
        size = max(high.x - low.x, high.y - low.y, high.z - low.z)
        toward_room = Vector((room_centre.x - centre.x, room_centre.y - centre.y, 0)).normalized()
        distance = 0.55 + min(size, 2.0) * 0.55
        camera = Vector((centre.x + toward_room.x * distance, centre.y + toward_room.y * distance, max(centre.z + 0.35, 0.95)))
        targets[target] = {'position': gltf(centre), 'camera': gltf(camera)}
    if 'closet' in targets:
        targets['closet'] = {'position': targets['closet']['position']}
    colliders = [
        collider('desk', [o for o in meshes('Desk ') if not o.name.startswith(('Desk rug', 'Desk wall', 'Desk headphone'))]),
        collider('chair', meshes('Chair ')),
        collider('shelf', meshes('Shelf U')),
        collider('floor-table', meshes('Low table')),
        collider('darts-stand', meshes('Dart rack') + meshes('Dart board cabinet')),
        collider('piano', meshes('Keyboard body') + meshes('Keyboard stand')),
        collider('beanbag', meshes('Beanbag')),
        collider('penlight-rack', meshes('Penlight wire grid')),
        collider('closet', meshes('Closet side wall') + meshes('Closet door')),
    ]
    return {
        'entry': gltf(Vector((-1.10, -1.35, 1.45))),
        'lookAt': gltf(Vector((0.3, 1.4, 1.0))),
        'bounds': {'minX': -1.78, 'maxX': 3.27, 'minZ': -1.90, 'maxZ': 1.85, 'minY': 0.02, 'maxY': 2.35},
        'targets': targets,
        'colliders': colliders,
    }


def set_open_preview(value):
    for o in bpy.data.objects:
        keys = getattr(getattr(o, 'data', None), 'shape_keys', None)
        if keys and 'Open' in keys.key_blocks:
            keys.key_blocks['Open'].value = value


def export():
    bpy.context.view_layer.update()
    bpy.data.objects['Floor']['roomNavigation'] = json.dumps(navigation())
    night = bpy.data.objects.get('Backdrop night')
    if night:
        night.hide_render = False
    set_open_preview(0.0)
    bpy.ops.object.select_all(action='DESELECT')
    for o in bpy.context.scene.objects:
        spill = o.type == 'LIGHT' and o.name.startswith('Penlight spill')
        if (o.type not in ('MESH', 'EMPTY') and not spill) or o.hide_render:
            continue
        if any(c.name in EXCLUDED_COLLECTIONS for c in o.users_collection):
            continue
        o.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=OUT,
        export_format='GLB',
        use_selection=True,
        export_extras=True,
        export_apply=True,
        export_yup=True,
        export_morph=False,
        export_cameras=False,
        export_lights=True,
    )
    set_open_preview(1.0)
    if night:
        night.hide_render = True
    return OUT


result = {'glb': export()}
