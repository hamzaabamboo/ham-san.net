import bpy
from pathlib import Path
from mathutils import Vector

family = globals().get('PROOF_FAMILY', 'Idol u2r3 r3 s2')
families = globals().get('PROOF_FAMILIES', [family])
gallery = len(families) > 1
tag = globals().get('PROOF_TAG', 'current')
root = Path(bpy.data.filepath).resolve().parents[2]
output = root / 'tools/room-harness/evidence/build' / f'acrylic-detail-{tag}.png'
proof = bpy.data.scenes.new('Acrylic detail proof')
objects = []
world = bpy.data.worlds.new('Acrylic detail proof world')
proof.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.15, 0.15, 0.15, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35

try:
    for index, name in enumerate(families):
        anchor = bpy.data.objects[name + ' base'].matrix_world.translation
        offset = Vector((0, (index % 4) * 0.16, -(index // 4) * 0.18)) - anchor
        for suffix in ('print', 'plate', 'base'):
            source = bpy.data.objects[name + ' ' + suffix]
            copy = source.copy()
            copy.parent = None
            copy.matrix_world = source.matrix_world.copy()
            if gallery:
                copy.location += offset
            copy.hide_render = False
            copy.hide_viewport = False
            proof.collection.objects.link(copy)
            objects.append(copy)
            for modifier in copy.modifiers:
                if modifier.type == 'BOOLEAN' and modifier.object:
                    cutter = modifier.object.copy()
                    cutter.matrix_world = modifier.object.matrix_world.copy()
                    if gallery:
                        cutter.location += offset
                    proof.collection.objects.link(cutter)
                    objects.append(cutter)
                    modifier.object = cutter
    proof.view_layers[0].update()
    corners = [obj.matrix_world @ Vector(c) for obj in objects if not obj.hide_render for c in obj.bound_box]
    lo = Vector([min(p[i] for p in corners) for i in range(3)])
    hi = Vector([max(p[i] for p in corners) for i in range(3)])
    target = (lo + hi) * 0.5
    camera_data = bpy.data.cameras.new('Acrylic detail proof camera')
    camera = bpy.data.objects.new(camera_data.name, camera_data)
    proof.collection.objects.link(camera)
    objects.append(camera)
    camera.location = target + Vector((-1.5, -0.025, 0.025) if gallery else (-0.25, -0.045, 0.045))
    camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera_data.type = 'ORTHO'
    camera_data.ortho_scale = max(hi.z - lo.z, (hi.y - lo.y) * 1600 / 1300) * 1.12 if gallery else (hi.z - lo.z) * 1.5
    camera_data.clip_start = 0.001
    proof.camera = camera
    for suffix, offset, energy in (
        ('key', (-0.15, -0.10, 0.20), 4.0),
        ('fill', (-0.10, 0.15, 0.10), 2.0),
    ):
        data = bpy.data.lights.new('Acrylic detail proof ' + suffix, 'AREA')
        data.energy = energy * (20 if gallery else 1)
        data.size = 0.9 if gallery else 0.25
        light = bpy.data.objects.new(data.name, data)
        proof.collection.objects.link(light)
        objects.append(light)
        light.location = target + Vector(offset) * (4 if gallery else 1)
        light.rotation_euler = (target - light.location).to_track_quat('-Z', 'Y').to_euler()
    proof.render.engine = 'CYCLES'
    proof.cycles.samples = 24
    proof.cycles.use_denoising = True
    proof.render.threads_mode = 'FIXED'
    proof.render.threads = 4
    proof.render.resolution_x = 1300 if gallery else 650
    proof.render.resolution_y = 1600 if gallery else 800
    proof.render.resolution_percentage = 100
    proof.render.image_settings.file_format = 'PNG'
    proof.render.filepath = str(output)
    bpy.ops.render.render(write_still=True, scene=proof.name)
finally:
    for obj in objects:
        data = obj.data
        bpy.data.objects.remove(obj, do_unlink=True)
        if isinstance(data, bpy.types.Camera):
            bpy.data.cameras.remove(data)
        elif isinstance(data, bpy.types.Light):
            bpy.data.lights.remove(data)
    bpy.data.scenes.remove(proof)
    bpy.data.worlds.remove(world)

result = {'path': str(output), 'families': families, 'isolated': True, 'saved': False}
