import bpy
from mathutils import Vector

names = (
    'Blue banner illustrated print',
    'Closet anime illustrated print',
    'Closet portrait illustrated print',
)
objects = [bpy.data.objects[name] for name in names]
image = bpy.data.images['illustrated-posters.png']
source = bpy.data.materials['Illustrated poster atlas']
material = bpy.data.materials.get('Restored illustrated poster set')
if material is None:
    material = source.copy()
    material.name = 'Restored illustrated poster set'
textures = [node for node in material.node_tree.nodes if node.type == 'TEX_IMAGE']
assert len(textures) == 1
textures[0].image = image
image.pack()
for obj in objects:
    assert obj.data.uv_layers.active is not None
    if 'roomPosterPreviousMaterial' not in obj:
        obj['roomPosterPreviousMaterial'] = obj.data.materials[0].name
    obj.data.materials[0] = material
    obj['roomPosterArtworkSource'] = 'illustrated-posters.png'
banner = bpy.data.objects['Blue banner illustrated print']
wall = bpy.data.objects['Entry wall']
wall_front = max((wall.matrix_world @ Vector(point)).y for point in wall.bound_box)
banner_front = min((banner.matrix_world @ Vector(point)).y for point in banner.bound_box)
banner.location.y += wall_front + 0.004 - banner_front
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
print({'restored_posters': list(names), 'artwork': image.name})
