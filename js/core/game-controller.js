/**
 * Controlador principal del juego
 * Gestiona el estado global, vidas, puntuación y flujo
 */
class GameController {
    constructor() {
        this.currentScreen = 'initial';
        this.currentRoom = null;
        this.currentQuestionIndex = 0;
        this.lives = 3;
        this.score = 0;
        this.completedRooms = [];
        this.gameStarted = false;
        
        // Inicializar automáticamente
        this.init();
    }

    init() {
        console.log('🎮 Game Controller inicializado');
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Escuchar teclas para navegación rápida (1-5 para puertas, A/B para opciones)
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'lobby' && e.key >= '1' && e.key <= '5') {
                this.enterRoom(parseInt(e.key));
            }
            
            if (this.currentScreen === 'room' && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'b')) {
                const options = document.querySelectorAll('.question-option');
                const targetOption = Array.from(options).find(opt => 
                    opt.textContent.toLowerCase().includes(e.key.toLowerCase())
                );
                if (targetOption) {
                    targetOption.click();
                }
            }
        });
    }

    /**
     * Iniciar el juego
     * @param {boolean} choice - true para jugar, false para no jugar
     */
    startGame(choice) {
        // Reproducir sonido si AudioManager está disponible
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('confirm');
        }
        
        if (choice) {
            // Animación de transición suave
            const initialScreen = document.getElementById('initial-screen');
            const lobbyScreen = document.getElementById('lobby-screen');
            
            initialScreen.classList.add('fade-out');
            setTimeout(() => {
                initialScreen.style.display = 'none';
                lobbyScreen.style.display = 'flex';
                lobbyScreen.classList.add('fade-in');
                setTimeout(() => {
                    lobbyScreen.classList.remove('fade-in');
                }, 500);
            }, 500);
            
            this.currentScreen = 'lobby';
            this.gameStarted = true;
            this.lives = 3;
            this.score = 0;
            this.completedRooms = [];
            this.currentQuestionIndex = 0;
            
            // Mostrar mensaje de sistema
            this.showSystemMessage('Sistema de depuración iniciado. Selecciona una sala.');
            
            console.log('🎮 Juego iniciado');
            this.updateUI();
        } else {
            // Respuesta sarcástica si elige FALSE
            this.showSystemMessage('FALSE? Patético. Un informático nace para debuggear.');
            
            if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
                AudioManager.playSound('error');
            }
            
            setTimeout(() => {
                if (confirm('¡No puedes escapar del bucle! ¿Quieres jugar de verdad?')) {
                    this.startGame(true);
                } else {
                    this.startGame(true); // Sin escapatoria 😈
                }
            }, 2000);
        }
    }

    /**
     * Entrar a una sala específica
     * @param {number} roomNumber - Número de la sala (1-5)
     */
    enterRoom(roomNumber) {
        if (!this.gameStarted) return;
        
        // Verificar si ya completó esta sala
        if (this.completedRooms.includes(roomNumber)) {
            this.showSystemMessage(`⚠️ Sala ${roomNumber} ya completada. Elige otra.`);
            return;
        }
        
        // Animación de puerta
        const doors = document.querySelectorAll('.door');
        doors.forEach(door => door.classList.remove('opening'));
        
        const selectedDoor = document.querySelector(`.door.room-${roomNumber}`);
        if (selectedDoor) {
            selectedDoor.classList.add('opening');
            
            if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
                AudioManager.playSound('door_open');
            }
        }
        
        setTimeout(() => {
            // Ocultar lobby y mostrar sala
            document.getElementById('lobby-screen').style.display = 'none';
            
            // Cargar la sala
            this.currentRoom = roomNumber;
            this.currentQuestionIndex = 0;
            this.currentScreen = 'room';
            this.loadRoom(roomNumber);
            
        }, 600);
    }

    /**
     * Cargar una sala específica
     * @param {number} roomNumber - Número de la sala
     */
    loadRoom(roomNumber) {
        console.log(`🚪 Cargando sala ${roomNumber}`);
        
        // Obtener datos de la sala desde RoomManager
        const roomData = window.RoomManager ? 
            window.RoomManager.getRoom(roomNumber) : 
            null;
        
        if (!roomData) {
            console.error(`Sala ${roomNumber} no encontrada`);
            alert('Error: Sala no encontrada. Volviendo al lobby.');
            this.leaveRoom();
            return;
        }
        
        // Crear pantalla de sala
        this.createRoomScreen(roomData);
        
        // Mostrar mensaje
        this.showSystemMessage(`Entrando a: ${roomData.name}`);
        
        // Reproducir música de ambiente si está disponible
        if (typeof AudioManager !== 'undefined' && AudioManager.playAmbient) {
            AudioManager.playAmbient(`room${roomNumber}`);
        }
    }

    /**
     * Crear la pantalla de una sala
     * @param {object} roomData - Datos de la sala
     */
    createRoomScreen(roomData) {
        // Eliminar pantalla anterior si existe
        const existingRoom = document.getElementById('room-screen');
        if (existingRoom) {
            existingRoom.remove();
        }
        
        // Obtener pregunta actual
        const question = roomData.questions[this.currentQuestionIndex];
        
        // Crear nueva pantalla de sala
        const roomScreen = document.createElement('div');
        roomScreen.id = 'room-screen';
        roomScreen.className = 'screen room-screen';
        roomScreen.style.display = 'flex';
        roomScreen.style.backgroundColor = roomData.themeColor + '15'; // Color con transparencia
        
        roomScreen.innerHTML = `
            <div class="room-header">
                <h1 class="room-title" style="color: ${roomData.themeColor}; text-shadow: 0 0 15px ${roomData.themeColor};">
                    ${roomData.name}
                </h1>
                <div class="room-stats">
                    <span class="lives">❤️ Vidas: ${this.lives}</span>
                    <span class="score">⭐ Puntuación: ${this.score}</span>
                    <span class="progress">📊 Progreso: ${this.currentQuestionIndex + 1}/${roomData.questions.length}</span>
                </div>
            </div>
            
            <div class="terminal-screen" style="border-color: ${roomData.themeColor}; box-shadow: 0 0 20px ${roomData.themeColor}, inset 0 0 15px ${roomData.themeColor};">
                <div class="terminal-title" style="color: ${roomData.themeColor}; text-shadow: 0 0 10px ${roomData.themeColor};">
                    ${roomData.description}
                </div>
                
                <div class="terminal-content" id="terminalContent">
                    <div class="command-line">
                        <span class="command-line-root" style="color: ${roomData.themeColor};">root@debug-system:~$</span>
                        <span class="command-line-command">Conexión establecida con ${roomData.name}</span>
                    </div>
                    <div class="command-line">
                        <span class="command-line-root" style="color: ${roomData.themeColor};">root@debug-system:~$</span>
                        <span class="command-line-command">GLITCH INTENSIDAD: ${'▮'.repeat(roomData.glitchIntensity)}${'▯'.repeat(5 - roomData.glitchIntensity)}</span>
                    </div>
                    <div class="command-line question-line">
                        <span class="command-line-root" style="color: ${roomData.themeColor};">root@debug-system:~$</span>
                        <span class="command-line-command question-text">${question.question}</span>
                    </div>
                </div>
                
                <!-- OPCIONES MÚLTIPLES -->
                <div class="question-options" id="questionOptions">
                    ${question.options.map(opt => `
                        <button class="option-btn question-option" 
                                data-option="${opt.id}"
                                style="border-color: ${roomData.themeColor}; animation: buttonGlowRoom 2s infinite;">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
                
                <div class="room-buttons">
                    <button class="option-btn hint-btn" onclick="window.gameController.requestHint()">
                        💡 PISTA
                    </button>
                    <button class="option-btn false-btn" onclick="window.gameController.leaveRoom()">
                        🚪 ABANDONAR SALA
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(roomScreen);
        
        // Añadir evento de clic a las opciones (fallback si onclick falla)
        setTimeout(() => {
            document.querySelectorAll('.question-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const optionId = e.currentTarget.dataset.option;
                    this.selectOption(optionId);
                });
            });
        }, 100);
    }

    /**
     * Seleccionar una opción de respuesta
     * @param {string} optionId - ID de la opción seleccionada
     */
    selectOption(optionId) {
        if (!this.currentRoom || !window.RoomManager) return;
        
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('keypress');
        }
        
        // Obtener datos de la sala y pregunta actual
        const roomData = window.RoomManager.getRoom(this.currentRoom);
        if (!roomData || !roomData.questions.length) return;
        
        const currentQuestion = roomData.questions[this.currentQuestionIndex];
        const isCorrect = window.RoomManager.validateAnswer(
            this.currentRoom, 
            currentQuestion.id, 
            optionId
        );
        
        // Deshabilitar botones temporalmente
        document.querySelectorAll('.question-option').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.7';
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    /**
     * Manejar respuesta correcta
     */
    handleCorrectAnswer() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('success');
        }
        
        // Añadir puntos (más puntos por sala avanzada)
        const points = 100 + (this.currentRoom * 20);
        this.score += points;
        
        // Mostrar mensaje
        this.showTerminalMessage(`✅ ¡CORRECTO! +${points} puntos`, 'success');
        
        // Avanzar a siguiente pregunta
        this.currentQuestionIndex++;
        
        setTimeout(() => {
            const roomData = window.RoomManager.getRoom(this.currentRoom);
            
            // Verificar si completó todas las preguntas de la sala
            if (this.currentQuestionIndex >= roomData.questions.length) {
                this.completeRoom();
            } else {
                // Cargar siguiente pregunta
                this.createRoomScreen(roomData);
            }
        }, 1500);
        
        this.updateUI();
    }

    /**
     * Manejar respuesta incorrecta
     */
    handleWrongAnswer() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('error');
        }
        
        // Perder vida
        this.loseLife();
        
        // Mostrar mensaje de error
        this.showTerminalMessage('❌ ERROR: Respuesta incorrecta. Pierdes una vida.', 'error');
        
        // Mostrar pista automática si quedan pocas vidas
        if (this.lives <= 1) {
            setTimeout(() => {
                const roomData = window.RoomManager.getRoom(this.currentRoom);
                const question = roomData.questions[this.currentQuestionIndex];
                this.showTerminalMessage(`💡 PISTA AUTOMÁTICA: ${question.hint}`, 'hint');
            }, 1200);
        }
        
        // Permitir reintentar después de un delay
        setTimeout(() => {
            document.querySelectorAll('.question-option').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        }, 1500);
    }

    /**
     * Completar una sala
     */
    completeRoom() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('room_complete');
        }
        
        // Marcar sala como completada
        window.RoomManager.completeRoom(this.currentRoom);
        this.completedRooms.push(this.currentRoom);
        
        // Bonus por completar sala
        const bonus = 200 + (this.currentRoom * 50);
        this.score += bonus;
        
        this.showTerminalMessage(`🎉 ¡SALA COMPLETADA! +${bonus} puntos bonus`, 'success');
        
        // Verificar si ganó (todas las salas completadas)
        if (this.completedRooms.length >= 5) {
            setTimeout(() => this.gameWon(), 2000);
        } else {
            setTimeout(() => this.leaveRoom(), 2500);
        }
        
        this.updateUI();
    }

    /**
     * Perder una vida
     */
    loseLife() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    /**
     * Salir de la sala actual
     */
    leaveRoom() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('door_close');
        }
        
        // Eliminar pantalla de sala
        const roomScreen = document.getElementById('room-screen');
        if (roomScreen) {
            roomScreen.remove();
        }
        
        // Mostrar lobby
        document.getElementById('lobby-screen').style.display = 'flex';
        this.currentScreen = 'lobby';
        this.currentRoom = null;
        this.currentQuestionIndex = 0;
        
        this.showSystemMessage('Has salido de la sala. Elige otra puerta para continuar debuggeando.');
    }

    /**
     * Solicitar pista
     */
    requestHint() {
        if (this.lives <= 1) {
            this.showSystemMessage('⚠️ No puedes pedir pistas con 1 vida restante.');
            return;
        }
        
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('hint');
        }
        
        // Perder una vida por pedir pista
        this.lives--;
        
        const roomData = window.RoomManager.getRoom(this.currentRoom);
        const question = roomData.questions[this.currentQuestionIndex];
        
        this.showTerminalMessage(`💡 PISTA: ${question.hint}`, 'hint');
        
        this.updateUI();
        
        // Mostrar mensaje de sistema
        this.showSystemMessage('Has usado una pista. Pierdes una vida.');
    }

    /**
     * Mostrar mensaje en el sistema
     * @param {string} message - Mensaje a mostrar
     */
    showSystemMessage(message) {
        const systemMsg = document.querySelector('.system-message');
        if (systemMsg) {
            systemMsg.textContent = `> root@debug-system:~$ ${message}`;
            
            // Efecto de parpadeo
            systemMsg.style.opacity = '0.5';
            setTimeout(() => {
                systemMsg.style.opacity = '1';
            }, 100);
        }
    }

    /**
     * Mostrar mensaje en la terminal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - 'success', 'error', 'hint'
     */
    showTerminalMessage(message, type = '') {
        const terminalContent = document.getElementById('terminalContent');
        if (!terminalContent) return;
        
        const messageClass = type === 'success' ? 'terminal-success' : 
                            type === 'error' ? 'terminal-error' : 
                            type === 'hint' ? 'terminal-hint' : '';
        
        const line = document.createElement('div');
        line.className = `command-line ${messageClass}`;
        line.innerHTML = `
            <span class="command-line-root">root@debug-system:~$</span>
            <span class="command-line-command">${message}</span>
        `;
        
        terminalContent.appendChild(line);
        
        // Scroll al final
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    /**
     * Actualizar UI con vidas y puntuación
     */
    updateUI() {
        // Actualizar stats en sala actual si existe
        const livesDisplay = document.querySelector('.lives');
        const scoreDisplay = document.querySelector('.score');
        const progressDisplay = document.querySelector('.progress');
        
        if (livesDisplay) livesDisplay.textContent = `❤️ Vidas: ${this.lives}`;
        if (scoreDisplay) scoreDisplay.textContent = `⭐ Puntuación: ${this.score}`;
        if (progressDisplay && this.currentRoom) {
            const roomData = window.RoomManager.getRoom(this.currentRoom);
            if (roomData) {
                progressDisplay.textContent = `📊 Progreso: ${this.currentQuestionIndex + 1}/${roomData.questions.length}`;
            }
        }
    }

    /**
     * Game Over
     */
    gameOver() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('game_over');
        }
        
        // Guardar puntuación si StorageManager está disponible
        if (typeof StorageManager !== 'undefined' && StorageManager.saveScore) {
            StorageManager.saveScore(this.score);
        }
        
        // Mostrar pantalla de Game Over con estilo
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameover-screen';
        gameOverScreen.className = 'screen';
        gameOverScreen.innerHTML = `
            <div class="debug-title" style="color: var(--color-error-red); animation: debugBlinkRed 0.5s infinite;">
                GAME OVER
            </div>
            <div class="question-text" style="color: var(--color-error-red);">
                HAS PERDIDO TODAS TUS VIDAS
            </div>
            <div class="score-final">
                <span style="font-size: 24px;">PUNTUACIÓN FINAL: ${this.score}</span>
            </div>
            <div class="options" style="margin-top: 40px;">
                <button class="option-btn" onclick="window.gameController.resetGame()">
                    🔁 REINICIAR
                </button>
                <button class="option-btn false-btn" onclick="window.gameController.showRanking()">
                    🏆 RANKING
                </button>
            </div>
        `;
        
        document.body.appendChild(gameOverScreen);
        
        // Añadir keyframes para blink rojo
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes debugBlinkRed {
                0%, 100% { opacity: 1; text-shadow: 0 0 15px #ff4444; }
                50% { opacity: 0.6; text-shadow: 0 0 30px #ff0000; }
            }
            .score-final {
                margin: 30px 0;
                font-family: var(--font-terminal);
                color: var(--color-neon-green);
                font-size: 28px;
                text-shadow: 0 0 10px var(--color-neon-green);
            }
        `;
        document.head.appendChild(style);
        
        this.currentScreen = 'gameover';
    }

    /**
     * Victoria
     */
    gameWon() {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('victory');
        }
        
        // Guardar puntuación
        if (typeof StorageManager !== 'undefined' && StorageManager.saveScore) {
            StorageManager.saveScore(this.score);
        }
        
        // Mostrar pantalla de victoria
        const victoryScreen = document.createElement('div');
        victoryScreen.id = 'victory-screen';
        victoryScreen.className = 'screen';
        victoryScreen.innerHTML = `
            <div class="debug-title" style="color: var(--color-neon-green); animation: debugBlink 0.3s infinite;">
                ¡VICTORIA!
            </div>
            <div class="question-text" style="color: var(--color-neon-green); margin: 20px 0;">
                HAS ESCAPADO DEL BUCLE INFINITO
            </div>
            <div class="score-final">
                <span style="font-size: 28px;">PUNTUACIÓN FINAL: ${this.score}</span>
            </div>
            <pre style="text-align: center; margin: 30px 0; color: var(--color-neon-cyan);">
╔══════════════════════════════════════════╗
║  Eres un verdadero maestro del debug   ║
║  El sistema te reconoce como LEGEND    ║
╚══════════════════════════════════════════╝
            </pre>
            <div class="options" style="margin-top: 40px;">
                <button class="option-btn" onclick="window.gameController.resetGame()">
                    🔁 JUGAR DE NUEVO
                </button>
                <button class="option-btn" onclick="window.gameController.showRanking()">
                    🏆 VER RANKING
                </button>
            </div>
        `;
        
        document.body.appendChild(victoryScreen);
        
        this.currentScreen = 'victory';
    }

    /**
     * Mostrar ranking (placeholder)
     */
    showRanking() {
        alert('🏆 RANKING\n\nPróximamente disponible en la versión 2.0\n\n¡Sigue debuggeando!');
    }

    /**
     * Reiniciar juego
     */
    resetGame() {
        // Eliminar pantallas de gameover/victoria si existen
        ['gameover-screen', 'victory-screen', 'room-screen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        
        // Mostrar pantalla inicial
        document.getElementById('lobby-screen').style.display = 'none';
        document.getElementById('initial-screen').style.display = 'flex';
        document.getElementById('initial-screen').classList.remove('fade-out');
        
        this.currentScreen = 'initial';
        this.gameStarted = false;
        this.currentRoom = null;
        this.currentQuestionIndex = 0;
        
        this.showSystemMessage('Sistema reiniciado. ¿Quieres jugar a DEBUG?');
    }
}

// Instanciar y exponer globalmente
window.gameController = new GameController();

// Añadir clases de animación fade para transiciones suaves
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        animation: fadeOut 0.5s forwards;
    }
    .fade-in {
        animation: fadeIn 0.5s forwards;
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: scale(0.95); }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    /* Animación de glow para botones de sala */
    @keyframes buttonGlowRoom {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    }
    /* Estilos para opciones de pregunta */
    .question-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 25px 0;
        max-width: 600px;
        width: 100%;
    }
    .question-option {
        padding: 15px 25px !important;
        font-size: 18px !important;
        text-align: left;
        justify-content: flex-start;
        width: 100%;
        transition: all 0.2s ease;
    }
    .question-option:hover {
        transform: translateX(10px) !important;
    }
    .question-option:disabled {
        cursor: not-allowed;
        transform: none !important;
    }
    .room-stats {
        display: flex;
        gap: 20px;
        margin-top: 15px;
        font-family: var(--font-terminal);
        font-size: 18px;
    }
    .room-buttons {
        display: flex;
        gap: 15px;
        margin-top: 25px;
        justify-content: center;
        flex-wrap: wrap;
    }
    .hint-btn {
        background-color: rgba(0, 255, 255, 0.1) !important;
        border-color: var(--color-neon-cyan) !important;
        color: var(--color-neon-cyan) !important;
    }
    .terminal-hint {
        color: var(--color-neon-cyan) !important;
        text-shadow: 0 0 8px var(--color-neon-cyan);
    }
    .question-text {
        color: var(--color-neon-green);
        font-weight: bold;
        margin: 10px 0;
    }
`;
document.head.appendChild(style);