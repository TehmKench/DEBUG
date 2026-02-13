/**
 * Controlador de interfaz de usuario
 * Gestiona la visualización de elementos en pantalla
 */
class UIController {
    constructor() {
        this.gameController = null;
        this.currentRoomData = null;
        this.currentQuestionIndex = 0;
        
        // Inicializar automáticamente si gameController ya existe
        if (window.gameController) {
            this.init(window.gameController);
        }
    }

    init(gameController) {
        this.gameController = gameController;
        console.log('🎨 UI Controller inicializado');
    }

    /**
     * Mostrar una pantalla específica
     * @param {string} screenId - ID de la pantalla ('initial-screen', 'lobby-screen', etc.)
     */
    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'flex';
            screen.classList.add('active');
            
            // Efecto de fade suave
            screen.style.opacity = '0';
            setTimeout(() => {
                screen.style.transition = 'opacity 0.4s ease';
                screen.style.opacity = '1';
            }, 10);
        }
        
        // Actualizar UI según la pantalla
        if (screenId === 'lobby-screen') {
            this.updateLobbyDoors();
        }
    }

    /**
     * Actualizar estado visual de las puertas en el lobby
     */
    updateLobbyDoors() {
        if (!this.gameController || !this.gameController.completedRooms) return;
        
        // Marcar puertas completadas
        document.querySelectorAll('.door').forEach(door => {
            const roomNumber = parseInt(door.querySelector('.door-number').textContent);
            if (this.gameController.completedRooms.includes(roomNumber)) {
                door.classList.add('completed');
                door.title = '✅ Sala completada';
            } else {
                door.classList.remove('completed');
                door.title = `🚪 Sala ${roomNumber}: ${door.querySelector('.door-name').textContent.replace('<br>', ' ')}`;
            }
        });
    }

    /**
     * Actualizar visualización de vidas y puntuación
     */
    updateStats() {
        if (!this.gameController) return;
        
        // Actualizar en sala actual si existe
        const livesEl = document.querySelector('.room-stats .lives');
        const scoreEl = document.querySelector('.room-stats .score');
        const progressEl = document.querySelector('.room-stats .progress');
        
        if (livesEl) livesEl.textContent = `❤️ Vidas: ${this.gameController.lives}`;
        if (scoreEl) scoreEl.textContent = `⭐ Puntuación: ${this.gameController.score}`;
        
        // Actualizar progreso si estamos en una sala
        if (progressEl && this.gameController.currentRoom) {
            const roomData = window.RoomManager?.getRoom(this.gameController.currentRoom);
            if (roomData) {
                progressEl.textContent = `📊 Progreso: ${this.gameController.currentQuestionIndex + 1}/${roomData.questions.length}`;
            }
        }
        
        // Efecto visual cuando quedan pocas vidas
        if (this.gameController.lives <= 1 && livesEl) {
            livesEl.style.color = 'var(--color-error-red)';
            livesEl.style.textShadow = '0 0 10px var(--color-error-red)';
        } else if (livesEl) {
            livesEl.style.color = '';
            livesEl.style.textShadow = '';
        }
    }

    /**
     * Mostrar mensaje en la terminal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - 'success', 'error', 'hint', 'system'
     */
    showTerminalMessage(message, type = 'system') {
        const terminalContent = document.getElementById('terminalContent');
        if (!terminalContent) return;
        
        // Clases según tipo de mensaje
        const typeClasses = {
            success: 'terminal-success',
            error: 'terminal-error',
            hint: 'terminal-hint',
            system: ''
        };
        
        const messageClass = typeClasses[type] || '';
        
        // Crear línea de mensaje
        const line = document.createElement('div');
        line.className = `command-line ${messageClass}`;
        line.innerHTML = `
            <span class="command-line-root">root@debug-system:~$</span>
            <span class="command-line-command">${message}</span>
        `;
        
        terminalContent.appendChild(line);
        
        // Scroll automático al final
        setTimeout(() => {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }, 50);
        
        // Efecto de entrada
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, 100);
    }

    /**
     * Mostrar mensaje del sistema (barra inferior)
     * @param {string} message - Mensaje a mostrar
     */
    showSystemMessage(message) {
        const systemMsg = document.querySelector('.system-message');
        if (!systemMsg) return;
        
        // Efecto de escritura tipo máquina
        systemMsg.textContent = '';
        const fullMessage = `> root@debug-system:~$ ${message}`;
        
        let i = 0;
        const typeWriter = () => {
            if (i < fullMessage.length) {
                systemMsg.textContent += fullMessage.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Reiniciar mensaje anterior
        systemMsg.style.opacity = '0.7';
        setTimeout(() => {
            systemMsg.textContent = '';
            systemMsg.style.opacity = '1';
            typeWriter();
        }, 200);
    }

    /**
     * Renderizar pregunta actual en la sala
     * @param {Object} roomData - Datos de la sala
     * @param {number} questionIndex - Índice de la pregunta actual
     */
    renderQuestion(roomData, questionIndex) {
        this.currentRoomData = roomData;
        this.currentQuestionIndex = questionIndex;
        
        const question = roomData.questions[questionIndex];
        if (!question) return;
        
        const terminalContent = document.getElementById('terminalContent');
        const optionsContainer = document.getElementById('questionOptions');
        
        if (!terminalContent || !optionsContainer) return;
        
        // Limpiar contenido anterior
        terminalContent.innerHTML = `
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
        `;
        
        // Renderizar opciones
        optionsContainer.innerHTML = question.options.map(opt => `
            <button class="option-btn question-option" 
                    data-option="${opt.id}"
                    style="border-color: ${roomData.themeColor}; --room-color: ${roomData.themeColor};">
                ${opt.text}
            </button>
        `).join('');
        
        // Añadir eventos a las opciones
        document.querySelectorAll('.question-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.disabled) {
                    const optionId = e.currentTarget.dataset.option;
                    if (this.gameController) {
                        this.gameController.selectOption(optionId);
                    }
                }
            });
            
            // Efecto hover mejorado
            btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'translateX(10px)';
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'translateX(0)';
                }
            });
        });
        
        // Scroll al inicio
        terminalContent.scrollTop = 0;
        
        // Enfocar primera opción
        setTimeout(() => {
            const firstOption = optionsContainer.querySelector('.question-option');
            if (firstOption) firstOption.focus();
        }, 300);
    }

    /**
     * Mostrar feedback visual por respuesta
     * @param {boolean} isCorrect - true si es correcta, false si es incorrecta
     * @param {string} optionId - ID de la opción seleccionada
     */
    showAnswerFeedback(isCorrect, optionId) {
        const selectedBtn = document.querySelector(`.question-option[data-option="${optionId}"]`);
        if (!selectedBtn) return;
        
        // Deshabilitar todas las opciones
        document.querySelectorAll('.question-option').forEach(btn => {
            btn.disabled = true;
        });
        
        if (isCorrect) {
            // Efecto de éxito
            selectedBtn.classList.add('correct');
            selectedBtn.style.background = 'rgba(0, 255, 0, 0.2)';
            selectedBtn.style.boxShadow = '0 0 20px var(--color-success-green)';
            
            // Animación de partículas de éxito
            this.createParticles(selectedBtn, 'var(--color-success-green)');
        } else {
            // Efecto de error
            selectedBtn.classList.add('incorrect');
            selectedBtn.style.background = 'rgba(255, 68, 68, 0.2)';
            selectedBtn.style.boxShadow = '0 0 20px var(--color-error-red)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            // Temblor de pantalla
            this.screenShake();
            
            // Animación de partículas de error
            this.createParticles(selectedBtn, 'var(--color-error-red)');
        }
    }

    /**
     * Crear partículas de feedback (éxito/error)
     * @param {HTMLElement} element - Elemento origen de las partículas
     * @param {string} color - Color de las partículas
     */
    createParticles(element, color) {
        const rect = element.getBoundingClientRect();
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'fixed';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            particle.style.background = color;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            // Posición inicial (centro del botón)
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            document.body.appendChild(particle);
            
            // Animación
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const duration = 300 + Math.random() * 400;
            
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
            });
            
            // Limpiar partícula
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
    }

    /**
     * Efecto de temblor de pantalla (para errores)
     */
    screenShake() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.style.animation = 'screenShake 0.5s';
        });
        
        // Añadir keyframes si no existen
        if (!document.getElementById('shake-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shake-keyframes';
            style.textContent = `
                @keyframes screenShake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover animación después
        setTimeout(() => {
            screens.forEach(screen => {
                screen.style.animation = '';
            });
        }, 500);
    }

    /**
     * Mostrar pista con efecto visual
     * @param {string} hint - Texto de la pista
     */
    showHint(hint) {
        this.showTerminalMessage(`💡 PISTA: ${hint}`, 'hint');
        
        // Efecto visual en terminal
        const terminal = document.querySelector('.terminal-screen');
        if (terminal) {
            terminal.style.boxShadow = '0 0 30px var(--color-neon-cyan), inset 0 0 20px var(--color-neon-cyan)';
            setTimeout(() => {
                terminal.style.boxShadow = '0 0 20px var(--color-neon-green), inset 0 0 15px var(--color-neon-green)';
            }, 2000);
        }
    }

    /**
     * Mostrar pantalla de Game Over
     */
    showGameOver() {
        // Eliminar pantallas existentes
        ['room-screen', 'victory-screen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        
        // Crear pantalla de Game Over
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'gameover-screen';
        gameOverScreen.className = 'screen active';
        gameOverScreen.innerHTML = `
            <div class="debug-title" style="color: var(--color-error-red); animation: debugBlinkRed 0.5s infinite;">
                GAME OVER
            </div>
            <div class="question-text" style="color: var(--color-error-red); margin: 20px 0;">
                HAS PERDIDO TODAS TUS VIDAS
            </div>
            <div class="score-final">
                <span>PUNTUACIÓN FINAL: ${this.gameController.score}</span>
            </div>
            <pre class="gameover-art" style="margin: 30px 0; color: var(--color-error-red);">
   💀  💀  💀  💀  💀
  💀  SISTEMA CAÍDO  💀
   💀  💀  💀  💀  💀
            </pre>
            <div class="options" style="margin-top: 30px;">
                <button class="option-btn" onclick="window.gameController.resetGame()">
                    🔁 REINICIAR DEBUG
                </button>
                <button class="option-btn false-btn" onclick="window.location.reload()">
                    🚪 SALIR DEL SISTEMA
                </button>
            </div>
        `;
        
        document.body.appendChild(gameOverScreen);
        
        // Añadir estilo para blink rojo
        if (!document.getElementById('gameover-styles')) {
            const style = document.createElement('style');
            style.id = 'gameover-styles';
            style.textContent = `
                @keyframes debugBlinkRed {
                    0%, 100% { opacity: 1; text-shadow: 0 0 15px #ff4444; }
                    50% { opacity: 0.7; text-shadow: 0 0 30px #ff0000; }
                }
                .score-final {
                    font-family: var(--font-terminal);
                    color: var(--color-neon-green);
                    font-size: 28px;
                    text-shadow: 0 0 10px var(--color-neon-green);
                    margin: 20px 0;
                }
                .gameover-art {
                    font-size: 24px;
                    letter-spacing: -1px;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Sonido de game over
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('game_over');
        }
    }

    /**
     * Mostrar pantalla de Victoria
     */
    showVictory() {
        // Eliminar pantallas existentes
        ['room-screen', 'gameover-screen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        
        // Crear pantalla de Victoria
        const victoryScreen = document.createElement('div');
        victoryScreen.id = 'victory-screen';
        victoryScreen.className = 'screen active';
        victoryScreen.innerHTML = `
            <div class="debug-title" style="color: var(--color-neon-green); animation: debugBlink 0.3s infinite;">
                ¡VICTORIA!
            </div>
            <div class="question-text" style="color: var(--color-neon-green); margin: 20px 0;">
                HAS ESCAPADO DEL BUCLE INFINITO
            </div>
            <div class="score-final">
                <span>PUNTUACIÓN FINAL: ${this.gameController.score}</span>
            </div>
            <pre class="victory-art" style="margin: 30px 0; color: var(--color-neon-green);">
╔══════════════════════════════════════════╗
║  █▀▀ █░█ █▀▀ █▀█ █▀█ █▄█ █░█ █▀▀ █▀█  ║
║  █▄█ █▄█ ██▄ █▀▄ █▄█ ░█░ █▄█ ██▄ █▀▄  ║
╚══════════════════════════════════════════╝
            </pre>
            <div class="options" style="margin-top: 30px;">
                <button class="option-btn" onclick="window.gameController.resetGame()">
                    🔁 DEBUGGEAR DE NUEVO
                </button>
                <button class="option-btn" onclick="window.location.reload()">
                    🏆 VER RANKING (PRÓXIMO)
                </button>
            </div>
        `;
        
        document.body.appendChild(victoryScreen);
        
        // Efecto de partículas de victoria
        setTimeout(() => {
            this.createVictoryParticles();
        }, 500);
        
        // Sonido de victoria
        if (typeof AudioManager !== 'undefined' && AudioManager.playSound) {
            AudioManager.playSound('victory');
        }
    }

    /**
     * Crear partículas de victoria (efecto especial)
     */
    createVictoryParticles() {
        const colors = ['var(--color-neon-green)', 'var(--color-neon-cyan)', 'var(--color-success-green)'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'victory-particle';
            particle.style.position = 'fixed';
            particle.style.width = `${3 + Math.random() * 5}px`;
            particle.style.height = `${3 + Math.random() * 5}px`;
            particle.style.borderRadius = '50%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '2000';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = '100%';
            
            document.body.appendChild(particle);
            
            // Animación
            const duration = 2000 + Math.random() * 1000;
            const endY = -100 - Math.random() * 200;
            const endX = (Math.random() - 0.5) * 300;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(0.5)', opacity: 0 },
                { transform: `translate(${endX}px, ${endY}px) scale(1)`, opacity: 0.8 },
                { transform: `translate(${endX * 1.5}px, ${endY * 1.5}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.1, 0.9, 0.4, 1)'
            });
            
            // Limpiar
            setTimeout(() => {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, duration);
        }
    }

    /**
     * Reiniciar UI al estado inicial
     */
    resetUI() {
        // Eliminar pantallas dinámicas
        ['room-screen', 'gameover-screen', 'victory-screen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        
        // Mostrar pantalla inicial
        this.showScreen('initial-screen');
        
        // Resetear estilos globales
        document.documentElement.style.setProperty('--current-room-color', 'var(--color-neon-green)');
    }
}

// Instanciar y exponer globalmente
window.uiController = new UIController();

// Añadir estilos necesarios para partículas y efectos
const uiStyles = document.createElement('style');
uiStyles.textContent = `
    /* Estilos para botones de pregunta */
    .question-option {
        width: 100%;
        text-align: left;
        justify-content: flex-start;
        padding: 15px 25px !important;
        font-size: 18px !important;
        margin: 8px 0 !important;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        position: relative;
        overflow: hidden;
    }
    
    .question-option:hover {
        transform: translateX(12px) !important;
        box-shadow: 0 0 15px var(--room-color, var(--color-neon-green)) !important;
    }
    
    .question-option:disabled {
        cursor: not-allowed !important;
        transform: translateX(0) !important;
        opacity: 0.8 !important;
    }
    
    .question-option.correct {
        animation: pulseSuccess 0.6s ease;
    }
    
    .question-option.incorrect {
        animation: shakeError 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }
    
    @keyframes pulseSuccess {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
    }
    
    @keyframes shakeError {
        10%, 90% { transform: translateX(-10px); }
        20%, 80% { transform: translateX(10px); }
        30%, 50%, 70% { transform: translateX(-5px); }
        40%, 60% { transform: translateX(5px); }
        0%, 100% { transform: translateX(0); }
    }
    
    /* Estilos para puertas completadas */
    .door.completed {
        opacity: 0.7;
        border-color: var(--color-success-green) !important;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.5) !important;
        cursor: not-allowed;
    }
    
    .door.completed::before {
        content: '✅';
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        color: var(--color-success-green);
        z-index: 10;
        text-shadow: 0 0 10px var(--color-success-green);
    }
    
    /* Estilos para mensajes de terminal */
    .terminal-success {
        color: var(--color-success-green) !important;
        text-shadow: 0 0 8px var(--color-success-green);
    }
    
    .terminal-error {
        color: var(--color-error-red) !important;
        text-shadow: 0 0 8px var(--color-error-red);
        animation: textShake 0.5s;
    }
    
    .terminal-hint {
        color: var(--color-neon-cyan) !important;
        text-shadow: 0 0 8px var(--color-neon-cyan);
    }
    
    @keyframes textShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    /* Estadísticas en sala */
    .room-stats {
        display: flex;
        gap: 25px;
        margin-top: 20px;
        font-family: var(--font-terminal);
        font-size: 19px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .room-stats .lives {
        color: var(--color-neon-green);
        transition: all 0.3s ease;
    }
    
    .room-stats .score {
        color: var(--color-neon-cyan);
    }
    
    .room-stats .progress {
        color: var(--color-neon-green);
        opacity: 0.9;
    }
    
    /* Botones en sala */
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
        animation: buttonGlowCyan 2s infinite;
    }
    
    @keyframes buttonGlowCyan {
        0%, 100% { box-shadow: 0 0 5px var(--color-neon-cyan); }
        50% { box-shadow: 0 0 15px var(--color-neon-cyan), 0 0 25px var(--color-neon-cyan); }
    }
    
    /* Responsive para mobile */
    @media (max-width: 768px) {
        .question-option {
            font-size: 16px !important;
            padding: 12px 20px !important;
        }
        
        .room-stats {
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        
        .room-buttons {
            flex-direction: column;
            width: 100%;
        }
        
        .room-buttons button {
            width: 100%;
        }
    }
`;
document.head.appendChild(uiStyles);