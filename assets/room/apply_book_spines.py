import bpy
from mathutils import Vector

source = bpy.data.collections['RoomHome']
image = bpy.data.images.load(bpy.path.abspath('//textures/book-spine-atlas.png'), check_existing=True)
image.colorspace_settings.name = 'sRGB'
image.pack()
material = bpy.data.materials.get('Illustrated paper book spines') or bpy.data.materials.new('Illustrated paper book spines')
material.use_nodes = True
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Roughness'].default_value = 0.58
texture = material.node_tree.nodes.get('Spine atlas') or material.node_tree.nodes.new('ShaderNodeTexImage')
texture.name = 'Spine atlas'
texture.image = image
material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Base Color'])
edges = [0, 114, 218, 327, 435, 540, 639, 751, 852, 960, 1063, 1156, 1230]
prefixes = ('Shelf book', 'Collection album spine', 'Upper collection booklet')
spines = sorted([obj for obj in source.all_objects if obj.type == 'MESH' and obj.name.startswith(prefixes) and obj.name.endswith(' binding') and not obj.hide_render], key=lambda obj: obj.name)
for index, obj in enumerate(spines):
    if material.name not in obj.data.materials:
        obj.data.materials.append(material)
    material_index = list(obj.data.materials).index(material)
    uv = obj.data.uv_layers.active or obj.data.uv_layers.new(name='Book spine UV')
    points = [obj.matrix_world@vertex.co for vertex in obj.data.vertices]
    ymin, ymax = min(point.y for point in points), max(point.y for point in points)
    zmin, zmax = min(point.z for point in points), max(point.z for point in points)
    column = index%12
    umin, umax = (edges[column]+3)/1230, (edges[column+1]-3)/1230
    stripe_ratio = (umax-umin)*image.size[0]/image.size[1]
    coverage = min(1, stripe_ratio/((ymax-ymin)/(zmax-zmin)))
    normal_matrix = obj.matrix_world.to_3x3().inverted().transposed()
    for polygon in obj.data.polygons:
        if (normal_matrix@polygon.normal).normalized().x > -0.9:
            continue
        polygon.material_index = material_index
        for loop in polygon.loop_indices:
            point = points[obj.data.loops[loop].vertex_index]
            uv.data[loop].uv = (umin+(umax-umin)*(ymax-point.y)/(ymax-ymin), 0.5+((point.z-zmin)/(zmax-zmin)-0.5)*coverage)

archive = bpy.data.collections.get('Room superseded book spine bars')
if archive is None:
    archive = bpy.data.collections.new('Room superseded book spine bars')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True
for obj in list(source.all_objects):
    if obj.name.startswith(prefixes) and ' spine band' in obj.name:
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        archive.objects.link(obj)
        obj.hide_render = True
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'textured_spines': len(spines), 'image_size': list(image.size)})
