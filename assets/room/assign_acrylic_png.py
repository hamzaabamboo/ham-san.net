import json
from pathlib import Path

import bmesh
import bpy

ROOT = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
spec = globals()['ACRYLIC_ASSIGNMENT']
obj = bpy.context.scene.objects[spec['object']]
image_path = ROOT / spec['png']
if obj.get('roomAcrylicInputPNG') == str(image_path):
    raise RuntimeError('Artwork already assigned')
image = bpy.data.images.load(str(image_path), check_existing=True)
quad = bpy.data.meshes[obj['roomGeometryRecoveryMesh']]
if len(quad.vertices) != 4:
    raise RuntimeError('Original print quad is required')
material = obj.data.materials[0].copy()
material.name = obj.name + ' individual artwork'
images = [n for n in material.node_tree.nodes if n.type == 'TEX_IMAGE']
if len(images) != 1:
    raise RuntimeError('Expected one artwork texture')
images[0].image = image
namespace = {}
exec((ROOT / 'assets/room/parametric_acrylic.py').read_text(), namespace)
mesh = namespace['png_plate'](image, [obj.matrix_world @ v.co for v in quad.vertices], material, bpy.data.materials['Optical clear display case acrylic'])
bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()
base = bpy.context.scene.objects[obj.name + ' base'].evaluated_get(depsgraph)
base_mesh = base.to_mesh()
top = max((base.matrix_world @ v.co).z for v in base_mesh.vertices)
base.to_mesh_clear()
bottom = min(v.co.z for v in mesh.vertices)
for vertex in mesh.vertices:
    if abs(vertex.co.z - bottom) <= 1e-6:
        vertex.co.z = top - 0.0005
mesh.update()
bm = bmesh.new()
bm.from_mesh(mesh)
defects = {'boundary': sum(e.is_boundary for e in bm.edges), 'nonmanifold': sum(not e.is_manifold for e in bm.edges), 'zero_area': sum(f.calc_area() <= 1e-12 for f in bm.faces)}
bm.free()
if any(defects.values()):
    raise RuntimeError(str(defects))
mesh.transform(obj.matrix_world.inverted())
obj.data.use_fake_user = True
obj['roomAcrylicPreviousMesh'] = obj.data.name
obj.data = mesh
obj['roomAcrylicInputPNG'] = str(image_path)
obj['roomArtworkRevision'] = image_path.stem + '-individual-v1'
bpy.context.view_layer.update()
temporary = ROOT / 'assets/room/room-v2-artwork-save.blend'
bpy.data.libraries.write(str(temporary), {bpy.context.scene}, path_remap='RELATIVE_ALL', fake_user=True, compress=True)
temporary.replace(ROOT / 'assets/room/room-v2.blend')
result = {'object': obj.name, 'png': str(image_path), 'triangles': sum(len(p.vertices) - 2 for p in mesh.polygons), 'audit': defects, 'source_saved': True, 'public_sync': False}
