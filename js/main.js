// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG Escape Room - Iniciando...');
    
    try {
        // Inicializar componentes
        const roomManager = new window.RoomManager();
        const gameController = new window.GameController(roomManager);
        
        // Guardar referencias globales
        window.roomManager = roomManager;
        window.gameController = gameController;
        
        // ===== NUEVO: Generar código animado exterior =====
        generateCodeRain();
        
        // Configurar eventos de los botones
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
        
        // Configurar puertas del lobby
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

// ===== FUNCIÓN PARA GENERAR CÓDIGO ANIMADO EXTERIOR =====
function generateCodeRain() {
    const codeRain = document.getElementById('codeRain');
    if (!codeRain) {
        console.warn('Elemento #codeRain no encontrado');
        return;
    }
    
    // Limpiar código anterior para evitar duplicados
    codeRain.innerHTML = '';
    
    const codeSnippets = [
        'while(true){debug();}', 'if(error){fix();}', 'for(i=0;i<100;i++)',
        'function escape(){return true;}', 'var trapped = true;', 'console.log("DEBUG");',
        'try{code}catch(err){}', 'let x = 5; x++;', 'const MAX = 1000;',
        'return this.error;', 'class Bug extends Error{}', 'import {debug} from "system";',
        'export default trapped;', 'async function loop(){}', 'await Promise.resolve();',
        'document.getElementById();', 'JSON.parse(data);', 'fetch("/api/debug");',
        'map.filter.reduce();', 'new Promise((resolve)=>{})'
    ];
    
    // Crear 20 columnas de código
    for (let i = 0; i < 20; i++) {
        const column = document.createElement('div');
        column.className = 'code-column';
        
        // Posición aleatoria horizontal
        const leftPos = Math.random() * 100;
        column.style.left = `${leftPos}%`;
        
        // Duración aleatoria entre 5-15 segundos
        const duration = 5 + Math.random() * 10;
        column.style.animationDuration = `${duration}s`;
        
        // Delay aleatorio
        const delay = Math.random() * 5;
        column.style.animationDelay = `${delay}s`;
        
        // Seleccionar snippet aleatorio
        const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        column.textContent = randomSnippet;
        
        codeRain.appendChild(column);
    }
}