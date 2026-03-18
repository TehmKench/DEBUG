// playerBoss.js - Movimiento mejorado para Boss Fight

AFRAME.registerComponent('boss-movement', {
  schema: {
    baseSpeed: {default: 0.25},
    boostSpeed: {default: 0.6},
    glideSpeed: {default: 0.15},
    jumpForce: {default: 0.35},
    momentum: {default: 0},
    maxMomentum: {default: 100}
  },

  init: function() {
    this.keys = {};
    this.velocity = new THREE.Vector3();
    this.velocityY = 0;
    this.onGround = true;
    this.isBoosting = false;
    this.isGliding = false;
    this.momentum = 0;
    this.boostCooldown = false;
    this.dashCooldown = false;
    
    // Boost de energía
    this.boostEnergy = 100;
    this.maxBoostEnergy = 100;
    
    window.addEventListener('keydown', e => this.onKeyDown(e));
    window.addEventListener('keyup', e => this.onKeyUp(e));
    
    // UI de momentum
    this.createMomentumUI();
  },

  onKeyDown: function(e) {
    this.keys[e.key.toLowerCase()] = true;
    
    // Dash con Shift
    if(e.key === 'Shift' && !this.dashCooldown) {
      this.performDash();
    }
    
    // Boost con Ctrl
    if(e.key === 'Control' && this.boostEnergy > 20 && !this.boostCooldown) {
      this.performBoost();
    }
  },

  onKeyUp: function(e) {
    this.keys[e.key.toLowerCase()] = false;
    
    if(e.key === ' ') {
      this.isGliding = false;
    }
  },

  performDash: function() {
    this.dashCooldown = true;
    const cam = this.el.querySelector('[camera]');
    const direction = new THREE.Vector3();
    cam.object3D.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    
    this.velocity.add(direction.multiplyScalar(2));
    
    // Efecto visual
    this.el.emit('dash');
    
    setTimeout(() => { this.dashCooldown = false; }, 800);
  },

  performBoost: function() {
    this.isBoosting = true;
    this.boostCooldown = true;
    this.boostEnergy -= 30;
    this.updateBoostUI();
    
    setTimeout(() => {
      this.isBoosting = false;
      this.boostCooldown = false;
    }, 2000);
  },

  tick: function(time, delta) {
    const el = this.el;
    const cam = el.querySelector('[camera]');
    if(!cam) return;

    // Calcular dirección de movimiento
    let moveVec = new THREE.Vector3();
    if(this.keys['w']) moveVec.z -= 1;
    if(this.keys['s']) moveVec.z += 1;
    if(this.keys['a']) moveVec.x -= 1;
    if(this.keys['d']) moveVec.x += 1;

    // Rotar según cámara (solo Y)
    const euler = new THREE.Euler().setFromQuaternion(cam.object3D.quaternion, 'YXZ');
    const yawQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, euler.y, 0));
    moveVec.applyQuaternion(yawQuat).normalize();

    // Determinar velocidad actual
    let currentSpeed = this.data.baseSpeed;
    if(this.isBoosting) currentSpeed = this.data.boostSpeed;
    if(this.isGliding) currentSpeed = this.data.glideSpeed;
    
    // Momentum bonus
    const momentumBonus = 1 + (this.momentum / 200);
    currentSpeed *= momentumBonus;

    // Aplicar movimiento
    if(moveVec.length() > 0) {
      el.object3D.position.x += moveVec.x * currentSpeed;
      el.object3D.position.z += moveVec.z * currentSpeed;
      
      // Aumentar momentum al moverse
      if(this.momentum < this.data.maxMomentum) {
        this.momentum += 0.5;
      }
    } else {
      // Reducir momentum cuando no se mueve
      if(this.momentum > 0) {
        this.momentum -= 0.3;
      }
    }

    // Salto
    if(this.keys[' '] && this.onGround) {
      this.velocityY = this.data.jumpForce;
      this.onGround = false;
      this.isGliding = true;
    }

    // Glide (mantener espacio)
    if(this.keys[' '] && !this.onGround) {
      this.isGliding = true;
      this.velocityY *= 0.96; // Caída más lenta
    }

    // Gravedad
    this.velocityY -= 0.015;
    el.object3D.position.y += this.velocityY;

    // Suelo
    if(el.object3D.position.y < 1.6) {
      el.object3D.position.y = 1.6;
      this.velocityY = 0;
      this.onGround = true;
      this.isGliding = false;
      
      // Landing bonus
      if(this.momentum > 50) {
        this.el.emit('perfect-landing');
      }
    }

    // Límites de arena
    const limit = 45;
    if(el.object3D.position.x > limit) el.object3D.position.x = limit;
    if(el.object3D.position.x < -limit) el.object3D.position.x = -limit;
    if(el.object3D.position.z > limit) el.object3D.position.z = limit;
    if(el.object3D.position.z < -limit) el.object3D.position.z = -limit;

    // Regenerar boost energy
    if(this.boostEnergy < this.maxBoostEnergy && !this.isBoosting) {
      this.boostEnergy += 0.1;
      this.updateBoostUI();
    }

    // Actualizar UI de momentum
    this.updateMomentumUI();
  },

  createMomentumUI: function() {
    // Momentum bar
    const momentumBar = document.createElement('div');
    momentumBar.id = 'momentum-bar';
    momentumBar.innerHTML = `
      <div style="position:fixed; bottom:30px; right:30px; width:200px;">
        <div style="color:#ff6600; font-family:'Courier New'; font-size:16px; margin-bottom:5px;">MOMENTUM</div>
        <div style="width:100%; height:10px; background:rgba(0,0,0,0.8); border:2px solid #ff6600; border-radius:5px;">
          <div id="momentum-fill" style="height:100%; width:0%; background:linear-gradient(90deg, #ff6600, #ffcc00); border-radius:5px; transition:width 0.1s;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(momentumBar);

    // Boost energy bar
    const boostBar = document.createElement('div');
    boostBar.id = 'boost-bar';
    boostBar.innerHTML = `
      <div style="position:fixed; bottom:80px; right:30px; width:200px;">
        <div style="color:#00ffff; font-family:'Courier New'; font-size:16px; margin-bottom:5px;">BOOST</div>
        <div style="width:100%; height:10px; background:rgba(0,0,0,0.8); border:2px solid #00ffff; border-radius:5px;">
          <div id="boost-fill" style="height:100%; width:100%; background:linear-gradient(90deg, #00ffff, #00ff88); border-radius:5px; transition:width 0.1s;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(boostBar);
  },

  updateMomentumUI: function() {
    const fill = document.getElementById('momentum-fill');
    if(fill) {
      fill.style.width = (this.momentum / this.data.maxMomentum * 100) + '%';
    }
  },

  updateBoostUI: function() {
    const fill = document.getElementById('boost-fill');
    if(fill) {
      fill.style.width = (this.boostEnergy / this.maxBoostEnergy * 100) + '%';
    }
  },

  getMomentum: function() {
    return this.momentum;
  },

  resetMomentum: function() {
    this.momentum = 0;
  }
});

// Efectos visuales
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  if(!scene) return;

  // Efecto dash
  scene.addEventListener('dash', () => {
    const player = document.getElementById('player');
    const originalColor = player.getAttribute('material', 'color') || '#00ffff';
    player.setAttribute('material', 'emissive-intensity', '5');
    setTimeout(() => {
      player.setAttribute('material', 'emissive-intensity', '1');
    }, 200);
  });

  // Efecto landing perfecto
  scene.addEventListener('perfect-landing', () => {
    const shockwave = document.createElement('a-ring');
    shockwave.setAttribute('position', '0 0.1 0');
    shockwave.setAttribute('radius-inner', '1');
    shockwave.setAttribute('radius-outer', '3');
    shockwave.setAttribute('color', '#ff6600');
    shockwave.setAttribute('opacity', '0.8');
    shockwave.setAttribute('rotation', '-90 0 0');
    shockwave.setAttribute('animation', 'property: radius-inner; to: 5; dur: 500; easing: easeOutQuad');
    shockwave.setAttribute('animation__fade', 'property: opacity; to: 0; dur: 500; easing: easeOutQuad');
    
    const player = document.getElementById('player');
    player.appendChild(shockwave);
    
    setTimeout(() => { shockwave.remove(); }, 500);
  });
});s