from pathlib import Path

import bpy


def refine_clearance():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Curtain clearance requires production source in Object mode')
    panels = [bpy.data.objects[name] for name in ('Balcony curtain left', 'Balcony curtain right')]
    if any(panel.get('curtainClearanceRefined') for panel in panels):
        raise RuntimeError('Curtain clearance already refined')
    result = []
    for panel in panels:
        backup = panel.data.copy()
        backup.name = f'{panel.data.name} before clearance'
        backup.use_fake_user = True
        for key in panel.data.shape_keys.key_blocks:
            if panel.name.endswith('left'):
                low = min(v.co.x for v in key.data)
                high = max(v.co.x for v in key.data)
                target_low, target_high = (-1.748, -0.67) if key.name == 'Basis' else (-1.74138, -1.28862)
                for vertex in key.data:
                    vertex.co.x = target_low + (vertex.co.x - low) / (high - low) * (target_high - target_low)
            elif key.name == 'Basis':
                low = min(v.co.x for v in key.data)
                high = max(v.co.x for v in key.data)
                for vertex in key.data:
                    vertex.co.x = -0.66 + (vertex.co.x - low) / (high - low) * 1.10
            for vertex in key.data:
                vertex.co.y -= 0.192
        for vertex, basis in zip(panel.data.vertices, panel.data.shape_keys.key_blocks['Basis'].data):
            vertex.co = basis.co
        panel.data.update()
        if panel.name.endswith('left'):
            panel['roomCurtainClosedCenter'] = -1.209
            panel['roomCurtainOpenCenter'] = -1.515
        else:
            panel['roomCurtainClosedCenter'] = -0.11
        panel['curtainClearanceRefined'] = True
        panel['curtainClearanceBackup'] = backup.name
        result.append({'name': panel.name, 'backup': backup.name})
    rail = bpy.data.objects['Balcony curtain rail']
    rail.location.y -= 0.192
    bpy.context.view_layer.update()
    return {'panels': result, 'rail_y': rail.location.y}


result = refine_clearance()
