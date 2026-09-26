import bpy

lid = bpy.data.objects['Laptop lid']
if lid.get('roomLaptopLidRepair') != 'v1':
    lid.scale.y = 0.98
    lid['roomLaptopLidRepair'] = 'v1'

bpy.context.view_layer.update()
print({'laptop_lid_dimensions': tuple(round(value, 4) for value in lid.dimensions)})
