import json
import os

import bpy
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(bpy.data.filepath)))
HERE = os.path.join(ROOT, 'tools', 'room-harness', 'item-compare')
ROOM_CENTRE = Vector((0.75, 0.0, 1.1))


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
    elif view == 'below':
        direction = Vector((0.0, -1.0, -0.5))
    else:
        direction = Vector((ROOM_CENTRE.x - centre.x, ROOM_CENTRE.y - centre.y, 0.0))
        if direction.length < 0.2:
            direction = Vector((0.0, -1.0, 0.0))
        direction.normalize()
        direction.z = 0.35
    direction.normalize()
    return centre, centre + direction * size * 1.35


def render(item_id):
    spec = json.load(open(os.path.join(HERE, 'items.json')))[item_id]
    objects = item_objects(spec)
    if not objects:
        return {'item': item_id, 'objects': 0}
    centre, eye = frame(objects, spec.get('view'))
    camera = bpy.data.objects.get('Item compare cam')
    if not camera:
        camera = bpy.data.objects.new('Item compare cam', bpy.data.cameras.new('Item compare cam'))
        bpy.context.scene.collection.objects.link(camera)
    camera.data.lens = 40
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
