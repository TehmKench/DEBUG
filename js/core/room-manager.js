/**
 * Room Manager - Gestor de Salas de Depuración
 * Contiene todas las 5 salas del escape room
 * Cada sala representa un nivel de stack de errores
 */
class RoomManager {
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

    /**
     * Sala 1: El Bucle Infinito
     * Nivel básico: Fundamentos de programación
     */
    createRoom_BucleInfinito() {
        return {
            id: 1,
            name: "EL BUCLE INFINITO",
            description: "Nivel 1: Fundamentos de programación",
            themeColor: "#1e3a8a",  // Azul profundo
            glitchIntensity: 1,
            questions: [
                {
                    id: "q1_1",
                    question: "¿Qué palabra se usa para repetir una acción varias veces?",
                    options: [
                        { id: "a", text: "loop / for", correct: true },
                        { id: "b", text: "exit", correct: false }
                    ],
                    hint: "Piensa en estructuras de control de flujo"
                },
                {
                    id: "q1_2",
                    question: "Si un bucle nunca termina, ¿qué problema ocurre?",
                    options: [
                        { id: "a", text: "Bucle infinito", correct: true },
                        { id: "b", text: "Compilación rápida", correct: false }
                    ],
                    hint: "Es exactamente lo que parece"
                },
                {
                    id: "q1_3",
                    question: "¿Qué valor lógico significa 'verdadero'?",
                    options: [
                        { id: "a", text: "true", correct: true },
                        { id: "b", text: "false", correct: false }
                    ],
                    hint: "Booleanos en inglés"
                },
                {
                    id: "q1_4",
                    question: "¿Cómo se llama el error cuando el programa no puede continuar?",
                    options: [
                        { id: "a", text: "Error o excepción", correct: true },
                        { id: "b", text: "Comentario", correct: false }
                    ],
                    hint: "Algo que interrumpe la ejecución normal"
                },
                {
                    id: "q1_5",
                    question: "¿Qué símbolo se usa normalmente para comentar una línea?",
                    options: [
                        { id: "a", text: "//", correct: true },
                        { id: "b", text: "%%", correct: false }
                    ],
                    hint: "Común en JavaScript, Java, C++"
                }
            ]
        };
    }

    /**
     * Sala 2: Código Maldito
     * Nivel variables: Variables y estructuras básicas
     */
    createRoom_CodigoMaldito() {
        return {
            id: 2,
            name: "CÓDIGO MALDITO",
            description: "Nivel 2: Variables y estructuras básicas",
            themeColor: "#4f46e5",  // Índigo
            glitchIntensity: 2,
            questions: [
                {
                    id: "q2_1",
                    question: "¿Qué es una variable?",
                    options: [
                        { id: "a", text: "Un espacio para guardar datos", correct: true },
                        { id: "b", text: "Un tipo de bucle", correct: false }
                    ],
                    hint: "Almacena información que puede cambiar"
                },
                {
                    id: "q2_2",
                    question: "Si x = 5 y luego x = x + 2, ¿cuánto vale x?",
                    options: [
                        { id: "a", text: "7", correct: true },
                        { id: "b", text: "5", correct: false }
                    ],
                    hint: "Operación aritmética básica"
                },
                {
                    id: "q2_3",
                    question: "¿Qué estructura se usa para tomar decisiones?",
                    options: [
                        { id: "a", text: "if", correct: true },
                        { id: "b", text: "print", correct: false }
                    ],
                    hint: "Estructura condicional"
                },
                {
                    id: "q2_4",
                    question: "¿Qué tipo de dato guardarías para 'ERROR'?",
                    options: [
                        { id: "a", text: "String (cadena)", correct: true },
                        { id: "b", text: "Entero", correct: false }
                    ],
                    hint: "Texto entre comillas"
                },
                {
                    id: "q2_5",
                    question: "¿Qué ocurre si usas una variable que no existe?",
                    options: [
                        { id: "a", text: "Error", correct: true },
                        { id: "b", text: "Se ignora siempre", correct: false }
                    ],
                    hint: "El programa no puede continuar"
                }
            ]
        };
    }

