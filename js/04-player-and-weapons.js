// ===== ИГРОК =====
function makeHuman(color){
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color, roughness:.78});
  const dark = new THREE.MeshStandardMaterial({color:0x252b25, roughness:.9});
  const skin = new THREE.MeshStandardMaterial({color:0xc99570, roughness:.88});
  const pants = new THREE.MeshStandardMaterial({color:0x34382c, roughness:.95});
  const vest = new THREE.MeshStandardMaterial({color:0x596044, roughness:.92});
  const trim = new THREE.MeshStandardMaterial({color:0x9a865d, roughness:.88});
  const bootMat = new THREE.MeshStandardMaterial({color:0x24231e, roughness:1});

  // Rounded torso and padded vest, with soft transitions at the shoulders.
  const torso = new THREE.Mesh(new THREE.SphereGeometry(1,14,12), mat);
  torso.scale.set(.36,.48,.235); torso.position.set(0,1.27,0); g.add(torso);
  const vestMesh = new THREE.Mesh(new THREE.SphereGeometry(1,14,12), vest);
  vestMesh.scale.set(.385,.405,.255); vestMesh.position.set(0,1.29,-.012); g.add(vestMesh);

  // Compact backpack sits flush against the back; straps curve over the shoulders.
  const pack=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),dark);
  pack.scale.set(.245,.30,.115); pack.position.set(0,1.34,.245); g.add(pack);
  const packTop=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),vest);
  packTop.scale.set(.205,.065,.12); packTop.position.set(0,1.59,.25); g.add(packTop);

  const strapMat = new THREE.MeshStandardMaterial({color:0x343a2c, roughness:.96});
  [-1,1].forEach(side=>{
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side*.17,1.57,.18),
      new THREE.Vector3(side*.245,1.48,.13),
      new THREE.Vector3(side*.275,1.30,-.12),
      new THREE.Vector3(side*.235,1.10,-.205)
    ]);
    const strap = new THREE.Mesh(new THREE.TubeGeometry(curve,12,.025,6,false),strapMat);
    g.add(strap);
    // Pouches are mounted directly onto the lower front of the vest.
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(.13,.15,.055),dark);
    pouch.position.set(side*.235,1.08,-.255); g.add(pouch);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(.135,.045,.018),trim);
    flap.position.set(side*.235,1.16,-.29); g.add(flap);
  });

  // A belt ring wraps around the waist instead of floating as a front-facing bar.
  const belt = new THREE.Mesh(new THREE.TorusGeometry(.305,.035,7,24),dark);
  belt.rotation.x=Math.PI/2; belt.scale.set(1,.72,1);
  belt.position.set(0,.96,0); g.add(belt);
  const buckle=new THREE.Mesh(new THREE.BoxGeometry(.105,.075,.035),trim);
  buckle.position.set(0,.96,-.245); g.add(buckle);

  const neck=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.12,4,8),skin);
  neck.position.y=1.72; g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(1,14,12), skin);
  head.scale.set(.205,.235,.19); head.position.set(0,1.93,0); g.add(head);
  // Face points toward local -Z.
  const eyeMat = new THREE.MeshBasicMaterial({color:0x171713});
  [-.09,.09].forEach(x=>{
    const e=new THREE.Mesh(new THREE.SphereGeometry(.025,7,6),eyeMat);
    e.position.set(x,1.96,-.176); g.add(e);
  });
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.045,8,7),skin);
  nose.scale.set(.8,1,1.05); nose.position.set(0,1.88,-.19); g.add(nose);
  // Fitted field cap: a low crown overlapping the head, with a short forward visor.
  const capBand=new THREE.Mesh(new THREE.CylinderGeometry(.207,.212,.045,16),dark);
  capBand.position.set(0,2.055,0); g.add(capBand);
  const capCrown=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),vest);
  capCrown.scale.set(.204,.105,.198);
  capCrown.position.set(0,2.095,.005); g.add(capCrown);
  const capVisor=new THREE.Mesh(new THREE.BoxGeometry(.235,.026,.125),dark);
  capVisor.position.set(0,2.045,-.158); g.add(capVisor);

  // Capsule-shaped arms keep the silhouette rounded while retaining shoulder pivots.
  const armLGroup = new THREE.Group(); armLGroup.position.set(-.34,1.57,0); g.add(armLGroup);
  const armRGroup = new THREE.Group(); armRGroup.position.set(.34,1.57,0); g.add(armRGroup);
  [armLGroup,armRGroup].forEach((pivot)=>{
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.39,5,9),mat);
    upper.position.y=-.27; pivot.add(upper);
    const cuff=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.075,4,8),dark);
    cuff.position.y=-.49; pivot.add(cuff);
    const hand=new THREE.Mesh(new THREE.SphereGeometry(.105,9,8),skin);
    hand.scale.set(.9,1,.95); hand.position.set(0,-.62,-.015); pivot.add(hand);
  });

  // Rounded trousers, knees and boots.
  const legL = new THREE.Group(); legL.position.set(-.17,.88,0); g.add(legL);
  const legR = new THREE.Group(); legR.position.set(.17,.88,0); g.add(legR);
  [legL,legR].forEach((leg)=>{
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.43,5,8),pants);
    thigh.position.y=-.31; leg.add(thigh);
    const knee=new THREE.Mesh(new THREE.SphereGeometry(.13,9,8),vest);
    knee.scale.set(1,.82,1); knee.position.set(0,-.48,-.015); leg.add(knee);
    const boot=new THREE.Mesh(new THREE.CapsuleGeometry(.115,.16,4,8),bootMat);
    boot.rotation.x=Math.PI/2; boot.scale.set(1,.9,1.25);
    boot.position.set(0,-.68,-.055); leg.add(boot);
  });
  return {group:g, armL:armLGroup, armR:armRGroup, legL, legR};
}
const playerModel = makeHuman(0x5a7a4a);
const player = playerModel.group;
player.scale.setScalar(1.13); // keep the player close to Borodach's overall height
scene.add(player);

