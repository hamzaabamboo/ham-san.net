import bpy

screen = bpy.data.objects['Monitor screen']
material = bpy.data.materials.get('Monitor forest display') or bpy.data.materials.new('Monitor forest display')
material.use_nodes = True
nodes = material.node_tree.nodes
shader = nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value = (0.005, 0.005, 0.005, 1)
shader.inputs['Roughness'].default_value = 0.28
shader.inputs['Emission Strength'].default_value = 1
texture = nodes.get('Forest wallpaper') or nodes.new('ShaderNodeTexImage')
texture.name = 'Forest wallpaper'
texture.image = bpy.data.images.load(bpy.path.abspath('//textures/monitor-forest-wallpaper.png'), check_existing=True)
texture.image.colorspace_settings.name = 'sRGB'
material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Emission Color'])
if material.name not in screen.data.materials:
    screen.data.materials.append(material)
material_index = list(screen.data.materials).index(material)
uv = screen.data.uv_layers.active or screen.data.uv_layers.new(name='UVMap')
min_y = min(vertex.co.y for vertex in screen.data.vertices)
max_y = max(vertex.co.y for vertex in screen.data.vertices)
min_z = min(vertex.co.z for vertex in screen.data.vertices)
max_z = max(vertex.co.z for vertex in screen.data.vertices)
screen_ratio = (max_y - min_y) / (max_z - min_z)
image_ratio = texture.image.size[0] / texture.image.size[1]
vertical_coverage = min(1, image_ratio / screen_ratio)
for polygon in screen.data.polygons:
    if polygon.normal.x < 0.9:
        continue
    polygon.material_index = material_index
    for index in polygon.loop_indices:
        vertex = screen.data.vertices[screen.data.loops[index].vertex_index].co
        uv.data[index].uv = ((vertex.y - min_y) / (max_y - min_y), 0.5 + ((vertex.z - min_z) / (max_z - min_z) - 0.5) * vertical_coverage)
archive = bpy.data.collections.get('Room superseded monitor placeholder')
if archive is None:
    archive = bpy.data.collections.new('Room superseded monitor placeholder')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(bpy.data.collections['RoomHome'].all_objects):
    if not obj.name.startswith('Screen code line'):
        continue
    world = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = world
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    archive.objects.link(obj)
screen['roomTarget'] = 'projects'
print({'screen': screen.name, 'texture_size': list(texture.image.size), 'front_material': material.name})
