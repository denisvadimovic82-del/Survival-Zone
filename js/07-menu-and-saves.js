// ===== ГЛАВНОЕ МЕНЮ / УПРАВЛЕНИЕ СОХРАНЕНИЯМИ =====
(function initMainMenu(){
  const menu=document.getElementById('mainMenu');
  const continueBtn=document.getElementById('menuContinue');
  const hint=document.getElementById('menuHint');
  const fileInput=document.getElementById('menuFileInput');
  const loader=document.getElementById('loadingScreen');
  const loadingMessage=document.getElementById('loadingMessage');
  const hasSave=(()=>{try{return !!(localStorage.getItem('stalker_zone_v14')||localStorage.getItem('stalker_zone_v13'));}catch(e){return false;}})();

  function showLoading(message, callback){
    loadingMessage.textContent=message||'ПОДГОТОВКА К ВЫХОДУ...';
    menu.classList.add('hidden');
    loader.classList.add('visible');
    window.setTimeout(()=>{ if(typeof callback==='function') callback(); },5000);
  }
  function finishStartupLoading(){
    try{sessionStorage.removeItem('zona_start_loading');}catch(e){}
    document.documentElement.classList.remove('zona-starting');
    menu.classList.add('hidden');
    loader.classList.add('visible');
    loadingMessage.textContent='ЗАГРУЗКА МИРА И СОХРАНЕНИЯ...';
    window.setTimeout(()=>loader.classList.remove('visible'),5000);
  }

  continueBtn.disabled=!hasSave;
  hint.textContent=hasSave?'НАЙДЕНО СОХРАНЕНИЕ. ПРОДОЛЖИТЬ ПУТЬ?':'СОХРАНЕНИЕ НЕ НАЙДЕНО. НАЧНИ НОВУЮ ИГРУ ИЛИ ЗАГРУЗИ ФАЙЛ.';

  let pendingStart=false;
  try{pendingStart=sessionStorage.getItem('zona_start_loading')==='1';}catch(e){}
  if(pendingStart) finishStartupLoading();

  // Продолжить: текущее сохранение уже восстановлено функцией loadState().
  continueBtn.addEventListener('click',()=>{
    if(!hasSave){hint.textContent='Сохранение не найдено.';return;}
    showLoading('ВОССТАНОВЛЕНИЕ СОХРАНЁННОГО МИРА...',()=>loader.classList.remove('visible'));
  });

  // Новая игра: очищаем старые данные и перезапускаем игру с начальными значениями.
  document.getElementById('menuNewGame').addEventListener('click',()=>{
    if(hasSave && !confirm('Начать новую игру? Текущее автосохранение будет удалено.')) return;
    try{
      localStorage.removeItem('stalker_zone_v14');
      localStorage.removeItem('stalker_zone_v13');
      sessionStorage.setItem('zona_start_loading','1');
    }catch(e){hint.textContent='Не удалось очистить старое сохранение.';return;}
    showLoading('СОЗДАНИЕ НОВОГО МИРА...',()=>location.reload());
  });

  // Импорт: после выбора файла сразу загружаем игру, меню повторно не показываем.
  document.getElementById('menuLoad').addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files&&fileInput.files[0]; if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      if(!data || typeof data!=='object' || !data.state || typeof data.state!=='object' || !Array.isArray(data.inventory))
        throw new Error('Неверный формат сохранения');
      localStorage.setItem('stalker_zone_v14',JSON.stringify(data));
      localStorage.removeItem('stalker_zone_v13');
      sessionStorage.setItem('zona_start_loading','1');
      showLoading('ЗАГРУЗКА ВЫБРАННОГО СОХРАНЕНИЯ...',()=>location.reload());
    }catch(e){hint.textContent='ОШИБКА ЗАГРУЗКИ: '+e.message;fileInput.value='';}
  });

  // Экспорт: только сохраняем файл; не закрываем меню, не запускаем игру.
  document.getElementById('menuSave').addEventListener('click',()=>{
    try{
      saveState();
      const raw=localStorage.getItem('stalker_zone_v14');
      if(!raw) throw new Error('Нет данных для сохранения');
      const blob=new Blob([raw],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='zona_save_'+new Date().toISOString().slice(0,10)+'.json';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      hint.textContent='ИГРА СОХРАНЕНА В ФАЙЛ.';
    }catch(e){hint.textContent='НЕ УДАЛОСЬ СОХРАНИТЬ: '+e.message;}
  });
})();

