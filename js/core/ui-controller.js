/**
 * Controlador de interfaz de usuario
 * Gestiona la visualización de elementos en pantalla
 */
class UIController {
    constructor() {
        this.gameController = null;
    }

    init(gameController) {
        this.gameController = gameController;
    }

    updateLivesDisplay() {
        // Actualizar visualización de vidas
        const livesContainer = document.getElementById('lives-display');
        if (!livesContainer) return;

        livesContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const life = document.createElement('span');
            life.className = 'life';
            life.textContent = '❤️';
            
            if (i >= this.gameController.lives) {
                life.classList.add('lost');
            } else if (this.gameController.lives === 1 && i === 0) {
                life.classList.add('warning');
            }
            
            livesContainer.appendChild(life);
        }
    }

    showRoom(roomData) {
        // Mostrar interfaz de la sala con el color correspondiente
        document.documentElement.style.setProperty('--current-room-color', roomData.color);
        
        // Renderizar preguntas, etc.
    }
}