// ===== МИР =====
const worldObjects = [];
const SAFE_ZONE_RADIUS = 7;
const SAFE_ZONE_CENTER = new THREE.Vector3(8, 0, 8);

// Постоянные укрытия от выброса. Их координаты стабильны между запусками.
const shelters = [];
const shelterCameraOccluders = [];
function markShelterCameraWall(mesh){
  mesh.material = mesh.material.clone();
  mesh.userData.cameraOccluder = true;
  mesh.material.transparent = true;
  mesh.material.opacity = 1;
  mesh.material.depthWrite = true;
  shelterCameraOccluders.push(mesh);
  return mesh;
}
function addShelter(x,z,name){
  // Масштаб здания рассчитан относительно модели игрока (~2.5 м рост).
  const group=new THREE.Group();
  const wood=new THREE.MeshStandardMaterial({color:0x51402e,roughness:1,flatShading:true});
  const darkWood=new THREE.MeshStandardMaterial({color:0x30271e,roughness:1,flatShading:true});
  const roofMat=new THREE.MeshStandardMaterial({color:0x343b3a,roughness:.95,flatShading:true});
  const floorMat=new THREE.MeshStandardMaterial({color:0x625642,roughness:1});
  const floor=new THREE.Mesh(new THREE.BoxGeometry(10,.18,10),floorMat); floor.position.y=.09; group.add(floor);
  const wallH=4.0, wallY=wallH/2, t=.26, edge=4.87;
  const back=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(10,wallH,t),wood)); back.position.set(0,wallY,edge); group.add(back);
  const left=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(t,wallH,10),wood)); left.position.set(-edge,wallY,0); group.add(left);
  const right=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(t,wallH,10),wood)); right.position.set(edge,wallY,0); group.add(right);
  const doorHalf=.95, frontZ=-edge;
  const frontL=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(edge-doorHalf,wallH,t),wood)); frontL.position.set(-(edge+doorHalf)/2,wallY,frontZ); group.add(frontL);
  const frontR=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(edge-doorHalf,wallH,t),wood)); frontR.position.set((edge+doorHalf)/2,wallY,frontZ); group.add(frontR);
  const lintel=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(2.15,1.2,t+.04),darkWood)); lintel.position.set(0,3.4,frontZ); group.add(lintel);
  const roof=markShelterCameraWall(new THREE.Mesh(new THREE.BoxGeometry(10.35,.3,10.35),roofMat)); roof.position.y=4.15; group.add(roof);
  for(const px of [-4.78,4.78]) for(const pz of [-4.78,4.78]){const post=new THREE.Mesh(new THREE.BoxGeometry(.2,4.05,.2),darkWood);post.position.set(px,2.03,pz);group.add(post);}
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),new THREE.MeshStandardMaterial({color:0xffc66b,emissive:0xff8a22,emissiveIntensity:1.3}));lamp.position.set(0,3.55,0);group.add(lamp);
  const light=new THREE.PointLight(0xffb45e,.55,9);light.position.set(0,3.25,0);group.add(light);
  group.position.set(x,getTerrainHeight(x,z),z); scene.add(group);
  const radius=4.45;
  const zone=new THREE.Mesh(new THREE.CircleGeometry(radius,32),new THREE.MeshBasicMaterial({color:0x69b9d8,transparent:true,opacity:.055,side:THREE.DoubleSide,depthWrite:false}));
  zone.rotation.x=-Math.PI/2;zone.position.set(x,getTerrainHeight(x,z)+.2,z);zone.renderOrder=2;scene.add(zone);
  shelters.push({x,z,radius,name,group,zone});
}

