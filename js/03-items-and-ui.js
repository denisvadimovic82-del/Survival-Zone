// ===== ITEM_DEFS =====
const ITEM_DEFS = {
  wood:   {name:'Дерево', icon:'🪵', desc:'Материал', stack:99},
  stone:  {name:'Камень', icon:'🪨', desc:'Материал', stack:99},
  fiber:  {name:'Волокно', icon:'🌿', desc:'Материал', stack:99},
  dog_head:{name:'Голова собаки',icon:'🐺',desc:'Трофей с мутировавшей собаки',stack:10},
  dog_tail:{name:'Хвост собаки',icon:'🦴',desc:'Трофей с мутировавшей собаки',stack:20},
  dog_meat:{name:'Мясо собаки',icon:'🥩',desc:'Мясо мутанта',stack:20},
  snork_meat:{name:'Мясо снорка',icon:'🥩',desc:'Мясо мутанта',stack:20},
  snork_eye:{name:'Глаз снорка',icon:'👁️',desc:'Редкий трофей мутанта',stack:10},
  snork_brain:{name:'Мозг снорка',icon:'🧠',desc:'Редкий трофей мутанта',stack:10},
  boar_meat:{name:'Мясо кабана',icon:'🥩',desc:'Мясо мутанта',stack:20},
  boar_tusks:{name:'Клыки кабана',icon:'🦷',desc:'Трофей с мутировавшего кабана',stack:10},
  boar_leg:{name:'Нога кабана',icon:'🦴',desc:'Трофей с мутировавшего кабана',stack:10},
  vodka:  {name:'Водка', icon:'🍶', desc:'-30 рад', stack:10, rad:-30},
  medkit: {name:'Аптечка', icon:'💊', desc:'Восстанавливает 55 HP и снижает токсины', stack:10, heal:55, detox:20},
  antirad:{name:'Антирад', icon:'💉', desc:'-50 рад', stack:10, rad:-50},
  bandage:{name:'Бинт',icon:'🩹',desc:'Останавливает кровотечение и немного восстанавливает здоровье',stack:10,bandage:true,heal:12},
  antidote:{name:'Антидот',icon:'🧪',desc:'Снижает интоксикацию на 65%',stack:10,detox:65},
  stimulant:{name:'Стимулятор',icon:'💉',desc:'Временно ускоряет восстановление выносливости и повышает скорость',stack:10,stim:true},
  ration:{name:'Сухпаёк',icon:'🥫',desc:'Восстанавливает голод на 45%',stack:20,food:45},
  water:{name:'Бутылка воды',icon:'🧴',desc:'Восстанавливает жажду на 55%',stack:20,drink:55},
  pistol: {name:'Пистолет', icon:'🔫', desc:'Урон 8, магазин 12', stack:1, weapon:true, dmg:8, mag:12},
  pistol_heavy:{name:'Тяжёлый пистолет',icon:'🔫',desc:'Урон 11, магазин 8',stack:1,weapon:true,dmg:11,mag:8},
  smg:{name:'Компактный ПП',icon:'🔫',desc:'Урон 7, магазин 24',stack:1,weapon:true,dmg:7,mag:24},
  rifle:  {name:'Автомат', icon:'🔫', desc:'Урон 12, магазин 30', stack:1, weapon:true, dmg:12, mag:30},
  rifle_scoped:{name:'Оптический автомат',icon:'🎯',desc:'Урон 15, магазин 20',stack:1,weapon:true,dmg:15,mag:20},
  shotgun:{name:'Дробовик (игровой)',icon:'🔫',desc:'Урон 18, магазин 6',stack:1,weapon:true,dmg:18,mag:6},
  ammo:   {name:'Патроны', icon:'📦', desc:'Боеприпасы', stack:200},
  artifact_detector:{name:'Артефактный детектор',icon:'📡',desc:'Специальный прибор для извлечения артефактов из аномалий. Запускает мини-игру со свайпами.',stack:1,device:true},
  artifact_medusa: {name:'Медуза', icon:'💎', desc:'+2 HP/сек, +3 рад/сек', stack:1, artifact:true, radRate:3, hpRate:2},
  artifact_soul:   {name:'Душа', icon:'🔮', desc:'-5 рад/сек', stack:1, artifact:true, radRate:-5},
  artifact_flash:  {name:'Вспышка', icon:'✨', desc:'+20% скорость, +4 рад/сек', stack:1, artifact:true, speed:1.2, radRate:4},
  artifact_rose:{name:'Пульсар',icon:'🌹',desc:'Гравитационный артефакт: +2 рад/сек',stack:1,artifact:true,radRate:2},
  artifact_magnet:{name:'Феррит',icon:'🧲',desc:'Артефакт: -2 рад/сек',stack:1,artifact:true,radRate:-2},
  artifact_fruit:{name:'Живица',icon:'🍈',desc:'Артефакт: +2 HP/сек, +1 рад/сек',stack:1,artifact:true,hpRate:2,radRate:1},
  artifact_fire:{name:'Искра',icon:'🔥',desc:'Термический артефакт: +3 рад/сек',stack:1,artifact:true,radRate:3},
  artifact_red_crystal:{name:'Термит',icon:'🔴',desc:'Термический артефакт: -1 рад/сек',stack:1,artifact:true,radRate:-1},
  artifact_sun:{name:'Зарево',icon:'☀️',desc:'Артефакт: +1 HP/сек, +1 рад/сек',stack:1,artifact:true,hpRate:1,radRate:1},
  artifact_battery:{name:'Вольтень',icon:'🔋',desc:'Электрофизический артефакт: +2 рад/сек',stack:1,artifact:true,radRate:2},
  artifact_prism:{name:'Спектр',icon:'💠',desc:'Электрофизический артефакт: -2 рад/сек',stack:1,artifact:true,radRate:-2},
  artifact_comet:{name:'Стриж',icon:'☄️',desc:'Артефакт: +1 HP/сек, +2 рад/сек',stack:1,artifact:true,hpRate:1,radRate:2},
  artifact_jelly:{name:'Мицелий',icon:'🟢',desc:'Биохимический артефакт: -3 рад/сек',stack:1,artifact:true,radRate:-3},
  artifact_snake_eye:{name:'Василиск',icon:'🐍',desc:'Биохимический артефакт: -2 рад/сек',stack:1,artifact:true,radRate:-2},
  artifact_slime:{name:'Слизень',icon:'🫧',desc:'Биохимический артефакт: +2 HP/сек, +1 рад/сек',stack:1,artifact:true,hpRate:2,radRate:1},
  artifact_gravi:{name:'Гравик',icon:'🪨',desc:'+12% переносимый вес, -2 рад/сек',stack:1,artifact:true,capacity:12,radRate:-2},
  artifact_bubble:{name:'Пузырь',icon:'🫧',desc:'+25% защиты от радиации, -1 HP/сек',stack:1,artifact:true,radResist:.25,hpRate:-1},
  artifact_sparkler:{name:'Искрец',icon:'⚡',desc:'+15% скорость, +2 рад/сек',stack:1,artifact:true,speed:1.15,radRate:2},
  artifact_medical:{name:'Панацея',icon:'🧬',desc:'+3 HP/сек, +1 рад/сек',stack:1,artifact:true,hpRate:3,radRate:1},
  artifact_crystal:{name:'Кристалл',icon:'🔷',desc:'+10% защиты от урона, +2 рад/сек',stack:1,artifact:true,damageResist:.10,radRate:2},
  artifact_heart:{name:'Сердце',icon:'❤️',desc:'+2 HP/сек, +1 рад/сек',stack:1,artifact:true,hpRate:2,radRate:1},
  artifact_wind:{name:'Ветер',icon:'🌪️',desc:'+25% скорость, -1 HP/сек',stack:1,artifact:true,speed:1.25,hpRate:-1},
  artifact_lichen:{name:'Лишайник',icon:'🍀',desc:'-4 рад/сек, -5% защиты от урона',stack:1,artifact:true,radRate:-4,damageResist:-.05},
  artifact_thunder:{name:'Гром',icon:'🌩️',desc:'+20% защиты от урона, +4 рад/сек',stack:1,artifact:true,damageResist:.20,radRate:4},
  artifact_echo:{name:'Эхо',icon:'🔔',desc:'+2 HP/сек, +10% скорость, +2 рад/сек',stack:1,artifact:true,hpRate:2,speed:1.10,radRate:2},
  artifact_void:{name:'Пустышка',icon:'⚫',desc:'-6 рад/сек, -10% скорость, +15% пси-защиты',stack:1,artifact:true,radRate:-6,speed:.90,psiResist:.15},
  artifact_gold:{name:'Золотая рыбка',icon:'🐟',desc:'+5 HP/сек, +5 рад/сек',stack:1,artifact:true,hpRate:5,radRate:5,rarity:'легендарный'},
  artifact_anchor:{name:'Якорь',icon:'⚓',desc:'+25 кг переносимого веса, -8% скорость',stack:1,artifact:true,capacity:25,speed:.92,rarity:'редкий'},
  artifact_ember:{name:'Уголёк',icon:'🟠',desc:'+2 HP/сек, +3 рад/сек',stack:1,artifact:true,hpRate:2,radRate:3,rarity:'обычный'},
  artifact_frost:{name:'Иней',icon:'❄️',desc:'-3 рад/сек, -1 HP/сек',stack:1,artifact:true,radRate:-3,hpRate:-1,rarity:'необычный'},
  artifact_scarab:{name:'Скарабей',icon:'🪲',desc:'+15% защиты от урона, +2 рад/сек',stack:1,artifact:true,damageResist:.15,radRate:2,rarity:'редкий'},
  artifact_moon:{name:'Лунный камень',icon:'🌙',desc:'+2 HP/сек, -2 рад/сек',stack:1,artifact:true,hpRate:2,radRate:-2,rarity:'редкий'},
  artifact_spore:{name:'Спора',icon:'🍄',desc:'+4 HP/сек, +4 рад/сек',stack:1,artifact:true,hpRate:4,radRate:4,rarity:'необычный'},
  artifact_shell:{name:'Панцирь',icon:'🐚',desc:'+30% защиты от радиации, -5% скорость',stack:1,artifact:true,radResist:.30,speed:.95,rarity:'редкий'},
  artifact_storm:{name:'Грозовой шар',icon:'🌩️',desc:'+20% скорость, +5 рад/сек',stack:1,artifact:true,speed:1.20,radRate:5,rarity:'эпический'},
  artifact_blood:{name:'Кровь камня',icon:'🩸',desc:'+5 HP/сек, -10% защиты от урона',stack:1,artifact:true,hpRate:5,damageResist:-.10,rarity:'эпический'},
  artifact_mirror:{name:'Зеркало',icon:'🪞',desc:'+20% защиты от урона, +25% пси-защиты, -3 рад/сек',stack:1,artifact:true,damageResist:.20,psiResist:.25,radRate:-3,rarity:'эпический'},
  artifact_crown:{name:'Корона',icon:'👑',desc:'+5 к максимуму здоровья, +2 HP/сек, +3 рад/сек',stack:1,artifact:true,maxHp:5,hpRate:2,radRate:3,rarity:'легендарный'},
  artifact_comet_tail:{name:'Хвост кометы',icon:'🌠',desc:'+30% скорость, -2 HP/сек',stack:1,artifact:true,speed:1.30,hpRate:-2,rarity:'легендарный'},
  artifact_heartwood:{name:'Живое сердце',icon:'💚',desc:'+4 HP/сек, -1 рад/сек',stack:1,artifact:true,hpRate:4,radRate:-1,rarity:'эпический'},
  helmet_basic:{name:'Простой шлем',icon:'🪖',desc:'Снижает урон, радиацию и немного пси-воздействие',stack:1,armor:true,armorSlot:'helmet',radResist:0.12,damageResist:0.06,psiResist:0.04,gravityResist:0.03},
  suit_basic:{name:'Костюм сталкера',icon:'🦺',desc:'Снижает урон, радиацию и пси-воздействие',stack:1,armor:true,armorSlot:'suit',damageResist:0.15,radResist:0.08,psiResist:0.08,gravityResist:0.04},
  backpack_basic:{name:'Рюкзак',icon:'🎒',desc:'+5 ячеек инвентаря, +15 кг переносимого веса',stack:1,armor:true,armorSlot:'backpack',capacity:15,slots:5},
  helmet_tactical:{name:'Тактический шлем',icon:'🪖',desc:'Усиленная защита от урона, радиации и пси-воздействия',stack:1,armor:true,armorSlot:'helmet',radResist:0.2,damageResist:0.1,psiResist:0.12,gravityResist:0.06},
  helmet_heavy:{name:'Бронированный шлем',icon:'⛑️',desc:'Высокая защита от урона, радиации и пси-воздействия',stack:1,armor:true,armorSlot:'helmet',radResist:0.3,damageResist:0.15,psiResist:0.18,gravityResist:0.10},
  suit_light:{name:'Лёгкий комбинезон',icon:'🦺',desc:'Лёгкая защита от урона, радиации и пси-воздействия',stack:1,armor:true,armorSlot:'suit',damageResist:0.1,radResist:0.12,psiResist:0.10,gravityResist:0.05},
  suit_heavy:{name:'Тяжёлый бронекостюм',icon:'🥋',desc:'Усиленная защита от урона, радиации и пси-воздействия',stack:1,armor:true,armorSlot:'suit',damageResist:0.28,radResist:0.2,psiResist:0.15,gravityResist:0.12},
  backpack_large:{name:'Большой рюкзак',icon:'🎒',desc:'+10 ячеек инвентаря, +30 кг переносимого веса',stack:1,armor:true,armorSlot:'backpack',capacity:30,slots:10},
};
// Типы артефактов и дополнительные свойства в духе STALCRAFT: каждый предмет получает
// свой профиль внутри семейства аномалии. Бонусы ниже реально влияют на игровой процесс.
const ARTIFACT_TYPE_LABELS={gravity:'Гравитационный',thermal:'Термический',electric:'Электрофизический',bio:'Биохимический'};
const ARTIFACT_RARITIES=[
  {name:'Обычный',min:85,max:100,weight:52},
  {name:'Необычный',min:100,max:110,weight:23},
  {name:'Особый',min:110,max:120,weight:13},
  {name:'Редкий',min:120,max:130,weight:7},
  {name:'Исключительный',min:130,max:140,weight:4},
  {name:'Легендарный',min:140,max:150,weight:1}
];
function rollArtifactQuality(){
  let roll=Math.random()*ARTIFACT_RARITIES.reduce((n,r)=>n+r.weight,0), tier=ARTIFACT_RARITIES[0];
  for(const r of ARTIFACT_RARITIES){roll-=r.weight;if(roll<=0){tier=r;break;}}
  return {rarity:tier.name,quality:Math.round((tier.min+Math.random()*(tier.max-tier.min))*10)/10};
}
// Старые сохранения и купленные ранее артефакты сохраняют работоспособность.
function normalizeArtifactItem(it){if(it&&ITEM_DEFS[it.id]?.artifact){if(!Number.isFinite(it.quality))it.quality=100;if(!it.rarity)it.rarity='Обычный';}return it;}