// ===== ОРУЖИЕ =====
let weaponMesh = null;
function setWeapon(id, preserveAmmo=false){
  // При обычной смене оружия возвращаем патроны в инвентарь.
  // При восстановлении сохранения оставляем магазин таким, каким он был.
  if(!preserveAmmo && ammoInMag > 0){ addItem('ammo', ammoInMag); ammoInMag = 0; }
  if(weaponMesh){ playerModel.armR.remove(weaponMesh); weaponMesh=null; }
  if(!id){
    updateAmmoUI();
    playerModel.armR.rotation.set(0,0,0);
    playerModel.armL.rotation.set(0,0,0);
    return;
  }
  const def = ITEM_DEFS[id];
  const mesh = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({color:0x414a4b, metalness:.72, roughness:.32, flatShading:true});
  const edgeMat = new THREE.MeshStandardMaterial({color:0x87908b, metalness:.65, roughness:.38, flatShading:true});
  const polymerMat = new THREE.MeshStandardMaterial({color:0x292d28, roughness:.9, flatShading:true});
  const woodMat = new THREE.MeshStandardMaterial({color:0x59402b, roughness:.9, flatShading:true});
  const addPart=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{
    const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.rotation.set(rx,ry,rz); mesh.add(m); return m;
  };
  let isMelee=false;
  if(id==='pistol'){
    // Компактный служебный пистолет: короткий затвор и тонкая рукоять.
    addPart(new THREE.BoxGeometry(.105,.105,.39),metalMat,0,.055,-.19);
    addPart(new THREE.BoxGeometry(.115,.12,.22),polymerMat,0,.025,-.015);
    addPart(new THREE.BoxGeometry(.085,.24,.12),polymerMat,0,-.13,.035,-.18);
    addPart(new THREE.BoxGeometry(.07,.11,.035),edgeMat,0,.12,-.34);
    addPart(new THREE.BoxGeometry(.09,.018,.12),polymerMat,0,-.255,.045);
  } else if(id==='pistol_heavy'){
    // Крупнокалиберный пистолет с массивным затвором и длинным стволом.
    addPart(new THREE.BoxGeometry(.145,.15,.52),metalMat,0,.07,-.25);
    addPart(new THREE.CylinderGeometry(.045,.045,.24,8),edgeMat,0,.045,-.53,Math.PI/2,0,0);
    addPart(new THREE.BoxGeometry(.14,.16,.25),polymerMat,0,.005,-.02);
    addPart(new THREE.BoxGeometry(.11,.29,.15),polymerMat,0,-.16,.055,-.2);
    addPart(new THREE.BoxGeometry(.15,.06,.12),metalMat,0,-.09,-.1);
    addPart(new THREE.BoxGeometry(.12,.025,.14),polymerMat,0,-.31,.07);
  } else if(id==='smg'){
    // Пистолет-пулемёт с перфорированным цевьём, длинным магазином и прикладом.
    addPart(new THREE.BoxGeometry(.11,.12,.72),metalMat,0,.07,-.32);
    addPart(new THREE.BoxGeometry(.14,.14,.25),polymerMat,0,.015,-.1);
    addPart(new THREE.BoxGeometry(.085,.31,.13),polymerMat,0,-.19,-.06,-.12);
    addPart(new THREE.BoxGeometry(.09,.36,.13),metalMat,0,-.2,-.24);
    addPart(new THREE.BoxGeometry(.08,.24,.1),polymerMat,0,-.14,.19);
    addPart(new THREE.BoxGeometry(.1,.08,.22),polymerMat,0,.04,.16);
    addPart(new THREE.BoxGeometry(.06,.07,.06),edgeMat,0,.17,-.58);
  } else if(id==='rifle'){
    // Автомат с длинным газоотводом, изогнутым магазином и прикладом.
    addPart(new THREE.BoxGeometry(.09,.105,.92),metalMat,0,.055,-.38);
    addPart(new THREE.BoxGeometry(.13,.14,.32),polymerMat,0,.025,-.15);
    addPart(new THREE.BoxGeometry(.105,.13,.4),woodMat,0,.02,-.62);
    addPart(new THREE.BoxGeometry(.11,.3,.16),polymerMat,0,-.17,-.2,-.14);
    addPart(new THREE.BoxGeometry(.11,.16,.3),woodMat,0,-.015,.2);
    addPart(new THREE.BoxGeometry(.07,.08,.12),metalMat,0,.14,-.18);
    addPart(new THREE.CylinderGeometry(.035,.035,.32,7),metalMat,0,.075,-.92,Math.PI/2,0,0);
  } else if(id==='rifle_scoped'){
    // Оптический автомат: длинный ствол, телескопический прицел и сошки.
    addPart(new THREE.BoxGeometry(.09,.105,1.02),metalMat,0,.055,-.43);
    addPart(new THREE.BoxGeometry(.12,.14,.34),polymerMat,0,.025,-.17);
    addPart(new THREE.BoxGeometry(.1,.13,.44),polymerMat,0,.02,-.68);
    addPart(new THREE.BoxGeometry(.105,.17,.3),polymerMat,0,-.015,.18);
    addPart(new THREE.CylinderGeometry(.065,.065,.34,10),metalMat,0,.19,-.39,Math.PI/2,0,0);
    addPart(new THREE.CylinderGeometry(.085,.085,.055,10),edgeMat,0,.19,-.39,Math.PI/2,0,0);
    addPart(new THREE.CylinderGeometry(.035,.035,.28,8),metalMat,0,.075,-1.0,Math.PI/2,0,0);
    addPart(new THREE.BoxGeometry(.035,.24,.035),metalMat,-.055,-.13,-.58);
    addPart(new THREE.BoxGeometry(.035,.24,.035),metalMat,.055,-.13,-.58);
  } else if(id==='shotgun'){
    // Двуствольный дробовик с деревянным цевьём и двумя параллельными стволами.
    addPart(new THREE.BoxGeometry(.13,.13,.38),metalMat,0,.035,-.18);
    addPart(new THREE.BoxGeometry(.13,.17,.28),woodMat,0,.015,-.48);
    addPart(new THREE.CylinderGeometry(.035,.035,.78,8),metalMat,-.045,.065,-.73,Math.PI/2,0,0);
    addPart(new THREE.CylinderGeometry(.035,.035,.78,8),metalMat,.045,.065,-.73,Math.PI/2,0,0);
    addPart(new THREE.BoxGeometry(.11,.16,.32),woodMat,0,-.005,.12);
    addPart(new THREE.BoxGeometry(.09,.27,.13),woodMat,0,-.15,-.08,-.18);
    addPart(new THREE.BoxGeometry(.12,.035,.1),metalMat,0,.14,-.42);
  } else {
    isMelee=true;
    addPart(new THREE.CylinderGeometry(.035,.04,.48,7),woodMat,0,-.08,-.12,Math.PI/2,0,0);
    addPart(new THREE.CylinderGeometry(.065,.065,.09,7),metalMat,0,-.08,-.12,Math.PI/2,0,0);
  }

  // Mount the grip into the right hand; do not roll the weapon away from the aim direction.
  mesh.position.set(0,-.58,-.055);
  mesh.rotation.set(isMelee ? 0 : -Math.PI/2,0,0);
  playerModel.armR.add(mesh);
  weaponMesh=mesh;

  if(isMelee){
    playerModel.armR.rotation.set(1.05,0,-.12);
    playerModel.armL.rotation.set(.45,0,.28);
  } else {
    // Right hand holds the grip; left arm reaches forward under the fore-end.
    playerModel.armR.rotation.set(Math.PI/2,0,-.08);
    playerModel.armL.rotation.set(Math.PI/2,0,.42);
  }
  // Новое оружие начинает с пустым магазином; при загрузке сохранения
  // сохранённый боезапас остаётся нетронутым.
  if(!preserveAmmo) ammoInMag=0;
  else ammoInMag=Math.min(Math.max(0, Math.floor(Number(ammoInMag)||0)), def.mag||0);
  currentWeaponId=id;
  updateAmmoUI();
}