// Физические прямоугольники стен; центральный дверной проём остаётся свободным.
function resolveShelterCollision(entity, bodyRadius=.38){
  for(const h of shelters){
    const walls=[
      {minX:h.x-5.00,maxX:h.x-4.74,minZ:h.z-5.00,maxZ:h.z+5.00},
      {minX:h.x+4.74,maxX:h.x+5.00,minZ:h.z-5.00,maxZ:h.z+5.00},
      {minX:h.x-5.00,maxX:h.x+5.00,minZ:h.z+4.74,maxZ:h.z+5.00},
      {minX:h.x-5.00,maxX:h.x-.95,minZ:h.z-5.00,maxZ:h.z-4.74},
      {minX:h.x+.95,maxX:h.x+5.00,minZ:h.z-5.00,maxZ:h.z-4.74}
    ];
    for(const w of walls){
      const minX=w.minX-bodyRadius,maxX=w.maxX+bodyRadius,minZ=w.minZ-bodyRadius,maxZ=w.maxZ+bodyRadius;
      if(entity.position.x>minX&&entity.position.x<maxX&&entity.position.z>minZ&&entity.position.z<maxZ){
        const pushes=[entity.position.x-minX,maxX-entity.position.x,entity.position.z-minZ,maxZ-entity.position.z];
        const m=Math.min(...pushes);
        if(m===pushes[0]) entity.position.x=minX;
        else if(m===pushes[1]) entity.position.x=maxX;
        else if(m===pushes[2]) entity.position.z=minZ;
        else entity.position.z=maxZ;
      }
    }
  }
}
function getShelterAt(x,z){return shelters.find(h=>Math.hypot(x-h.x,z-h.z)<=h.radius)||null;}
function isProtectedFromEmission(x,z){return Math.hypot(x-SAFE_ZONE_CENTER.x,z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS || !!getShelterAt(x,z);}
addShelter(-34,26,'Лесной бункер');
addShelter(42,-34,'Старая сторожка');
addShelter(-54,-48,'Заброшенный пост');
addShelter(58,48,'Полевое укрытие');

// ===== РЛС «ДУГА» — ДЛИННАЯ ЛИНЕЙНАЯ АНТЕННАЯ РЕШЁТКА =====
const radarBlinkLights=[];
const radarSolidBoxes=[];
const radarSolidBeams=[];
let radarBlinkTime=0;
function addRadarStation(x=0,z=-126){
  const g=new THREE.Group();
  const steel=new THREE.MeshStandardMaterial({color:0x303a3b,metalness:.72,roughness:.72});
  const rust=new THREE.MeshStandardMaterial({color:0x59483b,metalness:.48,roughness:.88});
  const dark=new THREE.MeshStandardMaterial({color:0x171f20,metalness:.5,roughness:.9});
  const concrete=new THREE.MeshStandardMaterial({color:0x66665e,roughness:1});
  const panel=new THREE.MeshStandardMaterial({color:0x59615c,metalness:.55,roughness:.82});
  const red=new THREE.MeshStandardMaterial({color:0xff3a20,emissive:0x8e1608,emissiveIntensity:1.2});
  function beam(a,b,r=.09,mat=steel){
    const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=new THREE.Vector3().subVectors(vb,va);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),5),mat);
    m.position.copy(va).add(vb).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());g.add(m);
    // Коллизия только у отдельных деталей возле земли: низкие балки — сегментами,
    // высокие опоры — небольшим контуром у основания. Верхние фермы остаются проходимыми.
    if(a[1]<=2.2 && b[1]<=2.2){
      radarSolidBeams.push({ax:a[0],az:a[2],bx:b[0],bz:b[2],r:r+.10});
    }else if(a[1]<=1.05 || b[1]<=1.05){
      const p=a[1]<=1.05?a:b;
      radarSolidBeams.push({ax:p[0],az:p[2],bx:p[0],bz:p[2],r:r+.18});
    }
    return m;
  }
  function box(w,h,d,mat,px,py,pz,collide=true){
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(px,py,pz);g.add(m);
    if(collide) radarSolidBoxes.push({minX:px-w/2,maxX:px+w/2,minZ:pz-d/2,maxZ:pz+d/2});
    return m;
  }
  // Длинная бетонная полоса основания вдоль всей антенны
  box(142,.45,20,concrete,0,.22,0,false);
  // Основной ряд высоких решётчатых мачт — характерный силуэт «Дуги»
  const towerXs=[];
  for(let i=0;i<22;i++){
    const tx=-66+i*6.25, h=25+Math.sin(i/21*Math.PI)*11;
    towerXs.push([tx,h]);
    const zf=-3.7,zb=3.7, y0=.5, y1=h;
    // четыре угловые стойки и широкие поперечные связи
    for(const zz of [zf,zb]) for(const dx of [-1.25,1.25]) beam([tx+dx,y0,zz],[tx+dx*.72,y1,zz*.72],.14,steel);
    for(let y=4;y<h;y+=4){
      const t=y/h;
      const half=1.25-.35*t, dep=3.7-.8*t;
      for(const zz of [-dep,dep]) beam([tx-half,y,zz],[tx+half,y,zz],.075,rust);
      beam([tx-half,y,-dep],[tx+half,y+4,dep],.055,dark);
      beam([tx+half,y,-dep],[tx-half,y+4,dep],.055,dark);
      beam([tx-half,y,0],[tx+half,y,0],.045,steel);
    }
    beam([tx-1.25,h,zf],[tx+1.25,h,zf],.09,rust);
    beam([tx-1.25,h,zb],[tx+1.25,h,zb],.09,rust);
    // короткие поперечины и тонкие антенные элементы на каждой секции
    for(let y=5;y<h-1;y+=2.1){
      beam([tx-1.1,y,-4.1],[tx-1.1,y,4.1],.035,panel);
      beam([tx+1.1,y,-4.1],[tx+1.1,y,4.1],.035,panel);
      beam([tx-1.1,y,0],[tx+1.1,y,0],.035,panel);
    }
    if(i%3===0){
      const lamp=new THREE.Mesh(new THREE.SphereGeometry(.2,9,7),red.clone());
      lamp.position.set(tx,h+.19,0);g.add(lamp);
      const beacon=new THREE.PointLight(0xff2414,0,13,2);beacon.position.copy(lamp.position);g.add(beacon);
      radarBlinkLights.push({material:lamp.material,light:beacon,phase:i*.37});
    }
  }
  // Связываем соседние высокие секции в единый пространственный каркас.
  for(let i=0;i<towerXs.length-1;i++){
    const [xa,ha]=towerXs[i], [xb,hb]=towerXs[i+1], top=Math.min(ha,hb);
    // Продольные связи привязаны непосредственно к наклонным стойкам обеих башен,
    // а не к условным координатам за их пределами.
    for(const xSide of [-1,1]) for(const zSide of [-1,1]){
      for(let y=4;y<top-1;y+=4){
        const halfA=1.25-.35*(y/ha), halfB=1.25-.35*(y/hb);
        const depA=3.7-.8*(y/ha), depB=3.7-.8*(y/hb);
        const pA=[xa+xSide*halfA,y,zSide*depA];
        const pB=[xb+xSide*halfB,y,zSide*depB];
        beam(pA,pB,.085,steel);
        const y2=Math.min(y+4,top-0.35);
        const halfA2=1.25-.35*(y2/ha), halfB2=1.25-.35*(y2/hb);
        const depA2=3.7-.8*(y2/ha), depB2=3.7-.8*(y2/hb);
        beam(pA,[xb+xSide*halfB2,y2,zSide*depB2],.05,rust);
        beam([xa-xSide*halfA,y,-zSide*depA],[xb-xSide*halfB2,y2,-zSide*depB2],.05,dark);
      }
    }
    // Связи в поперечном направлении сходятся с узлами боковых ферм.
    for(let y=4;y<top-1;y+=4){
      const depA=3.7-.8*(y/ha), depB=3.7-.8*(y/hb);
      beam([xa,y,-depA],[xa,y,depA],.06,panel);
      beam([xa,y,0],[xb,y,0],.065,steel);
    }
  }
  // Непрерывные продольные связи, подчёркивающие километровую длину массива
  for(const y of [8,14,20,26,32,36]){
    const valid=towerXs.filter(t=>t[1]>y+1);
    if(valid.length>1){beam([valid[0][0],y,-3.7],[valid[valid.length-1][0],y,-3.7],.07,steel);beam([valid[0][0],y,3.7],[valid[valid.length-1][0],y,3.7],.07,rust);}
  }
  // Вторая, более низкая параллельная антенная линия
  for(let i=0;i<29;i++){
    const tx=-68+i*4.85,h=10.5;
    for(const zz of [-8.2,-6.2]){
      beam([tx-.42,.5,zz],[tx-.28,h,zz],.075,dark);
      beam([tx+.42,.5,zz],[tx+.28,h,zz],.075,steel);
      for(let y=2.5;y<h;y+=2.5){
        beam([tx-.42,y,zz],[tx+.42,y,zz],.045,rust);
        beam([tx-.42,y,zz],[tx+.42,y+2.5,zz],.035,dark);
        beam([tx+.42,y,zz],[tx-.42,y+2.5,zz],.035,dark);
      }
    }
  }
  // Низкая параллельная антенна: непрерывные продольные связи и поперечные
  // перемычки соединяют все её стойки в один каркас; башмаки касаются бетона.
  for(const zz of [-8.2,-6.2]){
    beam([-68,.52,zz],[70,.52,zz],.09,steel);
    beam([-68,2.5,zz],[70,2.5,zz],.055,rust);
  }
  for(let tx=-68;tx<=70;tx+=4.85){
    beam([tx,.52,-8.2],[tx,.52,-6.2],.07,panel);
    box(.9,.12,1.0,concrete,tx,.51,-7.2,false);
  }
  // Башмаки основных мачт: визуально связывают четыре стойки с бетонной плитой.
  for(const [tx] of towerXs){
    for(const zz of [-3.45,3.45]) for(const dx of [-1.15,1.15])
      box(.62,.18,.62,concrete,tx+dx,.50,zz,false);
  }
  // Техническая площадка сбоку: длинный ангар, контейнеры и аппаратура
  // Ангар: объём и крыша не запирают проход; коллизия только у четырёх стен.
  box(27,5.4,11,concrete,-48,3.1,17,false);
  box(27,.35,11,dark,-48,5.85,17,false);
  box(27,5.2,.28,concrete,-48,3.1,11.5,true);
  box(27,5.2,.28,concrete,-48,3.1,22.5,true);
  box(.28,5.2,11,concrete,-61.5,3.1,17,true);
  box(.28,5.2,11,concrete,-34.5,3.1,17,true);
  for(let k=0;k<8;k++){
    box(.12,4.2,.12,rust,-60+k*3.3,3.2,11.4);
    box(.12,4.2,.12,rust,-60+k*3.3,3.2,22.6);
  }
  for(let k=0;k<5;k++) box(3.2,1.8,2.4,panel,-24+k*5.4,1.35,16);
  box(8,2.1,4,steel,54,1.5,15);
  box(5,1.5,3,rust,63,1.1,17);
  // Кабельные эстакады физически связывают антенну с техническим ангаром.
  for(let xx=-61;xx<=-35;xx+=6){
    beam([xx,.55,4.2],[xx,2.1,10.8],.09,rust);
    beam([xx,2.1,10.8],[xx+6,2.1,10.8],.065,steel);
  }
  // Вышка связи и кабельные опоры у технического корпуса
  for(const zz of [12,22]){
    beam([-31,.5,zz],[-31,15,zz],.16,steel);
    beam([-34,.5,zz],[-28,15,zz],.1,rust);
    beam([-28,.5,zz],[-34,15,zz],.1,rust);
  }
  beam([-31,15,12],[-31,15,22],.09,dark);
  // Ограждение по периметру объекта
  for(let xx=-74;xx<=74;xx+=4){
    beam([xx,.2,28],[xx,2.2,28],.045,dark);
    beam([xx,.2,-15],[xx,2.2,-15],.045,dark);
    if(xx<74){beam([xx,2.2,28],[xx+4,2.2,28],.035,rust);beam([xx,2.2,-15],[xx+4,2.2,-15],.035,rust);}
  }
  for(const zz of [-15,28]){beam([-74,.2,zz],[74,.2,zz],.045,dark);}
  g.position.set(x,getTerrainHeight(x,z),z);scene.add(g);return g;
}
const radarStation=addRadarStation(0,-120);
// Единая высота поверхности: на бетонной плите РЛС аномалии и артефакты
// размещаются на верхней грани плиты, а за её пределами — на рельефе.
function getWorldGroundHeight(x,z){
  const terrain=getTerrainHeight(x,z);
  const lx=x-radarStation.position.x, lz=z-radarStation.position.z;
  if(Math.abs(lx)<=71 && Math.abs(lz)<=10) return Math.max(terrain,radarStation.position.y+.445);
  return terrain;
}
// Переводим физические контуры из локальных координат РЛС в координаты мира.
for(const c of radarSolidBoxes){c.minX+=radarStation.position.x;c.maxX+=radarStation.position.x;c.minZ+=radarStation.position.z;c.maxZ+=radarStation.position.z;}
for(const c of radarSolidBeams){c.ax+=radarStation.position.x;c.bx+=radarStation.position.x;c.az+=radarStation.position.z;c.bz+=radarStation.position.z;}
function resolveRadarCollision(entity,bodyRadius=.42){
  // Несколько проходов нужны в местах, где стойки, фермы и оборудование сходятся вместе.
  for(let pass=0;pass<3;pass++){
    for(const b of radarSolidBoxes){
      const minX=b.minX-bodyRadius,maxX=b.maxX+bodyRadius,minZ=b.minZ-bodyRadius,maxZ=b.maxZ+bodyRadius;
      if(entity.position.x>minX&&entity.position.x<maxX&&entity.position.z>minZ&&entity.position.z<maxZ){
        const pushes=[entity.position.x-minX,maxX-entity.position.x,entity.position.z-minZ,maxZ-entity.position.z];
        const m=Math.min(...pushes);
        if(m===pushes[0]) entity.position.x=minX; else if(m===pushes[1]) entity.position.x=maxX;
        else if(m===pushes[2]) entity.position.z=minZ; else entity.position.z=maxZ;
      }
    }
    for(const b of radarSolidBeams){
      const vx=b.bx-b.ax,vz=b.bz-b.az,len2=vx*vx+vz*vz;
      const t=len2?Math.max(0,Math.min(1,((entity.position.x-b.ax)*vx+(entity.position.z-b.az)*vz)/len2)):0;
      const px=b.ax+t*vx,pz=b.az+t*vz,dx=entity.position.x-px,dz=entity.position.z-pz;
      const minD=bodyRadius+b.r,dist=Math.hypot(dx,dz);
      if(dist<minD){const nx=dist>.001?dx/dist:(-vz/(Math.sqrt(len2)||1)),nz=dist>.001?dz/dist:(vx/(Math.sqrt(len2)||1));entity.position.x=px+nx*minD;entity.position.z=pz+nz*minD;}
    }
  }
}

