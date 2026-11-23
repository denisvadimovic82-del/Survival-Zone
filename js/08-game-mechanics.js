// ===== МЕХАНИКИ =====
function reload(){
  ZoneAudio.reload();
  const def = equippedDef();
  if(!def || !def.mag) return;
  const total = countAmmo();
  if(total<=0){ log('Нет патронов!'); return; }
  const need = def.mag - ammoInMag;
  if(need<=0){ log('Магазин полон'); return; }
  const take = Math.min(need, total);
  let left = take;
  for(let i=0;i<inventory.length && left>0;i++){
    const it = inventory[i];
    if(it && it.id==='ammo'){ const d = Math.min(it.cnt, left); it.cnt -= d; left -= d; if(it.cnt<=0) inventory[i]=null; }
  }
  ammoInMag += take;
  updateAmmoUI();
  refreshInv();
  saveState();
  log('Перезарядка');
}

let atkAnimT = 0;
function attack(){
  const def = equippedDef();
  if(!def || !def.weapon){ meleeAttack(); return; }
  if(def.mag){
    if(ammoInMag<=0){ reload(); return; }
    atkAnimT = 0.25; shoot();
  } else { meleeAttack(); }
}

function shoot(){
  ZoneAudio.shot();
  const def = equippedDef();
  ammoInMag--; updateAmmoUI();

  // Aim along the screen reticle, and rotate the avatar to that horizontal direction before firing.
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  raycaster.far = 40;
  const aimDir = raycaster.ray.direction.clone();
  const aimYaw = Math.atan2(-aimDir.x, -aimDir.z);
  player.rotation.y = aimYaw;
  state.dir = aimYaw;
  const targets = enemies.filter(en => en && en.hp > 0).map(en => en.mesh);
  const hits = raycaster.intersectObjects(targets, true);
  let hitDistance = 40;
  if(hits.length){
    hitDistance = hits[0].distance;
    let obj = hits[0].object;
    let hitEnemy = null;
    while(obj && !hitEnemy){
      hitEnemy = enemies.find(en => en && en.mesh === obj);
      obj = obj.parent;
    }
    if(hitEnemy){
      const idx = enemies.indexOf(hitEnemy);
      const art=artifactTotals(), critical=Math.random()<art.critChance, shotDamage=def.dmg*(1+art.weaponDamage)*(critical?1.75:1);
      hitEnemy.hp -= shotDamage;
      if(critical)log(`КРИТИЧЕСКОЕ ПОПАДАНИЕ! ${Math.round(shotDamage)} урона`);
      if(hitEnemy.hpbar && hitEnemy.hpbar.userData.fg)
        hitEnemy.hpbar.userData.fg.scale.x = Math.max(0.001, hitEnemy.hp/hitEnemy.maxHp);
      if(hitEnemy.hp <= 0 && idx >= 0) killEnemy(idx);
    }
  }

  // Visual bullet starts at the muzzle tip of the equipped gun, not at the avatar's chest.
  const bullet = new THREE.Mesh(new THREE.SphereGeometry(.045, 5, 5), new THREE.MeshBasicMaterial({color:0xffff00}));
  player.updateMatrixWorld(true);
  let start;
  if(weaponMesh){
    weaponMesh.updateMatrixWorld(true);
    const muzzleLocal = ['rifle','rifle_scoped'].includes(currentWeaponId) ? new THREE.Vector3(0,.06,-1.0) : currentWeaponId==='shotgun' ? new THREE.Vector3(0,.065,-1.12) : currentWeaponId==='smg' ? new THREE.Vector3(0,.07,-.72) : currentWeaponId==='pistol_heavy' ? new THREE.Vector3(0,.07,-.58) : new THREE.Vector3(0,.06,-.42);
    start = weaponMesh.localToWorld(muzzleLocal);
  } else {
    start = player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
  }
  const target = raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, hitDistance);
  const end = target;
  bullet.position.copy(start);
  scene.add(bullet);
  const t0 = performance.now();
  const anim = ()=>{
    const t = (performance.now()-t0)/180;
    if(t>=1){ scene.remove(bullet); bullet.geometry.dispose(); bullet.material.dispose(); return; }
    bullet.position.lerpVectors(start, end, t);
    requestAnimationFrame(anim);
  };
  anim();
  saveState();
}

