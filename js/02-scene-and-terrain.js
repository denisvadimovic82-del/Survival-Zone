// ===== СЦЕНА =====
let renderer, scene, camera, dirLight;
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
try {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8a9a7a);
  scene.fog = new THREE.Fog(0x8a9a7a, 30, 110);

  camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 500);
  renderer = new THREE.WebGLRenderer({antialias:!isMobile, powerPreference:'high-performance', stencil:false, depth:true});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.0 : 1.25));
  document.body.appendChild(renderer.domElement);
} catch(e) {
  errBox.style.display = 'block';
  errBox.textContent = (typeof THREE==='undefined' ? '❌ Не удалось загрузить Three.js (проверь интернет или CDN). ' : '❌ WebGL недоступен: ') + e.message;
  throw e;
}

renderer.shadowMap.enabled = false; // expensive soft shadows disabled to reduce frame-time spikes

const hemi = new THREE.HemisphereLight(0xffffff, 0x445544, 0.9);
scene.add(hemi);
dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
dirLight.position.set(30, 50, 20);
scene.add(dirLight);

const rand = (a,b)=>a+Math.random()*(b-a);
const dist2 = (a,b)=>Math.hypot(a.x-b.x, a.z-b.z);

// ===== ТЕРРЕЙН =====
const TERRAIN_AMPLITUDE = 1.2, TERRAIN_FREQ = 0.08, TERRAIN_FLAT_RADIUS = 10;
function getTerrainHeight(x, z){
  const wx = x, wy = -z, d = Math.sqrt(wx*wx + wy*wy);
  if(d <= TERRAIN_FLAT_RADIUS) return 0;
  return Math.sin(wx*TERRAIN_FREQ) * Math.cos(wy*TERRAIN_FREQ) * TERRAIN_AMPLITUDE;
}

const groundGeo = new THREE.PlaneGeometry(300,300, 48, 48);
const gpos = groundGeo.attributes.position;
for(let i=0;i<gpos.count;i++){
  const x=gpos.getX(i), y=gpos.getY(i);
  if(Math.sqrt(x*x+y*y)>TERRAIN_FLAT_RADIUS)
    gpos.setZ(i, Math.sin(x*TERRAIN_FREQ) * Math.cos(y*TERRAIN_FREQ) * TERRAIN_AMPLITUDE);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({color:0x4a5a3a, roughness:1, flatShading:true}));
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;
scene.add(ground);