function addResource(type, x, z){
  let mesh, hp, radius;
  if(type==='tree'){
    const g = new THREE.Group();
    if(!addResource.treeTrunkGeo) addResource.treeTrunkGeo=new THREE.CylinderGeometry(.25,.35,2.5,6);
    if(!addResource.treeCone1) addResource.treeCone1=new THREE.ConeGeometry(1.4,2,6);
    if(!addResource.treeCone2) addResource.treeCone2=new THREE.ConeGeometry(1.1,1.8,6);
    if(!addResource.treeTrunkMat) addResource.treeTrunkMat=new THREE.MeshStandardMaterial({color:0x4a3020,flatShading:true});
    if(!addResource.treeLeafMat) addResource.treeLeafMat=new THREE.MeshStandardMaterial({color:0x3a5a2a,flatShading:true,roughness:1});
    const trunk=new THREE.Mesh(addResource.treeTrunkGeo,addResource.treeTrunkMat); trunk.position.y=1.25; g.add(trunk);
    const c1=new THREE.Mesh(addResource.treeCone1,addResource.treeLeafMat); c1.position.y=2.5; g.add(c1);
    const c2=new THREE.Mesh(addResource.treeCone2,addResource.treeLeafMat); c2.position.y=3.5; g.add(c2);
    mesh=g; hp=3; radius=.6;
  } else if(type==='rock'){
    // Irregular layered boulder silhouette with shared cached geometries/materials.
    const g=new THREE.Group();
    // Stable cached smooth boulder mesh: remove noisy per-vertex displacement that made facets look fractured.
    if(!addResource.rockGeo) addResource.rockGeo=new THREE.DodecahedronGeometry(1,1);
    if(!addResource.rockMat) addResource.rockMat=new THREE.MeshStandardMaterial({color:0x737b80,roughness:.96,flatShading:false});
    if(!addResource.rockDarkMat) addResource.rockDarkMat=new THREE.MeshStandardMaterial({color:0x555d62,roughness:1,flatShading:false});
    const main=new THREE.Mesh(addResource.rockGeo,addResource.rockMat); main.scale.set(1.12,.82,.94); main.position.y=.62; main.rotation.set(.08,Math.random()*Math.PI,.04); g.add(main);
    if(!addResource.rockSmallGeo) addResource.rockSmallGeo=new THREE.DodecahedronGeometry(.22,0);
    const pebble=new THREE.Mesh(addResource.rockSmallGeo,addResource.rockDarkMat); pebble.position.set(.46,.18,.32); pebble.rotation.set(.3,.8,.1); g.add(pebble);
    mesh=g; hp=4; radius=.85;
  } else {
    // Fuller, multi-tone shrub cluster using reusable low-poly spheres.
    const g=new THREE.Group();
    if(!addResource.bushGeo) addResource.bushGeo=new THREE.IcosahedronGeometry(.48,1);
    if(!addResource.bushMats) addResource.bushMats=[0x315f35,0x477b3d,0x254b2c].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true}));
    const parts=[[-.28,.35,0,.9], [.22,.5,.08,1.05], [.5,.3,-.08,.78], [-.05,.65,-.25,.82]];
    parts.forEach((p,i)=>{const b=new THREE.Mesh(addResource.bushGeo,addResource.bushMats[i%3]); b.position.set(p[0],p[1],p[2]); b.scale.set(p[3],p[3]*.82,p[3]); b.rotation.set(i*.17,i*.7,i*.13); g.add(b);});
    mesh=g; mesh.position.y=.45; hp=2; radius=.7;
  }
  mesh.position.x = x;
  mesh.position.z = z;
  mesh.position.y = (mesh.position.y||0) + Math.max(0, getTerrainHeight(x, z));
  scene.add(mesh);
  worldObjects.push({mesh,type,hp,radius,spawnX:x,spawnZ:z});
}
function hasResourceAt(type,x,z,epsilon=0.05){
  return worldObjects.some(o=>o.type===type && Math.abs(o.spawnX-x)<epsilon && Math.abs(o.spawnZ-z)<epsilon);
}