const INV_SIZE = 25; // базовые слоты без рюкзака
let inventory = new Array(INV_SIZE).fill(null);
function inventoryCapacity(backpack=armorGear.backpack){
  return INV_SIZE + (backpack ? (ITEM_DEFS[backpack.id]?.slots || 0) : 0);
}
// Возвращает компактный инвентарь нужного размера или null, если предметы не помещаются.
// Предметы из дополнительных ячеек переносятся в свободные базовые ячейки, а не удаляются.
function fitInventoryCapacity(items, capacity){
  const result=items.slice(0, Math.max(items.length, capacity));
  while(result.length<capacity) result.push(null);
  const overflow=[];
  for(let i=capacity;i<result.length;i++) if(result[i]) overflow.push(result[i]);
  if(overflow.length){
    const free=[];
    for(let i=0;i<capacity;i++) if(!result[i]) free.push(i);
    if(free.length<overflow.length) return null;
    overflow.forEach((item,n)=>{ result[free[n]]=item; });
  }
  result.length=capacity;
  return result;
}
function syncInventoryCapacity(){
  const fitted=fitInventoryCapacity(inventory,inventoryCapacity());
  if(fitted) inventory=fitted;
  selectedSlot=Math.max(0,Math.min(selectedSlot,inventory.length-1));
}
let artifactSlots = new Array(5).fill(null);
let armorGear = {helmet:null,suit:null,backpack:null};
let deviceGear = {detector:null};
let selectedSlot = 0;
let equippedIndex = -1;
let weaponGear = null;
let ammoInMag = 0;

