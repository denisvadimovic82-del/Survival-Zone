// ===== АНИМАЦИЯ =====
let walkPhase = 0;
function animatePlayer(dt, moving){
  if(moving){
    walkPhase += dt*12;
    const s = Math.sin(walkPhase)*0.8;
    if(!weaponMesh){
      playerModel.armL.rotation.x = s;
      playerModel.armR.rotation.x = -s;
    }
    playerModel.legL.rotation.x = -s;
    playerModel.legR.rotation.x = s;
  } else {
    if(!weaponMesh) {
      playerModel.armL.rotation.x *= 0.8;
      playerModel.armR.rotation.x *= 0.8;
    }
    playerModel.legL.rotation.x *= 0.8;
    playerModel.legR.rotation.x *= 0.8;
  }
  
  // Анимация покачивания при стрельбе/ударе (накладывается поверх базового угла)
  if(atkAnimT>0){
    atkAnimT -= dt;
    const def = equippedDef();
    let baseAngle = 0;
    if (weaponMesh && def) {
       baseAngle = def.mag ? Math.PI/2 : 1.05;
    }
    playerModel.armR.rotation.x = baseAngle + Math.sin((0.35-atkAnimT)/0.35*Math.PI)*0.28;
    playerModel.armR.rotation.z = (def && def.mag ? -.08 : -.12) + Math.sin((0.35-atkAnimT)/0.35*Math.PI)*0.12;
  }
}

const clock = new THREE.Clock();
let renderAccumulator=0; const FRAME_STEP=isMobile?1/45:1/55;
let radarBlinkAccumulator=0;
let shelterRaycastAccumulator=0;
let shelterRaycastReady=false;
let eatTimer=0,radTimer=0,autosaveTimer=0,anomalyHazardTimer=0;
let dayTime = state.time;
let cameraShelterDistance = state.camDist;
const shelterCameraRaycaster = new THREE.Raycaster();
const fadedShelterWalls = new Set();
const moveDir = new THREE.Vector3();
const tmpColor = new THREE.Color();