function meleeAttack(){
  ZoneAudio.melee();
  atkAnimT = 0.35;
  const def=equippedDef(),art=artifactTotals(),baseDmg=def&&def.dmg?def.dmg:2,dmg=baseDmg*(1+art.weaponDamage)*(Math.random()<art.critChance?1.75:1);
  for(let i=enemies.length-1;i>=0;i--){
    const en = enemies[i]; if(!en) continue;
    const d = dist2(en.mesh.position, player.position);
    if(d > 0.001 && d < 2.2){
      const fx = -Math.sin(player.rotation.y), fz = -Math.cos(player.rotation.y);
      const dx = (en.mesh.position.x-player.position.x)/d, dz = (en.mesh.position.z-player.position.z)/d;
      if(fx*dx + fz*dz > 0.2){
        en.hp -= dmg; en.hpbar.userData.fg.scale.x = Math.max(0.001, en.hp/en.maxHp);
        if(en.hp<=0) killEnemy(i);
      }
    }
  }
}

function killEnemy(i){
  const en = enemies[i]; if(!en || en.hp > 0) return;
  const x=en.mesh.position.x, z=en.mesh.position.z;
  if(en.type==='dog' || en.type==='wolf'){
    dropItem('dog_meat',1,x,z);
    if(Math.random()<0.38) dropItem('dog_head',1,x+.35,z);
    if(Math.random()<0.52) dropItem('dog_tail',1,x-.35,z);
  } else if(en.type==='snork'){
    dropItem('snork_meat',1,x,z);
    if(Math.random()<0.34) dropItem('snork_eye',1,x+.35,z);
    if(Math.random()<0.28) dropItem('snork_brain',1,x-.35,z);
    if(Math.random()<0.035) dropItem('helmet_basic',1,x+.55,z+.25);
    if(Math.random()<0.025) dropItem('suit_basic',1,x-.55,z+.25);
  } else if(en.type==='boar'){
    dropItem('boar_meat',1,x,z);
    if(Math.random()<0.48) dropItem('boar_tusks',1,x+.35,z);
    if(Math.random()<0.32) dropItem('boar_leg',1,x-.35,z);
  }
  scene.remove(en.mesh); enemies.splice(i,1); state.xp += 15;
  let leveledUp = false;
  while(state.xp >= state.lvl*100){
    state.xp -= state.lvl*100;
    state.lvl++;
    state.maxHp += 10;
    state.hp = state.maxHp;
    leveledUp = true;
  }
  log(leveledUp ? `УРОВЕНЬ ${state.lvl}!` : 'Противник побежден');
  saveState();
}

