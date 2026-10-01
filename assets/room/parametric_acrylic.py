import bpy
import numpy as np
from mathutils import Vector


def png_plate(image, corners, ink_material, clear_material, thickness=0.003, border_m=0.00065, tab_width_m=0.004, sample_step=4, alpha_threshold=0.2):
    if thickness <= 0 or border_m < 0 or tab_width_m <= 0 or sample_step < 1:
        raise ValueError('Invalid acrylic dimensions')
    origin = Vector(corners[0])
    horizontal = Vector(corners[1])-origin
    vertical = Vector(corners[3])-origin
    normal = horizontal.cross(vertical).normalized()
    width,height = image.size
    pixels = np.array(image.pixels[:],dtype=np.float32).reshape(height,width,4)
    mask = pixels[::sample_step,::sample_step,3]>alpha_threshold
    if not mask.any():
        raise ValueError("PNG has no opaque artwork")
    if mask.all():
        raise ValueError("PNG requires a transparent background")
    expanded = mask.copy()
    margin=max(1,int(np.ceil(border_m/(horizontal.length/mask.shape[1]))))
    for dy in range(-margin,margin+1):
        for dx in range(-margin,margin+1):
            shifted = np.roll(np.roll(mask,dy,axis=0),dx,axis=1)
            if dy>0: shifted[:dy,:]=False
            if dy<0: shifted[dy:,:]=False
            if dx>0: shifted[:,:dx]=False
            if dx<0: shifted[:,dx:]=False
            expanded |= shifted
    ys,xs=np.nonzero(mask)
    bottom=int(ys.min())
    foot=int(np.median(xs[ys<=bottom+2]))
    tab=max(1,int(np.ceil(tab_width_m/(horizontal.length/mask.shape[1])/2)))
    expanded[:bottom+margin+1,max(0,foot-tab):foot+tab+1]=True
    h,w=expanded.shape
    edges={}
    def edge(a,b):
        edges.setdefault(a,[]).append(b)
    for y,x in zip(*np.nonzero(expanded)):
        if y==0 or not expanded[y-1,x]: edge((x,y),(x+1,y))
        if x==w-1 or not expanded[y,x+1]: edge((x+1,y),(x+1,y+1))
        if y==h-1 or not expanded[y+1,x]: edge((x+1,y+1),(x,y+1))
        if x==0 or not expanded[y,x-1]: edge((x,y+1),(x,y))
    loops=[]
    while edges:
        start=next(iter(edges)); current=start; loop=[]
        while True:
            loop.append(current)
            choices=edges[current]
            current=choices.pop()
            if not choices: del edges[loop[-1]]
            if current==start:break
        loops.append(loop)
    contour=max(loops,key=lambda loop:abs(sum(loop[i][0]*loop[(i+1)%len(loop)][1]-loop[(i+1)%len(loop)][0]*loop[i][1] for i in range(len(loop)))))
    contour=[p for i,p in enumerate(contour) if (p[0]-contour[i-1][0])*(contour[(i+1)%len(contour)][1]-p[1])!=(p[1]-contour[i-1][1])*(contour[(i+1)%len(contour)][0]-p[0])]
    def simplify(points, tolerance):
        if len(points)<3:return points
        a=np.array(points[0],dtype=float); b=np.array(points[-1],dtype=float)
        delta=b-a; length=float(np.linalg.norm(delta))
        if length<1e-9:return [points[0],points[-1]]
        distances=[abs(float(delta[0]*(p[1]-a[1])-delta[1]*(p[0]-a[0])))/length for p in points[1:-1]]
        index=int(np.argmax(distances))+1
        if distances[index-1]<=tolerance:return [points[0],points[-1]]
        return simplify(points[:index+1],tolerance)[:-1]+simplify(points[index:],tolerance)
    split=max(range(len(contour)),key=lambda i:(contour[i][0]-contour[0][0])**2+(contour[i][1]-contour[0][1])**2)
    contour=simplify(contour[:split+1],0.9)[:-1]+simplify(contour[split:]+[contour[0]],0.9)[:-1]
    uvpoints=[Vector((x/w,y/h,0)) for x,y in contour]
    def cross(a,b,c):
        return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)
    signed=sum(uvpoints[i].x*uvpoints[(i+1)%len(uvpoints)].y-uvpoints[(i+1)%len(uvpoints)].x*uvpoints[i].y for i in range(len(uvpoints)))
    remaining=list(range(len(uvpoints)))
    if signed<0:remaining.reverse()
    triangles=[]
    while len(remaining)>3:
        clipped=False
        for j,b in enumerate(remaining):
            a=remaining[j-1];c=remaining[(j+1)%len(remaining)]
            pa,pb,pc=uvpoints[a],uvpoints[b],uvpoints[c]
            if cross(pa,pb,pc)<=1e-8:continue
            if any(cross(pa,pb,uvpoints[k])>=-1e-8 and cross(pb,pc,uvpoints[k])>=-1e-8 and cross(pc,pa,uvpoints[k])>=-1e-8 for k in remaining if k not in (a,b,c)):continue
            triangles.append((a,b,c));remaining.pop(j);clipped=True;break
        if not clipped:raise ValueError('Contour cannot be triangulated without degeneracy')
    triangles.append(tuple(remaining))
    world=[origin+horizontal*p.x+vertical*p.y for p in uvpoints]
    count=len(world)
    vertices=[p+normal*depth for depth in (thickness/2,-thickness/2) for p in world]
    faces=[tuple(tri) for tri in triangles]
    faces += [tuple(count+i for i in reversed(tri)) for tri in triangles]
    printed_faces=len(faces)
    faces += [(i,(i+1)%count,(i+1)%count+count,i+count) for i in range(count)]
    mesh=bpy.data.meshes.new(image.name+' parametric acrylic')
    mesh.from_pydata(vertices,[],faces)
    mesh.materials.append(ink_material)
    mesh.materials.append(clear_material)
    uv=mesh.uv_layers.new(name='Artwork UV')
    for polygon in mesh.polygons:
        polygon.material_index=0 if polygon.index<printed_faces else 1
        for loop_index in polygon.loop_indices:
            uv.data[loop_index].uv=uvpoints[mesh.loops[loop_index].vertex_index%count][:2]
    mesh.update()
    if any(face.area<1e-12 for face in mesh.polygons):
        bpy.data.meshes.remove(mesh)
        raise ValueError('Degenerate PNG contour')
    return mesh


def acrylic_base(width=0.05, depth=0.04, height=0.008, segments=32):
    if min(width, depth, height) <= 0 or segments < 8:
        raise ValueError('Invalid base dimensions')
    import math
    vertices=[(width/2*math.cos(math.tau*i/segments),depth/2*math.sin(math.tau*i/segments),z) for z in (0,height) for i in range(segments)]
    faces=[tuple(reversed(range(segments))),tuple(range(segments,2*segments))]
    faces += [(i,(i+1)%segments,(i+1)%segments+segments,i+segments) for i in range(segments)]
    mesh=bpy.data.meshes.new('Parametric acrylic base')
    mesh.from_pydata(vertices,[],faces)
    mesh.update()
    return mesh