// ===== UI-ФУНКЦИИ =====
const gameToastStack=document.getElementById('gameToastStack');
const zoneResultToastStack=document.getElementById('zoneResultToastStack');
const gameToastQueue=[];
const zoneResultToastQueue=[];
function positionGameToasts(){
  if(!gameToastStack)return;
  const hud=document.getElementById('survivalHUD');
  const crosshair=document.getElementById('crosshair');
  const hudRect=hud?hud.getBoundingClientRect():safeIndicator.getBoundingClientRect();
  const aimRect=crosshair?crosshair.getBoundingClientRect():{top:window.innerHeight*.5};
  // Невидимый коридор уведомлений: от нижней кромки ПДА до прицела.
  // PSI-плашка имеет приоритет: обычные сообщения начинаются ниже неё.
  const psiVisible=psiBanner&&psiBanner.style.display==='block';
  const psiRect=psiVisible?psiBanner.getBoundingClientRect():null;
  const safeVisible=safeIndicator&&safeIndicator.style.display!=='none'&&safeIndicator.classList.contains('active');
  const safeRect=safeVisible?safeIndicator.getBoundingClientRect():null;
  // Баннер обратного отсчёта выброса резервирует своё место: обычные сообщения идут ниже него.
  const emissionVisible=emissionBanner&&emissionBanner.style.display!=='none';
  const emissionRect=emissionVisible?emissionBanner.getBoundingClientRect():null;
  const anchorBottom=Math.max(hudRect.bottom,safeRect?safeRect.bottom:0,psiRect?psiRect.bottom:0,emissionRect?emissionRect.bottom:0);
  const top=Math.round(anchorBottom+8);
  const available=Math.max(0,Math.round(aimRect.top-top-10));
  gameToastStack.style.top=top+'px';
  // Не обрезаем контейнер: высота каждой плашки остаётся полной.
  gameToastStack.style.maxHeight='none';
  gameToastStack.style.overflow='visible';
  // Удаляем только самые старые сообщения, если суммарно не хватает места.
  let total=0;const gap=parseFloat(getComputedStyle(gameToastStack).gap)||6;
  for(const toast of gameToastQueue){if(toast.isConnected)total+=toast.getBoundingClientRect().height;}
  total+=Math.max(0,gameToastQueue.filter(t=>t.isConnected).length-1)*gap;
  while(gameToastQueue.length>1&&total>available){const old=gameToastQueue.pop();if(old&&old.isConnected){total-=old.getBoundingClientRect().height+gap;old.remove();}total=Math.max(0,total);}
  if(zoneResultToastStack){
    // Итоговые сообщения выброса: под плашкой безопасной зоны,
    // а вне неё — под HUD, чтобы уведомления не прыгали к верхнему краю.
    const safeIsVisible=safeIndicator&&safeIndicator.style.display!=='none'&&safeIndicator.classList.contains('active');
    const zoneAnchorBottom=safeIsVisible
      ? safeIndicator.getBoundingClientRect().bottom
      : (hud?hud.getBoundingClientRect().bottom:190);
    zoneResultToastStack.style.top=Math.round(zoneAnchorBottom+8)+'px';
  }
}
function positionPsiBanner(){
  if(!psiBanner)return;
  const hud=document.getElementById('survivalHUD');
  const hudRect=hud?hud.getBoundingClientRect():null;
  const safeVisible=safeIndicator&&safeIndicator.style.display!=='none'&&safeIndicator.classList.contains('active');
  // ПСИ-плашка располагается ниже HUD/безопасной зоны, но выше обычных уведомлений.
  const anchorBottom=safeVisible?safeIndicator.getBoundingClientRect().bottom:(hudRect?hudRect.bottom:190);
  psiBanner.style.top=Math.round(anchorBottom+8)+'px';
  if(gameToastStack)positionGameToasts();
}
window.addEventListener('resize',()=>{positionGameToasts();positionPsiBanner();});
function showGameToast(message,duration=3800,type='info'){
  if(!gameToastStack)return;
  positionGameToasts();
  const text=String(message||'');
  // Только два итоговых сообщения выброса размещаем непосредственно под безопасной зоной.
  const isZoneResult=/^☢️\s*(?:ВЫБРОС ОТСТУПИЛ|ВЫБРОС ЗАВЕРШИЛСЯ|Выброс закончился\.)/i.test(text);
  const targetStack=isZoneResult&&zoneResultToastStack?zoneResultToastStack:gameToastStack;
  const targetQueue=isZoneResult?zoneResultToastQueue:gameToastQueue;
  let icon='◈';
  if(/кров|ранен|урон|критич|смерт|опасност|пси|выброс|радиац|токсин|нет патрон/i.test(text)){type=type==='info'?'danger':type;icon='⚠';}
  else if(/подоб|добыто|куплено|продано|экипир|остановлено|сохран|уровень|побежден/i.test(text)){type=type==='info'?'success':type;icon='✓';}
  else if(/аномал|детектор|необходимо|нужен|подойди|недостат|нет места|инвентар/i.test(text)){type=type==='info'?'warning':type;icon='⌁';}
  const toast=document.createElement('div');toast.className='gameToast toast-'+type;if(/^(?:Возрождение\.\.\.|Перезарядка)$/i.test(text.trim()))toast.classList.add('toast-respawn');
  const iconEl=document.createElement('span');iconEl.className='toastIcon';iconEl.textContent=icon;
  const messageEl=document.createElement('span');messageEl.textContent=text;
  toast.append(iconEl,messageEl);targetStack.prepend(toast);targetQueue.unshift(toast);
  const maxCount=isZoneResult?2:4;
  while(targetQueue.length>maxCount){const old=targetQueue.pop();old.remove();}
  if(!isZoneResult)positionGameToasts();
  const life=Math.max(1800,Math.min(8500,duration||3800));
  setTimeout(()=>{if(!toast.isConnected)return;toast.classList.add('toast-out');setTimeout(()=>{toast.remove();const i=targetQueue.indexOf(toast);if(i>=0)targetQueue.splice(i,1);},260);},life);
}
function log(t,duration=3800){
  showGameToast(t,duration);
  // Сохраняем старую строку журнала как совместимый скрытый вывод.
  logEl.textContent=t;logEl.style.opacity=0;
}
function flashHurt(){ hurtFlash.style.opacity = 1; setTimeout(()=>hurtFlash.style.opacity=0, 150); }
function flashRad(){ radFlash.style.opacity = 1; setTimeout(()=>radFlash.style.opacity=0, 300); }
function updateBars(){
  renderSurvivalHUD();
  const hpPct=Math.max(0,state.hp/state.maxHp*100),radPct=Math.max(0,state.rad/state.maxRad*100),xpPct=Math.min(100,state.xp/Math.max(1,state.lvl*100)*100);
  hpFill.style.width=hpPct+'%';radFill.style.width=radPct+'%';xpFill.style.width=xpPct+'%';
  const hpLabel=document.getElementById('hpLabel'),radLabel=document.getElementById('radLabel'),xpLabel=document.getElementById('xpLabel');
  if(hpLabel)hpLabel.textContent=Math.ceil(state.hp)+'/'+Math.ceil(state.maxHp);
  if(radLabel)radLabel.textContent=Math.round(radPct)+'%';
  if(xpLabel)xpLabel.textContent=Math.round(xpPct)+'%';
  const levelNumber=document.getElementById('levelNumber');if(levelNumber)levelNumber.textContent=state.lvl||1;
}

