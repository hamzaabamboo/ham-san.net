import bpy

source = bpy.data.collections['RoomHome']
archive = bpy.data.collections.get('Room superseded acrylic duplicates')
if archive is None:
    archive = bpy.data.collections.new('Room superseded acrylic duplicates')
    bpy.context.scene.collection.children.link(archive)
archive.hide_render = True
archive.hide_viewport = True

names = [
    'Idol amber contour clear plate.001',
    'Idol amber contour print.001',
    'Idol burgundy contour clear plate.001',
    'Idol burgundy contour print.001',
    'Idol rose contour clear plate.001',
    'Idol rose contour print.001',
    'Idol teal contour clear plate.001',
    'Idol teal contour print.001',
]
for name in names:
    obj = bpy.data.objects[name]
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    archive.objects.link(obj)
    obj.hide_render = True
    obj.hide_viewport = True
    obj['roomArchived'] = 'acrylic-duplicate-repair'

print({'archived_acrylic_duplicates': names})
