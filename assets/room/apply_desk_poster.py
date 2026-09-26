import bpy

poster = bpy.data.objects['Desk blue group poster']
image = bpy.data.images.load(bpy.path.abspath('//textures/desk-group-poster.png'), check_existing=True)
image.colorspace_settings.name = 'sRGB'
points = [poster.matrix_world @ vertex.co for vertex in poster.data.vertices]
min_y, max_y = min(point.y for point in points), max(point.y for point in points)
min_z, max_z = min(point.z for point in points), max(point.z for point in points)
height = (max_y - min_y) * image.size[1] / image.size[0]
inverse = poster.matrix_world.inverted()
for vertex, point in zip(poster.data.vertices, points):
    point.z = max_z - (max_z - point.z) / (max_z - min_z) * height
    vertex.co = inverse @ point
poster.data.update()
material = bpy.data.materials.get('Desk group poster print') or bpy.data.materials.new('Desk group poster print')
material.use_nodes = True
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Roughness'].default_value = 0.78
texture = material.node_tree.nodes.get('Group artwork') or material.node_tree.nodes.new('ShaderNodeTexImage')
texture.name = 'Group artwork'
texture.image = image
material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
poster.data.materials.clear()
poster.data.materials.append(bpy.data.materials['Paper'])
poster.data.materials.append(material)
uv = poster.data.uv_layers.active or poster.data.uv_layers.new(name='UVMap')
normal_matrix = poster.matrix_world.inverted().transposed().to_3x3()
for polygon in poster.data.polygons:
    if (normal_matrix @ polygon.normal).normalized().x < 0.9:
        continue
    polygon.material_index = 1
    for index in polygon.loop_indices:
        point = poster.matrix_world @ poster.data.vertices[poster.data.loops[index].vertex_index].co
        uv.data[index].uv = ((point.y - min_y) / (max_y - min_y), (point.z - max_z + height) / height)
archive = bpy.data.collections.get('Room superseded desk poster shapes')
if archive is None:
    archive = bpy.data.collections.new('Room superseded desk poster shapes')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(bpy.data.collections['RoomHome'].all_objects):
    if not obj.name.startswith(('Desk poster portrait', 'Desk poster costume', 'Desk poster footer')):
        continue
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    archive.objects.link(obj)
print({'poster_bottom': max_z - height, 'poster_top': max_z, 'image_size': list(image.size)})
