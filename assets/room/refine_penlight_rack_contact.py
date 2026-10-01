from pathlib import Path

import bpy
from mathutils import Vector


def refine_rack_contact():
    if Path(bpy.data.filepath).name != 'room-v2.blend' or bpy.context.mode != 'OBJECT':
        raise RuntimeError('Rack correction requires production source in Object mode')
    pole = bpy.data.objects['Penlight grid pole 1']
    if pole.get('shelfClearanceRefined'):
        raise RuntimeError('Rack contact already corrected')
    collection = pole.users_collection[0]
    for name in ('Penlight grid pole 1', 'Penlight grid pole 1 foot', 'Penlight grid pole 1 cap'):
        obj = bpy.data.objects[name]
        obj.matrix_world.translation.x += 0.022
        obj.matrix_world.translation.y -= 0.034
        factor = 13 / 24 if name.endswith('cap') else 0.625 if name == 'Penlight grid pole 1' else 10 / 24
        for vertex in obj.data.vertices:
            vertex.co.x *= factor
            vertex.co.y *= factor
        obj.data.update()
    created = []
    for index, height in enumerate((0.7045455, 1.4, 2.0954545)):
        low = Vector((3.242, -0.699, height - 0.003))
        high = Vector((3.258, -0.683, height + 0.003))
        vertices = [(x, y, z) for z in (low.z, high.z) for y in (low.y, high.y) for x in (low.x, high.x)]
        faces = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
        name = f'Penlight grid pole 1 clip {index}'
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        obj = bpy.data.objects.new(name, mesh)
        collection.objects.link(obj)
        mesh.materials.append(pole.data.materials[0])
        bevel = obj.modifiers.new('Rounded clip edges', 'BEVEL')
        bevel.width = 0.001
        bevel.segments = 2
        created.append(obj)
    bpy.context.view_layer.update()
    degenerate = [(obj.name, face.index) for obj in created for face in obj.data.polygons if face.area <= 1e-12]
    if degenerate:
        raise RuntimeError(str(degenerate))
    pole['shelfClearanceRefined'] = True
    return {'moved': 3, 'created': [obj.name for obj in created], 'zero_area_faces': 0}


result = refine_rack_contact()
