// js/core/game-controller.js
/**
 * Game Controller - Controlador Principal del Juego
 */
class GameController {
    constructor(roomManager) {
        this.roomManager = roomManager;
        this.currentScreen = 'initial';
        this.currentRoom = null;
        this.completedRooms = [];
    }

    startGame(choice) {
        if (choice) {
            document.getElementById('initial-screen').style.display = 'none';
            document.getElementById('lobby-screen').style.display = 'block';
            this.currentScreen = 'lobby';
            this.updateDoorsStatus();
        } else {
            this.showAccessDenied();
        }
    }

    showAccessDenied() {
        const initialScreen = document.getElementById('initial-screen');
        initialScreen.innerHTML = `
<div style="text-align: center; padding: 40px;">
    <div style="color: #ff4444; font-size: 36px; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 10px #ff0000;">
        ✗ ERROR 403: ACCESO DENEGADO
    </div>
    <div style="color: #ffaa00; font-size: 20px; margin: 20px 0;">
        Los verdaderos programadores no huyen del debug.<br>
        Vuelve cuando estés listo para enfrentarte al código.
    </div>
    <div style="color: #666666; margin-top: 30px; font-style: italic;">
        [SISTEMA] Sesión cancelada.
    </div>
    <button class="option-btn" onclick="location.reload()" style="margin-top: 30px; font-size: 16px;">
        ¿CAMBIAR DE OPINIÓN?
    </button>
</div>
        `;
    }

    enterRoom(roomNumber) {
        console.log(`Entrando a Sala ${roomNumber}`);
        alert(`Entrando a la Sala ${roomNumber}\n\nEsta funcionalidad se implementará próximamente.`);
    }

    updateDoorsStatus() {
        const doors = document.querySelectorAll('.door');
        doors.forEach(door => {
            const roomNumber = parseInt(door.dataset.room);
            if (roomNumber === 1) {
                door.classList.add('active');
                door.classList.remove('locked');
            } else {
                const isUnlocked = this.completedRooms.includes(roomNumber - 1);
                if (isUnlocked) {
                    door.classList.add('active');
                    door.classList.remove('locked');
                } else {
                    door.classList.add('locked');
                    door.classList.remove('active');
                }
            }
        });
    }

    completeRoom(roomNumber) {
        if (!this.completedRooms.includes(roomNumber)) {
            this.completedRooms.push(roomNumber);
            this.updateDoorsStatus();
        }
    }
}

// Exportar globalmente
window.GameController = GameController;