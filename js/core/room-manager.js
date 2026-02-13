/**
 * Room Manager - Gestor de Salas de Depuración
 * Contiene todas las 5 salas del escape room
 */
class RoomManager {  // ← Cambiar a PascalCase (convención de clases)
    constructor() {
        this.currentRoom = null;
        this.completedRooms = [];
        
        // Definición de todas las salas
        this.rooms = {
            1: this.createRoom_BucleInfinito(),
            2: this.createRoom_CodigoMaldito(),
            3: this.createRoom_FuncionRecursiva(),
            4: this.createRoom_MemoriaCorrupta(),
            5: this.createRoom_KernelFantasma()
        };
    }

    // ... resto de tu código ...

    /**
     * Método compatible con game-controller.js
     * Devuelve los datos de una sala
     */
    getRoomData(roomNumber) {
        return this.getRoom(roomNumber);
    }

    /**
     * Obtener la pregunta actual de una sala
     * (la primera no respondida)
     */
    getCurrentQuestion(roomNumber) {
        const room = this.getRoom(roomNumber);
        if (!room || !room.questions.length) return null;
        return room.questions[0]; // Primera pregunta
    }
}

// Instanciar y exponer globalmente
window.RoomManager = new RoomManager();