function animate(){
  requestAnimationFrame(animate);
  const rawDt=clock.getDelta();
  radarBlinkAccumulator+=rawDt;
  if(radarBlinkAccumulator>=0.1){
    radarBlinkAccumulator=0;
    radarBlinkTime+=0.1;
    for(const b of radarBlinkLights){
      const pulse=(Math.sin(radarBlinkTime*3.2+b.phase)>0.35);
      b.material.emissiveIntensity=pulse?3.2:.08;
      b.light.intensity=pulse?1.8:0;
    }
  }
  renderAccumulator+=rawDt;
  if(renderAccumulator<FRAME_STEP) return;
  const dt=Math.min(renderAccumulator,0.05); renderAccumulator=0;

  const forward = new THREE.Vector3(-Math.sin(state.camYaw), 0, -Math.cos(state.camYaw));
  const right = new THREE.Vector3(Math.cos(state.camYaw), 0, -Math.sin(state.camYaw));
  moveDir.set(0,0,0);
  moveDir.addScaledVector(forward, -joy.dy);
  moveDir.addScaledVector(right, joy.dx);
  const armLoad=armorTotals(), weightNow=armorWeight();
  const loadMult=overloadSpeedMultiplier(weightNow,armLoad.capacity);
  if(moveDir.lengthSq()>1) moveDir.normalize();
  if(moveDir.lengthSq()>.01) ZoneAudio.walking(dt);

  // Перегрузка применяется к итоговой скорости движения (после бонусов артефактов).
  // При 200% переносимого веса скорость равна нулю.
  const moving = moveDir.lengthSq() > 0.0001;
  const sprinting=moving&&Math.max(Math.abs(joy.dx),Math.abs(joy.dy))>.72&&state.stamina>1;
  const staminaSpeed=state.stamina<=0?.58:sprinting?(state.stimTime>0?1.55:1.35):1;
  const speed=5.0*artifactTotals().speed*loadMult*staminaSpeed;
  survivalUpdate(dt,moving,sprinting);
  player.position.x += moveDir.x*speed*dt;
  player.position.z += moveDir.z*speed*dt;

  for(const o of worldObjects){
    const dx2 = player.position.x - o.mesh.position.x, dz2 = player.position.z - o.mesh.position.z;
    const dd = Math.hypot(dx2, dz2), minD = o.radius + 0.5;
    if(dd < minD && dd > 0.001){
      player.position.x = o.mesh.position.x + dx2/dd*minD;
      player.position.z = o.mesh.position.z + dz2/dd*minD;
    }
  }
  // Игрок не проходит сквозь стены; вход остаётся свободным.
  resolveShelterCollision(player,.42);
  resolveRadarCollision(player,.42);

  // Пси-зона РЛС: воздействие постепенно накапливается внутри радиуса станции и спадает снаружи.
  const psiDistance=Math.hypot(player.position.x-radarStation.position.x,player.position.z-radarStation.position.z);
  const psiInside=psiDistance<68;
  const psiProtection=armorTotals().psiResist;
  if(psiInside) psiLoad=Math.min(100,psiLoad+(psiDistance<42?8.2:4.8)*(1-psiProtection)*dt);
  else psiLoad=Math.max(0,psiLoad-7.5*dt);
  psiSoundTimer-=dt; psiDamageTimer-=dt;
  psiOverlay.classList.toggle('active',psiLoad>1);
  psiOverlay.classList.toggle('distort',psiLoad>48);
  psiBanner.style.display=(psiInside||psiLoad>1)?'block':'none';
  positionPsiBanner();
  if(psiBanner.style.display==='block') positionGameToasts();
  psiPct.textContent=Math.round(psiLoad)+'%'; psiFill.style.width=psiLoad+'%';
  psiBanner.classList.toggle('danger',psiLoad>=75);
  if(psiLoad>=30){
    if(psiSoundTimer<=0){ZoneAudio.psi(psiLoad);psiSoundTimer=psiLoad>75?1.3:psiLoad>50?2.0:3.2;}
    if(psiLoad>=100&&psiDamageTimer<=0){const psiHit=Math.max(2,12*(1-psiProtection));applyPlayerDamage(psiHit,0);psiDamageTimer=1.1;log('🧠 ПСИ-УДАР! Снято '+Math.ceil(psiHit)+' HP — срочно покинь территорию РЛС!',2400);}
  }

  let groundY = getTerrainHeight(player.position.x, player.position.z);
  // Бетонная плита РЛС — полноценная поверхность пола: игрок стоит на её верхней
  // грани, но может свободно ходить под антенной и между отдельными опорами.
  const radarLocalX=player.position.x-radarStation.position.x;
  const radarLocalZ=player.position.z-radarStation.position.z;
  if(Math.abs(radarLocalX)<=71 && Math.abs(radarLocalZ)<=10){
    const deckTop=radarStation.position.y+.445;
    groundY=Math.max(groundY,deckTop);
  }
  state.vy -= 15*dt; player.position.y += state.vy*dt;
  if(player.position.y <= groundY){
    player.position.y = groundY;
    if(state.vy < 0) state.vy = 0;
    state.onGround = true;
  }

  if(moving){
    const targetRot = Math.atan2(-moveDir.x, -moveDir.z);
    let diff = targetRot - player.rotation.y;
    while(diff > Math.PI) diff -= Math.PI*2;
    while(diff < -Math.PI) diff += Math.PI*2;
    player.rotation.y += diff*Math.min(1, dt*15); state.dir = player.rotation.y;
  }

  animatePlayer(dt, moving);

  // ===== КАМЕРА ПОДНЯТА (2.6) =====
  // MMO-style framing: keep the avatar lower in the frame while the fixed reticle stays centered.
  const insideShelter = !!getShelterAt(player.position.x, player.position.z);
  const desiredShelterDistance = insideShelter ? Math.min(state.camDist, 4.15) : state.camDist;
  cameraShelterDistance += (desiredShelterDistance - cameraShelterDistance) * Math.min(1, dt * 3.5);
  const camTarget = new THREE.Vector3(player.position.x, player.position.y + 3.25, player.position.z);
  const cosP = Math.cos(state.camPitch);
  const camPos = new THREE.Vector3(
    camTarget.x + Math.sin(state.camYaw)*cosP*cameraShelterDistance,
    camTarget.y + Math.sin(state.camPitch)*cameraShelterDistance,
    camTarget.z + Math.cos(state.camYaw)*cosP*cameraShelterDistance
  );
  camera.position.lerp(camPos, Math.min(1, dt*10));
  let viewTarget = camTarget;
  if(aimLockEnemy){
    if(aimLockEnemy.hp <= 0 || !enemies.includes(aimLockEnemy) || dist2(aimLockEnemy.mesh.position, player.position) > 40){
      aimLockEnemy = null;
      aimTargetEl.style.display = 'none';
    } else {
      const aimHeight = aimLockEnemy.type === 'dog' || aimLockEnemy.type === 'wolf' ? 0.55 : (aimLockEnemy.type === 'boar' ? 0.8 : 1.05);
      viewTarget = new THREE.Vector3(
        aimLockEnemy.mesh.position.x,
        aimLockEnemy.mesh.position.y + aimHeight,
        aimLockEnemy.mesh.position.z
      );
      const dxAim = viewTarget.x - player.position.x;
      const dzAim = viewTarget.z - player.position.z;
      const faceYaw = Math.atan2(-dxAim, -dzAim);
      let faceDiff = faceYaw - player.rotation.y;
      while(faceDiff > Math.PI) faceDiff -= Math.PI*2;
      while(faceDiff < -Math.PI) faceDiff += Math.PI*2;
      player.rotation.y += faceDiff * Math.min(1, dt*12);
      state.dir = player.rotation.y;
    }
  }
  // Прозрачность включается только у тех стен укрытий, которые реально
  // перекрывают отрезок между точкой обзора и камерой. Коллизии не меняются.
  shelterRaycastAccumulator+=dt;
  if(!shelterRaycastReady || shelterRaycastAccumulator>=0.08){
    shelterRaycastAccumulator=0;
    shelterRaycastReady=true;
    const cameraRay = new THREE.Vector3().subVectors(camera.position, viewTarget);
    const cameraRayLength = cameraRay.length();
    fadedShelterWalls.clear();
    if(cameraRayLength > 0.001){
      shelterCameraRaycaster.set(viewTarget, cameraRay.normalize());
      shelterCameraRaycaster.far = cameraRayLength;
      const hits = shelterCameraRaycaster.intersectObjects(shelterCameraOccluders, false);
      for(const hit of hits) fadedShelterWalls.add(hit.object);
    }
  }
  for(const wall of shelterCameraOccluders){
    // Внутри укрытия плавно просвечивают все стены и крыша;
    // дополнительно снаружи просвечивают только объекты на линии камеры.
    const targetOpacity = (insideShelter || fadedShelterWalls.has(wall)) ? 0.28 : 1;
    const mat = wall.material;
    mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, dt * 8);
    const shouldBeTransparent = mat.opacity < 0.999;
    if(mat.transparent !== shouldBeTransparent){ mat.transparent = shouldBeTransparent; mat.needsUpdate = true; }
    mat.depthWrite = mat.opacity > 0.95;
  }
  camera.lookAt(viewTarget);

  dayTime += dt/240; if(dayTime>1) dayTime-=1;
  const day = Math.sin(dayTime*Math.PI*2 - Math.PI/2)*0.5+0.5;
  dirLight.intensity = 0.3 + day*1.0;
  tmpColor.setHSL(0.55, 0.35, 0.2 + day*0.4);
  scene.background.copy(tmpColor); scene.fog.color.copy(tmpColor);

  // Цикл выброса: 210 сек спокойствия, 15 сек предупреждения, 35 сек опасной фазы.
  state.emissionClock=(state.emissionClock||0)+dt;
  if(state.emissionClock>=260) state.emissionClock-=260;
  const nextEmissionPhase=state.emissionClock>=225?'active':(state.emissionClock>=210?'warning':'calm');
  if(nextEmissionPhase!==emissionPhase){
    const previousEmissionPhase=emissionPhase;
    emissionPhase=nextEmissionPhase;
    if(emissionPhase==='warning'){ZoneAudio.emissionWarning(); log('⚠️ ПРЕДУПРЕЖДЕНИЕ О ВЫБРОСЕ. Атмосфера нестабильна, уровень радиации растёт. Немедленно найди укрытие и пережди удар Зоны!',6000);}
    else if(emissionPhase==='active'){ZoneAudio.emissionStart(); log('☢️ НАЧАЛСЯ ВЫБРОС! Смертоносная волна накрывает территорию. Вне укрытия радиация быстро растёт и разрушает здоровье. Срочно укройся!',6500);}
    else {
      ZoneAudio.emissionEnd(); log('☢️ ВЫБРОС ЗАВЕРШИЛСЯ. Самая опасная волна прошла. Но после неё в Зоне могли появиться новые аномалии — будь начеку.',6000);
      if(previousEmissionPhase==='active') spawnArtifactAnomalies();
    }
  }
  if(emissionPhase==='warning'){
    emissionBanner.style.display='block';
    emissionBanner.textContent='⚠️ ВЫБРОС ЧЕРЕЗ '+Math.max(1,Math.ceil(225-state.emissionClock))+' СЕК.';positionGameToasts();
    emissionOverlay.classList.remove('active');
  } else if(emissionPhase==='active'){
    emissionBanner.style.display='block';
    emissionBanner.textContent='☢️ ВЫБРОС! ДО КОНЦА '+Math.max(0,Math.ceil(260-state.emissionClock))+' СЕК.';positionGameToasts();
    emissionOverlay.classList.add('active');
    const protectedNow=isProtectedFromEmission(player.position.x,player.position.z);
    if(!protectedNow){
      // Выброс стал значительно опаснее: радиация накапливается втрое быстрее,
      // а при полном радиационном заражении здоровье уходит втрое быстрее прежнего.
      state.rad=Math.min(state.maxRad,state.rad+16.5*dt);
      if(state.rad>=state.maxRad) state.hp=Math.max(0,state.hp-13.5*dt);
      emissionFlashTimer+=dt;
      if(emissionFlashTimer>=1.1){emissionFlashTimer=0;flashRad();}
    }
    const emissionTint=new THREE.Color(0x8b241d);
    scene.background.lerp(emissionTint,protectedNow?.08:.38);
    scene.fog.color.lerp(emissionTint,protectedNow?.06:.32);
  } else {
    emissionBanner.style.display='none';
    emissionOverlay.classList.remove('active');
  }

  let inRad = false;
  let nearestExtractable=null, nearestExtractDistance=Infinity;
  anomalies.forEach(a=>{
    const d = dist2({x:a.x,z:a.z}, player.position);
    if(d < a.r){ inRad = true; a.mesh.material.opacity = 0.3 + Math.sin(performance.now()*0.005)*0.15; }
    else { a.mesh.material.opacity = 0.15; }
    const approachRadius=Math.max(5.5,(a.r||2.5)+2.2);
    if(d<=approachRadius && d<nearestExtractDistance){nearestExtractable=a;nearestExtractDistance=d;}
  });
  const scanBtn=scanArtifactBtnEl;
  const canScan=nearestExtractable && hasArtifactDetector() && !artifactGame.classList.contains('open') && !invPanel.classList.contains('open') && !tradePanel.classList.contains('open');
  scanBtn.classList.toggle('visible',!!canScan);
  scanBtn.textContent=nearestExtractable && !hasArtifactDetector() ? '📡 НУЖЕН ДЕТЕКТОР' : '📡 ИЗВЛЕЧЬ АРТЕФАКТ';
  scanBtn.disabled=!canScan;
  radTimer += dt;
  if(inRad && radTimer>0.5){ radTimer = 0; const radProtection=armorTotals().radResist; state.rad = Math.min(state.maxRad, state.rad + 3*(1-radProtection)); flashRad(); if(state.rad >= state.maxRad) state.hp -= 2*(1-radProtection*.5); }
  else if(!inRad && radTimer>0.5){ radTimer = 0; state.rad = Math.max(0, state.rad - 1); }
  anomalyHazardTimer+=dt;
  if(anomalyHazardTimer>=.5){anomalyHazardTimer=0;const art=artifactTotals();if(!isProtectedFromEmission(player.position.x,player.position.z)){
    anomalies.forEach(a=>{const d=Math.hypot(player.position.x-a.x,player.position.z-a.z);if(d>Math.max(1.2,a.r*.42))return;
      if(a.kind==='thermal'){applyPlayerDamage(1.0*(1-Math.min(.75,art.thermalResist)),.06);}
      else if(a.kind==='electric'){applyPlayerDamage(1.2*(1-Math.min(.75,art.electricResist)),.10);}
      else if(a.kind==='bio'){const bioProt=Math.min(.75,art.bioResist);state.rad=Math.min(state.maxRad,state.rad+1.2*(1-bioProt));state.intoxication=Math.min(100,(state.intoxication||0)+2.2*(1-bioProt));flashRad();if(state.intoxication>65)log('☣️ Токсичное облако! Интоксикация растёт — нужен антидот.',1800);}
      else if(a.kind==='gravity'){const gravProt=armorTotals().gravityResist;applyPlayerDamage(3.5*(1-gravProt),.12);if(gravProt<.35)state.stamina=Math.max(0,state.stamina-2.5*(1-gravProt));}
    });
  }}

  eatTimer+=dt;
  if(eatTimer>1){
    eatTimer=0;
    const art=artifactTotals();
    state.maxHp=Math.max(100,100+Math.max(0,state.lvl-1)*10+art.maxHp);state.hp=Math.min(state.hp,state.maxHp);
    if(state.hp>20)state.hp=Math.max(1,state.hp-0.1);
    if(art.radRate)state.rad=Math.max(0,Math.min(state.maxRad,state.rad+art.radRate));
    if(art.hpRate)state.hp=Math.max(1,Math.min(state.maxHp,state.hp+art.hpRate));
  }

  if(state.hp<=0){
    log('Возрождение...');
    state.hp = state.maxHp; state.rad = 0;
    // ===== РЕСПАВН В БЕЗОПАСНОЙ ЗОНЕ =====
    player.position.set(SAFE_ZONE_CENTER.x, getTerrainHeight(SAFE_ZONE_CENTER.x, SAFE_ZONE_CENTER.z), SAFE_ZONE_CENTER.z);
    state.vy = 0; state.onGround = true;
    saveState();
  }

  // ===== ИНДИКАТОР ЗАЩИТЫ =====
  const inSafe = Math.hypot(player.position.x-SAFE_ZONE_CENTER.x,player.position.z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS;
  const currentShelter=getShelterAt(player.position.x,player.position.z);
  const protectedNow=inSafe||!!currentShelter;
  const protectionLabel=inSafe?'🛡️ БЕЗОПАСНАЯ ЗОНА':(currentShelter?'🛖 '+currentShelter.name.toUpperCase():'');
  if(protectedNow){
    safeIndicator.textContent=protectionLabel;
    if(safeIndicator.style.display!=='block'){safeIndicator.style.display='block';safeIndicator.classList.add('active');safeIndicator.style.opacity='1';}
  } else if(safeIndicator.style.display!=='none'){
    safeIndicator.classList.remove('active');safeIndicator.style.opacity='0';setTimeout(()=>{if(!isProtectedFromEmission(player.position.x,player.position.z))safeIndicator.style.display='none';},300);
  }
  if(inSafe!==state.wasSafe){state.wasSafe=inSafe;saveState();}
  ringMat.opacity = 0.15 + Math.sin(performance.now()*0.002)*0.1;

  const isNight = day < 0.4;
  // Ensure the world has a visible enemy population after load/start; spawn timer no longer
  // depends on night-only logic or stale enemy counts.
  // Clamp elapsed time so returning from a background tab cannot trigger a spawn burst.
  enemySpawnTimer += Math.min(dt, 0.25);
  const livingEnemies = enemies.filter(en=>en && en.hp>0).length;
  const spawnThreshold = livingEnemies < 4 ? 4 : (isNight ? 7 : 10);
  const enemyCap = isNight ? 8 : 6;
  if(enemySpawnTimer >= spawnThreshold){
    // Always clear the timer when the check runs; this prevents stale accumulated
    // time from causing an instant spawn when population later drops.
    enemySpawnTimer=0;
    if(livingEnemies < enemyCap){
      const types = ['dog','boar','snork'];
      spawnEnemy(types[Math.floor(Math.random()*types.length)], player.position.x, player.position.z);
      saveState();
    }
  }

  enemies.forEach(en=>{
    if(inSafe){
      en.wanderTimer -= dt;
      if(en.wanderTimer <= 0){ en.wanderDir = Math.random() * Math.PI * 2; en.wanderTimer = 2 + Math.random() * 3; }
      const awayX = en.mesh.position.x - SAFE_ZONE_CENTER.x, awayZ = en.mesh.position.z - SAFE_ZONE_CENTER.z;
      const awayD = Math.hypot(awayX, awayZ) || 1;
      en.mesh.position.x += awayX/awayD * dt * en.speed * 0.7; en.mesh.position.z += awayZ/awayD * dt * en.speed * 0.7;
      en.mesh.position.x += Math.cos(en.wanderDir) * dt * en.speed * 0.3; en.mesh.position.z += Math.sin(en.wanderDir) * dt * en.speed * 0.3;
      for(const o of worldObjects){
        const dx2 = en.mesh.position.x - o.mesh.position.x, dz2 = en.mesh.position.z - o.mesh.position.z;
        const dd = Math.hypot(dx2, dz2), minD = o.radius + 0.5;
        if(dd < minD && dd > 0.001){ en.mesh.position.x = o.mesh.position.x + dx2/dd*minD; en.mesh.position.z = o.mesh.position.z + dz2/dd*minD; }
      }
      const dxSafe = en.mesh.position.x - SAFE_ZONE_CENTER.x, dzSafe = en.mesh.position.z - SAFE_ZONE_CENTER.z;
      const distSafe = Math.hypot(dxSafe, dzSafe);
      if(distSafe < SAFE_ZONE_RADIUS + 1 && distSafe > 0.001){
        en.mesh.position.x = SAFE_ZONE_CENTER.x + dxSafe/distSafe * (SAFE_ZONE_RADIUS + 1);
        en.mesh.position.z = SAFE_ZONE_CENTER.z + dzSafe/distSafe * (SAFE_ZONE_RADIUS + 1);
      }
      resolveShelterCollision(en.mesh,.42);
      resolveRadarCollision(en.mesh,.42);
      en.mesh.position.y = getTerrainHeight(en.mesh.position.x, en.mesh.position.z);
      en.legs.forEach((l,i)=>{ l.rotation.x = Math.sin(performance.now()*0.015 + i*Math.PI/2)*0.8; });
      en.mesh.rotation.y = Math.atan2(Math.cos(en.wanderDir), Math.sin(en.wanderDir));
    } else {
      const dx = player.position.x - en.mesh.position.x, dz = player.position.z - en.mesh.position.z;
      const d = Math.hypot(dx,dz);
      if(d > en.attackRange){
        const targetRot = Math.atan2(dx, dz);
        let diff = targetRot - en.mesh.rotation.y;
        while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
        en.mesh.rotation.y += diff*Math.min(1, dt*8);
        en.mesh.position.x += dx/d*dt*en.speed; en.mesh.position.z += dz/d*dt*en.speed;
        for(const o of worldObjects){
          const dx2 = en.mesh.position.x - o.mesh.position.x, dz2 = en.mesh.position.z - o.mesh.position.z;
          const dd = Math.hypot(dx2, dz2), minD = o.radius + 0.5;
          if(dd < minD && dd > 0.001){ en.mesh.position.x = o.mesh.position.x + dx2/dd*minD; en.mesh.position.z = o.mesh.position.z + dz2/dd*minD; }
        }
        const dxSafe = en.mesh.position.x - SAFE_ZONE_CENTER.x, dzSafe = en.mesh.position.z - SAFE_ZONE_CENTER.z;
        const distSafe = Math.hypot(dxSafe, dzSafe);
        if(distSafe < SAFE_ZONE_RADIUS + 1 && distSafe > 0.001){
          en.mesh.position.x = SAFE_ZONE_CENTER.x + dxSafe/distSafe * (SAFE_ZONE_RADIUS + 1);
          en.mesh.position.z = SAFE_ZONE_CENTER.z + dzSafe/distSafe * (SAFE_ZONE_RADIUS + 1);
        }
        resolveShelterCollision(en.mesh,.42);
      resolveRadarCollision(en.mesh,.42);
        en.mesh.position.y = getTerrainHeight(en.mesh.position.x, en.mesh.position.z);
        en.legs.forEach((l,i)=>{ l.rotation.x = Math.sin(performance.now()*0.015 + i*Math.PI/2)*0.8; });
      } else {
        en.cd += dt;
        if(en.cd>1.0){ en.cd = 0; if(!isProtectedFromEmission(player.position.x,player.position.z)){const arm=armorTotals(); applyPlayerDamage(en.dmg,.28);} }
      }
    }
    en.hpbar.lookAt(camera.position);
  });

  groundItems.forEach(g=>{
    g.mesh.rotation.y += dt*2;
    const gY = Math.max(0, getTerrainHeight(g.mesh.position.x, g.mesh.position.z));
    g.mesh.position.y = gY + 0.4 + Math.sin(performance.now()*0.003 + g.mesh.position.x)*0.1;
    const d = dist2(g.mesh.position, player.position);
    if(d < 2.0 && d > 0.3){
      const dx = player.position.x - g.mesh.position.x, dz = player.position.z - g.mesh.position.z;
      g.mesh.position.x += dx/d*dt*5; g.mesh.position.z += dz/d*dt*5;
    }
  });

  // Автоматический подбор: предмет притягивается к игроку и подбирается вплотную.
  // При полном инвентаре предмет остаётся на земле, сообщение показывается один раз.
  for(let gi=groundItems.length-1;gi>=0;gi--){
    const g=groundItems[gi];
    const itemDistance=dist2(g.mesh.position, player.position);
    if(itemDistance<0.8){
      if(canAddItem(g.id, g.cnt)) pickupItem(g);
      else if(!g.warnedFull){ log('Инвентарь полон'); g.warnedFull=true; }
    } else if(itemDistance>1.5){
      g.warnedFull=false;
    }
  }

  updateBars();
  state.x = player.position.x; state.z = player.position.z; state.time = dayTime;
  autosaveTimer += dt;
  if(autosaveTimer >= 15){ autosaveTimer = 0; saveState(); }
  const animT=performance.now()*0.001;
  animatedAnomalies.forEach((a,i)=>{
    if(!a.mesh) return;
    if(a.artifactMesh){a.artifactMesh.rotation.y+=dt*.85;a.artifactMesh.rotation.x+=dt*.22;a.artifactMesh.position.y=getWorldGroundHeight(a.x,a.z)+1.55+Math.sin(animT*2+i)*.12;}
    a.mesh.rotation.y+=dt*(a.kind==='electric'?-.12:.25+i%4*.08);
    a.mesh.rotation.x+=dt*.12;
    const pulse=1+Math.sin(animT*2.2+i)*.07; a.mesh.scale.setScalar(pulse);
    (a.mesh.userData.effectParts||[]).forEach((part,j)=>{
      if(a.kind==='thermal'){
        const u=part.userData, phase=animT*u.speed+u.phase;
        part.position.y=u.baseY+Math.sin(phase)*.16;
        part.position.x=u.baseX+Math.sin(phase*.7)*.07;
        part.position.z=u.baseZ+Math.cos(phase*.8)*.07;
        part.rotation.y+=dt*1.8;
        part.material.opacity=.48+(.34*(.5+.5*Math.sin(phase*1.7)));
        const scale=.78+.32*(.5+.5*Math.sin(phase)); part.scale.set(scale,scale,scale);
      } else if(a.kind==='electric'){
        part.material.opacity=.2+.8*(.5+.5*Math.sin(animT*18+part.userData.phase+j));
      }
    });
    if(a.artifactMesh){a.artifactMesh.rotation.y+=dt*1.1; a.artifactMesh.rotation.x+=dt*.45; a.artifactMesh.position.y=getWorldGroundHeight(a.x,a.z)+1.55+Math.sin(animT*2.8+i)*.18;}
  });
  ZoneAudio.update(dt, player.position, anomalies, enemies, emissionPhase);
  if(campfireAnimation){const f=campfireAnimation;f.flame1.scale.set(1+Math.sin(animT*13)*.12,1+Math.sin(animT*17)*.2,1+Math.cos(animT*11)*.1);f.flame2.scale.set(1+Math.cos(animT*16)*.15,1+Math.sin(animT*19)*.22,1+Math.sin(animT*14)*.12);f.flame1.rotation.z=Math.sin(animT*8)*.08;f.flame2.rotation.x=Math.cos(animT*9)*.07;if(f.light)f.light.intensity=1.35+Math.sin(animT*18)*.35+Math.sin(animT*7)*.18;}
  renderer.render(scene, camera);
}

