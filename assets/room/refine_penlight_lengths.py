import bpy


root = bpy.data.objects["Layout penlight towel rack"]
diffusers = [
    o
    for o in root.children
    if (o.name.startswith("Cheering light") and "handle" not in o.name)
    or o.name.startswith("Collection penlight diffuser")
]
grips = [
    o
    for o in root.children
    if o.name.startswith("Cheering light handle") or o.name.startswith("Collection penlight grip")
]
desired_lengths = [0.18, 0.16, 0.20, 0.17, 0.19, 0.15, 0.21, 0.18]
diffusers.sort(key=lambda o: (round(o.location.z, 3), o.location.y))
grips.sort(key=lambda o: (round(o.location.z, 3), o.location.y))

for index, diffuser in enumerate(diffusers):
    candidates = [
        grip
        for grip in grips
        if abs(grip.location.y - diffuser.location.y) < 0.001 and grip.location.z < diffuser.location.z
    ]
    if not candidates:
        continue
    grip = max(candidates, key=lambda o: o.location.z)
    desired = desired_lengths[index % len(desired_lengths)]
    current = diffuser.dimensions.z
    if current <= 0:
        continue
    diffuser.scale.z *= desired / current
    diffuser.location.z = grip.location.z + grip.dimensions.z / 2 + desired / 2
    diffuser["roomPenlightLengthRepair"] = "short-varied-v1"

bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath="/Users/vittayapalotai.tanyawat/code/ham-san.net/assets/room/room.blend")
print(
    [
        (o.name, round(o.dimensions.z, 4), round(o.location.z, 4))
        for o in diffusers
    ]
)