let artifactMiniTarget=null, artifactSequence=[], artifactStep=0, artifactPointerStart=null;
const artifactGame=document.getElementById('artifactGame');
const artifactArrow=document.getElementById('artifactArrow');
const artifactProgress=document.getElementById('artifactProgress');
const artifactGameStatus=document.getElementById('artifactGameStatus');
const SWIPE_DIRS=['up','down','left','right'];
const SWIPE_GLYPHS={up:'↑',down:'↓',left:'←',right:'→'};
function hasArtifactDetector(){return !!(deviceGear.detector && deviceGear.detector.id==='artifact_detector');}
function beginArtifactMiniGame(anomaly){ZoneAudio.artifact();
  artifactMiniTarget=anomaly;
  artifactSequence=Array.from({length:5},()=>SWIPE_DIRS[Math.floor(Math.random()*SWIPE_DIRS.length)]);
  artifactStep=0;
  artifactGame.classList.add('open');
  artifactGameStatus.textContent='Свайпай точно по направлению стрелки';
  updateArtifactMiniGame();
}
function updateArtifactMiniGame(){
  artifactArrow.textContent=SWIPE_GLYPHS[artifactSequence[artifactStep]];
  artifactProgress.textContent=`Шаг ${artifactStep+1} из ${artifactSequence.length}`;
}
function finishArtifactMiniGame(success){
  artifactGame.classList.remove('open');
  artifactPointerStart=null;
  if(success && artifactMiniTarget && anomalies.includes(artifactMiniTarget)){
    const a=artifactMiniTarget, id=a.artifactId;
    const quality=rollArtifactQuality();
    if(addItem(id,1,quality)){
      scene.remove(a.mesh); if(a.artifactMesh) scene.remove(a.artifactMesh);
      anomalies.splice(anomalies.indexOf(a),1); const ai=animatedAnomalies.indexOf(a);if(ai>=0)animatedAnomalies.splice(ai,1);
      log(`Детектор извлёк артефакт: ${ITEM_DEFS[id].name} · ${quality.rarity} (${quality.quality}%)`);
      saveState();
    }else log('Инвентарь полон — артефакт остался в аномалии');
  }
  artifactMiniTarget=null;
}
function registerArtifactSwipe(dx,dy){
  if(!artifactGame.classList.contains('open')) return;
  if(Math.max(Math.abs(dx),Math.abs(dy))<35) return;
  const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  if(dir!==artifactSequence[artifactStep]){
    artifactStep=0;
    artifactSequence=Array.from({length:5},()=>SWIPE_DIRS[Math.floor(Math.random()*SWIPE_DIRS.length)]);
    artifactGameStatus.textContent='ОШИБКА! Последовательность сброшена — начинай сначала.';
    updateArtifactMiniGame();
    return;
  }
  artifactStep++;
  if(artifactStep>=artifactSequence.length){
    artifactGameStatus.textContent='Сигнал стабилизирован! Артефакт извлечён.';
    finishArtifactMiniGame(true);
  }else{
    artifactGameStatus.textContent='Верно! Продолжай.';
    updateArtifactMiniGame();
  }
}
artifactGame.addEventListener('pointerdown',e=>{if(e.target.closest('#artifactGameCancel'))return;artifactPointerStart={x:e.clientX,y:e.clientY};});
artifactGame.addEventListener('pointerup',e=>{if(!artifactPointerStart)return;const dx=e.clientX-artifactPointerStart.x,dy=e.clientY-artifactPointerStart.y;artifactPointerStart=null;registerArtifactSwipe(dx,dy);});
document.getElementById('artifactGameCancel').addEventListener('click',()=>finishArtifactMiniGame(false));

// Тап по видимой модели аномалии — альтернативный способ взаимодействия на телефоне/ПК.
const anomalyTapRaycaster=new THREE.Raycaster();
const anomalyTapPointer=new THREE.Vector2();
lookZone.addEventListener('click',e=>{
  if(artifactGame.classList.contains('open') || invPanel.classList.contains('open')) return;
  anomalyTapPointer.x=(e.clientX/innerWidth)*2-1;
  anomalyTapPointer.y=-(e.clientY/innerHeight)*2+1;
  anomalyTapRaycaster.setFromCamera(anomalyTapPointer,camera);
  const meshes=anomalies.map(a=>a.mesh);
  const hit=anomalyTapRaycaster.intersectObjects(meshes,false)[0];
  if(!hit) return;
  const a=anomalies.find(x=>x.mesh===hit.object);
  if(a) startAnomalyExtraction(a);
});