function spawnResourceRandom(minSpacing=3.2){
  for(let attempt=0;attempt<120;attempt++){
    const a=Math.random()*Math.PI*2, r=rand(12,95), x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Math.hypot(x-SAFE_ZONE_CENTER.x,z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS+3) continue;
    if(shelters.some(h=>Math.hypot(h.x-x,h.z-z)<h.radius+3)) continue;
    if(worldObjects.some(o=>Math.hypot(o.spawnX-x,o.spawnZ-z)<minSpacing)) continue;
    const type=Math.random()<.55?'tree':(Math.random()<.55?'rock':'bush');
    addResource(type,x,z); return true;
  }
  return false;
}
function ensureResourcePopulation(target=55){
  let tries=0;
  while(worldObjects.length<target && tries<target*80){ if(spawnResourceRandom()){} tries++; }
}
for(let placed=0; placed<55; placed++) if(!spawnResourceRandom()) break;

const groundItems = [];
const dropColors = {wood:0x8b5a2b, stone:0x999999, fiber:0x33cc33, vodka:0x88ccff,
                    medkit:0xff4444, antirad:0x44ff88, ammo:0xcccc44,
                    pistol:0x888888, rifle:0x666666,
                    artifact_medusa:0x33ffff, artifact_soul:0xaa66ff, artifact_flash:0xffff66, artifact_rose:0xff66aa, artifact_magnet:0x88aaff, artifact_fruit:0x99dd66, artifact_fire:0xff5522, artifact_red_crystal:0xff2222, artifact_sun:0xffcc33, artifact_battery:0x66ddff, artifact_prism:0xbb88ff, artifact_comet:0xeeeeff, artifact_jelly:0x55ff99, artifact_snake_eye:0x66bb44, artifact_slime:0x66ffcc, artifact_gravi:0x777777, artifact_bubble:0x88ddff, artifact_sparkler:0xffee55, artifact_medical:0x55ffbb, artifact_crystal:0x66bbff, artifact_heart:0xff5577, artifact_wind:0xaaddff, artifact_lichen:0x55aa55, artifact_thunder:0xaaaaff, artifact_echo:0xddbbff, artifact_void:0x332244, artifact_gold:0xffcc44, artifact_anchor:0x8899aa, artifact_ember:0xff7733, artifact_frost:0xaaddff, artifact_scarab:0x99aa33, artifact_moon:0xaaaaff, artifact_spore:0x88bb66, artifact_shell:0xddbb99, artifact_storm:0x6688ff, artifact_blood:0xaa2244, artifact_mirror:0x99ddff, artifact_crown:0xffdd55, artifact_comet_tail:0xffaa66, artifact_heartwood:0x44bb77, dog_head:0x987b62, dog_tail:0x76533d, dog_meat:0x9b3737, snork_meat:0x7b4242, snork_eye:0x66aa88, snork_brain:0xb77a99, boar_meat:0x9b3737, boar_tusks:0xe7dfc6, boar_leg:0x805b4b, helmet_basic:0xaaaaaa, suit_basic:0x557799, backpack_basic:0x665533};

