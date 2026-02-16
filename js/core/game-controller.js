/**
 * Game Controller - Controlador Principal del Juego
 */
class GameController {
    constructor() {
        this.roomManager = new RoomManager();
        this.currentScreen = 'initial';
        this.currentRoom = null;
        this.lives = 3; // Se usará dentro de las salas
        this.score = 0;
        this.completedRooms = [];
    }

    init() {
        this.setupEventListeners();
        this.generateCodeRain();
    }

    setupEventListeners() {
        // Botones de la pantalla inicial
        document.getElementById('true-btn').addEventListener('click', () => this.startGame(true));
        document.getElementById('false-btn').addEventListener('click', () => this.startGame(false));
        
        // Puertas del lobby
        document.querySelectorAll('.door').forEach(door => {
            door.addEventListener('click', (e) => {
                const roomNumber = e.currentTarget.dataset.room;
                this.enterRoom(parseInt(roomNumber));
            });
        });
    }

    startGame(choice) {
        if (choice) {
            document.getElementById('initial-screen').style.display = 'none';
            document.getElementById('lobby-screen').style.display = 'block';
            this.currentScreen = 'lobby';
            
            // Reproducir sonido de inicio (cuando tengas audio)
            // if (window.audioManager) window.audioManager.play('success');
            
            setTimeout(() => {
                alert('¡Bienvenido al sistema de depuración!\n\nElige una sala para comenzar tu escape.');
            }, 300);
        } else {
            this.showAccessDenied();
        }
    }

    showAccessDenied() {
        const screen = document.getElementById('initial-screen');
        screen.innerHTML = `
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
    <button class="option-btn" id="retry-btn" style="margin-top: 30px; font-size: 16px;">
        ¿CAMBIAR DE OPINIÓN?
    </button>
</div>
        `;
        document.getElementById('retry-btn').addEventListener('click', () => location.reload());
    }

    enterRoom(roomNumber) {
        const room = this.roomManager.getRoom(roomNumber);
        if (!room) {
            console.error(`Sala ${roomNumber} no encontrada`);
            return;
        }
        
        // Ocultar lobby
        document.getElementById('lobby-screen').style.display = 'none';
        
        // Aquí integrarás A-Frame para las salas 3D
        alert(`Entrando a la Sala ${roomNumber}: ${room.name}\n\nPróximamente con A-Frame 3D`);
        
        this.currentRoom = roomNumber;
        this.currentScreen = 'room';
        
        // Guardar estado
        this.saveGameState();
    }

    // Métodos adicionales: loseLife(), gameOver(), completeRoom(), saveGameState(), etc.
    // (Implementar según necesites para las salas)
    
    generateCodeRain() {
        const codeRain = document.getElementById('codeRain');
        if (!codeRain) return;
        
        const codeSnippets = [
            'while(true){debug();}', 'if(error){fix();}', 'for(i=0;i<100;i++)',
            'function escape(){return true;}', 'var trapped = true;', 'console.log("DEBUG");',
            'try{code}catch(err){}', 'let x = 5; x++;', 'const MAX = 1000;',
            'return this.error;', 'class Bug extends Error{}', 'import {debug} from "system";',
            'export default trapped;', 'async function loop(){}', 'await Promise.resolve();',
            'document.getElementById();', 'JSON.parse(data);', 'fetch("/api/debug");',
            'map.filter.reduce();', 'new Promise((resolve)=>{})'
        ];
        
        for (let i = 0; i < 20; i++) {
            const column = document.createElement('div');
            column.className = 'code-column';
            column.style.left = `${Math.random() * 100}%`;
            column.style.animationDuration = `${5 + Math.random() * 10}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            column.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            codeRain.appendChild(column);
        }
    }

    saveGameState() {
        const state = {
            completedRooms: this.completedRooms,
            score: this.score,
            timestamp: Date.now()
        };
        localStorage.setItem('debugGameState', JSON.stringify(state));
    }
}