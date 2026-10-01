from pathlib import Path

import bpy


def refine_contact():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Piano contact requires production source in Object mode')
    stand = bpy.data.objects['Keyboard stand X']
    if stand.get('floorContactRefined'):
        raise RuntimeError('Piano stand contact already refined')
    bpy.context.view_layer.update()
    points = [stand.matrix_world @ vertex.co for vertex in stand.data.vertices]
    low = min(point.z for point in points)
    high = max(point.z for point in points)
    floor = bpy.data.objects['Floor']
    support = max((floor.matrix_world @ vertex.co).z for vertex in floor.data.vertices)
    original = stand.data.copy()
    original.use_fake_user = True
    stand['floorContactOriginalMesh'] = original.name
    inverse = stand.matrix_world.inverted()
    for vertex, point in zip(stand.data.vertices, points):
        point.z = support + (point.z - low) * (high - support) / (high - low)
        vertex.co = inverse @ point
    stand.data.update()
    stand['floorContactRefined'] = True
    bpy.context.view_layer.update()
    return {'stand': stand.name, 'previous_gap_m': low - support, 'support_z_m': support, 'top_z_m': high}


result = refine_contact()