function startAnomalyExtraction(a){
  if(!a) return false;
  const d=Math.hypot(a.x-player.position.x,a.z-player.position.z);
  const interactRadius=Math.max(5.5,(a.r||2.5)+2.2);
  if(d>interactRadius){log('Подойди ближе к аномалии, чтобы использовать детектор.');return false;}
  if(!hasArtifactDetector()){log('Нужен экипированный артефактный детектор. Открой инвентарь → Снаряжение → слот «Детектор».');return false;}
  // Изначально на карте есть обычные опасные аномалии без артефакта.
  // Детектор сканирует и их: при первом запуске назначаем подходящий артефакт.
  if(!a.artifactId){
    const pool=ARTIFACT_ANOMALY_POOLS[a.kind]||ARTIFACT_ANOMALY_POOLS.gravity;
    a.artifactId=pool[Math.floor(Math.random()*pool.length)];
    a.kind=ARTIFACT_ANOMALY_POOLS[a.kind] ? a.kind : 'gravity';
    saveState();
  }
  beginArtifactMiniGame(a);
  return true;
}
function interact(){
  if(player.position.distanceTo(traderPos) < 2.5){ openTrade(); return; }
  // Ищем ближайшую аномалию любого типа: стартовые аномалии тоже сканируются.
  let bestAnomaly=null, anomalyDistance=Infinity;
  anomalies.forEach(a=>{
    const d=Math.hypot(a.x-player.position.x,a.z-player.position.z);
    const interactRadius=Math.max(5.5,(a.r||2.5)+2.2);
    if(d<=interactRadius && d<anomalyDistance){ anomalyDistance=d; bestAnomaly=a; }
  });
  if(bestAnomaly){ startAnomalyExtraction(bestAnomaly); return; }
  let bestO=null, bd=2.4;
  worldObjects.forEach(o=>{ const d = dist2(o.mesh.position, player.position); if(d<bd){ bd=d; bestO=o; } });
  let bestG=null, bgd=2.0;
  groundItems.forEach(g=>{ const d = dist2(g.mesh.position, player.position); if(d<bgd){ bgd=d; bestG=g; } });
  if(bestG && bgd < bd){ pickupItem(bestG); return; }
  if(bestO){
    const def = equippedDef(), power = def && def.speed ? def.speed : 1;
    bestO.hp -= power;
    if(bestO.hp<=0){
      if(bestO.type==='tree') dropItem('wood',2, bestO.mesh.position.x, bestO.mesh.position.z);
      if(bestO.type==='rock') dropItem('stone',2, bestO.mesh.position.x, bestO.mesh.position.z);
      if(bestO.type==='bush') dropItem('fiber',2, bestO.mesh.position.x, bestO.mesh.position.z);
      scene.remove(bestO.mesh); worldObjects.splice(worldObjects.indexOf(bestO),1);
      const respawnX = bestO.spawnX, respawnZ = bestO.spawnZ, respawnType=bestO.type;
      const respawnRecord={type:respawnType,x:respawnX,z:respawnZ,at:Date.now()+9000};
      pendingResourceRespawns.push(respawnRecord);
      setTimeout(()=>{ const ri=pendingResourceRespawns.indexOf(respawnRecord); if(ri<0) return; pendingResourceRespawns.splice(ri,1); if(Number.isFinite(respawnX) && Number.isFinite(respawnZ) && !hasResourceAt(respawnType,respawnX,respawnZ)) addResource(respawnType,respawnX,respawnZ); saveState(); },9000);
      saveState();
      log('Добыто!');
    }
  }
}


// Явная кнопка сканирования: вызывает тот же поиск ближайшей аномалии, что и взаимодействие.
document.getElementById('scanArtifactBtn').addEventListener('click',()=>{
  if(artifactGame.classList.contains('open') || !hasArtifactDetector()) return;
  let best=null,bd=Infinity;
  anomalies.forEach(a=>{const d=Math.hypot(a.x-player.position.x,a.z-player.position.z);if(d<=Math.max(5.5,(a.r||2.5)+2.2)&&d<bd){best=a;bd=d;}});
  if(best) startAnomalyExtraction(best);
});

