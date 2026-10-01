import json
import re
import shutil
from pathlib import Path

import bmesh
import bpy

ROOT = Path('/Users/vittayapalotai.tanyawat/code/ham-san.net')
namespace = {}
exec((ROOT / 'assets/room/parametric_acrylic.py').read_text(), namespace)
scene = bpy.context.scene
bpy.context.view_layer.update()
depsgraph = bpy.context.evaluated_depsgraph_get()
objects = sorted((o for o in scene.objects if re.fullmatch(r'Bay r\d+ stand \d+', o.name) and not o.hide_render), key=lambda o: o.name)
if len(objects) != 45:
    raise RuntimeError(f'Expected 45 Bay prints, found {len(objects)}')
prepared = []
report = []
clear = bpy.data.materials['Optical clear display case acrylic']
for obj in objects:
    if obj.get('roomGeometryRevision') or len(obj.data.vertices) != 4 or any(m.type != 'SOLIDIFY' for m in obj.modifiers):
        raise RuntimeError(f'Unexpected source geometry: {obj.name}')
    images = [n.image for m in obj.data.materials if m and m.use_nodes for n in m.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image]
    if len(images) != 1:
        raise RuntimeError(f'Expected one artwork image: {obj.name}')
    image = images[0]
    base = scene.objects[obj.name + ' base']
    evaluated = base.evaluated_get(depsgraph)
    base_mesh = evaluated.to_mesh()
    top = max((evaluated.matrix_world @ v.co).z for v in base_mesh.vertices)
    evaluated.to_mesh_clear()
    mesh = namespace['png_plate'](image, [obj.matrix_world @ v.co for v in obj.data.vertices], obj.data.materials[0], clear)
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
        raise RuntimeError(str((obj.name, defects)))
    mesh.transform(obj.matrix_world.inverted())
    prepared.append((obj, mesh, image))
    report.append({'name': obj.name, 'image': image.filepath, 'triangles': sum(len(p.vertices) - 2 for p in mesh.polygons), 'base_insertion_m': 0.0005, **defects})
for obj, mesh, image in prepared:
    obj.data.use_fake_user = True
    obj['roomGeometryRecoveryMesh'] = obj.data.name
    obj['roomGeometryRecoveryModifiers'] = json.dumps([{'name': m.name, 'type': m.type, 'thickness': m.thickness, 'offset': m.offset} for m in obj.modifiers])
    obj.data = mesh
    for modifier in list(obj.modifiers):
        obj.modifiers.remove(modifier)
    obj['roomGeometryRevision'] = 'bay-png-parametric-v1'
    obj['roomAcrylicInputPNG'] = image.filepath
    obj['roomAcrylicParameters'] = json.dumps({'thickness': 0.003, 'border_m': 0.00065, 'tab_width_m': 0.004, 'base_insertion_m': 0.0005})
bpy.context.view_layer.update()
source = ROOT / 'assets/room/room-v2.blend'
backup = ROOT / 'tools/room-harness/image-to-3d/outputs/room-before-bay-parametric.blend'
if not backup.exists():
    shutil.copy2(source, backup)
temporary = ROOT / 'assets/room/room-v2-bay-save.blend'
bpy.data.libraries.write(str(temporary), {scene}, path_remap='RELATIVE_ALL', fake_user=True, compress=True)
temporary.replace(source)
report_path = ROOT / 'tools/room-harness/image-to-3d/outputs/bay-parametric-integration.json'
report_path.write_text(json.dumps(report, indent=2))
result = {'integrated': len(prepared), 'triangles': sum(r['triangles'] for r in report), 'report': str(report_path), 'saved': str(source)}
