import bpy
import json
import os
import math
from mathutils import Vector

REPO = os.path.abspath(os.path.join(os.path.dirname(bpy.data.filepath), '..', '..'))
PLAN = os.path.join(REPO, 'tools', 'room-harness', 'build', 'build-plan.json')
OUT_DIR = os.path.join(REPO, 'tools', 'room-harness', 'evidence', 'build')
ONLY = globals().get('PROOF_ONLY')
TAG = globals().get('PROOF_TAG', 'latest')
RES = globals().get('PROOF_RES', (1280, 800))
CAM_COLLECTION = 'ROOM_PROOF_CAMERAS'

with open(PLAN, encoding='utf-8') as handle:
    plan = json.load(handle)

scene = bpy.context.scene
os.makedirs(OUT_DIR, exist_ok=True)
cams = bpy.data.collections.get(CAM_COLLECTION)
if cams is None:
    cams = bpy.data.collections.new(CAM_COLLECTION)
    scene.collection.children.link(cams)
cams.hide_render = False

view_layer = bpy.context.view_layer
EXPORT_SET = {plan['sourceCollection'], CAM_COLLECTION}


def set_exclusions(layer_collection, excluded):
    for child in layer_collection.children:
        if child.name not in EXPORT_SET:
            excluded[child.name] = child.exclude
            child.exclude = True


previous_exclusions = {}
set_exclusions(view_layer.layer_collection, previous_exclusions)

previous = {
    'camera': scene.camera,
    'engine': scene.render.engine,
    'res': (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage),
    'filepath': scene.render.filepath,
    'format': scene.render.image_settings.file_format,
}


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def ensure_camera(name, spec):
    cam_data = bpy.data.cameras.get(name) or bpy.data.cameras.new(name)
    cam = bpy.data.objects.get(name)
    if cam is None:
        cam = bpy.data.objects.new(name, cam_data)
        cams.objects.link(cam)
    cam.data = cam_data
    if spec.get('kind') == 'ortho_top':
        cam_data.type = 'ORTHO'
        cam_data.ortho_scale = spec.get('orthoScale', 9.5)
        cam.location = Vector((spec.get('center', [0.0, 0.0])[0], spec.get('center', [0.0, 0.0])[1], 2.25))
        cam_data.clip_start = 0.01
        cam.rotation_euler = (0.0, 0.0, 0.0)
    else:
        cam_data.type = 'PERSP'
        cam_data.lens = spec.get('lens', 28)
        cam.location = Vector(spec['position'])
        look_at(cam, spec['lookAt'])
    cam_data.clip_end = 60.0
    return cam


written = []
try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT' if hasattr(bpy.types, 'RenderSettings') and 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
    scene.render.resolution_x, scene.render.resolution_y = RES
    if hasattr(scene, 'eevee'):
        scene.eevee.taa_render_samples = 48
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    for name, spec in plan['proofCameras'].items():
        if ONLY and name not in ONLY:
            continue
        cam = ensure_camera(name, spec)
        scene.camera = cam
        path = os.path.join(OUT_DIR, f'{name.lower()}-{TAG}.png')
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        written.append(path)
finally:
    for child in view_layer.layer_collection.children:
        if child.name in previous_exclusions:
            child.exclude = previous_exclusions[child.name]
    scene.camera = previous['camera']
    scene.render.engine = previous['engine']
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = previous['res']
    scene.render.filepath = previous['filepath']
    scene.render.image_settings.file_format = previous['format']

result = {'written': written, 'camera_collection': CAM_COLLECTION}