let tradeMode='buy', tradeSelected=null;
const TRADE_BUY_ITEMS=[
{id:'medkit',price:450,cnt:2},{id:'bandage',price:160,cnt:3},{id:'antidote',price:520,cnt:1},{id:'stimulant',price:700,cnt:1},{id:'ration',price:180,cnt:2},{id:'water',price:90,cnt:2},{id:'antirad',price:400,cnt:1},{id:'vodka',price:220,cnt:1},{id:'ammo',price:180,cnt:30},
{id:'pistol',price:1200,cnt:1},{id:'pistol_heavy',price:2400,cnt:1},{id:'smg',price:3800,cnt:1},{id:'rifle',price:5200,cnt:1},{id:'rifle_scoped',price:8500,cnt:1},{id:'shotgun',price:4600,cnt:1},
{id:'helmet_basic',price:1400,cnt:1},{id:'helmet_tactical',price:3200,cnt:1},{id:'helmet_heavy',price:5600,cnt:1},
{id:'suit_light',price:2800,cnt:1},{id:'suit_basic',price:4500,cnt:1},{id:'suit_heavy',price:9000,cnt:1},
{id:'backpack_basic',price:1800,cnt:1},{id:'backpack_large',price:4200,cnt:1},{id:'artifact_detector',price:2500,cnt:1},
{id:'artifact_medusa',price:3500,cnt:1},{id:'artifact_soul',price:4200,cnt:1},{id:'artifact_flash',price:3000,cnt:1}];
const TRADE_SELL_PRICES={wood:3,stone:4,fiber:2,dog_head:80,dog_tail:45,dog_meat:35,snork_meat:55,snork_eye:180,snork_brain:220,boar_meat:45,boar_tusks:160,boar_leg:90,vodka:250,medkit:600,bandage:90,antidote:300,stimulant:450,ration:100,water:45,antirad:450,artifact_medusa:800,artifact_soul:1000,artifact_flash:700,artifact_rose:900,artifact_magnet:1000,artifact_fruit:1100,artifact_fire:950,artifact_red_crystal:1200,artifact_sun:1400,artifact_battery:1300,artifact_prism:1500,artifact_comet:1700,artifact_jelly:1200,artifact_snake_eye:1450,artifact_slime:1350,artifact_gravi:1800,artifact_bubble:1900,artifact_sparkler:1600,artifact_medical:2200,artifact_crystal:2100,artifact_heart:2400,artifact_wind:2000,artifact_lichen:2300,artifact_thunder:2600,artifact_echo:2500,artifact_void:2800,artifact_gold:3000,artifact_anchor:1900,artifact_ember:650,artifact_frost:1250,artifact_scarab:2100,artifact_moon:2200,artifact_spore:900,artifact_shell:2300,artifact_storm:3200,artifact_blood:3400,artifact_mirror:3600,artifact_crown:4800,artifact_comet_tail:3900,artifact_heartwood:3000,helmet_basic:350,suit_basic:700,backpack_basic:450,helmet_tactical:650,helmet_heavy:1100,suit_light:600,suit_heavy:1600,backpack_large:900};
// Индивидуальная базовая цена каждого артефакта сохраняется; редкость и качество повышают её.
const ARTIFACT_RARITY_PRICE_MULTIPLIERS={'Обычный':1,'Необычный':1.5,'Особый':2,'Редкий':3,'Исключительный':4.5,'Легендарный':7,'Эпический':2};
function getTradeSellPrice(item){
 const base=TRADE_SELL_PRICES[item.id]||0;
 if(!ITEM_DEFS[item.id]?.artifact)return base;
 const rarity=String(item.rarity||'Обычный');
 const rarityKey=Object.keys(ARTIFACT_RARITY_PRICE_MULTIPLIERS).find(k=>k.toLowerCase()===rarity.toLowerCase())||'Обычный';
 const quality=Math.max(.85,Math.min(1.5,(Number(item.quality)||100)/100));
 return Math.max(1,Math.round(base*ARTIFACT_RARITY_PRICE_MULTIPLIERS[rarityKey]*quality*.7));
}