const survEls={stamina:document.getElementById('staminaFill'),hunger:document.getElementById('hungerFill'),thirst:document.getElementById('thirstFill'),tox:document.getElementById('toxFill'),staminaPct:document.getElementById('staminaPct'),hungerPct:document.getElementById('hungerPct'),thirstPct:document.getElementById('thirstPct'),toxPct:document.getElementById('toxPct'),warning:document.getElementById('survivalWarning')};
let survivalTick=0,bleedTick=0,staminaRegenDelay=0;
function renderSurvivalHUD(){if(!survEls.stamina)return;const vals={stamina:state.stamina??100,hunger:state.hunger??100,thirst:state.thirst??100,tox:state.intoxication??0};for(const k of ['stamina','hunger','thirst'])survEls[k].style.width=Math.max(0,Math.min(100,vals[k]))+'%';survEls.tox.style.width=Math.max(0,Math.min(100,vals.tox))+'%';survEls.staminaPct.textContent=Math.round(vals.stamina);survEls.hungerPct.textContent=Math.round(vals.hunger);survEls.thirstPct.textContent=Math.round(vals.thirst);survEls.toxPct.textContent=Math.round(vals.tox);let msg=[];if((state.bleeding||0)>0)msg.push('🩸 КРОВОТЕЧЕНИЕ');if(vals.stamina<15)msg.push('⚠️ НЕТ ВЫНОСЛИВОСТИ');if(vals.hunger<20)msg.push('🍖 СИЛЬНЫЙ ГОЛОД');if(vals.thirst<20)msg.push('💧 СИЛЬНАЯ ЖАЖДА');if(vals.tox>60)msg.push('☣️ ИНТОКСИКАЦИЯ');survEls.warning.style.display=msg.length?'block':'none';survEls.warning.textContent=msg.join(' · ');}
function applyPlayerDamage(amount,bleedChance=0){const armor=armorTotals();const final=Math.max(0,amount*(1-armor.damageResist));state.hp=Math.max(0,state.hp-final);if(bleedChance>0&&Math.random()<bleedChance&&state.bleeding<3){state.bleeding=Math.min(3,state.bleeding+1);log('🩸 РАНЕНИЕ! Началось кровотечение — используй бинт.',2600);}if(final>0)flashHurt();return final;}
function survivalUpdate(dt,moving,sprinting){state.hunger=Math.max(0,(state.hunger??100)-dt*.045);state.thirst=Math.max(0,(state.thirst??100)-dt*.065);state.intoxication=Math.max(0,(state.intoxication??0)-dt*.025);if(sprinting&&moving&&state.stamina>0){state.stamina=Math.max(0,state.stamina-dt*(17+(state.thirst<25?5:0)));staminaRegenDelay=1.1;}else{staminaRegenDelay=Math.max(0,staminaRegenDelay-dt);if(staminaRegenDelay<=0)state.stamina=Math.min(100,state.stamina+dt*(state.stimTime>0?30:14));}state.stimTime=Math.max(0,(state.stimTime||0)-dt);if(state.bleeding>0){bleedTick+=dt;if(bleedTick>=1){bleedTick=0;state.hp=Math.max(0,state.hp-state.bleeding*1.1);}}if(state.hunger<20){survivalTick+=dt;if(survivalTick>=8){survivalTick=0;state.hp=Math.max(0,state.hp-.6);}}else if(state.thirst<15){survivalTick+=dt;if(survivalTick>=6){survivalTick=0;state.hp=Math.max(0,state.hp-.8);}}else survivalTick=0;if(state.intoxication>75&&Math.random()<dt*.22){state.hp=Math.max(0,state.hp-.5);flashHurt();}renderSurvivalHUD();}
function useConsumableItem(item,def){if(!item||!def)return false;let used=false;if(def.bandage&&state.bleeding>0){state.bleeding=0;bleedTick=0;state.hp=Math.min(state.maxHp,state.hp+(def.heal||0));log('🩹 Кровотечение остановлено бинтом');used=true;}else if(def.heal){if(state.hp<state.maxHp){state.hp=Math.min(state.maxHp,state.hp+def.heal);used=true;}if(def.detox){state.intoxication=Math.max(0,state.intoxication-def.detox);used=true;}}if(def.detox&&!def.heal&&state.intoxication>0){state.intoxication=Math.max(0,state.intoxication-def.detox);used=true;}if(def.food&&state.hunger<100){state.hunger=Math.min(100,state.hunger+def.food);used=true;}if(def.drink&&state.thirst<100){state.thirst=Math.min(100,state.thirst+def.drink);used=true;}if(def.stim&&state.stimTime<=0){state.stimTime=35;state.stamina=Math.min(100,state.stamina+35);used=true;}if(!used){log('Сейчас этот препарат не требуется');return false;}item.cnt--;if(item.cnt<=0)inventory[selectedSlot]=null;refreshInv();saveState();return true;}
function countAmmo(){
  let t=0;
  inventory.forEach(it=>{ if(it && it.id==='ammo') t+=it.cnt; });
  return t;
}