let emissionPhase = state.emissionClock >= 225 ? 'active' : (state.emissionClock >= 210 ? 'warning' : 'calm');
let emissionFlashTimer = 0;
function restoreWorldSnapshot(w){
  if(!w || typeof w!=='object') return;
  const validSavedResources = Array.isArray(w.resources) ? w.resources.filter(o=>o && ['tree','rock','bush'].includes(o.type) && Number.isFinite(o.x) && Number.isFinite(o.z)) : [];
  // Older saves stored undefined spawn coordinates. Keep the freshly generated world instead of wiping it.
  if(validSavedResources.length || (Array.isArray(w.resources) && w.resources.length===0)){
    worldObjects.slice().forEach(o=>scene.remove(o.mesh)); worldObjects.length=0;
    validSavedResources.forEach(o=>{ addResource(o.type,o.x,o.z); const r=worldObjects[worldObjects.length-1]; if(r && Number.isFinite(o.hp)) r.hp=Math.max(0,Math.min(r.hp,o.hp)); });
  }
  pendingResourceRespawns = Array.isArray(w.pendingRespawns) ? w.pendingRespawns.filter(r=>r && ['tree','rock','bush'].includes(r.type) && Number.isFinite(r.x) && Number.isFinite(r.z) && Number.isFinite(r.at)) : [];
  pendingResourceRespawns.forEach(r=>{ const wait=Math.max(0,r.at-Date.now()); setTimeout(()=>{ const idx=pendingResourceRespawns.indexOf(r); if(idx<0) return; pendingResourceRespawns.splice(idx,1); if(!hasResourceAt(r.type,r.x,r.z)) addResource(r.type,r.x,r.z); saveState(); },wait); });
  groundItems.slice().forEach(g=>scene.remove(g.mesh)); groundItems.length=0;
  if(Array.isArray(w.groundItems)) w.groundItems.forEach(g=>{ if(g && ITEM_DEFS[g.id] && Number.isFinite(g.cnt) && g.cnt>0 && Number.isFinite(g.x) && Number.isFinite(g.z)) dropItem(g.id,Math.floor(g.cnt),g.x,g.z,.5,{quality:g.quality,rarity:g.rarity}); });
  anomalies.slice().forEach(a=>{scene.remove(a.mesh);if(a.artifactMesh)scene.remove(a.artifactMesh);}); anomalies.length=0;
  if(Array.isArray(w.anomalies)) w.anomalies.forEach(a=>{ if(a && Number.isFinite(a.x) && Number.isFinite(a.z)) spawnAnomaly(a.x,a.z,a.r,a.kind||'hazard',a.artifactId||null); });
  enemies.slice().forEach(e=>scene.remove(e.mesh)); enemies.length=0;
  // Restore only a bounded, valid living population so old/corrupt saves cannot
  // permanently exceed the spawn system's intended population.
  if(Array.isArray(w.enemies)) w.enemies.filter(e=>e && ['dog','wolf','boar','snork'].includes(e.type) && Number.isFinite(e.x) && Number.isFinite(e.z) && (!Number.isFinite(e.hp) || e.hp>0)).slice(0,8).forEach(e=>spawnEnemy(e.type==='wolf'?'dog':e.type,e.x,e.z,e));
  ensureResourcePopulation(55);
}
if(loaded && savedWorldData) restoreWorldSnapshot(savedWorldData);
state.vy = 0;
player.position.x = state.x;
player.position.z = state.z;
player.position.y = getTerrainHeight(state.x, state.z);

// Spawn timer must exist before startup code resets it (TDZ fix).
let enemySpawnTimer = 0;
// Make sure each enemy type is actually nearby after restoring the saved player position.
const starterTypes=['dog','boar','snork'];
for(const type of starterTypes){
  const nearbyOfType=enemies.filter(e=>e&&e.hp>0&&e.type===type&&dist2(e.mesh.position,player.position)<45).length;
  if(nearbyOfType===0){ const a=Math.random()*Math.PI*2, r=12+Math.random()*6; spawnEnemy(type,player.position.x+Math.cos(a)*r,player.position.z+Math.sin(a)*r); }
}
enemySpawnTimer=0;

if(loaded && weaponGear && ITEM_DEFS[weaponGear.id] && ITEM_DEFS[weaponGear.id].weapon){
  // Оружие хранится в weaponGear, а не в inventory[equippedIndex].
  // Восстанавливаем модель в руках после перезахода и сохраняем патроны в магазине.
  setWeapon(weaponGear.id, true);
} else if(loaded && equippedIndex>=0 && inventory[equippedIndex]){
  // Совместимость со старыми сохранениями, где оружие ещё могло быть в инвентаре.
  const loadedDef = ITEM_DEFS[inventory[equippedIndex].id];
  if(loadedDef && loadedDef.weapon) setWeapon(inventory[equippedIndex].id, true);
  else updateAmmoUI();
} else if(!loaded) {
  inventory[0] = {id:'pistol', cnt:1};
  inventory[1] = {id:'ammo', cnt:30};
  inventory[2] = {id:'medkit', cnt:2};
  inventory[3] = {id:'antirad', cnt:1};
  inventory[4] = {id:'vodka', cnt:1};
  equippedIndex = 0;
  setWeapon('pistol');
} else {
  updateAmmoUI();
  refreshInv();
}
updateBars();
updateAmmoUI();

// Начальная проверка безопасной зоны и укрытий.
if (isProtectedFromEmission(player.position.x, player.position.z)) {
  const inCamp=Math.hypot(player.position.x-SAFE_ZONE_CENTER.x,player.position.z-SAFE_ZONE_CENTER.z)<SAFE_ZONE_RADIUS;
  safeIndicator.textContent=inCamp?'🛡️ БЕЗОПАСНАЯ ЗОНА':'🛖 В УКРЫТИИ';
  safeIndicator.style.display='block'; safeIndicator.classList.add('active'); safeIndicator.style.opacity='1';
  state.wasSafe=inCamp;
}

