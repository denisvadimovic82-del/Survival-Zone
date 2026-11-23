const fullscreenBtn = document.getElementById('fullscreenBtn');
if(fullscreenBtn){
  fullscreenBtn.addEventListener('click', async ()=>{
    try {
      if(document.fullscreenElement){
        await document.exitFullscreen();
        try{ if(screen.orientation&&screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
      }
      else if(document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen();
        try{ if(screen.orientation&&screen.orientation.lock) await screen.orientation.lock('portrait'); }catch(e){}
      }
      else if(document.documentElement.webkitRequestFullscreen){
        document.documentElement.webkitRequestFullscreen();
        try{ if(screen.orientation&&screen.orientation.lock) await screen.orientation.lock('portrait'); }catch(e){}
      }
      else { fullscreenBtn.title='Полноэкранный режим не поддерживается этим браузером'; }
    } catch(e){
      const box=document.getElementById('errBox'); if(box){ box.style.display='block'; box.textContent+='❌ Полноэкранный режим: '+e.message+'\n'; }
    }
  });
}

// ===== ОБРАБОТЧИК ОШИБОК =====
const errBox = document.getElementById('errBox');
window.onerror = function(msg, src, line, col, err){
  errBox.style.display = 'block';
  errBox.textContent += `❌ ${msg}\n  в ${src}:${line}:${col}\n\n`;
  console.error(msg, err);
  return false;
};
window.addEventListener('unhandledrejection', function(ev){
  errBox.style.display='block';
  errBox.textContent += '❌ Ошибка загрузки/выполнения: '+(ev.reason && ev.reason.message ? ev.reason.message : ev.reason)+'\n\n';
  console.error('Unhandled promise rejection', ev.reason);
});

// ===== EARLY UI =====
const hpFill = document.querySelector('#hp .fill');
const radFill = document.querySelector('#rad .fill');
const xpFill = document.querySelector('#xp .fill');
const logEl = document.getElementById('log');
const hurtFlash = document.getElementById('hurtFlash');
const radFlash = document.getElementById('radFlash');
const invPanel = document.getElementById('invPanel');
const invGrid = document.getElementById('invGrid');
const invDetail = document.getElementById('invDetail');
const weaponSlotEl = document.getElementById('weaponSlot');
const tradePanel = document.getElementById('tradePanel');
const tradeList = document.getElementById('tradeList');
const tradeMoney = document.getElementById('tradeMoney');
const safeIndicator = document.getElementById('safeIndicator');
const emissionBanner = document.getElementById('emissionBanner');
const emissionOverlay = document.getElementById('emissionOverlay');
const aimTargetEl = document.getElementById('aimTarget');
const scanArtifactBtnEl = document.getElementById('scanArtifactBtn');