function artifactTotals(){
  let speed=1,hpRate=0,radRate=0,radResist=0,damageResist=0,capacity=0,maxHp=0,jump=0,weaponDamage=0,critChance=0,thermalResist=0,electricResist=0,bioResist=0,psiResist=0,gravityResist=0,list=[];
  artifactSlots.forEach(raw=>{const a=normalizeArtifactItem(raw);if(!a)return;const d=ITEM_DEFS[a.id];if(!d||!d.artifact)return;const q=Math.max(.85,Math.min(1.5,(a.quality||100)/100));
    if(d.speed)speed*=1+(d.speed-1)*q;
    hpRate+=(d.hpRate||0)*q;radRate+=(d.radRate||0)*q;radResist+=(d.radResist||0)*q;damageResist+=(d.damageResist||0)*q;capacity+=(d.capacity||0)*q;maxHp+=(d.maxHp||0)*q;
    jump+=(d.jump||0)*q;weaponDamage+=(d.weaponDamage||0)*q;critChance+=(d.critChance||0)*q;thermalResist+=(d.thermalResist||0)*q;electricResist+=(d.electricResist||0)*q;bioResist+=(d.bioResist||0)*q;psiResist+=(d.psiResist||0)*q;gravityResist+=(d.gravityResist||0)*q;
    list.push(`${d.icon} ${d.name} (${a.rarity||'Обычный'} ${Math.round(a.quality||100)}%): ${d.desc}`);
  });
  return {speed,hpRate,radRate,radResist:Math.max(-.5,Math.min(.5,radResist)),damageResist:Math.max(-.5,Math.min(.65,damageResist)),capacity,maxHp,jump,weaponDamage,critChance,thermalResist,electricResist,bioResist,psiResist:Math.max(0,Math.min(.65,psiResist)),gravityResist:Math.max(0,Math.min(.65,gravityResist)),list};
}
function renderCharacterStats(){
  const panel=document.getElementById('characterStats'); if(!panel) return;
  const totals=artifactTotals(), weapon=equippedDef();
  const armor=armorTotals(), weight=armorWeight(), loadMult=overloadSpeedMultiplier(weight,armor.capacity);
  const move=5*totals.speed*loadMult;
  const hpText=`${Math.ceil(state.hp)} / ${Math.ceil(state.maxHp)}`;
  const radText=`${Math.ceil(state.rad)} / ${Math.ceil(state.maxRad)}`;
  panel.innerHTML=`<div class="statCard"><div class="statLine"><span>❤️ Здоровье</span><strong>${hpText}</strong></div><div class="statLine"><span>☢️ Радиация</span><strong>${radText}</strong></div><div class="statLine"><span>🏃 Скорость</span><strong>${move.toFixed(1)} (${(totals.speed*loadMult).toFixed(2)}×)${loadMult<=0?' · ОБЕЗДВИЖЕН':loadMult<1?' · −'+Math.round((1-loadMult)*100)+'%':''}</strong></div><div class="statLine"><span>💚 Регенерация HP</span><strong>${totals.hpRate>=0?'+':''}${totals.hpRate.toFixed(1)}/сек</strong></div><div class="statLine"><span>☢️ Изменение радиации</span><strong>${totals.radRate>=0?'+':''}${totals.radRate.toFixed(1)}/сек</strong></div><div class="statLine"><span>🛡️ Защита артефактов</span><strong>${Math.round(totals.radResist*100)}% рад. / ${Math.round(totals.damageResist*100)}% урон</strong></div><div class="statLine"><span>🎒 Бонус веса</span><strong>+${totals.capacity.toFixed(1)} кг</strong></div><div class="statLine"><span>🦘 Прыжок</span><strong>+${Math.round(totals.jump*100)}%</strong></div><div class="statLine"><span>🎯 Урон оружия</span><strong>+${Math.round(totals.weaponDamage*100)}%</strong></div><div class="statLine"><span>💥 Шанс крит. попадания</span><strong>+${Math.round(totals.critChance*100)}%</strong></div><div class="statLine"><span>🔥 Защита от жара</span><strong>+${Math.round(totals.thermalResist*100)}%</strong></div><div class="statLine"><span>⚡ Защита от электричества</span><strong>+${Math.round(totals.electricResist*100)}%</strong></div><div class="statLine"><span>🧬 Защита от биохимии</span><strong>+${Math.round(totals.bioResist*100)}%</strong></div><div class="statLine"><span>🧠 Пси-защита</span><strong>${Math.round(armor.psiResist*100)}%</strong></div><div class="statLine"><span>🌀 Защита от гравитации</span><strong>${Math.round(armor.gravityResist*100)}%</strong></div></div><div class="statCard"><div class="statLine"><span>🔧 Оружие</span><strong>${weapon?weapon.name:'Не экипировано'}</strong></div><div class="statLine"><span>🎯 Урон</span><strong>${weapon&&weapon.dmg?Math.round(weapon.dmg*(1+totals.weaponDamage)):'—'}</strong></div><div class="statLine"><span>📦 Магазин</span><strong>${weapon&&weapon.mag?`${ammoInMag}/${weapon.mag}`:'—'}</strong></div></div><div class="statCard"><strong>💎 Эффекты экипированных артефактов (${totals.list.length})</strong><div class="artifactEffectList">${totals.list.length?totals.list.map(x=>`<div class="artifactEffectItem">${x}</div>`).join(''):'<div class="statSub">Артефакты не экипированы</div>'}</div></div><div class="statSub">Показаны текущие бонусы экипировки. Защита, пси-сопротивление и переносимый вес рассчитываются с учётом брони и артефактов.</div>`;
  const overloaded=weight>armor.capacity, overloadText=overloadLabel(weight,armor.capacity);
  panel.innerHTML += `<div class="statCard"><div class="statLine"><span>🏃 Выносливость</span><strong>${Math.round(state.stamina||100)} / 100</strong></div><div class="statLine"><span>🍖 Голод</span><strong>${Math.round(state.hunger??100)}%</strong></div><div class="statLine"><span>💧 Жажда</span><strong>${Math.round(state.thirst??100)}%</strong></div><div class="statLine"><span>☣️ Интоксикация</span><strong>${Math.round(state.intoxication||0)}%</strong></div><div class="statLine"><span>🩸 Кровотечение</span><strong>${state.bleeding>0?'+'+state.bleeding+' уровня':'нет'}</strong></div></div>`;
  panel.innerHTML += `<div class="statCard"><div class="statLine"><span>🛡️ Снижение урона</span><strong>${Math.round(armor.damageResist*100)}%</strong></div><div class="statLine"><span>☢️ Защита от радиации</span><strong>${Math.round(armor.radResist*100)}%</strong></div><div class="statLine"><span>🧠 Пси-защита</span><strong>${Math.round(armor.psiResist*100)}%</strong></div><div class="statLine"><span>🌀 Защита от гравитации</span><strong>${Math.round(armor.gravityResist*100)}%</strong></div><div class="statLine"><span>🎒 Вес / лимит</span><strong>${weight.toFixed(1)} / ${armor.capacity} кг${overloaded?' — '+overloadText:''}${weight>=armor.capacity*2?' (200% лимита)':''}</strong></div><div class="statLine"><span>Шлем</span><strong>${armor.helmet?armor.helmet.name:'не надет'}</strong></div><div class="statLine"><span>Костюм</span><strong>${armor.suit?armor.suit.name:'не надет'}</strong></div><div class="statLine"><span>Рюкзак</span><strong>${armor.backpack?armor.backpack.name:'не надет'}</strong></div><div class="statLine"><span>Детектор</span><strong>${deviceGear.detector?'экипирован':'не экипирован'}</strong></div></div>`;
}
function renderWeaponRack(){
  const rack=document.getElementById('weaponRack'); if(!rack)return; const def=equippedDef();
  rack.innerHTML=`<div class="weaponGearSlot ${def?'active':'empty'}" id="weaponGearMain"><span class="${def?'':'slotPlaceholder'}">${def?def.icon:'🔫'}</span><small>ОСНОВНОЕ · ${def?def.name:'пусто'}${def?' · нажми, чтобы снять':''}</small></div><div class="weaponGearSlot empty"><span class="slotPlaceholder">🔫</span><small>ВТОРОЙ СЛОТ · пока недоступен</small></div>`;
  const main=document.getElementById('weaponGearMain'); if(main) main.addEventListener('click',()=>{if(!weaponGear)return;let free=inventory.findIndex(v=>!v);if(free<0){log('Нет места в инвентаре, чтобы снять оружие');return;}inventory[free]=weaponGear;weaponGear=null;equippedIndex=-1;setWeapon(null);refreshInv();saveState();});
}
function setInventoryView(view){
  const inventoryView=view==='inventory', equipmentView=view==='equipment', statsView=view==='stats';
  document.getElementById('inventoryContent').style.display=inventoryView?'flex':'none';
  document.getElementById('invSort').style.display=inventoryView?'inline-flex':'none';
  document.getElementById('equipmentContent').style.display=equipmentView?'block':'none';
  document.getElementById('characterStats').style.display=statsView?'block':'none';
  document.getElementById('tabInventory').classList.toggle('active',inventoryView);
  document.getElementById('tabEquipment').classList.toggle('active',equipmentView);
  document.getElementById('tabStats').classList.toggle('active',statsView);
  if(equipmentView){ renderDeviceRack(); renderArmorRack(); renderArtifactRack(); renderWeaponRack(); }
  if(statsView) renderCharacterStats();
}
function equippedDef(){ return weaponGear ? ITEM_DEFS[weaponGear.id] : (equippedIndex>=0 && inventory[equippedIndex] ? ITEM_DEFS[inventory[equippedIndex].id] : null); }

