import bpy

names = ['Closet yellow illustration poster', 'Closet portrait poster', 'Closet anime illustrated print', 'Closet portrait illustrated print']
jamb = bpy.data.objects['Closet wood jamb.001']
boundary = max((jamb.matrix_world @ vertex.co).y for vertex in jamb.data.vertices)
poster = bpy.data.objects[names[0]]
edge = min((poster.matrix_world @ vertex.co).y for vertex in poster.data.vertices)
shift = max(0, boundary + 0.06 - edge)
for name in names:
    obj = bpy.data.objects[name]
    matrix = obj.matrix_world.copy()
    matrix.translation.y += shift
    obj.matrix_world = matrix
bpy.context.view_layer.update()
print({'shift': shift, 'jamb_clearance': min((poster.matrix_world @ vertex.co).y for vertex in poster.data.vertices) - boundary})
