import bmesh
import bpy
from mathutils import Matrix, Vector


def bounds(obj):
    points = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    return (
        min(p.x for p in points), max(p.x for p in points),
        min(p.y for p in points), max(p.y for p in points),
        min(p.z for p in points), max(p.z for p in points),
    )


def riser(name, tiers, material, collection):
    mesh_bm = bmesh.new()
    for x0, x1, y0, y1, z0, z1 in tiers:
        if z1 - z0 < 0.001:
            continue
        bmesh.ops.create_cube(
            mesh_bm, size=1,
            matrix=Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) @ Matrix.Diagonal((x1 - x0, y1 - y0, z1 - z0, 1)),
        )
    mesh = bpy.data.meshes.new(name)
    mesh_bm.to_mesh(mesh)
    mesh_bm.free()
    mesh.materials.append(material)
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj['roomTarget'] = 'hobbies'
    return obj


def place_row(stands, x_center, y0, y1, z_top, collection):
    count = len(stands)
    step = (y1 - y0 - 0.15) / (count - 1) if count > 1 else 0
    for index, (figure, base) in enumerate(stands):
        for obj in (figure, base):
            obj.hide_render = False
            obj.hide_set(False)
            for owner in list(obj.users_collection):
                owner.objects.unlink(obj)
            collection.objects.link(obj)
            obj['roomTarget'] = 'hobbies'
        figure.rotation_euler.z = 0
        bpy.context.view_layer.update()
        y = y0 + 0.075 + index * step if count > 1 else (y0 + y1) / 2
        b = bounds(base)
        base.matrix_world.translation += Vector((x_center - (b[0] + b[1]) / 2, y - (b[2] + b[3]) / 2, z_top + 0.0005 - b[4]))
        bpy.context.view_layer.update()
        b = bounds(base)
        f = bounds(figure)
        stagger = 0.006 if index % 2 else -0.006
        figure.matrix_world.translation += Vector((x_center + stagger - (f[0] + f[1]) / 2, y - (f[2] + f[3]) / 2, b[5] + 0.0005 - f[4]))
        bpy.context.view_layer.update()
