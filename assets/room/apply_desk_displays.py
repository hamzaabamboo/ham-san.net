import bpy

for object_name, image_name, material_name in [
    ('Laptop display', 'laptop-projects-display.png', 'Laptop actual projects display'),
    ('Tablet glass', 'tablet-notes-display.png', 'Tablet actual notes display'),
]:
    screen = bpy.data.objects[object_name]
    material = bpy.data.materials.get(material_name) or bpy.data.materials.new(material_name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (0.003, 0.003, 0.003, 1)
    shader.inputs['Roughness'].default_value = 0.28
    shader.inputs['Emission Strength'].default_value = 1
    image = bpy.data.images.load(bpy.path.abspath('//textures/'+image_name), check_existing=True)
    image.colorspace_settings.name = 'sRGB'
    image.pack()
    texture = material.node_tree.nodes.get('Actual page capture') or material.node_tree.nodes.new('ShaderNodeTexImage')
    texture.name = 'Actual page capture'
    texture.image = image
    material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Emission Color'])
    if material.name not in screen.data.materials:
        screen.data.materials.append(material)
    index = list(screen.data.materials).index(material)
    uv = screen.data.uv_layers.active or screen.data.uv_layers.new(name='Display UV')
    minimum = [min(vertex.co[i] for vertex in screen.data.vertices) for i in range(3)]
    maximum = [max(vertex.co[i] for vertex in screen.data.vertices) for i in range(3)]
    for polygon in screen.data.polygons:
        if polygon.normal.x < 0.9:
            continue
        polygon.material_index = index
        for loop in polygon.loop_indices:
            point = screen.data.vertices[screen.data.loops[loop].vertex_index].co
            uv.data[loop].uv = ((point.y-minimum[1])/(maximum[1]-minimum[1]), (point.z-minimum[2])/(maximum[2]-minimum[2]))
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Actual project and notes page captures assigned to front display UVs')
