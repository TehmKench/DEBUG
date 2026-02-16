// js/core/room-manager.js
/**
 * Room Manager - Gestor de Salas de Depuración
 */
class RoomManager {
    constructor() {
        this.rooms = {
            1: this.createRoom_BucleInfinito(),
            2: this.createRoom_CodigoMaldito(),
            3: this.createRoom_FuncionRecursiva(),
            4: this.createRoom_MemoriaCorrupta(),
            5: this.createRoom_KernelFantasma()
        };
    }

    // Método 1: Define las funciones correctamente
    createRoom_BucleInfinito() {
        return {
            id: 1,
            name: "EL BUCLE INFINITO",
            questions: []
        };
    }

    createRoom_CodigoMaldito() {
        return {
            id: 2,
            name: "CÓDIGO MALDITO",
            questions: []
        };
    }

    createRoom_FuncionRecursiva() {
        return {
            id: 3,
            name: "FUNCIÓN RECURSIVA",
            questions: []
        };
    }

    createRoom_MemoriaCorrupta() {
        return {
            id: 4,
            name: "MEMORIA CORRUPTA",
            questions: []
        };
    }

    createRoom_KernelFantasma() {
        return {
            id: 5,
            name: "KERNEL FANTASMA",
            questions: []
        };
    }

    getRoom(roomNumber) {
        return this.rooms[roomNumber] || null;
    }
}

// Exportar globalmente
window.RoomManager = RoomManager;