/**
 * Controlador principal del juego
 * Gestiona el estado global, vidas, puntuación y flujo
 */
class GameController {
    constructor() {
        this.currentScreen = 'initial';
        this.currentRoom = null;
        this.lives = 3;
        this.score = 0;
        this.completedRooms = [];
    }

    init() {
        // Inicializar el juego
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Eventos para transiciones entre pantallas
        document.addEventListener('startGame', (e) => {
            this.startGame(e.detail.choice);
        });

        document.addEventListener('enterRoom', (e) => {
            this.enterRoom(e.detail.roomNumber);
        });
    }

    startGame(choice) {
        if (choice) {
            // Mostrar lobby
            document.getElementById('initial-screen').style.display = 'none';
            document.getElementById('lobby-screen').style.display = 'block';
            this.currentScreen = 'lobby';
        }
    }

    enterRoom(roomNumber) {
        // Usar librería de animación para transición
        // frameLibrary.animate({ ... });
        
        this.currentRoom = roomNumber;
        this.currentScreen = 'room';
        
        // Cargar sala específica
        this.loadRoom(roomNumber);
    }

    loadRoom(roomNumber) {
        // Lógica para cargar la sala correspondiente
        console.log(`Cargando sala ${roomNumber}`);
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        // Lógica de game over
        console.log('Game Over');
    }
}