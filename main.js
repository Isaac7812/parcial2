/**
 * Universidad Militar Nueva Granada - Facultad de Ingeniería
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

/**
 * @param {number} centerX - Centro X de la circunferencia
 * @param {number} centerY - Centro Y de la circunferencia
 * @param {number} r - Radio de la circunferencia
 * @param {string} color - Color del trazo
 */
function midpointCircle(centerX, centerY, r, color = "#444444") {
  let x = 0;
  let y = r;
  let p = 1 - r; // Parámetro de decisión inicial

  // Función auxiliar para pintar los 8 puntos simétricos
  function plotCirclePoints(cx, cy, x, y) {
    plotPixel(cx + x, cy + y, color);
    plotPixel(cx - x, cy + y, color);
    plotPixel(cx + x, cy - y, color);
    plotPixel(cx - x, cy - y, color);
    plotPixel(cx + y, cy + x, color);
    plotPixel(cx - y, cy + x, color);
    plotPixel(cx + y, cy - x, color);
    plotPixel(cx - y, cy - x, color);
  }

  plotCirclePoints(centerX, centerY, x, y);

  while (x < y) {
    x++;
    if (p < 0) {
      // El píxel correcto está al este: solo avanza x
      p = p + 2 * x + 1;
    } else {
      // El píxel correcto está al sureste: avanza x, retrocede y
      y--;
      p = p + 2 * x - 2 * y + 1;
    }
    plotCirclePoints(centerX, centerY, x, y);
  }
}

// - Prueba, se borrara despues
midpointCircle(CX, CY, 250, "#444444");