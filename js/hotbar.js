/* ============================================================
   hotbar.js — DEBUG
   ============================================================ */

/* ============================================================
   ▼▼▼  PON AQUÍ TUS MODELOS GLB  ▼▼▼
   - src   → ruta al archivo .glb
   - label → nombre que aparece debajo
   Puedes tener hasta 6 slots. Borra los que no uses.
   ============================================================ */
const HOTBAR_ITEMS = [
  // { src: "models/TU_MODELO_1.glb", label: "Nombre 1" },
  // { src: "models/TU_MODELO_2.glb", label: "Nombre 2" },
  // { src: "models/TU_MODELO_3.glb", label: "Nombre 3" },
  // { src: "models/TU_MODELO_4.glb", label: "Nombre 4" },
  // { src: "models/TU_MODELO_5.glb", label: "Nombre 5" },
  // { src: "models/TU_MODELO_6.glb", label: "Nombre 6" },
];
/* ▲▲▲  FIN DE LA ZONA DE EDICIÓN  ▲▲▲ */




/* ============================================================
   NO TOQUES NADA DE AQUÍ PARA ABAJO
   ============================================================ */

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
`;
document.head.appendChild(style);

function buildHotbar() {
  const bar = document.createElement("div");
  bar.id = "debug-hotbar";

  // Siempre 6 slots visibles
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement("div");
    slot.className = "hb-slot";

    const num = document.createElement("span");
    num.className = "hb-num";
    num.textContent = i + 1;

    const item = HOTBAR_ITEMS[i];

    if (item) {
      const label = document.createElement("span");
      label.className = "hb-label";
      label.textContent = item.label;
      slot.appendChild(num);
      slot.appendChild(label);
      renderGLB(slot, item.src);
    } else {
      const empty = document.createElement("span");
      empty.className = "hb-empty";
      empty.textContent = "—";
      slot.appendChild(num);
      slot.appendChild(empty);
    }

    bar.appendChild(slot);
  }

  document.body.appendChild(bar);
}

function renderGLB(slotEl, src) {
  if (typeof THREE === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width = 50;
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildHotbar);
} else {
  buildHotbar();
}
