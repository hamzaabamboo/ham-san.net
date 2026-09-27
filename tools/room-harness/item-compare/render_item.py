import json
import math
import os

import bpy
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(bpy.data.filepath)))
HERE = os.path.join(ROOT, 'tools', 'room-harness', 'item-compare')
ROOM_CENTRE = Vector((0.75, 0.0, 1.1))
ROOM_LOW = Vector((-1.7, -1.78, 0.25))
ROOM_HIGH = Vector((3.2, 1.82, 2.25))


def item_objects(spec):
    found = []
    for o in bpy.data.objects:
        if o.type not in ('MESH', 'CURVE') or o.hide_render or o.matrix_world.translation.z < -3:
            continue
        if not any(o.name.startswith(p) for p in spec['prefix']):
            continue
        if any(o.name.startswith(p) for p in spec.get('exclude', [])):
            continue
        found.append(o)
    return found


def frame(objects, view):
    points = [o.matrix_world @ Vector(c) for o in objects for c in o.bound_box]
    low = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    high = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    centre = (low + high) / 2
    size = max((high - low).length, 0.12)
    if view == 'top':
        direction = Vector((0.0, -0.25, 1.0))
    elif view == 'right':
        direction = Vector((-1.0, 0.12, 0.2))
    elif view == 'below':
        direction = Vector((0.0, -1.0, -0.5))
    else:
        walls = [
            (centre.x - ROOM_LOW.x, Vector((1.0, 0.15, 0.0))),
            (ROOM_HIGH.x - centre.x, Vector((-1.0, 0.15, 0.0))),
            (centre.y - ROOM_LOW.y, Vector((0.15, 1.0, 0.0))),
            (ROOM_HIGH.y - centre.y, Vector((0.15, -1.0, 0.0))),
        ]
        gap, normal = min(walls, key=lambda wall: wall[0])
        direction = normal if gap < 0.9 else Vector((ROOM_CENTRE.x - centre.x, ROOM_CENTRE.y - centre.y, 0.0))
        if direction.length < 0.2:
            direction = Vector((0.0, -1.0, 0.0))
        direction.normalize()
        direction.z = 0.35
    direction.normalize()
    eye = centre + direction * size * 1.35
    eye = Vector((min(max(eye.x, ROOM_LOW.x), ROOM_HIGH.x), min(max(eye.y, ROOM_LOW.y), ROOM_HIGH.y), min(max(eye.z, ROOM_LOW.z), ROOM_HIGH.z)))
    distance = max((eye - centre).length, 0.05)
    fov = min(2.0 * math.atan(size * 0.6 / distance), math.radians(100))
    return centre, eye, 18.0 / math.tan(fov / 2.0)


def render(item_id):
    spec = json.load(open(os.path.join(HERE, 'items.json')))[item_id]
    objects = item_objects(spec)
    if not objects:
        return {'item': item_id, 'objects': 0}
    centre, eye, lens = frame(objects, spec.get('view'))
    if 'eye' in spec:
        eye = Vector(spec['eye'])
        lens = spec.get('lens', 24)
    camera = bpy.data.objects.get('Item compare cam')
    if not camera:
        camera = bpy.data.objects.new('Item compare cam', bpy.data.cameras.new('Item compare cam'))
        bpy.context.scene.collection.objects.link(camera)
    camera.data.lens = lens
    camera.data.clip_start = 0.01
    camera.location = eye
    camera.rotation_euler = (centre - eye).to_track_quat('-Z', 'Y').to_euler()
    scene = bpy.context.scene
    scene.camera = camera
    scene.render.resolution_x = 800
    scene.render.resolution_y = 800
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.filepath = os.path.join(HERE, 'current', f'{item_id}.jpg')
    bpy.ops.render.render(write_still=True)
    return {'item': item_id, 'objects': len(objects)}
