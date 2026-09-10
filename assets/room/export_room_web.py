import bpy
from collections import defaultdict

scene = bpy.context.scene
source = bpy.data.collections['RoomHome']
if bpy.data.collections.get('RoomWebExport'):
    raise RuntimeError('Export collection already exists')
stage = bpy.data.collections.new('RoomWebExport')
scene.collection.children.link(stage)
selected = list(bpy.context.selected_objects)
active = bpy.context.view_layer.objects.active
meshes = []
groups = defaultdict(list)
depsgraph = bpy.context.evaluated_depsgraph_get()
try:
    for obj in source.all_objects:
        if obj.hide_render:
            continue
        if obj.type in {'MESH', 'CURVE', 'FONT'}:
            mesh = bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph), preserve_all_data_layers=True, depsgraph=depsgraph)
            meshes.append(mesh)
            mesh.transform(obj.matrix_world)
            clone = bpy.data.objects.new('Web ' + obj.name, mesh)
            stage.objects.link(clone)
            for key in [
                'roomTarget',
                'roomNavigation',
                'roomCurtain',
                'roomCurtainClosedCenter',
                'roomCurtainOpenCenter',
                'roomCurtainGatheredScale',
                'roomCurtainClosedWidth',
                'roomCurtainWindow',
                'roomClosetLeaf',
                'roomClosetOpenOffset'
            ]:
                if key in obj:
                    clone[key] = obj[key]
            key = (
                tuple(m.name if m else None for m in mesh.materials),
                tuple((layer.name, layer.active_render) for layer in mesh.uv_layers),
                obj.get('roomTarget'),
                obj.get('roomCurtain'),
                obj.get('roomClosetLeaf'),
                obj.name if 'roomNavigation' in obj else None
            )
            groups[key].append(clone)
        elif obj.type == 'LIGHT':
            clone = bpy.data.objects.new(obj.name.replace(' ', '_'), obj.data)
            clone.matrix_world = obj.matrix_world
            stage.objects.link(clone)
    for group in groups.values():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in group:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = group[0]
        if len(group) > 1:
            bpy.ops.object.join()
    bpy.ops.object.select_all(action='DESELECT')
    for obj in stage.objects:
        obj.select_set(True)
    result = bpy.ops.export_scene.gltf(filepath=bpy.path.abspath('//room-web-current.glb'), export_format='GLB', use_selection=True, export_extras=True, export_lights=True, export_yup=True)
    print({'result': str(result), 'groups': len(groups), 'objects': len(stage.objects)})
finally:
    for obj in list(stage.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(stage)
    for mesh in meshes:
        try:
            if mesh.users == 0:
                bpy.data.meshes.remove(mesh)
        except ReferenceError:
            pass
    bpy.ops.object.select_all(action='DESELECT')
    for obj in selected:
        if obj.name in bpy.context.view_layer.objects:
            obj.select_set(True)
    bpy.context.view_layer.objects.active = active
