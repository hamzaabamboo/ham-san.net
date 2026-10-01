from pathlib import Path

import bpy


def refine_entry_contact():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Entry correction requires production source in Object mode')
    bpy.context.view_layer.update()
    tile = bpy.data.objects['Genkan tile floor']
    surface = max((tile.matrix_world @ vertex.co).z for vertex in tile.data.vertices)
    frames = [bpy.data.objects[name] for name in ('Entry door frame side', 'Entry door frame side.001')]
    if any(frame.get('floorContactRefined') for frame in frames):
        raise RuntimeError('Entry contact already refined')
    changes = []
    for frame in frames:
        inverse = frame.matrix_world.inverted()
        count = 0
        for vertex in frame.data.vertices:
            world = frame.matrix_world @ vertex.co
            if world.z < surface:
                world.z = surface
                vertex.co = inverse @ world
                count += 1
        frame.data.update()
        frame['floorContactRefined'] = True
        changes.append({'name': frame.name, 'vertices': count})
    bpy.context.view_layer.update()
    degenerate = [(frame.name, face.index) for frame in frames for face in frame.data.polygons if face.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    return {'surface': surface, 'changes': changes, 'zero_area_faces': 0}


result = refine_entry_contact()