function getTradeSellItems(){
 const result=[];
 inventory.forEach((item,index)=>{if(!item)return;const def=ITEM_DEFS[item.id];const price=getTradeSellPrice(item);if(price>0&&!def?.weapon&&item.id!=='ammo')result.push({id:item.id,cnt:item.cnt,index,source:'inventory',rarity:item.rarity,quality:item.quality,price});});
 return result;
}
function setTradeMode(mode){tradeMode=mode;tradeSelected=null;document.getElementById('tradeBuyMode').classList.toggle('active',mode==='buy');document.getElementById('tradeSellMode').classList.toggle('active',mode==='sell');renderTrade();}
function renderTrade(){if(!tradeList)return;tradeList.innerHTML='';tradeMoney.textContent=`Деньги: ${state.money} ₽`;const buyBtn=document.getElementById('tradeBuy'),sellBtn=document.getElementById('tradeSell');buyBtn.disabled=tradeMode!=='buy'||tradeSelected===null;sellBtn.disabled=tradeMode!=='sell'||tradeSelected===null;
 const items=tradeMode==='buy'?TRADE_BUY_ITEMS:getTradeSellItems();
 items.forEach((it,i)=>{const def=ITEM_DEFS[it.id];if(!def)return;const card=document.createElement('button');card.type='button';card.className='tradeItem'+(tradeSelected===i?' selected':'');card.innerHTML=`<div class="nm">${def.icon} ${def.name}${it.cnt>1?' ×'+it.cnt:''}</div><div class="pr">${it.price} ₽${tradeMode==='sell'?' / 1 шт.':''}</div>`;card.addEventListener('click',()=>{tradeSelected=i;renderTrade();});tradeList.appendChild(card);});
 const info=document.getElementById('tradeSelectedInfo');if(tradeSelected===null)info.innerHTML='Выберите предмет — характеристики появятся здесь';else {const it=items[tradeSelected],def=ITEM_DEFS[it.id];const stats=getItemCharacteristics(it.id,1);info.innerHTML=`<div class="tradeDetailName">${def.icon} ${def.name} — ${it.price} ₽${tradeMode==='sell'?' за 1 шт.':''}</div><div class="tradeDetailStats">${stats.join('<br>')}${tradeMode==='sell'?`<br>В наличии: ${it.cnt}`:''}</div>`; }}
function openTrade(){ZoneAudio.trader();tradePanel.classList.add('open');setTradeMode('buy');}
document.getElementById('tradeBuyMode').addEventListener('click',()=>setTradeMode('buy'));document.getElementById('tradeSellMode').addEventListener('click',()=>setTradeMode('sell'));
document.getElementById('tradeBuy').addEventListener('click',()=>{if(tradeMode!=='buy'||tradeSelected===null)return;const it=TRADE_BUY_ITEMS[tradeSelected],def=ITEM_DEFS[it.id];if(!it||!def)return;if(state.money<it.price){log('Недостаточно рублей');return;}if(!canAddItem(it.id,it.cnt)){log('Недостаточно места в инвентаре');return;}if(!addItem(it.id,it.cnt))return;state.money-=it.price;log(`Куплено: ${def.name} −${it.price} ₽`);tradeSelected=null;renderTrade();saveState();});
document.getElementById('tradeSell').addEventListener('click',()=>{if(tradeMode!=='sell'||tradeSelected===null)return;const current=getTradeSellItems();const it=current[tradeSelected];if(!it)return;const source=inventory;const item=source[it.index];if(!item||item.id!==it.id)return;const def=ITEM_DEFS[it.id];item.cnt--;if(item.cnt<=0)source[it.index]=null;state.money+=it.price;refreshInv();log(`Продано: ${def.name} +${it.price} ₽`);tradeSelected=null;renderTrade();saveState();});

function pickupItem(g){
  if(addItem(g.id,g.cnt,{quality:g.quality||100,rarity:g.rarity||'Обычный'})){
    scene.remove(g.mesh); groundItems.splice(groundItems.indexOf(g),1);
    log('Получено: '+ITEM_DEFS[g.id].name); saveState();
  } else log('Инвентарь полон');
}
