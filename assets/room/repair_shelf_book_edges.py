import bpy

prefixes = ('Shelf density book', 'Shelf upper book', 'Shelf top bay book')
removed = 0
for obj in list(bpy.data.objects):
    if obj.name.startswith(prefixes) and (' top' in obj.name or ' band' in obj.name):
        bpy.data.objects.remove(obj, do_unlink=True)
        removed += 1

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'removed_unaligned_edges': removed})
