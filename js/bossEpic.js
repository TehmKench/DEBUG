// bossEpic.js
AFRAME.registerComponent('boss-epic', {
  schema: {
    health: {default: 100},
    phase: {default: 1},
    maxHealth: {default: 100}
  },

  init: function() {
    this.el.sceneEl.bossHealth = this.data.health;
    this.phase = 1;
    this.attackCooldown = false;
  },

  update: function() {
    const healthPercent = (this.data.health / this.data.maxHealth) * 100;
    
    // Cambiar fase según vida
    if(healthPercent < 30 && this.phase === 1) {
      this.phase = 2;
      this.el.emit('phase2');
      this.el.setAttribute('animation', 'property: scale; to: 4 4 4; dur: 2000');
    }
    
    // Cambiar color según fase
    if(this.phase === 2) {
      this.el.setAttribute('material', 'color', '#330000');
      this.el.setAttribute('material', 'emissive', '#ff0000');
    }
  },

  takeDamage: function(amount) {
    this.data.health -= amount;
    this.el.emit('damage');
    this.update();
  }
});