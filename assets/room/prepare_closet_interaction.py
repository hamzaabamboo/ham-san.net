import bpy

front = bpy.data.objects['Closet sliding panel']
rear = bpy.data.objects['Closet sliding panel.001']

for obj, leaf, offset in ((front, 'right', 0.95), (rear, 'left', -0.95)):
    obj['roomTarget'] = 'closet'
    obj['roomClosetLeaf'] = leaf
    obj['roomClosetOpenOffset'] = offset

print({'closet_leaves': [(front.name, front['roomClosetLeaf']), (rear.name, rear['roomClosetLeaf'])]})