function createArtifactModel(id,size=0.48){
  const group=new THREE.Group();
  let seed=0;for(let i=0;i<id.length;i++)seed=(seed*31+id.charCodeAt(i))>>>0;
  const type=seed%12, color=dropColors[id]||0x9bdcff;
  const material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.48,metalness:.42,roughness:.28,flatShading:true});
  const dark=new THREE.MeshStandardMaterial({color:0x25303a,metalness:.65,roughness:.32});
  let geometry;
  switch(type){
    case 0: geometry=new THREE.IcosahedronGeometry(size,1);break;
    case 1: geometry=new THREE.DodecahedronGeometry(size,0);break;
    case 2: geometry=new THREE.TetrahedronGeometry(size*1.18,0);break;
    case 3: geometry=new THREE.TorusKnotGeometry(size*.56,size*.19,48,8,2+(seed%3),3);break;
    case 4: geometry=new THREE.TorusGeometry(size*.68,size*.22,10,24);break;
    case 5: geometry=new THREE.ConeGeometry(size*.72,size*1.65,5+(seed%5));break;
    case 6: geometry=new THREE.SphereGeometry(size*.78,12,9);break;
    case 7: geometry=new THREE.CylinderGeometry(size*.25,size*.78,size*1.35,6);break;
    case 8: geometry=new THREE.OctahedronGeometry(size,0);break;
    case 9: geometry=new THREE.CapsuleGeometry(size*.35,size*.75,4,8);break;
    case 10: geometry=new THREE.TorusGeometry(size*.42,size*.12,6,18);break;
    default: geometry=new THREE.IcosahedronGeometry(size*.9,2);break;
  }
  const core=new THREE.Mesh(geometry,material);core.rotation.set((seed%7)*.17,(seed%11)*.21,(seed%5)*.19);group.add(core);
  const ornaments=1+(seed%4);
  for(let i=0;i<ornaments;i++){
    const a=(i/ornaments)*Math.PI*2+(seed%13)*.11;
    const radius=size*(.62+(i%2)*.22), h=((i%3)-1)*size*.28;
    const spike=new THREE.Mesh(new THREE.ConeGeometry(size*.12,size*(.42+(i%3)*.12),4),i%2?material:dark);
    spike.position.set(Math.cos(a)*radius,h,Math.sin(a)*radius);spike.rotation.z=Math.cos(a)*.7;spike.rotation.x=Math.sin(a)*.7;group.add(spike);
  }
  if(seed%3===0){const ring=new THREE.Mesh(new THREE.TorusGeometry(size*.92,size*.045,5,28),material);ring.rotation.set(Math.PI/2,(seed%5)*.25,(seed%7)*.18);group.add(ring);}
  if(seed%4===1){const bead=new THREE.Mesh(new THREE.SphereGeometry(size*.18,8,6),dark);bead.position.set(0,size*.82,0);group.add(bead);}
  group.userData.artifactId=id;
  return group;
}

function dropItem(id, cnt, x, z, y=0.5, artifactMeta=null){
  if(!cnt || cnt<=0) return;
  const baseColor = dropColors[id]||0xffffff;
  const mat = new THREE.MeshStandardMaterial({color:baseColor, flatShading:true});
  mat.emissive = new THREE.Color(baseColor);
  mat.emissiveIntensity = 0.25;
  const mesh = ITEM_DEFS[id]?.artifact ? createArtifactModel(id,.24) : new THREE.Mesh(new THREE.OctahedronGeometry(.22), mat);
  if(ITEM_DEFS[id]?.artifact){mesh.traverse(o=>{if(o.material){o.material.emissive=new THREE.Color(baseColor);o.material.emissiveIntensity=.25;}});}
  mesh.position.set(x, getTerrainHeight(x, z) + y, z);
  scene.add(mesh);
  groundItems.push({mesh,id,cnt,quality:artifactMeta?.quality,rarity:artifactMeta?.rarity});
}

