/* ============================================================
   hotbar.js — 5 slots
   pickup-final-key  → nivel1.html
   pickup-keycard    → nivel2.html
   pickup-rkey       → nivel3.html
   pickup-chest-key  → nivel4.html
   pickup-trophy     → finale.html  (se añade al ganar el boss)

   puerta5 se desbloquea automáticamente cuando el jugador
   tiene los 4 items de los niveles → redirige a nivel5.html
   ============================================================ */

const PICKUP_DEFS = [
  { sceneId: "pickup-final-key",  src: "assets/final_key.glb",                      label: "Final Key"  },
  { sceneId: "pickup-keycard",    src: "assets/key_card_lvl_5.glb",                 label: "Keycard"    },
  { sceneId: "pickup-rkey",       src: "assets/r_key_-_the_binding_of_isaac.glb",   label: "R Key"      },
  { sceneId: "pickup-chest-key",  src: "assets/big_chest_key.glb",                  label: "Chest Key"  },
  { sceneId: "pickup-trophy",     src: "assets/absolute_supremacy_trophy.glb",      label: "Trophy"     },
];

const MAX_SLOTS   = 5;
const STORAGE_KEY = "hotbar_v3";

// Los 4 items que desbloquean puerta5
const PUERTA5_REQ = [
  "pickup-final-key",
  "pickup-keycard",
  "pickup-rkey",
  "pickup-chest-key"
];

function loadInventory() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveInventory() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

let inventory = loadInventory();

/* ── ESTILOS ─────────────────────────────────────────── */
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  #debug-hotbar {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 9999;
    pointer-events: none;
    user-select: none;
  }

  .hb-slot {
    width: 64px;
    height: 64px;
    border: 1.5px solid #ff00ff66;
    background: rgba(0,0,0,0.75);
    border-radius: 4px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 0 8px #ff00ff33, inset 0 0 10px #ff00ff11;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .hb-slot.hb-filled {
    border-color: #ff00ffcc;
    box-shadow: 0 0 14px #ff00ff55, inset 0 0 10px #ff00ff22;
  }

  .hb-slot::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: #ff00ff;
    opacity: 0.6;
  }

  .hb-slot canvas {
    width: 50px !important;
    height: 50px !important;
  }

  .hb-slot .hb-label {
    position: absolute;
    bottom: 3px;
    left: 0; right: 0;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 7px;
    color: #ff00ff;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 3px;
  }

  .hb-slot .hb-empty {
    font-family: 'Share Tech Mono', monospace;
    font-size: 20px;
    color: #ff00ff22;
  }

  .hb-slot .hb-num {
    position: absolute;
    top: 3px;
    left: 5px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    color: #ff00ff55;
  }

  #hb-msg {
    position: fixed;
    top: 38px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    letter-spacing: 3px;
    padding: 6px 18px;
    border: 1px solid #ff00ff;
    border-radius: 3px;
    color: #ff00ff;
    background: rgba(0,0,0,0.75);
    box-shadow: 0 0 12px #ff00ff66;
    z-index: 99999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.35s;
  }
