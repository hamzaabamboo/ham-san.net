import bpy

archive_name = 'Room superseded shelf filler'
archive = bpy.data.collections.get(archive_name)
if archive is None:
    archive = bpy.data.collections.new(archive_name)
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True

prefixes = (
    'Shelf density ',
    'Shelf upper ',
    'Shelf display volume',
    'Shelf top bay ',
)
moved = []
for obj in list(bpy.data.objects):
    if not obj.name.startswith(prefixes):
        continue
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    archive.objects.link(obj)
    obj.hide_render = True
    obj.hide_viewport = True
    obj['roomArchived'] = 'shelf-filler-repair'
    moved.append(obj.name)

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'archived': len(moved), 'collection': archive_name})