// ===== УПРАВЛЕНИЕ =====
const joyEl = document.getElementById('joy');
const knob = document.getElementById('knob');
const joy = {active:false, dx:0, dy:0};

joyEl.addEventListener('touchstart', e=>{ joy.active = true; moveJoy(e.touches[0]); e.preventDefault(); }, {passive:false});
joyEl.addEventListener('touchmove', e=>{ if(joy.active) moveJoy(e.touches[0]); e.preventDefault(); }, {passive:false});
joyEl.addEventListener('touchend', e=>{ joy.active = false; joy.dx = joy.dy = 0; knob.style.transform = 'translate(0,0)'; e.preventDefault(); }, {passive:false});
joyEl.addEventListener('touchcancel', ()=>{ joy.active = false; joy.dx = joy.dy = 0; knob.style.transform = 'translate(0,0)'; });
function moveJoy(t){
  const r = joyEl.getBoundingClientRect();
  let dx = t.clientX - (r.left + r.width/2), dy = t.clientY - (r.top + r.height/2);
  const len = Math.hypot(dx, dy), max = 38;
  if(len > max){ dx = dx/len*max; dy = dy/len*max; }
  joy.dx = dx/max; joy.dy = dy/max;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
}

const lookZone = document.getElementById('lookZone');
let look = {active:false, lastX:0, lastY:0, touchId:null};
lookZone.addEventListener('touchstart', e=>{
  if(look.active) return;
  const t = e.changedTouches[0]; look.active = true; look.touchId = t.identifier;
  look.lastX = t.clientX; look.lastY = t.clientY; e.preventDefault();
}, {passive:false});
lookZone.addEventListener('touchmove', e=>{
  if(!look.active) return;
  for(let i=0;i<e.changedTouches.length;i++){
    const t = e.changedTouches[i];
    if(t.identifier !== look.touchId) continue;
    const dx = t.clientX - look.lastX, dy = t.clientY - look.lastY;
    look.lastX = t.clientX; look.lastY = t.clientY;
    state.camYaw -= dx * 0.005;
    state.camPitch = Math.max(-0.15, Math.min(1.2, state.camPitch + dy * 0.005));
  }
  e.preventDefault();
}, {passive:false});
function endLook(e){
  if(!look.active) return;
  for(let i=0;i<e.changedTouches.length;i++){
    if(e.changedTouches[i].identifier === look.touchId){ look.active = false; look.touchId = null; break; }
  }
}
window.addEventListener('touchend', endLook);
window.addEventListener('touchcancel', endLook);

function bindBtn(id, fn){
  const el = document.getElementById(id);
  if(!el) return;
  let touched = false;
  el.addEventListener('touchstart', e=>{ touched = true; fn(); e.preventDefault(); e.stopPropagation(); }, {passive:false});
  el.addEventListener('click', e=>{ if(touched){ touched = false; e.preventDefault(); return; } fn(); e.preventDefault(); });
}

function doAutoAim(){
  // The aim button is a toggle: tapping it again releases the current target.
  if(aimLockEnemy){
    aimLockEnemy = null;
    aimTargetEl.style.display = 'none';
    log('Автонаведение выключено');
    return;
  }
  let best = null, bestD = 30;
  enemies.forEach(en=>{
    const d = dist2(en.mesh.position, player.position);
    if(d < bestD && en.hp > 0){
      const distToSafe = Math.hypot(en.mesh.position.x - SAFE_ZONE_CENTER.x, en.mesh.position.z - SAFE_ZONE_CENTER.z);
      if(distToSafe < SAFE_ZONE_RADIUS + 1) return;
      best = en; bestD = d;
    }
  });
  if(!best){ aimLockEnemy = null; aimTargetEl.style.display = 'none'; log('Нет цели рядом'); return; }
  aimLockEnemy = best;
  aimTargetEl.style.display = 'block';
  log('🎯 Прицел зафиксирован на враге');
}

bindBtn('bJump', ()=>{ if(state.onGround){ state.vy = 6.0*(1+artifactTotals().jump); state.onGround = false; } });
bindBtn('bAtk', ()=>attack());
bindBtn('bReload', ()=>reload());
bindBtn('bInteract', ()=>interact());
bindBtn('bAim', doAutoAim);
bindBtn('bInv', ()=>{ invPanel.classList.toggle('open'); if(invPanel.classList.contains('open')) refreshInv(); });
document.getElementById('invSort').addEventListener('click',sortInventory);
document.getElementById('invClose').addEventListener('click', ()=> invPanel.classList.remove('open'));
document.getElementById('tabInventory').addEventListener('click',()=>setInventoryView('inventory'));
document.getElementById('tabEquipment').addEventListener('click',()=>setInventoryView('equipment'));
document.getElementById('tabStats').addEventListener('click',()=>setInventoryView('stats')); 
document.getElementById('tradeClose').addEventListener('click', ()=> tradePanel.classList.remove('open'));
