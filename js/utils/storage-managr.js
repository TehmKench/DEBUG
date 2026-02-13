/**
 * Gestor de almacenamiento
 * Guarda y recupera el progreso del jugador
 */
class StorageManager {
    static saveGameState(gameState) {
        localStorage.setItem('debugGameState', JSON.stringify(gameState));
    }

    static loadGameState() {
        const saved = localStorage.getItem('debugGameState');
        return saved ? JSON.parse(saved) : null;
    }

    static clearGameState() {
        localStorage.removeItem('debugGameState');
    }
}