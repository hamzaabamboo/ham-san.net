import bpy

left = {
    'Ceiling diffuser': (-2.25, -0.25, 2.713),
    'Ceiling disc': (-2.25, -0.25, 2.752),
    'Ceiling mount': (-2.25, -0.25, 2.789),
    'Room warm ceiling front': (-2.25, -0.25, 2.643),
}
right = {
    'Ceiling diffuser.001': (2.05, 0.75, 2.713),
    'Ceiling disc.001': (2.05, 0.75, 2.752),
    'Ceiling mount.001': (2.05, 0.75, 2.789),
    'Room warm ceiling rear': (2.05, 0.75, 2.653),
}
for name, location in {**left, **right}.items():
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise RuntimeError(f'Missing ceiling light object: {name}')
    obj.location = location
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print('Ceiling fixtures and warm sources aligned left/right across the room')
