// ===== ВРАГИ =====
const enemies = [];
let aimLockEnemy = null;
function makeDog(){
  // STALKER-inspired Blind Dog silhouette: lean scavenger canine, not a wolf.
  const g = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({color:0x6d6252, flatShading:true});
  const dark = new THREE.MeshStandardMaterial({color:0x3d382f, flatShading:true});
  const patch = new THREE.MeshStandardMaterial({color:0x877b65, flatShading:true});
  const eye = new THREE.MeshStandardMaterial({color:0xd3a94c, emissive:0x302000, flatShading:true});
  const torso = new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),fur); torso.scale.set(.83,.78,1.55); torso.position.set(0,.48,-.12); g.add(torso);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(.28,7,5),patch); shoulders.scale.set(1,.9,1.1); shoulders.position.set(0,.55,.38); g.add(shoulders);
  const neck = new THREE.Mesh(new THREE.ConeGeometry(.22,.48,7),fur); neck.rotation.x=-.55; neck.position.set(0,.59,.52); g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),fur); head.scale.set(.92,.78,1.1); head.position.set(0,.75,.76); g.add(head);
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(.13,.38,7),dark); muzzle.rotation.x=Math.PI/2; muzzle.position.set(0,.64,1.0); g.add(muzzle);
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(.12,7,5),dark); jaw.scale.set(1,.5,1.25); jaw.position.set(0,.53,.93); g.add(jaw);
  for(const x of [-.16,.16]){
    const ear=new THREE.Mesh(new THREE.ConeGeometry(.075,.22,5),fur); ear.position.set(x,.94,.69); ear.rotation.z=x<0?.18:-.18; g.add(ear);
    const e=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),eye); e.position.set(x*.65,.78,.92); g.add(e);
  }
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.09,.38,6),fur); tail.rotation.x=-Math.PI/2; tail.position.set(0,.49,-.72); g.add(tail);
  const legPivots=[];
  for(const [x,z] of [[-.19,.42],[.19,.42],[-.18,-.48],[.18,-.48]]){
    const pivot=new THREE.Group(); pivot.position.set(x,.37,z); g.add(pivot);
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.23,3,6),fur); upper.position.y=-.13; pivot.add(upper);
    const lower=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.18,3,6),dark); lower.position.set(0,-.31,.035); pivot.add(lower);
    const paw=new THREE.Mesh(new THREE.SphereGeometry(.085,6,5),dark); paw.scale.set(1,.55,1.35); paw.position.set(0,-.42,.08); pivot.add(paw);
    legPivots.push(pivot);
  }
  return {group:g, legs:legPivots};
}
function makeBoar(){
  // STALKER-style mutant boar silhouette: long low body, wedge head, bristled ridge, curved tusks.
  const g = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({color:0x59432f, flatShading:true});
  const bristle = new THREE.MeshStandardMaterial({color:0x2d261d, flatShading:true});
  const hide = new THREE.MeshStandardMaterial({color:0x786047, flatShading:true});
  const tusk = new THREE.MeshStandardMaterial({color:0xd8c59a, flatShading:true});
  const dark = new THREE.MeshStandardMaterial({color:0x201b16, flatShading:true});
  // Elongated, low-slung body avoids a bear-like round silhouette.
  const body=new THREE.Mesh(new THREE.SphereGeometry(.48,9,6),fur); body.scale.set(.92,.78,1.72); body.position.set(0,.57,-.18); g.add(body);
  const frontMass=new THREE.Mesh(new THREE.SphereGeometry(.38,8,5),fur); frontMass.scale.set(1.02,1.12,1.16); frontMass.position.set(0,.67,.42); g.add(frontMass);
  // Raised coarse mane running along the back.
  for(let i=0;i<7;i++){ const spike=new THREE.Mesh(new THREE.ConeGeometry(.075,.24,5),bristle); spike.position.set(0,.99,.42-i*.19); spike.rotation.x=-.12; g.add(spike); }
  // Narrow, forward-projecting head and tubular snout.
  const head=new THREE.Mesh(new THREE.SphereGeometry(.29,8,6),hide); head.scale.set(1.02,.84,1.18); head.position.set(0,.62,.83); g.add(head);
  const snout=new THREE.Mesh(new THREE.CylinderGeometry(.14,.21,.46,7),hide); snout.rotation.x=Math.PI/2; snout.position.set(0,.47,1.12); g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.16,7,5),dark); nose.scale.set(1.1,.75,.55); nose.position.set(0,.46,1.35); g.add(nose);
  for(const x of [-.22,.22]){
    const ear=new THREE.Mesh(new THREE.ConeGeometry(.115,.27,5),fur); ear.position.set(x,.88,.73); ear.rotation.z=x<0?.48:-.48; g.add(ear);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),new THREE.MeshStandardMaterial({color:0xd89a36,emissive:0x321800})); eye.position.set(x*.75,.68,1.02); g.add(eye);
    // Tusks rise from either side of the muzzle and angle slightly outward.
    const tuskMesh=new THREE.Mesh(new THREE.ConeGeometry(.065,.3,6),tusk); tuskMesh.position.set(x*.88,.48,.92); tuskMesh.rotation.z=x<0?.24:-.24; tuskMesh.rotation.x=Math.PI-.25; g.add(tuskMesh);
  }
  // Leg pivots keep hooves attached during the walk cycle (no independently floating feet).
  const legs=[];
  for(const [x,z] of [[-.22,.48],[.22,.48],[-.23,-.52],[.23,-.52]]){
    const pivot=new THREE.Group(); pivot.position.set(x,.43,z); g.add(pivot); legs.push(pivot);
    const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.075,.22,3,6),fur); leg.position.set(0,-.16,0); pivot.add(leg);
    const hoof=new THREE.Mesh(new THREE.BoxGeometry(.14,.09,.17),dark); hoof.position.set(0,-.35,.04); pivot.add(hoof);
  }
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.045,.28,5),fur); tail.rotation.x=Math.PI/2; tail.position.set(0,.52,-.88); g.add(tail);
  return {group:g, legs};
}
function makeSnork(){
  // STALKER-inspired snork: sharply hunched, low head, elongated arms, ragged suit and gas mask.
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({color:0x928672, flatShading:true});
  const cloth = new THREE.MeshStandardMaterial({color:0x30372e, flatShading:true});
  const rag = new THREE.MeshStandardMaterial({color:0x4c4b3c, flatShading:true});
  const mask = new THREE.MeshStandardMaterial({color:0x202522, flatShading:true});
  const metal = new THREE.MeshStandardMaterial({color:0x77796e, flatShading:true});
  const gash = new THREE.MeshStandardMaterial({color:0x665b4b, flatShading:true});
  // Crooked, forward-leaning torso and pronounced shoulder hump.
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.46,4,7),cloth); torso.position.set(0,.82,-.12); torso.rotation.x=-.62; g.add(torso);
  const hump=new THREE.Mesh(new THREE.SphereGeometry(.28,7,5),rag); hump.scale.set(1.15,1.05,1.35); hump.position.set(0,1.05,-.32); g.add(hump);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),skin); head.scale.set(.95,1.04,.9); head.position.set(0,1.18,.28); g.add(head);
  const hood=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),cloth); hood.scale.set(1.18,.9,1.1); hood.position.set(0,1.24,.22); g.add(hood);
  // Mask faceplate with two conspicuous round eye lenses and lower filter canister.
  const faceplate=new THREE.Mesh(new THREE.BoxGeometry(.3,.16,.1),mask); faceplate.position.set(0,1.15,.46); g.add(faceplate);
  for(const x of [-.105,.105]){
    const lens=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6),metal); lens.position.set(x,1.19,.52); g.add(lens);
  }
  const filter=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.15,8),metal); filter.rotation.x=Math.PI/2; filter.position.set(0,1.04,.49); g.add(filter);
  // Torn cloth strips at the shoulders, not a clean backpack shape.
  for(const x of [-.2,.2]){ const strip=new THREE.Mesh(new THREE.BoxGeometry(.1,.32,.08),rag); strip.position.set(x,.78,.02); strip.rotation.z=x<0?.18:-.18; g.add(strip); }
  const pivots=[];
  // Long, dangling arms with bent elbows and broad hands held close to the ground.
  for(const x of [-.3,.3]){
    const arm=new THREE.Group(); arm.position.set(x,.96,.02); g.add(arm);
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.25,3,6),rag); upper.position.set(0,-.18,0); upper.rotation.z=x<0?.16:-.16; arm.add(upper);
    const fore=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.34,3,6),cloth); fore.position.set(x<0?-.04:.04,-.48,.18); fore.rotation.x=-.3; arm.add(fore);
    const hand=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),skin); hand.scale.set(1.15,.65,1.4); hand.position.set(x<0?-.06:.06,-.7,.29); arm.add(hand); pivots.push(arm);
  }
  // Crouched legs: each leg is a hierarchy so shin and boot move with the thigh.
  for(const x of [-.14,.14]){
    const legPivot=new THREE.Group(); legPivot.position.set(x,.42,-.12); g.add(legPivot); pivots.push(legPivot);
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.26,3,6),skin); thigh.position.set(0,-.08,-.015); thigh.rotation.x=-.28; legPivot.add(thigh);
    const knee=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),skin); knee.position.set(0,-.22,.025); legPivot.add(knee);
    const shin=new THREE.Mesh(new THREE.CapsuleGeometry(.08,.22,3,6),cloth); shin.position.set(0,-.32,.105); shin.rotation.x=.42; legPivot.add(shin);
    const boot=new THREE.Mesh(new THREE.BoxGeometry(.15,.11,.23),cloth); boot.position.set(0,-.48,.205); legPivot.add(boot);
  }
  // Small ragged patches on the back silhouette.
  for(let i=0;i<3;i++){ const flap=new THREE.Mesh(new THREE.ConeGeometry(.08,.2,5),gash); flap.position.set((i-1)*.13,.68,-.42); flap.rotation.x=Math.PI/2; g.add(flap); }
  return {group:g, legs:pivots};
}
function makeEnemyNameSprite(type){
  const names={dog:'СОБАКА',boar:'КАБАН',snork:'СНОРК'};
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,256,64);
  ctx.font='bold 30px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=7;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(names[type]||'ВРАГ',128,32);
  ctx.fillStyle=type==='snork'?'#d9c9a5':type==='boar'?'#e3ad72':'#d8d0b6';ctx.fillText(names[type]||'ВРАГ',128,32);
  const tex=new THREE.CanvasTexture(canvas);tex.minFilter=THREE.LinearFilter;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
  sprite.scale.set(1.55,.38,1);sprite.position.y=.22;return sprite;
}
function makeHPBar(){
  const g = new THREE.Group();
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(1.0,.1), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:.5}));
  const fgGeo = new THREE.PlaneGeometry(.96,.06); fgGeo.translate(0.48, 0, 0);
  const fg = new THREE.Mesh(fgGeo, new THREE.MeshBasicMaterial({color:0x33ff33}));
  fg.position.set(-0.48, 0, .01); g.add(bg, fg); g.userData.fg = fg;
  return g;
}
function spawnEnemy(type, nearX, nearZ, saved=null){
  let model, hp, dmg, speed, range;
  if(type==='dog' || type==='wolf'){ model=makeDog(); hp=20; dmg=6; speed=2.8; range=1.0; type='dog'; }
  else if(type==='boar'){ model=makeBoar(); hp=40; dmg=10; speed=1.8; range=1.4; }
  else { model=makeSnork(); hp=30; dmg=14; speed=3.2; range=1.0; }

  const a = Math.random()*Math.PI*2, r = rand(9,18);
  let ex = nearX+Math.cos(a)*r, ez = nearZ+Math.sin(a)*r;
  if(Math.hypot(ex - SAFE_ZONE_CENTER.x, ez - SAFE_ZONE_CENTER.z) < SAFE_ZONE_RADIUS + 5){
    const a2 = Math.random() * Math.PI * 2, r2 = SAFE_ZONE_RADIUS + 6 + Math.random() * 15;
    ex = SAFE_ZONE_CENTER.x + Math.cos(a2) * r2;
    ez = SAFE_ZONE_CENTER.z + Math.sin(a2) * r2;
  }
  if(saved && Number.isFinite(saved.x) && Number.isFinite(saved.z)){ ex=saved.x; ez=saved.z; }
  model.group.position.set(ex, getTerrainHeight(ex, ez), ez);
  model.group.rotation.y = saved && Number.isFinite(saved.yaw) ? saved.yaw : Math.random()*Math.PI*2;
  const bar = makeHPBar(); bar.position.y = type==='snork'? 1.5 : (type==='dog'? 1.25 : 1.3);
  const nameSprite=makeEnemyNameSprite(type); nameSprite.position.y=bar.position.y+.32; model.group.add(nameSprite);
  model.group.add(bar);
  scene.add(model.group);
  const restoredHp = saved && Number.isFinite(saved.hp) ? Math.max(1,Math.min(hp,saved.hp)) : hp;
  enemies.push({mesh:model.group, model, type, hp:restoredHp, maxHp:hp, dmg, speed, cd:0, hpbar:bar, legs:model.legs, attackRange:range, wanderDir:Math.random()*Math.PI*2, wanderTimer:0, vocalTimer:rand(2,7)});
  bar.userData.fg.scale.x=Math.max(.01,restoredHp/hp);
}

