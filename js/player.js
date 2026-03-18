// player.js
AFRAME.registerComponent("wasd-collision", {
  schema: { speed: {default: 0.15}, rayLength: {default: 0.7}, jumpStrength: {default: 0.3} },

  init: function () {
    this.keys = {};
    this.velocityY = 0;
    this.onGround = true;

    window.addEventListener("keydown", e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => this.keys[e.key.toLowerCase()] = false);
  },

  tick: function () {
    const el = this.el;
    const cam = el.querySelector('[camera]');
    if (!cam) return;

    let moveVec = new THREE.Vector3();
    if (this.keys["w"]) moveVec.z -= 4;
    if (this.keys["s"]) moveVec.z += 4;
    if (this.keys["a"]) moveVec.x -= 4;
    if (this.keys["d"]) moveVec.x += 4;

    const euler = new THREE.Euler().setFromQuaternion(cam.object3D.quaternion,'YXZ');
    const yawQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,euler.y,0));
    moveVec.applyQuaternion(yawQuat).normalize();

    // --- colisiones ---
    const raycaster = new THREE.Raycaster(el.object3D.position.clone(), moveVec.clone(), 0, this.data.rayLength);
    const walls = [];
    el.sceneEl.object3D.traverse(obj => { if(obj.userData.isWall) walls.push(obj); });
    const hit = raycaster.intersectObjects(walls,true);

    if(hit.length === 0){
      el.object3D.position.x += moveVec.x * this.data.speed;
      el.object3D.position.z += moveVec.z * this.data.speed;
    }

    // --- salto ---
    if(this.keys[" "] && this.onGround){
      this.velocityY = this.data.jumpStrength;
      this.onGround = false;
    }

    // --- gravedad ---
    this.velocityY -= 0.01;
    el.object3D.position.y += this.velocityY;

    // --- suelo ---
    if(el.object3D.position.y < 1.6){
      el.object3D.position.y = 1.6;
      this.velocityY = 0;
      this.onGround = true;
    }
  }
});

AFRAME.registerComponent("wall", {
  init: function(){
    this.el.object3D.userData.isWall = true;
  }
});