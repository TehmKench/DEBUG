/**
 * Punto de entrada principal
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gestor de audio
    window.audioManager = new AudioManager();
    window.audioManager.init();
    
    // Inicializar controlador del juego
    window.gameController = new GameController();
    window.gameController.init();
    
    console.log('DEBUG Escape Room - Iniciado correctamente');
});