// ===== СОСТОЯНИЕ =====
let state = {
  hp:100, maxHp:100, rad:0, maxRad:100, xp:0, lvl:1, stamina:100, hunger:100, thirst:100, intoxication:0, bleeding:0, stimTime:0,
  x:0, z:0, y:0, vy:0, onGround:true, dir:0,
  camYaw:0, camPitch:0.35, camDist:5.5,
  time:0.25, money:2000, wasSafe:false, emissionClock:0
};

let psiLoad=0, psiDamageTimer=0, psiSoundTimer=0, psiMaxDamagePulse=0;
const psiOverlay=document.getElementById("psiOverlay"), psiBanner=document.getElementById("psiBanner"), psiFill=document.getElementById("psiFill"), psiPct=document.getElementById("psiPct");
let savedWorldData = null;
let pendingResourceRespawns = [];
function saveState(){
  try{
    localStorage.setItem('stalker_zone_v14', JSON.stringify({
      version:23, state, inventory, artifactSlots, armorGear, deviceGear, weaponGear, equippedIndex, ammoInMag,
      world:{resources:worldObjects.map(o=>({type:o.type,x:o.spawnX,z:o.spawnZ,hp:o.hp})),
      groundItems:groundItems.map(g=>({id:g.id,cnt:g.cnt,x:g.mesh.position.x,z:g.mesh.position.z,quality:g.quality,rarity:g.rarity})),
      anomalies:anomalies.map(a=>({x:a.x,z:a.z,r:a.r,kind:a.kind,artifactId:a.artifactId})),
      enemies:enemies.filter(e=>e.hp>0).map(e=>({type:e.type,x:e.mesh.position.x,z:e.mesh.position.z,hp:e.hp,yaw:e.mesh.rotation.y})),
      pendingRespawns:pendingResourceRespawns.map(r=>({type:r.type,x:r.x,z:r.z,at:r.at}))}
    }));
  }catch(e){ log('Не удалось сохранить игру'); }
}
function loadState(){
  try{
    const raw = localStorage.getItem('stalker_zone_v14') || localStorage.getItem('stalker_zone_v13');
    if(!raw) return false;
    const d = JSON.parse(raw);
    if(!d || typeof d !== 'object') return false;
    savedWorldData = d.world && typeof d.world==='object' ? d.world : null;
    if(d.state && typeof d.state === 'object'){
      for(const k of ['stamina','hunger','thirst','intoxication','bleeding','stimTime'])if(!Number.isFinite(d.state[k]))d.state[k]=({stamina:100,hunger:100,thirst:100,intoxication:0,bleeding:0,stimTime:0})[k];
      const numeric = ['hp','maxHp','rad','maxRad','xp','lvl','x','z','time','money','camYaw','camPitch','camDist','emissionClock'];
      for(const key of numeric){
        if(Number.isFinite(Number(d.state[key]))) state[key] = Number(d.state[key]);
      }
      state.camYaw = Number.isFinite(state.camYaw) ? state.camYaw : 0;
      state.camPitch = Math.max(-0.15, Math.min(1.2, state.camPitch));
      state.camDist = Math.max(2.5, Math.min(9, state.camDist));
      state.hp = Math.max(1, Math.min(state.maxHp, state.hp));
      state.maxHp = Math.max(1, state.maxHp);
      state.rad = Math.max(0, Math.min(state.maxRad, state.rad));
      state.maxRad = Math.max(1, state.maxRad);
      state.xp = Math.max(0, state.xp);
      state.lvl = Math.max(1, Math.floor(state.lvl));
      state.money = Math.max(0, Math.floor(state.money));
      state.time = ((state.time % 1) + 1) % 1;
      state.emissionClock = ((state.emissionClock % 260) + 260) % 260;
    }
    if(Array.isArray(d.inventory)){
      inventory = new Array(Math.max(INV_SIZE,Math.min(200,d.inventory.length))).fill(null);
      for(let i=0;i<Math.min(inventory.length,d.inventory.length);i++){
        const it = d.inventory[i];
        if(it && ITEM_DEFS[it.id] && Number.isFinite(it.cnt) && it.cnt > 0){
          inventory[i] = normalizeArtifactItem({...it,id:it.id,cnt:Math.min(ITEM_DEFS[it.id].stack,Math.floor(it.cnt))});
        }
      }
    }
    artifactSlots = new Array(5).fill(null);
    if(Array.isArray(d.artifactSlots)) for(let i=0;i<Math.min(5,d.artifactSlots.length);i++){ const it=d.artifactSlots[i]; if(it && ITEM_DEFS[it.id] && ITEM_DEFS[it.id].artifact && Number.isFinite(it.cnt) && it.cnt>0) artifactSlots[i]=normalizeArtifactItem({...it,id:it.id,cnt:1}); }
    armorGear={helmet:null,suit:null,backpack:null}; if(d.armorGear&&typeof d.armorGear==='object') for(const key of ['helmet','suit','backpack']){const it=d.armorGear[key];if(it&&ITEM_DEFS[it.id]&&ITEM_DEFS[it.id].armorSlot===key)armorGear[key]={id:it.id,cnt:1};}
    weaponGear = d.weaponGear && ITEM_DEFS[d.weaponGear.id] && ITEM_DEFS[d.weaponGear.id].weapon ? {id:d.weaponGear.id,cnt:1} : null;
    deviceGear={detector:null};
    if(d.deviceGear && d.deviceGear.detector && d.deviceGear.detector.id==='artifact_detector'){
      deviceGear.detector={id:'artifact_detector',cnt:1};
    }
    syncInventoryCapacity();
    equippedIndex = Number.isInteger(d.equippedIndex) && d.equippedIndex>=0 &&
      d.equippedIndex<inventory.length && inventory[d.equippedIndex] &&
      (ITEM_DEFS[inventory[d.equippedIndex].id].weapon || ITEM_DEFS[inventory[d.equippedIndex].id].artifact)
      ? d.equippedIndex : -1;
    if(equippedIndex>=0 && inventory[equippedIndex] && ITEM_DEFS[inventory[equippedIndex].id].artifact){ const free=artifactSlots.findIndex(v=>!v); if(free>=0) artifactSlots[free]=inventory[equippedIndex]; inventory[equippedIndex]=null; equippedIndex=-1; }
    if(!weaponGear && equippedIndex>=0 && inventory[equippedIndex] && ITEM_DEFS[inventory[equippedIndex].id].weapon){weaponGear={id:inventory[equippedIndex].id,cnt:1};inventory[equippedIndex]=null;equippedIndex=-1;}
    ammoInMag = Math.max(0, Math.floor(Number(d.ammoInMag) || 0));
    const equipped = equippedDef();
    if(!equipped || !equipped.mag) ammoInMag = 0;
    else ammoInMag = Math.min(ammoInMag, equipped.mag);
    return true;
  }catch(e){ return false; }
}

const loaded = loadState();