const anomalies = [];
const animatedAnomalies=[];
let campfireAnimation=null;
const ARTIFACT_ANOMALY_POOLS = {
  gravity:['artifact_rose','artifact_magnet','artifact_fruit','artifact_soul','artifact_medusa','artifact_gravi','artifact_wind','artifact_void','artifact_anchor','artifact_mirror'],
  thermal:['artifact_fire','artifact_red_crystal','artifact_sun','artifact_flash','artifact_heart','artifact_gold','artifact_ember','artifact_blood','artifact_crown'],
  electric:['artifact_battery','artifact_prism','artifact_comet','artifact_sparkler','artifact_crystal','artifact_thunder','artifact_echo','artifact_storm','artifact_comet_tail'],
  bio:['artifact_jelly','artifact_snake_eye','artifact_slime','artifact_bubble','artifact_medical','artifact_lichen','artifact_frost','artifact_scarab','artifact_moon','artifact_spore','artifact_shell','artifact_heartwood']
};
Object.entries(ARTIFACT_ANOMALY_POOLS).forEach(([type,ids])=>ids.forEach((id,index)=>{
  const d=ITEM_DEFS[id]; if(!d)return; d.artifactType=type;
  const n=index+1;
  if(type==='gravity'){
    d.capacity=(d.capacity||0)+[2,4,6,3,8,5,7,10,4,6][index];
    d.jump=(d.jump||0)+[.02,.04,.06,.03,.08,.05,.07,.10,.04,.06][index];
    if(index%3===0)d.speed=(d.speed||1)*1.03;
    if(index%4===2)d.damageResist=(d.damageResist||0)-.025;
  }else if(type==='thermal'){
    d.hpRate=(d.hpRate||0)+[.4,.7,1.1,.5,1.4,.8,1.8,1.2,2.1][index];
    d.thermalResist=(d.thermalResist||0)+[.025,.04,.06,.03,.08,.045,.10,.07,.12][index];
    if(index%3===1)d.speed=(d.speed||1)*.98;
    if(index%4===0)d.radRate=(d.radRate||0)+.6;
  }else if(type==='electric'){
    d.weaponDamage=(d.weaponDamage||0)+[.025,.04,.055,.035,.07,.05,.085,.065,.10][index];
    d.critChance=(d.critChance||0)+[.01,.015,.02,.012,.025,.018,.03,.022,.035][index];
    d.electricResist=(d.electricResist||0)+[.025,.035,.045,.03,.055,.04,.07,.05,.085][index];
    if(index%3===0)d.speed=(d.speed||1)*1.025;
    if(index%4===2)d.radRate=(d.radRate||0)+.5;
  }else if(type==='bio'){
    d.hpRate=(d.hpRate||0)+[.6,.8,1.0,.7,1.3,1.1,1.5,.9,1.7,1.2,1.9,2.2][index];
    d.bioResist=(d.bioResist||0)+[.025,.035,.045,.03,.06,.05,.07,.04,.08,.055,.09,.11][index];
    if(index%3===0)d.radResist=(d.radResist||0)+.025;
    if(index%4===1)d.damageResist=(d.damageResist||0)-.02;
  }
}));

const ANOMALY_INFO = {
  gravity:{name:'Воронка',color:0x9b72ff},
  thermal:{name:'Жарка',color:0xff6b2b},
  electric:{name:'Электра',color:0x45dfff},
  bio:{name:'Кисель',color:0x72ff79},
  hazard:{name:'Аномалия',color:0x66ff33}
};
function spawnAnomaly(x, z, savedRadius, kind='hazard', artifactId=null){
  while(anomalies.length>=25){const oldest=anomalies.shift();if(oldest){scene.remove(oldest.mesh);if(oldest.artifactMesh)scene.remove(oldest.artifactMesh);}}
  const r = Number.isFinite(savedRadius) ? Math.max(1,Math.min(8,savedRadius)) : rand(2, 4);
  const info=ANOMALY_INFO[kind]||ANOMALY_INFO.hazard;
  let geometry;
  // Для огненной и электрической аномалий базовая сфера почти прозрачна:
  // сам эффект создают отдельные частицы и разряды вокруг артефакта.
  if(kind==='bio') geometry=new THREE.TorusKnotGeometry(r*.52,.16,48,8);
  else geometry=new THREE.SphereGeometry(r,12,12);
  const mesh = new THREE.Mesh(geometry,
    new THREE.MeshBasicMaterial({color:info.color, transparent:true, opacity:(kind==='thermal'||kind==='electric')?.025:.15, side:THREE.DoubleSide}));
  mesh.position.set(x, getWorldGroundHeight(x, z) + 1, z);
  mesh.userData.effectParts=[];
  if(kind==='thermal'){
    const fireMats=[0xff3b12,0xff7624,0xffc247].map(color=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.82, blending:THREE.AdditiveBlending,depthWrite:false}));
    for(let i=0;i<22;i++){
      const angle=Math.random()*Math.PI*2, radius=rand(.25,r*.82), h=rand(.25,r*1.35);
      const flame=new THREE.Mesh(new THREE.ConeGeometry(rand(.045,.11),rand(.22,.52),5),fireMats[i%fireMats.length]);
      flame.position.set(Math.cos(angle)*radius,h,Math.sin(angle)*radius);
      flame.rotation.z=(Math.random()-.5)*.55;
      flame.userData={baseX:flame.position.x,baseZ:flame.position.z,baseY:h,phase:Math.random()*Math.PI*2,speed:rand(1.2,2.8)};
      mesh.add(flame); mesh.userData.effectParts.push(flame);
    }
  } else if(kind==='electric'){
    const boltMats=[0x8df5ff,0x35cfff,0xffffff].map(color=>new THREE.LineBasicMaterial({color,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));
    // Несколько ветвящихся зигзагообразных молний расходятся радиально в плоскости земли.
    for(let i=0;i<16;i++){
      const angle=(i/16)*Math.PI*2+Math.random()*.12, length=r*rand(.72,1.18);
      const side=new THREE.Vector3(-Math.sin(angle),0,Math.cos(angle));
      const dir=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));
      const points=[]; const steps=6;
      for(let j=0;j<=steps;j++){
        const t=j/steps, offset=(j===0||j===steps)?0:(Math.random()-.5)*.34;
        points.push(new THREE.Vector3(dir.x*length*t+side.x*offset, .48+Math.sin(t*Math.PI)*rand(-.08,.08), dir.z*length*t+side.z*offset));
      }
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),boltMats[i%boltMats.length]);
      line.userData={phase:Math.random()*Math.PI*2}; mesh.add(line); mesh.userData.effectParts.push(line);
    }
  }
  scene.add(mesh);
  let artifactMesh=null;
  if(artifactId && ITEM_DEFS[artifactId]){
    const artifactColor=dropColors[artifactId]||0xffffff;
    artifactMesh=createArtifactModel(artifactId,.48);
    artifactMesh.position.set(x,getWorldGroundHeight(x,z)+1.55,z);
    scene.add(artifactMesh);
  }
  const anomaly={mesh, artifactMesh, r, x, z, kind, artifactId}; anomalies.push(anomaly); animatedAnomalies.push(anomaly);
}
function spawnArtifactAnomalies(){
  const kinds=Object.keys(ARTIFACT_ANOMALY_POOLS);
  const created=[];
  for(let i=0;i<4;i++){
    let placed=false;
    for(let attempt=0;attempt<45&&!placed;attempt++){
      const a=Math.random()*Math.PI*2, distance=rand(16,48);
      const x=player.position.x+Math.cos(a)*distance;
      const z=player.position.z+Math.sin(a)*distance;
      if(Math.hypot(x-SAFE_ZONE_CENTER.x,z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS+8) continue;
      if(shelters.some(h=>Math.hypot(h.x-x,h.z-z)<h.radius+7)) continue;
      if(anomalies.some(o=>Math.hypot(o.x-x,o.z-z)<10)) continue;
      const kind=kinds[Math.floor(Math.random()*kinds.length)];
      const pool=ARTIFACT_ANOMALY_POOLS[kind];
      const artifactId=pool[Math.floor(Math.random()*pool.length)];
      spawnAnomaly(x,z,rand(2.2,3.8),kind,artifactId);
      created.push(ANOMALY_INFO[kind].name);
      placed=true;
    }
  }
  if(created.length){
    log('☢️ ВЫБРОС ОТСТУПИЛ. Зона изменилась: обнаружены новые аномалии — '+created.join(', ')+'. Будь осторожен: каждая из них смертельно опасна. Проверь местность детектором и ищи свечение артефактов.',7500);
    saveState();
  } else log('☢️ Выброс закончился. Новых аномалий поблизости обнаружить не удалось, но старые ловушки Зоны никуда не исчезли.',6000);
}
for(let i=0;i<8;i++){
  let placed=false;
  for(let attempt=0;attempt<40&&!placed;attempt++){
    const a=Math.random()*Math.PI*2,r=rand(20,90),x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(shelters.some(h=>Math.hypot(h.x-x,h.z-z)<h.radius+8)) continue;
    if(Math.hypot(x-SAFE_ZONE_CENTER.x,z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS+8) continue;
    spawnAnomaly(x,z); placed=true;
  }
}

function makeLog(x, z, angle, length){
  const g = new THREE.Group();
  const logMat = new THREE.MeshStandardMaterial({color:0x6a4a2a, flatShading:true, roughness:.9});
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, length, 8), logMat);
  log.rotation.z = Math.PI/2; log.position.y = 0.3; g.add(log);
  g.position.set(x, getTerrainHeight(x, z), z);
  g.rotation.y = angle;
  scene.add(g);
}