animate();

// ===== ПРОЦЕДУРНЫЕ ЗВУКИ И АТМОСФЕРА =====
const ZoneAudio=(()=>{let ctx,master,ready=false,windTimer=null,stepT=0,anomalyTimer=0,emissionPulse=0;function init(){if(ctx)return;try{ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.42;master.connect(ctx.destination)}catch(e){}}function unlock(){init();if(!ctx)return;if(ctx.state==='suspended')ctx.resume();ready=true;if(!windTimer){wind();windTimer=setInterval(()=>{if(ready&&!document.hidden&&Math.random()<.7)wind()},10000)}}function tone(f,d,t='sine',v=.1,slide=0){if(!ready||!ctx)return;let o=ctx.createOscillator(),g=ctx.createGain();o.type=t;o.frequency.setValueAtTime(f,ctx.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(25,f+slide),ctx.currentTime+d);g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(v,ctx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+d+.02)}function noise(d,v=.07,cut=800){if(!ready||!ctx)return;let b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*d),ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;let s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=cut;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);s.connect(f);f.connect(g);g.connect(master);s.start()}function wind(){noise(3,.025,420);tone(80,2.8,'sine',.018,-12)}function click(){tone(650,.05,'square',.025,-160)}function pickup(){tone(520,.09,'sine',.07,160);tone(780,.1,'sine',.045,90)}function shot(){noise(.2,.24,1700);tone(100,.17,'sawtooth',.2,-45);tone(48,.2,'sine',.16,-15)}function hit(){noise(.12,.12,600);tone(110,.12,'triangle',.08,-30)}function reload(){tone(300,.08,'square',.05,-120);setTimeout(()=>noise(.09,.08,1300),150);setTimeout(()=>tone(420,.08,'square',.05,90),360)}function melee(){noise(.18,.1,700);tone(180,.13,'triangle',.07,-70)}function step(){noise(.07,.045,320);tone(65,.07,'sine',.03,-10)}function artifact(){tone(900,.18,'sine',.06,220);tone(1200,.22,'sine',.045,-100)}function trader(){tone(420,.1,'sine',.04,80);tone(580,.13,'sine',.055,120)}function emissionWarning(){noise(2.2,.16,700);tone(260,1.8,'sawtooth',.1,-120);tone(320,1.5,'sine',.08,-180)}function emissionStart(){noise(4,.32,400);tone(38,3.5,'sine',.25,-12);tone(70,3,'sawtooth',.13,-45);setTimeout(()=>noise(2.8,.28,900),450)}function emissionEnd(){noise(3.5,.12,500);tone(90,2.8,'sine',.07,-35)}function psi(level){const k=Math.max(0,Math.min(1,level/100));tone(90+ k*35,2.6,'sine',.04+k*.08,-30-k*45);tone(420+k*260,1.8,'triangle',.015+k*.035,100+k*180);noise(1.7,.018+k*.055,900+k*1600);if(level>72){tone(rand(1500,2300),.35,'sine',.025,-rand(500,1000));noise(.45,.05,2600)}}
function anomaly(kind){
// Layered, softer anomaly signatures: each cue combines slow modulation, filtered noise and resonant tones.
if(kind==='electric'){noise(.7,.035,3200);noise(.18,.07,5200);tone(rand(900,1500),.75,'sine',.035,-rand(350,800));tone(rand(500,850),1.1,'triangle',.022,rand(250,500));tone(rand(1800,2400),.16,'sine',.018,-rand(500,1200));}
else if(kind==='gravity'){tone(rand(38,52),2.2,'sine',.07,rand(18,32));tone(rand(65,90),1.8,'triangle',.026,-rand(20,40));noise(1.6,.025,260);tone(rand(120,170),1.5,'sine',.018,-rand(60,110));}
else if(kind==='thermal'){noise(1.15,.035,1900);noise(.22,.025,3200);tone(rand(140,190),1.3,'triangle',.035,-rand(50,110));tone(rand(55,80),1.8,'sine',.025,rand(10,25));}
else if(kind==='bio'){noise(1.25,.028,850);tone(rand(95,145),1.7,'sine',.035,-rand(25,50));tone(rand(260,380),.55,'triangle',.018,-rand(100,180));}
else{noise(.9,.03,1200);tone(rand(180,280),1.1,'sine',.03,-rand(60,120));tone(rand(420,600),.5,'triangle',.018,-rand(120,250));}}function enemy(type){if(type==='dog'){noise(.3,.14,1000);tone(170,.45,'sawtooth',.08,-70)}else if(type==='boar'){noise(.5,.2,500);tone(90,.45,'sawtooth',.12,-25)}else if(type==='snork'){noise(.65,.16,1200);tone(230,.5,'sawtooth',.1,-150)}}function walking(dt){if(!ready)return;stepT-=dt;if(stepT<=0){step();stepT=.5}}function update(dt,pos,anomalies,enemies,phase){if(!ready||!pos)return;anomalyTimer-=dt;if(anomalyTimer<=0){anomalyTimer=2.6;let nearest=null,nd=999;for(const a of anomalies||[]){const d=Math.hypot(pos.x-a.x,pos.z-a.z);if(d<nd){nd=d;nearest=a}}if(nearest&&nd<18){anomaly(nearest.kind);}}(enemies||[]).forEach(e=>{e.vocalTimer=(e.vocalTimer||rand(3,6))-dt;const d=Math.hypot(pos.x-e.mesh.position.x,pos.z-e.mesh.position.z);if(e.vocalTimer<=0&&d<22){enemy(e.type);e.vocalTimer=rand(4,9)}else if(e.vocalTimer<=0)e.vocalTimer=rand(2,5)});if(phase==='active'){emissionPulse-=dt;if(emissionPulse<=0){noise(2,.08,700);tone(55,1.8,'sine',.08,-20);emissionPulse=3.5}}else emissionPulse=0}return{unlock,click,pickup,shot,hit,reload,melee,step,artifact,trader,psi,walking,emissionWarning,emissionStart,emissionEnd,update}})();;
['pointerdown','touchstart','keydown'].forEach(e=>window.addEventListener(e,()=>ZoneAudio.unlock(),{once:true,passive:true}));
document.addEventListener('click',e=>{if(e.target.closest('button,.btn,#weaponSlot,.slot,.tradeItem'))ZoneAudio.click()},true);

document.addEventListener('visibilitychange', ()=>{ if(document.hidden) saveState(); });
window.addEventListener('beforeunload', saveState);

addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
