import bpy
from io_scene_gltf2.blender.exp.material.search_node_tree import get_gltf_node_name

source = bpy.data.materials['Optical clear display case']
group_name = get_gltf_node_name()
group = bpy.data.node_groups.get(group_name)
if group is None:
    group = bpy.data.node_groups.new(group_name, 'ShaderNodeTree')
if not any(item.name == 'Occlusion' and item.in_out == 'INPUT' for item in group.interface.items_tree):
    group.interface.new_socket(name='Occlusion', in_out='INPUT', socket_type='NodeSocketFloat').default_value = 1
if not any(item.name == 'Thickness' and item.in_out == 'INPUT' for item in group.interface.items_tree):
    group.interface.new_socket(name='Thickness', in_out='INPUT', socket_type='NodeSocketFloat')
materials = {}
for obj in bpy.data.collections['RoomHome'].all_objects:
    if obj.type != 'MESH' or source not in list(obj.data.materials):
        continue
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    thickness = round(min(max(point[axis] for point in points) - min(point[axis] for point in points) for axis in range(3)), 6)
    if not 0.002 < thickness < 0.005:
        raise ValueError(f'Unexpected case panel thickness: {obj.name}: {thickness}')
    if thickness not in materials:
        material = source.copy()
        material.name = f'Optical clear display case {thickness * 1000:g}mm'
        node = material.node_tree.nodes.new('ShaderNodeGroup')
        node.node_tree = group
        node.inputs['Thickness'].default_value = thickness
        materials[thickness] = material
    for slot in obj.material_slots:
        if slot.material == source:
            slot.material = materials[thickness]
print({material.name: thickness for thickness, material in materials.items()})