for(let i=0;i<24;i++){
  const angle = (i / 24) * Math.PI * 2;
  const x = SAFE_ZONE_CENTER.x + Math.cos(angle) * SAFE_ZONE_RADIUS;
  const z = SAFE_ZONE_CENTER.z + Math.sin(angle) * SAFE_ZONE_RADIUS;
  const arcLen = (2 * Math.PI * SAFE_ZONE_RADIUS) / 24;
  makeLog(x, z, angle + Math.PI/2, arcLen + 0.4);
}

const floorGeo = new THREE.CircleGeometry(SAFE_ZONE_RADIUS - 0.3, 32);
const floorMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.06, side:THREE.DoubleSide, depthWrite:false});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI/2;
floor.position.set(SAFE_ZONE_CENTER.x, getTerrainHeight(SAFE_ZONE_CENTER.x, SAFE_ZONE_CENTER.z) + 0.05, SAFE_ZONE_CENTER.z);
floor.renderOrder = 2;
scene.add(floor);

const ringGeo = new THREE.RingGeometry(SAFE_ZONE_RADIUS - 0.4, SAFE_ZONE_RADIUS - 0.15, 48);
const ringMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.25, side:THREE.DoubleSide, depthWrite:false});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI/2;
ring.position.set(SAFE_ZONE_CENTER.x, getTerrainHeight(SAFE_ZONE_CENTER.x, SAFE_ZONE_CENTER.z) + 0.06, SAFE_ZONE_CENTER.z);
ring.renderOrder = 3;
scene.add(ring);

const traderPos = new THREE.Vector3(
  SAFE_ZONE_CENTER.x + 2.0,
  getTerrainHeight(SAFE_ZONE_CENTER.x + 2.0, SAFE_ZONE_CENTER.z),
  SAFE_ZONE_CENTER.z + 0.6
);

// Small helpers for a more natural low-poly human silhouette.
function makeLimb(parent, a, b, radius, material, radial=8){
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const delta = new THREE.Vector3().subVectors(vb, va);
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, Math.max(.02, delta.length()-radius*2), 4, radial),
    material
  );
  mesh.position.copy(va).add(vb).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), delta.normalize());
  parent.add(mesh);
  return mesh;
}

const campfirePos = new THREE.Vector3(
  SAFE_ZONE_CENTER.x - 1.0,
  getTerrainHeight(SAFE_ZONE_CENTER.x - 1.0, SAFE_ZONE_CENTER.z - 0.4),
  SAFE_ZONE_CENTER.z - 0.4
);

