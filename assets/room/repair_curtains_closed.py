import bpy
from math import cos, pi, sin

source = bpy.data.collections['RoomHome']
archive = bpy.data.collections.get('Room superseded curtains') or bpy.data.collections.new('Room superseded curtains')
if archive.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True


def archive_curtain_parts():
    for obj in list(source.all_objects):
        name = obj.name.lower()
        if not (
            'gathered curtain' in name
            or 'curtain hook' in name
            or 'rail carrier' in name
            or 'header seam' in name
            or 'weighted hem' in name
            or name.startswith('curtain panel')
        ):
            continue
        for collection in list(obj.users_collection):
            collection.objects.unlink(obj)
        archive.objects.link(obj)
        obj.hide_render = True
        obj.hide_viewport = True


def get_image(name, path):
    image = bpy.data.images.get(name)
    if image is None:
        image = bpy.data.images.load(path, check_existing=True)
        image.name = name
    if not image.packed_file:
        image.pack()
    return image


def make_material(name, color, use_base_texture):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    shader = nodes.new('ShaderNodeBsdfPrincipled')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = 0.84
    shader.inputs['Sheen Weight'].default_value = 0.18
    shader.inputs['Specular IOR Level'].default_value = 0.28
    normal_image = get_image('Woven fabric normal UV', '//textures/fabric-normal.png')
    normal_texture = nodes.new('ShaderNodeTexImage')
    normal_texture.image = normal_image
    normal_texture.interpolation = 'Linear'
    normal_texture.name = 'Curtain low frequency normal'
    normal = nodes.new('ShaderNodeNormalMap')
    normal.inputs['Strength'].default_value = 0.08
    links.new(normal_texture.outputs['Color'], normal.inputs['Color'])
    links.new(normal.outputs['Normal'], shader.inputs['Normal'])
    if use_base_texture:
        base_image = get_image('Golden linen UV', '//textures/linen-basecolor.png')
        base_texture = nodes.new('ShaderNodeTexImage')
        base_texture.image = base_image
        base_texture.interpolation = 'Linear'
        base_texture.name = 'Curtain linen weave'
        links.new(base_texture.outputs['Color'], shader.inputs['Base Color'])
    links.new(shader.outputs['BSDF'], output.inputs['Surface'])
    if hasattr(material, 'surface_render_method'):
        try:
            material.surface_render_method = 'DITHERED'
        except TypeError:
            pass
    if hasattr(material, 'blend_method'):
        try:
            material.blend_method = 'OPAQUE'
        except TypeError:
            pass
    material.diffuse_color = (*color, 1)
    return material


def make_panel(name, curtain_id, window_left, window_right, side, bottom, top, material, folds, gather_width):
    center = (window_left + window_right) / 2
    if side == 'left':
        closed_left = window_left
        closed_right = center + 0.025
        open_center = window_left + gather_width / 2
    else:
        closed_left = center - 0.025
        closed_right = window_right
        open_center = window_right - gather_width / 2
    closed_center = (closed_left + closed_right) / 2
    closed_width = closed_right - closed_left

    def surface(u, v):
        phase = u * folds * 2 * pi + 0.12 * sin(v * pi)
        amplitude = 0.018 + 0.009 * sin(v * pi)
        x = closed_left + u * closed_width
        y = 2.405 - amplitude * cos(phase) - 0.004 * sin(v * pi)
        z = top - v * (top - bottom) - 0.006 * sin(phase / 2) ** 2 * v ** 6
        return x, y, z

    nx, ny = 96, 48
    vertices = [surface(x / nx, y / ny) for y in range(ny + 1) for x in range(nx + 1)]
    faces = [
        (y * (nx + 1) + x, y * (nx + 1) + x + 1, (y + 1) * (nx + 1) + x + 1, (y + 1) * (nx + 1) + x)
        for y in range(ny)
        for x in range(nx)
    ]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    uv = mesh.uv_layers.new(name='Cloth UV')
    for polygon in mesh.polygons:
        polygon.use_smooth = True
        for loop_index in polygon.loop_indices:
            index = mesh.loops[loop_index].vertex_index
            uv.data[loop_index].uv = (index % (nx + 1) / nx, 1 - index // (nx + 1) / ny)
    obj = bpy.data.objects.new(name, mesh)
    source.objects.link(obj)
    mesh.materials.append(material)
    solid = obj.modifiers.new('Curtain fabric thickness', 'SOLIDIFY')
    solid.thickness = 0.0015
    obj['roomCurtain'] = curtain_id
    obj['roomCurtainClosedCenter'] = closed_center
    obj['roomCurtainOpenCenter'] = open_center
    obj['roomCurtainGatheredScale'] = gather_width / closed_width
    obj['roomCurtainClosedWidth'] = closed_width
    obj['roomCurtainWindow'] = [window_left, window_right]
    return obj


archive_curtain_parts()
tan = make_material('Curtain linen clean', (0.62, 0.48, 0.27), True)
blue = make_material('Curtain blue clean', (0.19, 0.33, 0.39), False)
panels = [
    ('Balcony gathered curtain left panel', 'balcony-left', -3.97, -0.48, 'left', 0.1053, 2.529, tan, 14, 0.72),
    ('Balcony gathered curtain right panel', 'balcony-right', -3.97, -0.48, 'right', 0.1053, 2.529, tan, 14, 0.72),
    ('Raised window gathered curtain left panel', 'raised-left', 0.68, 3.73, 'left', 0.8953, 2.529, blue, 12, 0.42),
    ('Raised window gathered curtain right panel', 'raised-right', 0.68, 3.73, 'right', 0.8953, 2.529, blue, 12, 0.42),
]
for values in panels:
    make_panel(*values)

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Curtains rebuilt as four independent full-width panels with open/closed metadata')