    /**
     * Sala 3: La Función Recursiva
     * Nivel intermedio: Funciones y recursión
     */
    createRoom_FuncionRecursiva() {
        return {
            id: 3,
            name: "LA FUNCIÓN RECURSIVA",
            description: "Nivel 3: Funciones y recursión",
            themeColor: "#7c3aed",  // Púrpura
            glitchIntensity: 3,
            questions: [
                {
                    id: "q3_1",
                    question: "¿Qué es una función?",
                    options: [
                        { id: "a", text: "Un bloque reutilizable de código", correct: true },
                        { id: "b", text: "Un tipo de error", correct: false }
                    ],
                    hint: "Bloque de código con un propósito específico"
                },
                {
                    id: "q3_2",
                    question: "Si una función se llama a sí misma sin condición de salida, ¿qué ocurre?",
                    options: [
                        { id: "a", text: "Recursión infinita (stack overflow)", correct: true },
                        { id: "b", text: "Se optimiza automáticamente", correct: false }
                    ],
                    hint: "La pila de llamadas se llena"
                },
                {
                    id: "q3_3",
                    question: "¿Para qué sirve el valor `return`?",
                    options: [
                        { id: "a", text: "Devolver un resultado y terminar la función", correct: true },
                        { id: "b", text: "Reiniciar el programa", correct: false }
                    ],
                    hint: "Indica el valor de salida de la función"
                },
                {
                    id: "q3_4",
                    question: "¿Qué representa el 'stack' en una llamada recursiva?",
                    options: [
                        { id: "a", text: "La memoria de las llamadas pendientes", correct: true },
                        { id: "b", text: "El historial de errores", correct: false }
                    ],
                    hint: "Estructura LIFO (último en entrar, primero en salir)"
                },
                {
                    id: "q3_5",
                    question: "Si cada depuración te acerca a la salida... ¿por qué sigues atrapado?",
                    options: [
                        { id: "a", text: "Porque tú eres la excepción no capturada", correct: true },
                        { id: "b", text: "Porque el sistema necesita un reboot", correct: false }
                    ],
                    hint: "Meta-pregunta sobre tu situación"
                }
            ]
        };
    }

    /**
     * Sala 4: Memoria Corrupta
     * Nivel avanzado: Memoria y punteros
     */
    createRoom_MemoriaCorrupta() {
        return {
            id: 4,
            name: "MEMORIA CORRUPTA",
            description: "Nivel 4: Memoria y punteros",
            themeColor: "#db2777",  // Rosa/Rojo
            glitchIntensity: 4,
            questions: [
                {
                    id: "q4_1",
                    question: "¿Qué es un puntero?",
                    options: [
                        { id: "a", text: "Una variable que almacena una dirección de memoria", correct: true },
                        { id: "b", text: "Un tipo de bucle", correct: false }
                    ],
                    hint: "Referencia a una ubicación en memoria"
                },
                {
                    id: "q4_2",
                    question: "¿Qué ocurre si accedes a memoria ya liberada?",
                    options: [
                        { id: "a", text: "Comportamiento indefinido / segmentation fault", correct: true },
                        { id: "b", text: "El sistema la reasigna automáticamente", correct: false }
                    ],
                    hint: "Error grave de memoria"
                },
                {
                    id: "q4_3",
                    question: "¿Qué estructura usa LIFO (último en entrar, primero en salir)?",
                    options: [
                        { id: "a", text: "Pila (stack)", correct: true },
                        { id: "b", text: "Cola (queue)", correct: false }
                    ],
                    hint: "Estructura de datos fundamental"
                },
                {
                    id: "q4_4",
                    question: "¿Qué representa una 'fuga de memoria'?",
                    options: [
                        { id: "a", text: "Memoria reservada que nunca se libera", correct: true },
                        { id: "b", text: "Un archivo de log demasiado grande", correct: false }
                    ],
                    hint: "Recursos que no se liberan"
                },
                {
                    id: "q4_5",
                    question: "La variable `jugador.estaAtrapado` es `true`. Para cambiarla a `false`, necesitas:",
                    options: [
                        { id: "a", text: "Encontrar la referencia raíz del objeto jugador", correct: true },
                        { id: "b", text: "Salir del juego", correct: false }
                    ],
                    hint: "Acceder a la variable desde su contexto"
                }
            ]
        };
    }

