import bpy
import json
import os
from mathutils import Vector

REPO = os.path.abspath(os.path.join(os.path.dirname(bpy.data.filepath), '..', '..'))
OUT = os.path.join(REPO, 'tools', 'room-harness', 'build', 'audit-latest.json')
SOURCE = 'RoomHome'
ROOM_KEYS = (
    'roomTarget', 'roomNavigation', 'roomCurtain', 'roomClosetLeaf',
    'roomBounds', 'roomCollision', 'roomLight', 'roomSwitch'
)


def bounds(obj):
    corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    lo = [round(min(v[i] for v in corners), 4) for i in range(3)]
    hi = [round(max(v[i] for v in corners), 4) for i in range(3)]
    return lo, hi


def triangles(obj, depsgraph):
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    count = sum(len(p.vertices) - 2 for p in mesh.polygons)
    evaluated.to_mesh_clear()
    return count


def material_summary(mat):
    if mat is None:
        return None
    info = {'name': mat.name, 'blend': getattr(mat, 'surface_render_method', getattr(mat, 'blend_method', None)), 'images': []}
    if mat.use_nodes and mat.node_tree:
        for node in mat.node_tree.nodes:
            if node.type == 'TEX_IMAGE' and node.image:
                info['images'].append(node.image.name)
            if node.type == 'BSDF_PRINCIPLED':
                info['alpha'] = round(node.inputs['Alpha'].default_value, 3)
                info['transmission'] = round(node.inputs['Transmission Weight'].default_value, 3) if 'Transmission Weight' in node.inputs else None
                info['roughness'] = round(node.inputs['Roughness'].default_value, 3)
                emission = node.inputs.get('Emission Strength')
                info['emission'] = round(emission.default_value, 3) if emission else None
    return info


def collection_tree(col, depth=0, acc=None):
    acc = acc if acc is not None else []
    acc.append({'name': col.name, 'depth': depth, 'objects': [o.name for o in col.objects]})
    for child in col.children:
        collection_tree(child, depth + 1, acc)
    return acc


source = bpy.data.collections.get(SOURCE)
depsgraph = bpy.context.evaluated_depsgraph_get()
objects = []
materials = {}
tri_total = 0
if source:
    for obj in source.all_objects:
        record = {
            'name': obj.name,
            'type': obj.type,
            'collection': obj.users_collection[0].name if obj.users_collection else None,
            'parent': obj.parent.name if obj.parent else None,
            'hide_render': obj.hide_render,
            'hide_viewport': obj.hide_viewport,
            'props': {k: (obj[k] if isinstance(obj[k], (int, float, str, bool)) else str(obj[k])) for k in obj.keys() if k in ROOM_KEYS},
            'location': [round(v, 4) for v in obj.matrix_world.translation],
        }
        if obj.type in {'MESH', 'CURVE', 'FONT'}:
            lo, hi = bounds(obj)
            record['min'] = lo
            record['max'] = hi
            tris = triangles(obj, depsgraph) if obj.type == 'MESH' else 0
            record['tris'] = tris
            if not obj.hide_render:
                tri_total += tris
            record['materials'] = [m.name if m else None for m in (obj.data.materials if hasattr(obj.data, 'materials') else [])]
            for m in (obj.data.materials if hasattr(obj.data, 'materials') else []):
                if m and m.name not in materials:
                    materials[m.name] = material_summary(m)
            record['uv_layers'] = [uv.name for uv in obj.data.uv_layers] if obj.type == 'MESH' else []
        elif obj.type == 'LIGHT':
            record['light'] = {'kind': obj.data.type, 'energy': round(obj.data.energy, 3), 'color': [round(c, 3) for c in obj.data.color]}
        elif obj.type == 'CAMERA':
            record['camera'] = {'lens': round(obj.data.lens, 2)}
        objects.append(record)

payload = {
    'file': bpy.data.filepath,
    'blender': bpy.app.version_string,
    'source_collection': SOURCE,
    'source_present': source is not None,
    'collections': collection_tree(bpy.context.scene.collection),
    'object_count': len(objects),
    'triangles_renderable': tri_total,
    'objects': objects,
    'materials': materials,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as handle:
    json.dump(payload, handle, indent=1, ensure_ascii=False)
result = {'written': OUT, 'objects': len(objects), 'triangles_renderable': tri_total, 'source_present': source is not None}