function updateAmmoUI(){
  if(!weaponSlotEl) return;
  const def = equippedDef();
  if(!def){ weaponSlotEl.textContent=''; return; }
  if(!def.mag){ weaponSlotEl.textContent = def.icon; return; }
  const total = countAmmo();
  weaponSlotEl.innerHTML = `${def.icon}<span style="position:absolute;bottom:0px;right:2px;font-size:9px;font-weight:900;color:#ffd700">${ammoInMag}/${total}</span>`;
}

function canAddItem(id, cnt=1){
  const def = ITEM_DEFS[id];
  if(!def || !Number.isFinite(cnt) || cnt<=0) return false;
  let remaining = Math.floor(cnt);
  if(def.stack>1){
    for(const it of inventory){
      if(it && it.id===id) remaining -= Math.max(0, def.stack-it.cnt);
    }
  }
  for(const it of inventory) if(!it && remaining>0) remaining -= def.stack;
  return remaining<=0;
}
function addItem(id, cnt=1, artifactMeta=null){
  const def = ITEM_DEFS[id];
  if(!def || !Number.isFinite(cnt) || cnt<=0) return false;
  cnt = Math.floor(cnt);
  if(!canAddItem(id, cnt)) return false;
  let left = cnt;
  for(let i=0;i<inventory.length && left>0;i++){
    if(inventory[i] && inventory[i].id===id && def.stack>1){
      const add = Math.min(def.stack - inventory[i].cnt, left);
      inventory[i].cnt += add; left -= add;
    }
  }
  for(let i=0;i<inventory.length && left>0;i++){
    if(!inventory[i]){
      const add = Math.min(def.stack, left);
      inventory[i] = {id, cnt:add}; if(def.artifact){const meta=artifactMeta||rollArtifactQuality();inventory[i].quality=meta.quality;inventory[i].rarity=meta.rarity;} left -= add;
    }
  }
  refreshInv();
  return left===0;
}

const ARMOR_SLOT_LABELS={helmet:'ШЛЕМ',suit:'КОСТЮМ',backpack:'РЮКЗАК'};
const ARMOR_SLOT_EMPTY={helmet:'🪖',suit:'🦺',backpack:'🎒'};
const ITEM_WEIGHTS={wood:1,stone:2,fiber:.2,dog_head:1.1,dog_tail:.6,dog_meat:.8,snork_meat:1,snork_eye:.15,snork_brain:.4,boar_meat:1.2,boar_tusks:.7,boar_leg:1.4,vodka:.5,medkit:.7,bandage:.15,antidote:.2,stimulant:.25,ration:.45,water:.6,antirad:.2,pistol:1.2,pistol_heavy:1.5,smg:2,rifle:3,rifle_scoped:3.5,shotgun:3.8,ammo:.03,artifact_detector:1.2,artifact_medusa:1,artifact_soul:1,artifact_flash:.5,artifact_rose:.8,artifact_magnet:.8,artifact_fruit:.9,artifact_fire:.8,artifact_red_crystal:.9,artifact_sun:.9,artifact_battery:.8,artifact_prism:.8,artifact_comet:.7,artifact_jelly:.9,artifact_snake_eye:.7,artifact_slime:.9,artifact_gravi:1,artifact_bubble:.7,artifact_sparkler:.6,artifact_medical:.8,artifact_crystal:.8,artifact_heart:.9,artifact_wind:.6,artifact_lichen:.8,artifact_thunder:.9,artifact_echo:.7,artifact_void:.8,artifact_gold:1,artifact_anchor:1.8,artifact_ember:.8,artifact_frost:.7,artifact_scarab:1.2,artifact_moon:.9,artifact_spore:.6,artifact_shell:1.4,artifact_storm:1.1,artifact_blood:1.3,artifact_mirror:1.5,artifact_crown:1.6,artifact_comet_tail:.9,artifact_heartwood:1.2,helmet_basic:2,helmet_tactical:2.5,helmet_heavy:3,suit_basic:5,suit_light:4,suit_heavy:8,backpack_basic:2,backpack_large:3};
// Защита от предметов без веса: для любого нового ITEM_DEFS задаётся безопасный вес по категории.
Object.keys(ITEM_DEFS).forEach(id=>{if(!Number.isFinite(ITEM_WEIGHTS[id])){const d=ITEM_DEFS[id];ITEM_WEIGHTS[id]=d.artifact ? 0.9 : d.armorSlot?(d.armorSlot==='suit'?5:d.armorSlot==='backpack'?2.5:2):d.weapon?2:d.device?1:1;}});

function getItemCharacteristics(id, count=1){
  const def=ITEM_DEFS[id]; if(!def) return [];
  const stats=[];
  // Краткое описание скрываем, если его смысл уже раскрывается отдельными
  // числовыми характеристиками ниже: иначе оружие, броня, артефакты и расходники
  // показывают одни и те же бонусы дважды.
  const hasDetailedCharacteristics = !!(
    def.weapon || def.artifact || def.armorSlot ||
    def.heal !== undefined || def.rad !== undefined || def.bandage || def.detox || def.food || def.drink || def.stim
  );
  if(def.desc && !hasDetailedCharacteristics) stats.push(def.desc);
  if(def.weapon){ if(def.dmg!==undefined)stats.push(`Урон: ${def.dmg}`); if(def.mag!==undefined)stats.push(`Размер магазина: ${def.mag} патронов`); }
  if(def.heal)stats.push(`Восстановление здоровья: +${def.heal} HP`);
  if(def.rad)stats.push(`Изменение радиации: ${def.rad>0?'+':''}${def.rad}`);if(def.bandage)stats.push('Останавливает кровотечение');if(def.detox)stats.push(`Снижение интоксикации: ${def.detox}%`);if(def.food)stats.push(`Голод: +${def.food}%`);if(def.drink)stats.push(`Жажда: +${def.drink}%`);if(def.stim)stats.push('Стимуляция на 35 секунд');
  const item=inventory[selectedSlot]&&inventory[selectedSlot].id===id?inventory[selectedSlot]:null;
  const quality=item&&def.artifact?Math.max(.85,Math.min(1.5,(item.quality||100)/100)):1;
  if(def.hpRate)stats.push(`Изменение здоровья в секунду: ${def.hpRate*quality>0?'+':''}${(def.hpRate*quality).toFixed(1)} HP/сек`);
  if(def.radRate)stats.push(`Изменение радиации в секунду: ${def.radRate*quality>0?'+':''}${(def.radRate*quality).toFixed(1)}`);
  if(def.speed)stats.push(`Скорость: ${Math.round((def.speed-1)*100*quality)>0?'+':''}${Math.round((def.speed-1)*100*quality)}%`);
  if(def.radResist)stats.push(`Защита от радиации: ${Math.round(def.radResist*quality*100)>0?'+':''}${Math.round(def.radResist*quality*100)}%`);
  if(def.damageResist)stats.push(`Снижение получаемого урона: ${Math.round(def.damageResist*quality*100)>0?'+':''}${Math.round(def.damageResist*quality*100)}%`);
  if(def.capacity)stats.push(`Бонус переносимого веса: +${(def.capacity*quality).toFixed(1)} кг`);
  if(def.jump)stats.push(`Высота прыжка: +${Math.round(def.jump*quality*100)}%`);
  if(def.weaponDamage)stats.push(`Урон оружия: +${Math.round(def.weaponDamage*quality*100)}%`);
  if(def.critChance)stats.push(`Шанс критического попадания: +${Math.round(def.critChance*quality*100)}%`);
  if(def.thermalResist)stats.push(`Защита от термического воздействия: +${Math.round(def.thermalResist*quality*100)}%`);
  if(def.electricResist)stats.push(`Защита от электрического воздействия: +${Math.round(def.electricResist*quality*100)}%`);
  if(def.bioResist)stats.push(`Защита от биохимического воздействия: +${Math.round(def.bioResist*quality*100)}%`);
  if(def.psiResist)stats.push(`Пси-защита: +${Math.round(def.psiResist*quality*100)}%`);
  if(def.gravityResist)stats.push(`Защита от гравитации: +${Math.round(def.gravityResist*quality*100)}%`);
  if(def.slots)stats.push(`Дополнительные ячейки: +${def.slots}`);
  if(def.armorSlot)stats.push(`Тип экипировки: ${{helmet:'Шлем',suit:'Костюм',backpack:'Рюкзак'}[def.armorSlot]||def.armorSlot}`);
  if(def.device)stats.push('Тип предмета: прибор');
  if(def.artifact)stats.push('Тип предмета: артефакт');
  if(def.artifact){stats.push(`Тип: ${ARTIFACT_TYPE_LABELS[def.artifactType]||'Аномальный'}`);stats.push(`Редкость: ${item?.rarity||'Обычный'} · качество ${Math.round(item?.quality||100)}%`);}
  if(def.armor)stats.push('Тип предмета: броня');
  const unitWeight=ITEM_WEIGHTS[id]||0;
  stats.push(`Вес: ${(unitWeight*count).toFixed(2)} кг${count>1?` (${unitWeight.toFixed(2)} кг/шт.)`:''}`);
  return stats;
}

