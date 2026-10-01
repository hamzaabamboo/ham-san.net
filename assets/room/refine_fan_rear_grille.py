import math
import shutil
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ROOT = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
scene = bpy.context.scene
root = scene.objects['Desk fan']
if root.get('rearGrilleRevision'):
    raise RuntimeError('Rear grille already integrated')
normal = (root.matrix_world.to_3x3() @ Vector((math.cos(math.radians(8)), 0, math.sin(math.radians(8))))).normalized()
center = root.matrix_world @ Vector((-0.008, 0, 0.064))
rotor = scene.objects['Desk fan rotor']
rotor_tree = BVHTree.FromPolygons([rotor.matrix_world @ v.co for v in rotor.data.vertices], [tuple(p.vertices) for p in rotor.data.polygons])
prepared = []
report = []
for index in range(1, 29):
    source = scene.objects[f'Desk fan grille {index}']
    copy = source.copy()
    copy.data = source.data.copy()
    copy.name = f'Desk fan rear grille {index}'
    inverse = source.matrix_world.inverted()
    for vertex in copy.data.vertices:
        point = source.matrix_world @ vertex.co
        vertex.co = inverse @ (point - normal * (2 * normal.dot(point - center)))
    for polygon in copy.data.polygons:
        polygon.flip()
    copy.data.update()
    bm = bmesh.new()
    bm.from_mesh(copy.data)
    defects = {'boundary': sum(e.is_boundary for e in bm.edges), 'nonmanifold': sum(not e.is_manifold for e in bm.edges), 'zero_area': sum(f.calc_area() <= 1e-12 for f in bm.faces)}
    bm.free()
    points = [source.matrix_world @ v.co for v in copy.data.vertices]
    tree = BVHTree.FromPolygons(points, [tuple(p.vertices) for p in copy.data.polygons])
    defects['rotor_surface_hits'] = len(tree.overlap(rotor_tree))
    if any(defects.values()):
        raise RuntimeError(str((copy.name, defects)))
    report.append({'name': copy.name, **defects})
    copy['roomGeometryRevision'] = 'fan-rear-grille-v1'
    prepared.append((source, copy))
for source, copy in prepared:
    for collection in source.users_collection:
        collection.objects.link(copy)
    copy.matrix_world = source.matrix_world.copy()
root['rearGrilleRevision'] = 'fan-rear-grille-v1'
bpy.context.view_layer.update()
source_path = ROOT / 'assets/room/room-v2.blend'
backup = ROOT / 'tools/room-harness/image-to-3d/outputs/room-before-fan-rear-grille.blend'
if not backup.exists():
    shutil.copy2(source_path, backup)
temporary = ROOT / 'assets/room/room-v2-fan-save.blend'
bpy.data.libraries.write(str(temporary), {scene}, path_remap='RELATIVE_ALL', fake_user=True, compress=True)
temporary.replace(source_path)
result = {'integrated': len(prepared), 'audit': report, 'saved': str(source_path), 'scene': scene.name, 'other_scenes_preserved': [s.name for s in bpy.data.scenes if s != scene], 'live_filepath': bpy.data.filepath}
