/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Isaac Aragón Jurado
 * Descripción: Sistema de Dispersión Geométrica Orbital (Rasterización Manual)
 */

const canvas = document.getElementById("orbitCanvas");
const ctx = canvas.getContext("2d");

const CX = canvas.width / 2;   // Centro X del canvas
const CY = canvas.height / 2;  // Centro Y del canvas

/**
 * Pinta un único píxel en la posición (x, y) con el color dado.
 * @param {number} x - Coordenada horizontal
 * @param {number} y - Coordenada vertical
 * @param {string} color - Color en formato CSS
 */
function plotPixel(x, y, color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

// --- Prueba, la voy a borrar en el proximo commit ---
plotPixel(CX, CY, "#ff0000"); // Pinta el centro en rojo para verificar