from pathlib import Path

import bpy


def refine_controls():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Strip controls require production source in Object mode')
    strip = bpy.data.objects['Monitor soundbar']
    if strip.get('visibleControlsRefined'):
        raise RuntimeError('Strip controls already refined')
    plastic = bpy.data.materials.new('Monitor strip satin plastic')
    plastic.use_nodes = True
    shader = plastic.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (0.012, 0.014, 0.016, 1)
    shader.inputs['Roughness'].default_value = 0.48
    green = plastic.copy()
    green.name = 'Monitor strip power green'
    green.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = (0.025, 0.24, 0.16, 1)
    strip['controlOriginalMaterial'] = strip.data.materials[0].name
    strip.data.materials[0] = plastic
    for face in strip.data.polygons:
        if max(abs(value) for value in face.normal) > 0.999:
            face.use_smooth = False
    parts = []
    for name, x, y, radius, material in [
        ('Monitor strip navigation wheel', -1.600, 0.800, 0.010, plastic),
        ('Monitor strip power button', -1.612, 0.764, 0.0032, green),
    ]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=0.0015, location=(x, y, 0.8775))
        obj = bpy.context.object
        obj.name = name
        obj.data.materials.append(material)
        obj['roomTarget'] = 'projects'
        obj['dimensionsEstimated'] = True
        obj['photoReference'] = 'PXL_20260908_033243806.jpg'
        bevel = obj.modifiers.new('Control rim', 'BEVEL')
        bevel.width = 0.0003
        bevel.segments = 2
        for face in obj.data.polygons:
            face.use_smooth = len(face.vertices) == 4
        parts.append(obj.name)
    strip['visibleControlsRefined'] = True
    bpy.context.view_layer.update()
    return {'parts': parts, 'fine_button_layout_unresolved': True}


result = refine_controls()
