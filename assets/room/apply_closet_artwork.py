import bpy

assignments = {
    'Closet anime illustrated print': 'Closet illustration artwork print',
    'Closet portrait illustrated print': 'Closet portrait artwork print',
}
for object_name, material_name in assignments.items():
    obj = bpy.data.objects[object_name]
    material = bpy.data.materials[material_name]
    obj.data.materials.clear()
    obj.data.materials.append(material)
    obj['roomArtworkSource'] = material_name

print({'closet_artwork': assignments})
