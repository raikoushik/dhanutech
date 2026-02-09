import json, math, os

# NOTE: kept filename for compatibility with existing docs/automation.
# This generator now outputs a text-based JSON mesh bundle to avoid binary-file
# support issues in restricted deployment tools.


def sphere(rx, ry, rz, seg_u=24, seg_v=14, cx=0.0, cy=0.0, cz=0.0):
    pos=[]; nor=[]; idx=[]
    for j in range(seg_v+1):
        v=j/seg_v
        th=v*math.pi
        st,ct=math.sin(th),math.cos(th)
        for i in range(seg_u+1):
            u=i/seg_u
            ph=u*math.tau
            sp,cp=math.sin(ph),math.cos(ph)
            x=cp*st; y=ct; z=sp*st
            pos += [cx+rx*x, cy+ry*y, cz+rz*z]
            nx,ny,nz=x/rx if rx else x,y/ry if ry else y,z/rz if rz else z
            ln=math.sqrt(nx*nx+ny*ny+nz*nz) or 1
            nor += [nx/ln,ny/ln,nz/ln]
    row=seg_u+1
    for j in range(seg_v):
        for i in range(seg_u):
            a=j*row+i; b=a+1; c=a+row; d=c+1
            idx += [a,c,b,b,c,d]
    return pos,nor,idx


def cylinder_x(r=0.1, length=0.5, seg=16, cx=0,cy=0,cz=0):
    pos=[]; nor=[]; idx=[]
    x0=cx-length/2; x1=cx+length/2
    for k,x in enumerate([x0,x1]):
        for i in range(seg+1):
            u=i/seg
            a=u*math.tau
            y=cy+r*math.cos(a); z=cz+r*math.sin(a)
            pos += [x,y,z]
            nor += [0,math.cos(a),math.sin(a)]
    row=seg+1
    for i in range(seg):
        a=i; b=i+1; c=i+row; d=c+1
        idx += [a,c,b,b,c,d]
    return pos,nor,idx


def wing(width=0.55,height=0.26,th=0.01,cx=0,cy=0,cz=0):
    p=[(-width/2,0,-height/2),( width/2,0,-height/2),( width/2,0,height/2),(-width/2,0,height/2),
       (-width/2,th,-height/2),( width/2,th,-height/2),( width/2,th,height/2),(-width/2,th,height/2)]
    p=[(x+cx,y+cy,z+cz) for x,y,z in p]
    faces=[(0,1,2,3,(0,-1,0)),(4,7,6,5,(0,1,0)),(0,4,5,1,(0,0,-1)),(1,5,6,2,(1,0,0)),(2,6,7,3,(0,0,1)),(3,7,4,0,(-1,0,0))]
    pos=[];nor=[];idx=[];vi=0
    for a,b,c,d,n in faces:
        for vert in [a,b,c,d]:
            x,y,z=p[vert]; pos += [x,y,z]; nor += list(n)
        idx += [vi,vi+1,vi+2,vi,vi+2,vi+3]; vi += 4
    return pos,nor,idx


def tr(data, tx=0,ty=0,tz=0, rz=0):
    pos,nor,idx=data
    c,s=math.cos(rz),math.sin(rz)
    p2=[]; n2=[]
    for i in range(0,len(pos),3):
        x,y,z=pos[i],pos[i+1],pos[i+2]
        xr=x*c-y*s; yr=x*s+y*c
        p2 += [xr+tx,yr+ty,z+tz]
    for i in range(0,len(nor),3):
        x,y,z=nor[i],nor[i+1],nor[i+2]
        xr=x*c-y*s; yr=x*s+y*c
        n2 += [xr,yr,z]
    return p2,n2,idx


parts = [
    ("body",   sphere(0.55,0.34,0.30,22,14,0.25,0,0), [0.85,0.56,0.22]),
    ("head",   sphere(0.22,0.21,0.2,18,12,-0.35,0.06,0), [0.85,0.56,0.22]),
    ("stripe1",cylinder_x(0.31,0.03,18,0.05), [0.08,0.08,0.09]),
    ("stripe2",cylinder_x(0.30,0.03,18,0.28), [0.08,0.08,0.09]),
    ("stripe3",cylinder_x(0.28,0.03,18,0.50), [0.08,0.08,0.09]),
    ("eyeL",   sphere(0.055,0.055,0.055,12,8,-0.43,0.09,-0.08), [0.05,0.05,0.06]),
    ("eyeR",   sphere(0.055,0.055,0.055,12,8,-0.43,0.09,0.08), [0.05,0.05,0.06]),
    ("wingL",  tr(wing(0.66,0.32,0.008,0.12,0.19,-0.20), rz=-0.16), [0.78,0.92,1.0]),
    ("wingR",  tr(wing(0.66,0.32,0.008,0.12,0.19,0.20), rz=0.16), [0.78,0.92,1.0]),
    ("antL",   tr(cylinder_x(0.012,0.23,8,-0.46,0.23,-0.07), rz=-0.55), [0.15,0.12,0.08]),
    ("antR",   tr(cylinder_x(0.012,0.23,8,-0.46,0.23,0.07), rz=-0.55), [0.15,0.12,0.08]),
]

model={
    "asset":{"name":"Dhanu Tech Assistant Bee","format":"mesh-json-v1","units":"meters"},
    "animation":{
        "name":"hover_loop",
        "duration":1.0,
        "wingAmplitudeDeg":26,
        "bodyBobY":0.03
    },
    "meshes":[
        {"name":name,"color":color,"positions":p,"normals":n,"indices":idx}
        for name,(p,n,idx),color in parts
    ]
}

os.makedirs('assets', exist_ok=True)
out='assets/dhanu-tech-assistant-bee.json'
with open(out,'w',encoding='utf-8') as f:
    json.dump(model,f,separators=(',',':'))
print(out, 'written')
