<div align="center">

# ⚡ DEBUG

![Estado](https://img.shields.io/badge/estado-en%20finalizado-yellow?style=for-the-badge)
![Versión](https://img.shields.io/badge/versión-7.4.0-blue?style=for-the-badge)

> Juego de quiz en primera persona con estética cyberpunk/neon. Pon a prueba tus conocimientos de informática, supera las salas y destruye el VOID CORE BOSS.

</div>

---

## 🎮 ¿De qué trata?

DEBUG es un juego web 3D en primera persona. El jugador recorre **5 zonas** en orden: cuatro salas de preguntas y una sala final de combate. Cada sala está bloqueada hasta completar la anterior. Al superar una sala aparece un objeto coleccionable que se guarda en el inventario y desbloquea el acceso a la siguiente.

---

## 🕹️ Controles

| Tecla | Acción |
|---|---|
| `W A S D` | Moverse |
| `Ratón` | Mirar |
| `Click` | Interactuar / responder |
| `Espacio` | Saltar *(solo en la sala final)* |
| `Shift Izquierdo` | Dash *(solo en la sala final)* |

---

## 🗺️ Zonas

### 🏠 Lobby

El punto de partida. Estética vaporwave con una grid animada que reacciona al ritmo de la música. Tiene **5 puertas**, una por sala. Las puertas bloqueadas brillan en rojo; al completar una sala, la siguiente se ilumina con su color. La puerta de la sala final exige los **4 objetos** del inventario para abrirse.

---

### 🟦 Sala 01 — Redes & Comunicaciones

Estética wireframe en **cian**. Lluvia de caracteres de código cayendo en el escenario.

**Quiz:** 8 preguntas sobre redes. Hay que acertar **5 de 8** para superar la sala. Cada pregunta tiene **15 segundos** y 3 opciones, solo una correcta. Si se falla el mínimo, te devuelve al lobby.

**Temario:** Modelo OSI, switches, hubs, routers, DHCP, DNS, subredes IPv4, HTTPS.

**Recompensa:** 🗝️ *Final Key*

---

### 🟠 Sala 02 — Sistemas Operativos

Misma estructura que la Sala 01 pero con paleta **naranja**. Requiere haber completado la Sala 01.

**Quiz:** 8 preguntas sobre sistemas operativos Linux y Windows.

**Temario:** Comandos Linux (`ps aux`, `chmod`, `chown`, `df -h`), permisos numéricos, sistemas de ficheros (NTFS, EXT4), `/etc/passwd`, hipervisores tipo 1 y tipo 2.

**Recompensa:** 💳 *Keycard*

---

### 🟢 Sala 03 — Seguridad & Servicios

Paleta **verde**. Requiere haber completado la Sala 02.

**Quiz:** 8 preguntas sobre ciberseguridad y servicios de red.

**Temario:** ARP Spoofing, firewalls por capas OSI, SFTP, fuerza bruta, LDAP/Active Directory, DMZ, TLS/SSL, tipos de malware (gusano, troyano, spyware).

**Recompensa:** 🔑 *R Key*

---

### 🔴 Sala 04 — Hardware & Mantenimiento

Paleta **roja**. Requiere haber completado la Sala 03.

**Quiz:** 8 preguntas sobre hardware y mantenimiento de equipos.

**Temario:** Caché L1, NVMe vs SATA, POST, RAID 1, conectores ATX, MemTest86, hilos del procesador, sectores defectuosos.

**Recompensa:** 🗝️ *Chest Key*

---

### 🟣 Sala Final — VOID CORE BOSS

La sala final es un combate en arena abierta, completamente diferente a las anteriores. Solo se accede con los **4 objetos** del inventario.

**Mapa:** Terreno abierto generado por procedimientos con dunas de wireframe rojo, de 2000 × 2000 unidades.

**Objetivo:** Recolectar **3 orbes** esparcidos por el mapa. Cada orbe recogido viaja hacia el boss y le quita un tercio de vida.

**Boss — VOID CORE:** Flota sobre la arena y sigue al jugador con proyectiles. Tiene **3 fases**:
- **Fase 1** (100%–67% HP): dispara en línea recta cada 800ms.
- **Fase 2** (67%–34% HP): más proyectiles en abanico, cadencia de 500ms.
- **Fase 3** (<34% HP): fuego circular de 12 proyectiles + rayos con advertencia visual previa.

**HUD:** Barra de vida del boss, barra de vida del jugador, contador de orbes y radar que muestra la posición de los orbes pendientes.

**Al vencer:** Explosión, rayo de luz ascendente y transición a la pantalla de victoria. Se obtiene el 🏆 *Trophy*.

---

## 🎒 Inventario

Los objetos recogidos en cada sala se guardan en la **hotbar** y persisten entre escenas. La sala final comprueba que estén los 4 antes de dejar entrar.

| Objeto | Sala |
|---|---|
| 🗝️ Final Key | Sala 01 |
| 💳 Keycard | Sala 02 |
| 🔑 R Key | Sala 03 |
| 🗝️ Chest Key | Sala 04 |
| 🏆 Trophy | Sala Final |

---

## 📸 Capturas

*(Añade aquí tus capturas de cada zona)*

| Lobby | Sala 01 | Sala 02 |
|---|---|---|
| *(captura)* | *(captura)* | *(captura)* |

| Sala 03 | Sala 04 | Boss Final |
|---|---|---|
| *(captura)* | *(captura)* | *(captura)* |

---

<div align="center">
  <sub>Hecho con 💻 y mucho <code>#00ffff</code> — TehmKench</sub>
</div>
