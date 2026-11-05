from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import bpy
from mathutils import Vector

root = Path(bpy.data.filepath).resolve().parents[2]
assert Path(bpy.data.filepath).name == 'room-v2.blend'
scene = bpy.context.scene
bpy.context.view_layer.update()
phase = globals().get('ROOM_PHASE')
if phase is None:
    hour = datetime.now(ZoneInfo('Asia/Tokyo')).hour
    phase = 'night' if hour < 6 or hour >= 18 else 'day'
night = phase == 'night'


def principled(material):
    return next(n for n in material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')


def surface_normal(name, filename, repeat, strength, roughness, sheen=0.0):
    material = bpy.data.materials[name]
    nodes, links = material.node_tree.nodes, material.node_tree.links
    shader = principled(material)
    image = bpy.data.images.load(str(root / 'assets/room/textures' / filename), check_existing=True)
    image.colorspace_settings.name = 'Non-Color'
    image.pack()
    coordinates = nodes.get('Room surface UV') or nodes.new('ShaderNodeTexCoord')
    coordinates.name = 'Room surface UV'
    mapping = nodes.get('Room surface scale') or nodes.new('ShaderNodeMapping')
    mapping.name = 'Room surface scale'
    mapping.inputs['Scale'].default_value = (*repeat, 1)
    texture = nodes.get('Room surface normal texture') or nodes.new('ShaderNodeTexImage')
    texture.name = 'Room surface normal texture'
    texture.image = image
    texture.extension = 'REPEAT'
    normal = nodes.get('Room surface normal') or nodes.new('ShaderNodeNormalMap')
    normal.name = 'Room surface normal'
    normal.inputs['Strength'].default_value = strength
    links.new(coordinates.outputs['UV'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], texture.inputs['Vector'])
    links.new(texture.outputs['Color'], normal.inputs['Color'])
    links.new(normal.outputs['Normal'], shader.inputs['Normal'])
    shader.inputs['Roughness'].default_value = roughness
    if sheen:
        shader.inputs['Sheen Weight'].default_value = sheen
        shader.inputs['Sheen Roughness'].default_value = 0.7
    return material.name


surfaces = []
for name in ['Curtain mustard', 'Curtain powder blue']:
    surfaces.append(surface_normal(name, 'fabric-normal.png', (2, 6), 0.28, 0.93, 0.35))
for name in ['Beanbag pale cream canvas', 'Chair v2 cushion linen']:
    surfaces.append(surface_normal(name, 'fabric-normal.png', (5, 5), 0.2, 0.91, 0.3))
for material in bpy.data.materials:
    if material.name.startswith(('Art towel ', 'Art Live towel fold ')):
        surfaces.append(surface_normal(material.name, 'fabric-normal.png', (2, 5), 0.2, 0.94, 0.25))
surfaces.append(surface_normal('Oak floor', 'wood-normal.png', (4, 3), 0.18, 0.64))
surfaces.append(surface_normal('Closet wood grain', 'wood-normal.png', (2, 4), 0.16, 0.58))

sun = bpy.data.objects['Sun']
sun.data.energy = 0.15 if night else 3.4
sun.data.color = (0.48, 0.62, 1.0) if night else (1.0, 0.9, 0.74)
sun.data.angle = 0.12
sun.rotation_euler = (Vector((0, 0.45, 0)) - Vector((-1.6, 2.8, 2.7))).to_track_quat('-Z', 'Y').to_euler()
world = next(n for n in scene.world.node_tree.nodes if n.type == 'BACKGROUND')
world.inputs['Strength'].default_value = 0.12 if night else 0.2
world.inputs['Color'].default_value = (0.48, 0.58, 0.75, 1)

fixtures = []
for index, energy in [(1, 65), (2, 55)]:
    diffuser = bpy.data.objects[f'Ceiling light {index} diffuser']
    points = [diffuser.matrix_world @ Vector(c) for c in diffuser.bound_box]
    centre = sum(points, Vector()) / len(points)
    name = f'Room practical ceiling {index}'
    light = bpy.data.objects.get(name)
    if light is None:
        data = bpy.data.lights.new(name, 'AREA')
        light = bpy.data.objects.new(name, data)
        bpy.data.collections['Ceiling lights'].objects.link(light)
    light.location = centre + Vector((0, 0, -0.05))
    light.rotation_euler = (0, 0, 0)
    light.data.shape = 'DISK'
    light.data.size = 0.48
    light.data.color = (1, 0.74, 0.46)
    light.data.energy = energy if night else 0
    fixtures.append({'name': name, 'position': list(light.location), 'energy': light.data.energy})

for obj in scene.objects:
    if 'roomBackdrop' in obj:
        obj.hide_render = (obj['roomBackdrop'] == 'night') != night
    if obj.type == 'LIGHT' and obj.name.startswith('Penlight spill'):
        obj.data.energy = 8 if night else 3
        obj.data.shadow_soft_size = 0.08
    if obj.name in ['Lookdev key', 'Stage key', 'Stage fill']:
        obj.hide_render = True

diffuser = principled(bpy.data.materials['Light diffuser'])
diffuser.inputs['Emission Color'].default_value = (1, 0.77, 0.52, 1)
diffuser.inputs['Emission Strength'].default_value = 2.5 if night else 0.15
scene['roomLookdevVersion'] = 1
scene['roomLookdevPhase'] = phase
bpy.context.view_layer.update()
result = {'phase': phase, 'surfaces': surfaces, 'fixtures': fixtures, 'saved': False}
