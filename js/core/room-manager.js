/**
 * Room Manager - Gestor de Salas de Depuración
 * Contiene todas las 5 salas del escape room
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
        this.completedRooms = [];
    }

    // ... (métodos createRoom_* con las preguntas de cada sala)
    // ... (métodos getRoom, validateAnswer, etc.)

    createRoom_BucleInfinito() {
        return {
            id: 1,
            name: "EL BUCLE INFINITO",
            description: "Nivel 1: Fundamentos de programación",
            themeColor: "#1e3a8a",
            questions: [
                {
                    id: "q1_1",
                    question: "¿Qué palabra se usa para repetir una acción varias veces?",
                    options: [
                        { id: "a", text: "loop / for", correct: true },
                        { id: "b", text: "exit", correct: false }
                    ]
                },
                // ... más preguntas de la sala 1
            ]
        };
    }
    
    // Implementar métodos similares para las otras 4 salas
    // (El contenido completo ya lo tienes en versiones anteriores)
}