function armorTotals(){const h=armorGear.helmet?ITEM_DEFS[armorGear.helmet.id]:null;const su=armorGear.suit?ITEM_DEFS[armorGear.suit.id]:null;const bp=armorGear.backpack?ITEM_DEFS[armorGear.backpack.id]:null;const art=artifactTotals();const rawDamage=(h&&h.damageResist||0)+(su&&su.damageResist||0)+art.damageResist;const rawRad=(h&&h.radResist||0)+(su&&su.radResist||0)+art.radResist;const rawPsi=(h&&h.psiResist||0)+(su&&su.psiResist||0)+art.psiResist;const rawGravity=(h&&h.gravityResist||0)+(su&&su.gravityResist||0)+art.gravityResist;return {radResist:Math.max(-.5,Math.min(.75,rawRad)),damageResist:Math.max(-.5,Math.min(.8,rawDamage)),psiResist:Math.max(0,Math.min(.75,rawPsi)),gravityResist:Math.max(0,Math.min(.75,rawGravity)),capacity:30+(bp&&bp.capacity||0)+art.capacity,helmet:h,suit:su,backpack:bp};}
function armorWeight(){let total=0;inventory.forEach(it=>{if(it)total+=(ITEM_WEIGHTS[it.id]||0)*it.cnt;});artifactSlots.forEach(it=>{if(it)total+=(ITEM_WEIGHTS[it.id]||0);});Object.values(armorGear).forEach(it=>{if(it)total+=(ITEM_WEIGHTS[it.id]||0);});Object.values(deviceGear).forEach(it=>{if(it)total+=(ITEM_WEIGHTS[it.id]||0);});return total;}
function overloadSpeedMultiplier(weight,capacity){
  const safeCapacity=Math.max(1,capacity);
  const ratio=weight/safeCapacity;
  if(ratio<=1)return 1;
  // Перегрузка ощутимо снижает скорость уже сразу за лимитом:
  // 110% веса = 0.65x, 120% = 0.40x, 150% = 0.20x,
  // 200% и выше = полная остановка.
  if(ratio<=1.1)return 1-(ratio-1)*3.5;
  if(ratio<=1.2)return 0.65-(ratio-1.1)*2.5;
  if(ratio<=1.5)return 0.4-(ratio-1.2)*(2/3);
  if(ratio<2)return 0.2-(ratio-1.5)*0.4;
  return 0;
}
function overloadLabel(weight,capacity){
  const ratio=weight/Math.max(1,capacity);
  if(ratio<=1)return '';
  if(ratio<1.2)return 'Лёгкая перегрузка';
  if(ratio<2)return 'Критическая перегрузка';
  return 'Персонаж обездвижен';
}
function renderDeviceRack(){
  const rack=document.getElementById('deviceRack'); if(!rack)return; rack.innerHTML='';
  const it=deviceGear.detector, d=it&&ITEM_DEFS[it.id], slot=document.createElement('div');
  slot.className='armorSlot'+(it?' filled':'');
  slot.innerHTML=`<span class='${d?'':'slotPlaceholder'}'>${d?d.icon:'📡'}</span><strong>ДЕТЕКТОР</strong>`;
  slot.title=it?`${d.name} — нажмите, чтобы снять`:'Слот артефактного детектора';
  slot.addEventListener('click',()=>{if(!it)return;let free=inventory.findIndex(v=>!v);if(free<0){inventory.push(null);free=inventory.length-1;}inventory[free]=it;deviceGear.detector=null;refreshInv();saveState();});
  rack.appendChild(slot);
}
function equipDeviceItem(it,slotIndex){
  if(!it || it.id!=='artifact_detector')return;
  const old=deviceGear.detector;deviceGear.detector=it;inventory[slotIndex]=old||null;
  refreshInv();saveState();log('Артефактный детектор экипирован');
}
function renderArmorRack(){
  const rack=document.getElementById('armorRack'); if(!rack)return; rack.innerHTML='';
  ['helmet','suit','backpack'].forEach(key=>{
    const it=armorGear[key],d=it&&ITEM_DEFS[it.id],slot=document.createElement('div');
    slot.className='armorSlot'+(it?' filled':'');
    slot.innerHTML=`<span class='${d?'':'slotPlaceholder'}'>${d?d.icon:ARMOR_SLOT_EMPTY[key]}</span><strong>${ARMOR_SLOT_LABELS[key]}</strong>`;
    slot.title=it?`${d.name} — нажмите, чтобы снять`:`Слот ${ARMOR_SLOT_LABELS[key]}`;
    slot.addEventListener('click',()=>{
      if(!it)return;
      const candidate=inventory.slice();
      // Возвращаем экипировку в инвентарь до уменьшения его вместимости.
      const free=candidate.findIndex(v=>!v);
      if(free>=0) candidate[free]=it; else candidate.push(it);
      const targetCapacity=inventoryCapacity(key==='backpack'?null:armorGear.backpack);
      const fitted=fitInventoryCapacity(candidate,targetCapacity);
      if(!fitted){log(key==='backpack'?'Нельзя снять рюкзак: сначала освободите место в инвентаре':'Инвентарь заполнен');return;}
      inventory=fitted;
      armorGear[key]=null;
      selectedSlot=Math.min(selectedSlot,inventory.length-1);
      refreshInv(); saveState();
      log(`${d.name}: снято`);
    });
    rack.appendChild(slot);
  });
}
function equipArmorItem(it,slotIndex){
  const def=ITEM_DEFS[it && it.id], key=def && def.armorSlot;
  if(!key || !['helmet','suit','backpack'].includes(key)) return;
  const old=armorGear[key];
  const candidate=inventory.slice();
  candidate[slotIndex]=old||null;
  const targetCapacity=inventoryCapacity(key==='backpack'?it:armorGear.backpack);
  const fitted=fitInventoryCapacity(candidate,targetCapacity);
  if(!fitted){log(key==='backpack'?'Нельзя заменить рюкзак: освободите место в инвентаре':'Инвентарь заполнен');return;}
  inventory=fitted;
  armorGear[key]=it;
  selectedSlot=Math.min(selectedSlot,inventory.length-1);
  refreshInv(); saveState(); log(`${def.name}: экипировано`);
}
function renderArtifactRack(){
  const rack=document.getElementById('artifactRack'); if(!rack) return; rack.innerHTML='';
  artifactSlots.forEach((it,i)=>{ const slot=document.createElement('div'); slot.className='artifactSlot'+(it?' filled':''); slot.innerHTML=`<small>${i+1}</small><span class='${it?'':'slotPlaceholder'}'>${it?ITEM_DEFS[it.id].icon:'◇'}</span>`; slot.title=it?`${ITEM_DEFS[it.id].name} — нажми, чтобы снять`:'Слот артефакта';
    slot.addEventListener('click',()=>{ if(!artifactSlots[i]) return; const free=inventory.findIndex(v=>!v); if(free<0){log('Инвентарь заполнен');return;} inventory[free]=artifactSlots[i]; artifactSlots[i]=null; refreshInv(); saveState(); }); rack.appendChild(slot); });
}
function sortInventory(){
  const selectedItem=inventory[selectedSlot]||null;
  const equippedItem=equippedIndex>=0?inventory[equippedIndex]:null;
  const rarityRank={'Легендарный':6,'Исключительный':5,'Редкий':4,'Особый':3,'Необычный':2,'Обычный':1};
  const categoryRank=it=>{
    const d=ITEM_DEFS[it.id]||{};
    if(d.artifact) return 0;
    if(d.weapon) return 1;
    if(d.armorSlot) return 2;
    if(d.device) return 3;
    if(d.heal||d.rad) return 4;
    if(it.id==='ammo'||d.ammo) return 5;
    return 6;
  };
  const rarityValue=it=>rarityRank[it.rarity]||0;
  const filled=inventory.filter(Boolean).sort((a,b)=>{
    const ca=categoryRank(a),cb=categoryRank(b);
    if(ca!==cb) return ca-cb;
    if(ca===0){
      const rr=rarityValue(b)-rarityValue(a);
      if(rr) return rr;
      const quality=(Number(b.quality)||100)-(Number(a.quality)||100);
      if(quality) return quality;
    }
    const da=ITEM_DEFS[a.id]||{},db=ITEM_DEFS[b.id]||{};
    return String(da.name||a.id).localeCompare(String(db.name||b.id),'ru');
  });
  inventory=filled.concat(new Array(Math.max(0,inventory.length-filled.length)).fill(null));
  selectedSlot=selectedItem?inventory.indexOf(selectedItem):Math.min(selectedSlot,inventory.length-1);
  if(selectedSlot<0) selectedSlot=0;
  equippedIndex=equippedItem?inventory.indexOf(equippedItem):-1;
  refreshInv();
  saveState();
  log('Инвентарь отсортирован');
}