// Campfire stones and crossed firewood.
(function(){
  const stones = new THREE.MeshStandardMaterial({color:0x62666a, roughness:1, flatShading:true});
  const wood = new THREE.MeshStandardMaterial({color:0x49301d, roughness:1, flatShading:true});
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2;
    const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(.22,0),stones);
    stone.position.set(campfirePos.x+Math.cos(a)*.72,campfirePos.y+.13,campfirePos.z+Math.sin(a)*.72);
    stone.scale.set(1,.72,1);
    scene.add(stone);
  }
  for(let i=0;i<3;i++){
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.11,.13,1.05,7),wood);
    log.rotation.z=Math.PI/2;
    log.rotation.y=i*Math.PI/3;
    log.position.set(campfirePos.x,campfirePos.y+.16,campfirePos.z);
    scene.add(log);
  }
  const flameMat1=new THREE.MeshBasicMaterial({color:0xff8a22});
  const flameMat2=new THREE.MeshBasicMaterial({color:0xffd34e});
  const flame1=new THREE.Mesh(new THREE.ConeGeometry(.34,.95,7),flameMat1);
  flame1.position.set(campfirePos.x,campfirePos.y+.62,campfirePos.z);
  const flame2=new THREE.Mesh(new THREE.ConeGeometry(.19,.68,7),flameMat2);
  flame2.position.set(campfirePos.x+.08,campfirePos.y+.55,campfirePos.z-.04);
  scene.add(flame1,flame2);
  campfireAnimation={flame1,flame2,flameMat1,flameMat2,base1:flame1.scale.clone(),base2:flame2.scale.clone()};
  const fireLight=new THREE.PointLight(0xff8a32,1.7,10,2);
  fireLight.position.set(campfirePos.x,campfirePos.y+1.0,campfirePos.z);
  scene.add(fireLight); if(campfireAnimation)campfireAnimation.light=fireLight;
})();

// Borodach: seated posture, head, neck, jacket, arms, hands, bent legs and boots.
(function(){
  const g=new THREE.Group();
  const jacket=new THREE.MeshStandardMaterial({color:0x596047,roughness:.98});
  const jacketDark=new THREE.MeshStandardMaterial({color:0x343b30,roughness:1});
  const pants=new THREE.MeshStandardMaterial({color:0x343b35,roughness:1,flatShading:true});
  const skin=new THREE.MeshStandardMaterial({color:0xd6a47e,roughness:.9,flatShading:true});
  const shirt=new THREE.MeshStandardMaterial({color:0x8c8065,roughness:1});
  const capMat=new THREE.MeshStandardMaterial({color:0x3d382c,roughness:1,flatShading:true});
  const bootMat=new THREE.MeshStandardMaterial({color:0x292521,roughness:1,flatShading:true});

  // Wooden stool/crate beneath him.
  const seat=new THREE.Mesh(new THREE.BoxGeometry(.95,.16,.72),new THREE.MeshStandardMaterial({color:0x60452d,roughness:1}));
  seat.position.set(0,.55,0); g.add(seat);
  for(const x of [-.34,.34]) for(const z of [-.23,.23]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.09,.55,.09),jacketDark);
    leg.position.set(x,.28,z); g.add(leg);
  }

  // Pelvis and torso lean slightly forward toward the fire.
  const pelvis=new THREE.Mesh(new THREE.SphereGeometry(.43,10,8),pants);
  pelvis.scale.set(1,.65,.82); pelvis.position.set(0,.82,0); g.add(pelvis);
  const torso=new THREE.Mesh(new THREE.SphereGeometry(1,14,12),jacket);
  torso.scale.set(.48,.53,.34); torso.position.set(0,1.42,-.02);
  torso.rotation.x=-.10; g.add(torso);
  const jacketFront=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),shirt);
  jacketFront.scale.set(.19,.36,.045); jacketFront.position.set(0,1.43,.305); g.add(jacketFront);
  // Soft lapels and jacket seams give the coat a tailored, cloth-like finish.
  for(const side of [-1,1]){
    const lapel=new THREE.Mesh(new THREE.SphereGeometry(1,9,8),jacketDark);
    lapel.scale.set(.075,.28,.035); lapel.position.set(side*.14,1.57,.315);
    lapel.rotation.z=side*.18; g.add(lapel);
    const button=new THREE.Mesh(new THREE.SphereGeometry(.025,7,6),capMat);
    button.position.set(side*.035,1.46,.35); g.add(button);
  }
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.2,8),skin);
  neck.position.set(0,1.94,.02); g.add(neck);

  // Head and recognizable facial features, looking toward the campfire.
  const head=new THREE.Mesh(new THREE.SphereGeometry(.31,12,10),skin);
  head.scale.set(1,.98,.92); head.position.set(0,2.2,.05); g.add(head);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.075,7,6),skin);
  nose.scale.set(.72,.8,1.2); nose.position.set(0,2.17,.34); g.add(nose);
  const eyeMat=new THREE.MeshStandardMaterial({color:0x29231e});
  for(const x of [-.115,.115]){
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),eyeMat);
    eye.position.set(x,2.27,.315); g.add(eye);
  }
  const beard=new THREE.Mesh(new THREE.SphereGeometry(.23,9,7),jacketDark);
  beard.scale.set(1,.52,.7); beard.position.set(0,2.02,.19); g.add(beard);
  // Lower the crown onto the head and overlap it with the brim to eliminate visible gaps.
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.33,12,8,0,Math.PI*2,0,Math.PI/2),capMat);
  cap.scale.set(.99,.52,.97); cap.position.set(0,2.39,.02); g.add(cap);
  const brim=new THREE.Mesh(new THREE.CylinderGeometry(.335,.335,.06,12),capMat);
  brim.position.set(0,2.395,.075); g.add(brim);

  // Legs folded forward in a seated position.
  for(const side of [-1,1]){
    const hip=[side*.23,.82,0];
    const knee=[side*.34,.53,.48];
    const ankle=[side*.34,.22,.34];
    makeLimb(g,hip,knee,.17,pants,8);
    makeLimb(g,knee,ankle,.13,pants,8);
    const boot=new THREE.Mesh(new THREE.BoxGeometry(.23,.16,.4),bootMat);
    boot.position.set(side*.34,.12,.47); g.add(boot);
    // Arms bent at the elbows, hands resting on knees.
    const shoulder=[side*.43,1.72,.02];
    const elbow=[side*.55,1.23,.28];
    const hand=[side*.34,.7,.48];
    makeLimb(g,shoulder,elbow,.13,jacket,8);
    makeLimb(g,elbow,hand,.105,jacket,8);
    const palm=new THREE.Mesh(new THREE.SphereGeometry(.105,7,6),skin);
    palm.position.set(...hand); g.add(palm);
  }

  // Face the fire: the character's local forward (+Z) points toward the fire.
  g.scale.setScalar(.94);
  g.position.copy(traderPos);
  g.rotation.y=Math.atan2(campfirePos.x-traderPos.x,campfirePos.z-traderPos.z);
  scene.add(g);
})();
