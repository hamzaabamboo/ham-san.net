import bpy
from mathutils import Vector

sc = bpy.context.scene
OUT = globals().get('OUT_DIR', '/Users/vittayapalotai.tanyawat/code/ham-san.net/tools/room-harness/evidence/build/work/')
prev = (sc.camera, sc.render.filepath, sc.render.engine, sc.render.resolution_x, sc.render.resolution_y,
        sc.render.resolution_percentage, sc.cycles.samples, sc.render.threads_mode, sc.render.threads,
        sc.view_settings.exposure)
made = []
try:
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = globals().get('SAMPLES', 24)
    sc.render.threads_mode = 'FIXED'
    sc.render.threads = 4
    sc.view_settings.exposure = prev[9] + globals().get('EV', 1.2)
    for name, loc, look, lens, rx, ry in VIEWS:
        cd = bpy.data.cameras.new('tmpcam ' + name)
        cam = bpy.data.objects.new('tmpcam ' + name, cd)
        sc.collection.objects.link(cam)
        made.append(cam)
        cam.location = Vector(loc)
        cam.rotation_euler = (Vector(look) - cam.location).to_track_quat('-Z', 'Y').to_euler()
        cd.lens = lens
        cd.clip_start = 0.01
        cd.clip_end = 30
        sc.camera = cam
        sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = rx, ry, 100
        sc.render.filepath = OUT + 'v_' + name + '.png'
        bpy.ops.render.render(write_still=True)
finally:
    (sc.camera, sc.render.filepath, sc.render.engine, sc.render.resolution_x, sc.render.resolution_y,
     sc.render.resolution_percentage, sc.cycles.samples, sc.render.threads_mode, sc.render.threads,
     sc.view_settings.exposure) = prev
    for cam in made:
        cd = cam.data
        bpy.data.objects.remove(cam)
        bpy.data.cameras.remove(cd)
result = {'dirty': bpy.data.is_dirty, 'views': [v[0] for v in VIEWS]}