`;
document.head.appendChild(style);

/* ── MENSAJE ─────────────────────────────────────────── */
let msgEl, msgTimer;
function showMsg(text, color) {
  if (!msgEl) {
    msgEl = document.createElement("div");
    msgEl.id = "hb-msg";
    document.body.appendChild(msgEl);
  }
  color = color || "#ff00ff";
  msgEl.textContent       = text;
  msgEl.style.color       = color;
  msgEl.style.borderColor = color;
  msgEl.style.boxShadow   = `0 0 12px ${color}88`;
  msgEl.style.opacity     = "1";
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { msgEl.style.opacity = "0"; }, 2000);
}

/* ── BUILD HOTBAR ─────────────────────────────────────── */
function buildHotbar() {
  const old = document.getElementById("debug-hotbar");
  if (old) old.remove();

  const bar = document.createElement("div");
  bar.id = "debug-hotbar";

  for (let i = 0; i < MAX_SLOTS; i++) {
    const slot = document.createElement("div");
    const item = inventory[i];
    slot.className = "hb-slot" + (item ? " hb-filled" : "");
    slot.id = `hb-slot-${i}`;

    const num = document.createElement("span");
    num.className   = "hb-num";
    num.textContent = i + 1;
    slot.appendChild(num);

    if (item) {
      const label = document.createElement("span");
      label.className   = "hb-label";
      label.textContent = item.label;
      slot.appendChild(label);
      renderGLB(slot, item.src);
    } else {
      const empty = document.createElement("span");
      empty.className   = "hb-empty";
      empty.textContent = "—";
      slot.appendChild(empty);
    }

    bar.appendChild(slot);
  }

  document.body.appendChild(bar);
}

/* ── RENDER GLB EN CANVAS ────────────────────────────── */
function renderGLB(slotEl, src) {
  if (typeof THREE === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width  = 50;
  canvas.height = 50;
  slotEl.insertBefore(canvas, slotEl.querySelector(".hb-label"));

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(50, 50);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0.8, 2.2);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const d = new THREE.DirectionalLight(0x00ffff, 1.2);
  d.position.set(1, 2, 2);
  scene.add(d);
  const p = new THREE.PointLight(0xff00ff, 0.8, 8);
  p.position.set(-1, 1, 1);
  scene.add(p);

  let model = null;

  if (THREE.GLTFLoader) {
    new THREE.GLTFLoader().load(src, (gltf) => {
      model = gltf.scene;
      const box    = new THREE.Box3().setFromObject(model);
      const size   = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      model.scale.setScalar(1.4 / maxDim);
      model.position.sub(center.multiplyScalar(1.4 / maxDim));
      scene.add(model);
    }, undefined, () => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xff00ff, wireframe: true })
      );
      model = mesh;
      scene.add(model);
    });
  }

  (function loop() {
    requestAnimationFrame(loop);
    if (model) model.rotation.y += 0.025;
    renderer.render(scene, camera);
  })();
}

/* ── ATTACH PICKUPS EN ESCENA ────────────────────────── */
function attachPickups() {
  PICKUP_DEFS.forEach(def => {
    const el = document.getElementById(def.sceneId);
    if (!el) return;

    if (inventory.find(i => i.sceneId === def.sceneId)) {
      el.setAttribute("visible", "false");
      return;
    }

    const pos = el.getAttribute("position") || { x: 0, y: 1, z: 0 };
    el.setAttribute("animation__float", {
      property: "position", dir: "alternate", dur: 1800, loop: true, easing: "easeInOutSine",
      from: `${pos.x} ${pos.y} ${pos.z}`,
      to:   `${pos.x} ${parseFloat(pos.y) + 0.3} ${pos.z}`
    });
    el.setAttribute("animation__spin", {
      property: "rotation", to: "0 360 0", dur: 4000, loop: true, easing: "linear"
    });
    el.classList.add("clickable");

    el.addEventListener("click", () => {
      if (inventory.length >= MAX_SLOTS) { showMsg("INVENTARIO LLENO", "#ff0000"); return; }
      if (inventory.find(i => i.sceneId === def.sceneId)) return;
      inventory.push({ sceneId: def.sceneId, src: def.src, label: def.label });
      saveInventory();
      buildHotbar();
      el.setAttribute("visible", "false");
      el.classList.remove("clickable");
      showMsg("+ " + def.label + " RECOGIDO", "#ff00ff");
    });
  });
}

/* ── PUERTA 5 ────────────────────────────────────────── */
function checkPuerta5() {
  const p5 = document.getElementById("puerta5");
  if (!p5) return;

  const hasAll = PUERTA5_REQ.every(id => inventory.find(i => i.sceneId === id));

  if (hasAll) {
    // Desbloqueada — magenta pulsante, clickable → nivel5.html
    p5.setAttribute("material",
      "color:#ff00ff22; emissive:#ff00ff; emissiveIntensity:2.5; opacity:0.85; transparent:true;");
    p5.setAttribute("animation__pulse", {
      property: "material.emissiveIntensity",
      from: 1.5, to: 4, dir: "alternate", loop: true, dur: 900, easing: "easeInOutSine"
    });
    p5.classList.add("clickable");
    p5.addEventListener("click", () => { window.location.href = "nivel5.html"; });

    const lockP5 = document.getElementById("lockP5");
    if (lockP5) lockP5.setAttribute("visible", "false");

    showMsg("SALA FINAL DESBLOQUEADA", "#ff00ff");
  } else {
    // Bloqueada — rojo apagado, muestra cuántos faltan al hacer click
    p5.setAttribute("material",
      "color:#220000; emissive:#ff0000; emissiveIntensity:0.5; opacity:0.6; transparent:true;");
    p5.classList.remove("clickable");

    p5.addEventListener("click", () => {
      const missing = PUERTA5_REQ.filter(id => !inventory.find(i => i.sceneId === id)).length;
      showMsg("FALTAN " + missing + " ITEMS", "#ff0000");
      p5.setAttribute("material","color:#440000; emissive:#ff0000; emissiveIntensity:2.5; opacity:0.8; transparent:true;");
      setTimeout(() =>
        p5.setAttribute("material","color:#220000; emissive:#ff0000; emissiveIntensity:0.5; opacity:0.6; transparent:true;")
      , 350);
    });
  }
}

/* ── API PÚBLICA ─────────────────────────────────────── */
window.Hotbar = {
  has(sceneId)  { return !!inventory.find(i => i.sceneId === sceneId); },
  consume(sceneId) {
    const idx = inventory.findIndex(i => i.sceneId === sceneId);
    if (idx === -1) return false;
    const item = inventory.splice(idx, 1)[0];
    saveInventory(); buildHotbar();
    showMsg("USADO: " + item.label, "#ffaa00");
    return true;
  },
  getAll() { return [...inventory]; },
  // Llamado desde nivel5.html al ganar el boss
  addTrophy() {
    if (inventory.find(i => i.sceneId === "pickup-trophy")) return;
    inventory.push({
      sceneId: "pickup-trophy",
      src:     "assets/absolute_supremacy_trophy.glb",
      label:   "Trophy"
    });
    saveInventory();
    buildHotbar();
  }
};

/* ── INIT ────────────────────────────────────────────── */
function init() {
  buildHotbar();
  const sceneEl = document.querySelector("a-scene");
  if (sceneEl) {
    if (sceneEl.hasLoaded) { attachPickups(); checkPuerta5(); }
    else sceneEl.addEventListener("loaded", () => { attachPickups(); checkPuerta5(); });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}