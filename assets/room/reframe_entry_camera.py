import json

import bpy

floor = bpy.data.objects['Floor base']
navigation = json.loads(floor['roomNavigation'])
navigation['lookAt'] = [-0.75, 1.2, -1.0]
floor['roomNavigation'] = json.dumps(navigation)
floor['roomEntryCameraRepair'] = 'desk-visible-v1'
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'entry': navigation['entry'], 'lookAt': navigation['lookAt']})
