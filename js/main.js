/**
 * Punto de entrada principal
 * Inicializa todos los componentes del juego
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    const gameController = new GameController();
    const roomManager = new RoomManager();
    const uiController = new UIController();
    const audioManager = new AudioManager();
    
    // Configurar dependencias
    uiController.init(gameController);
    audioManager.init();
    
    // Iniciar el juego
    gameController.init();
    
    // Guardar referencia global para debugging
    window.game = gameController;
    window.rooms = roomManager;
    window.ui = uiController;
    window.audio = audioManager;
});