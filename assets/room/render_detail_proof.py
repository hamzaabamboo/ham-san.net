import bpy
from pathlib import Path
from mathutils import Vector

scene = bpy.context.scene
root = Path(bpy.data.filepath).resolve().parents[2]
tag = globals().get('PROOF_TAG', 'current')
view = globals().get('PROOF_VIEW', 'oblique')
label = globals().get('PROOF_LABEL', 'mouse')
name = globals().get('PROOF_OBJECT', 'Mouse')
output = root / 'tools/room-harness/evidence/build' / f'{label}-{tag}-{view}.png'
subject = bpy.data.objects.get(name + ' before refinement') or bpy.data.objects[name]
corners = [subject.matrix_world @ Vector(c) for c in subject.bound_box]
target = sum(corners, Vector()) / len(corners)
target = Vector(globals().get('PROOF_TARGET', target))
offsets = {'oblique': (0.15, -0.20, 0.15), 'top': (0.0, 0.0, 0.30),
           'side': (0.25, -0.03, 0.045), 'front': (-0.18, -0.20, 0.12)}
previous = (scene.camera, scene.render.filepath, scene.render.engine,
            scene.render.resolution_x, scene.render.resolution_y,
            scene.render.resolution_percentage, scene.render.image_settings.file_format,
            scene.render.threads_mode, scene.render.threads, scene.cycles.samples,
            scene.cycles.use_denoising)
created = []
camera_data = bpy.data.cameras.new('Mouse proof temporary camera')
camera = bpy.data.objects.new('Mouse proof temporary camera', camera_data)
scene.collection.objects.link(camera)
created.append(camera)
camera.location = target + Vector(globals().get('PROOF_OFFSET', offsets[view]))
camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera_data.type = 'ORTHO'
camera_data.ortho_scale = globals().get('PROOF_SCALE', 0.18)
camera_data.clip_start = 0.001
camera_data.clip_end = 10.0

try:
    for suffix, offset, energy, size in globals().get('PROOF_LIGHTS', (
        ('key', (0.04, -0.12, 0.23), 8.0, 0.25),
        ('fill', (-0.10, 0.10, 0.15), 3.0, 0.20),
    )):
        light_data = bpy.data.lights.new('Mouse proof temporary ' + suffix, 'AREA')
        light_data.energy = energy
        light_data.shape = 'DISK'
        light_data.size = size
        light = bpy.data.objects.new(light_data.name, light_data)
        scene.collection.objects.link(light)
        created.append(light)
        light.location = target + Vector(offset)
        light.rotation_euler = (target - light.location).to_track_quat('-Z', 'Y').to_euler()
    scene.camera = camera
    scene.render.engine = globals().get('PROOF_ENGINE', 'BLENDER_EEVEE')
    if scene.render.engine == 'CYCLES':
        scene.render.threads_mode = 'FIXED'
        scene.render.threads = 4
        scene.cycles.samples = 24
        scene.cycles.use_denoising = True
    scene.render.resolution_x = 800
    scene.render.resolution_y = 650
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath = str(output)
    bpy.context.view_layer.update()
    bpy.ops.render.render(write_still=True)
finally:
    (scene.camera, scene.render.filepath, scene.render.engine,
     scene.render.resolution_x, scene.render.resolution_y,
     scene.render.resolution_percentage, scene.render.image_settings.file_format,
     scene.render.threads_mode, scene.render.threads, scene.cycles.samples,
     scene.cycles.use_denoising) = previous
    for obj in created:
        data = obj.data
        bpy.data.objects.remove(obj, do_unlink=True)
        if isinstance(data, bpy.types.Camera):
            bpy.data.cameras.remove(data)
        else:
            bpy.data.lights.remove(data)

result = {'path': str(output), 'view': view, 'saved': False, 'lighting': 'temporary geometry proof only'}
