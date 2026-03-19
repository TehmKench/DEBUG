// doors.js
let unlockedRoom = parseInt(localStorage.getItem("unlockedRoom")) || 1;

AFRAME.registerComponent("door", {
  schema: { room: {type:"number"} },

  init: function(){

    const unlocked = this.data.room <= unlockedRoom;

    this.el.setAttribute("material", {
      color: unlocked ? "#00ffff" : "#220000",
      emissive: unlocked ? "#00ffff" : "#110000",
      emissiveIntensity: unlocked ? 4 : 0.5,
      metalness: 0.2,
      roughness: 0.1
    });

    if(unlocked){
      this.el.setAttribute("animation", {
        property: "material.emissiveIntensity",
        from: 2,
        to: 6,
        dir: "alternate",
        loop: true,
        dur: 1500,
        easing: "easeInOutSine"
      });
    }

    this.el.addEventListener("click", ()=>{
      if(unlocked){
        window.location.href = "nivel" + this.data.room + ".html";
      } else {
        alert("🔒 Sala bloqueada");
      }
    });
  }
});