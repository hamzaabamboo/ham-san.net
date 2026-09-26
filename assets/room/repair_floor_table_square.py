import bpy

top = bpy.data.objects['Low hobby table top']
if top.get('roomFloorTableSquareRepair') != 'v1':
    target_depth = top.dimensions.x
    top.scale.y *= target_depth / top.dimensions.y
    top['roomFloorTableSquareRepair'] = 'v1'

for name, y in {
    'Low hobby table leg': 0.4041,
    'Low hobby table leg.001': -0.4041,
    'Low hobby table leg.002': 0.4041,
    'Low hobby table leg.003': -0.4041,
}.items():
    obj = bpy.data.objects[name]
    obj.location.y = y

print({'top_dimensions': tuple(round(value, 4) for value in top.dimensions)})