    /**
     * Sala 5: El Kernel Fantasma
     * Nivel abstracto: Sistemas y paradigmas
     */
    createRoom_KernelFantasma() {
        return {
            id: 5,
            name: "EL KERNEL FANTASMA",
            description: "Nivel 5: Sistemas y paradigmas",
            themeColor: "#be123c",  // Rojo sangre
            glitchIntensity: 5,
            questions: [
                {
                    id: "q5_1",
                    question: "¿Qué es un deadlock?",
                    options: [
                        { id: "a", text: "Dos procesos bloqueados esperando recursos del otro", correct: true },
                        { id: "b", text: "Un bucle con condición siempre falsa", correct: false }
                    ],
                    hint: "Situación de bloqueo mutuo"
                },
                {
                    id: "q5_2",
                    question: "¿Qué paradigma trata a 'todo como objetos'?",
                    options: [
                        { id: "a", text: "Programación orientada a objetos", correct: true },
                        { id: "b", text: "Programación funcional", correct: false }
                    ],
                    hint: "POO - Programación Orientada a Objetos"
                },
                {
                    id: "q5_3",
                    question: "¿Qué representa el símbolo `null`?",
                    options: [
                        { id: "a", text: "Ausencia de referencia/valor", correct: true },
                        { id: "b", text: "El número cero", correct: false }
                    ],
                    hint: "No es lo mismo que 0 o undefined"
                },
                {
                    id: "q5_4",
                    question: "¿Qué ocurre cuando dos hilos acceden a un recurso compartido sin sincronización?",
                    options: [
                        { id: "a", text: "Condición de carrera (race condition)", correct: true },
                        { id: "b", text: "El programa se optimiza", correct: false }
                    ],
                    hint: "Problema de concurrencia"
                },
                {
                    id: "q5_5",
                    question: "El sistema te pregunta: '¿Eres código o eres el depurador?'",
                    options: [
                        { id: "a", text: "Soy el error que el sistema no puede resolver", correct: true },
                        { id: "b", text: "Soy el usuario", correct: false }
                    ],
                    hint: "Paradoja final - rompe el bucle"
                }
            ]
        };
    }

    /**
     * Obtener una sala por su número
     */
    getRoom(roomNumber) {
        return this.rooms[roomNumber] || null;
    }

    /**
     * Obtener todas las salas
     */
    getAllRooms() {
        return this.rooms;
    }

    /**
     * Obtener una pregunta específica de una sala
     */
    getQuestion(roomNumber, questionId) {
        const room = this.getRoom(roomNumber);
        if (!room) return null;
        return room.questions.find(q => q.id === questionId);
    }

    /**
     * Validar respuesta de una pregunta
     */
    validateAnswer(roomNumber, questionId, selectedOptionId) {
        const question = this.getQuestion(roomNumber, questionId);
        if (!question) return false;
        
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        return selectedOption ? selectedOption.correct : false;
    }

    /**
     * Obtener el número total de preguntas en una sala
     */
    getTotalQuestions(roomNumber) {
        const room = this.getRoom(roomNumber);
        return room ? room.questions.length : 0;
    }

    /**
     * Verificar si una sala está completada
     */
    isRoomCompleted(roomNumber) {
        return this.completedRooms.includes(roomNumber);
    }

    /**
     * Marcar una sala como completada
     */
    completeRoom(roomNumber) {
        if (!this.isRoomCompleted(roomNumber)) {
            this.completedRooms.push(roomNumber);
            return true;
        }
        return false;
    }

    /**
     * Obtener estadísticas del progreso
     */
    getProgress() {
        return {
            completed: this.completedRooms.length,
            total: Object.keys(this.rooms).length,
            percentage: Math.round((this.completedRooms.length / Object.keys(this.rooms).length) * 100)
        };
    }

    /**
     * Reiniciar el progreso
     */
    resetProgress() {
        this.completedRooms = [];
        this.currentRoom = null;
    }
}