function refreshInv(){
  renderDeviceRack();
  renderArmorRack();
  renderArtifactRack();
  renderWeaponRack();
  renderCharacterStats();
  if(!invPanel || !invGrid || !invDetail) return;
  if(!invPanel.classList.contains('open')) return;
  invGrid.innerHTML = '';
  for(let i=0;i<inventory.length;i++){
    const sl = document.createElement('div');
    const it = inventory[i];
    sl.className = 'slot' + (i===selectedSlot?' sel':'');
    if(it && ITEM_DEFS[it.id]?.artifact){
      const r=String(it.rarity||'Обычный').toLowerCase();
      const rarityClass = r.includes('легендар')?'legendary'
        :r.includes('исключ')?'exceptional'
        :r.includes('эпич')?'epic'
        :r.includes('редк')?'rare'
        :r.includes('особ')?'special'
        :r.includes('необыч')?'uncommon':'common';
      sl.classList.add('rarity-'+rarityClass);
      sl.title=`${ITEM_DEFS[it.id].name} · ${it.rarity||'Обычный'} · ${Math.round(it.quality||100)}%`;
    }
    if(it){
      sl.textContent = ITEM_DEFS[it.id].icon;
      if(it.cnt>1){
        const c = document.createElement('span');
        c.className='cnt'; c.textContent = it.cnt;
        sl.appendChild(c);
      }
      if(i===equippedIndex){
        const e = document.createElement('span');
        e.style.cssText='position:absolute;top:2px;left:2px;font-size:9px;color:#0f0;font-weight:bold;';
        e.textContent='E';
        sl.appendChild(e);
      }
    }
    sl.addEventListener('click', ()=>{ selectedSlot = i; refreshInv(); });
    invGrid.appendChild(sl);
  }
  const it = inventory[selectedSlot];
  if(!it){
    invDetail.innerHTML = `<div class="name" style="opacity:.5">Пусто</div>`;
  } else {
    const def = ITEM_DEFS[it.id];
    invDetail.innerHTML = `
      <div class="name">${def.icon} ${def.name} <span style="opacity:.6;font-size:12px">×${it.cnt}</span></div>
      <div class="desc">${getItemCharacteristics(it.id, it.cnt).join('<br>')}</div>
      <div class="row">
        ${(def.weapon || def.artifact || def.armorSlot || def.device) ? `<button class="ibtn" id="invEquip">${(def.armorSlot||def.device)?'Экипировать / заменить':(equippedIndex===selectedSlot?'Снять':'Экипировать')}</button>` : ''}
        ${(def.heal||def.rad||def.bandage||def.detox||def.food||def.drink||def.stim) ? `<button class="ibtn" id="invUse">Использовать</button>` : ''}
        <button class="ibtn drop" id="invDrop">Выбросить</button>
      </div>`;
    const eq = document.getElementById('invEquip');
    if(eq) eq.addEventListener('click', ()=>{
      if(def.armorSlot){ equipArmorItem(it,selectedSlot); return; }
      if(def.device){ equipDeviceItem(it,selectedSlot); return; }
      if(def.artifact){ const free=artifactSlots.findIndex(v=>!v); if(free<0){log('Все 5 слотов артефактов заняты');return;} artifactSlots[free]=it; inventory[selectedSlot]=null; if(equippedIndex===selectedSlot) equippedIndex=-1; }
      else if(def.weapon){ if(weaponGear){ const free=inventory.findIndex((v,i)=>!v&&i!==selectedSlot); if(free<0){log('Нет свободной ячейки для снятия текущего оружия');return;} inventory[free]=weaponGear; } weaponGear=it; inventory[selectedSlot]=null; equippedIndex=-1; setWeapon(it.id); }
      refreshInv(); saveState();
    });
    const us = document.getElementById('invUse');
    if(us) us.addEventListener('click', ()=>{
      if(it.cnt>0){if(def.rad){state.rad=Math.max(0,state.rad+def.rad);it.cnt--;if(it.cnt<=0)inventory[selectedSlot]=null;refreshInv();saveState();}else useConsumableItem(it,def);}
    });
    const dr = document.getElementById('invDrop');
    if(dr) dr.addEventListener('click', ()=>{
      const dropCount = it.cnt>1?1:it.cnt;
      if(dropCount<=0) return;
      it.cnt -= dropCount;
      if(it.cnt<=0) inventory[selectedSlot]=null;
      if(equippedIndex===selectedSlot && !inventory[selectedSlot]){
        equippedIndex=-1; setWeapon(null);
      }
      const fx = -Math.sin(state.camYaw), fz = -Math.cos(state.camYaw);
      dropItem(it.id, dropCount, player.position.x + fx*1.2, player.position.z + fz*1.2);
      refreshInv(); saveState();
    });
  }
}
