// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG Escape Room - Iniciando...');
    
    try {
        // Verificar que las clases estén disponibles
        if (typeof window.RoomManager === 'undefined' || typeof window.GameController === 'undefined') {
            console.error('Error: Clases no disponibles. Verifica los imports.');
            return;
        }
        
        // Inicializar componentes
        const roomManager = new window.RoomManager();
        const gameController = new window.GameController(roomManager);
        
        // Guardar referencias globales
        window.roomManager = roomManager;
        window.gameController = gameController;
        
        // Configurar eventos
        const trueBtn = document.getElementById('true-btn');
        const falseBtn = document.getElementById('false-btn');
        
        if (trueBtn && falseBtn) {
            trueBtn.addEventListener('click', () => {
                gameController.startGame(true);
            });
            
            falseBtn.addEventListener('click', () => {
                gameController.startGame(false);
            });
        }
        
        // Configurar puertas
        document.querySelectorAll('.door').forEach(door => {
            door.addEventListener('click', (e) => {
                const roomNumber = parseInt(e.currentTarget.dataset.room);
                if (roomNumber) {
                    gameController.enterRoom(roomNumber);
                }
            });
        });
        
        console.log('DEBUG Escape Room - Iniciado correctamente');
    } catch (error) {
        console.error('Error al inicializar el juego:', error);
    }
});