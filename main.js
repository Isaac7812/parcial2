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

/**
 * @param {number} x0 - X inicial
 * @param {number} y0 - Y inicial
 * @param {number} x1 - X final
 * @param {number} y1 - Y final
 * @param {string} color - Color del trazo
 */
function bresenhamLine(x0, y0, x1, y1, color = "#ffffff") {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let sx = x0 < x1 ? 1 : -1; // Dirección en X
  let sy = y0 < y1 ? 1 : -1; // Dirección en Y

  let p = 2 * dy - dx; // Parámetro de decisión inicial

  // Si la pendiente es mayor a 1, se intercambian los roles de x e y
  const steep = dy > dx;
  if (steep) {
    [dx, dy] = [dy, dx];
    p = 2 * dy - dx;
  }

  let x = x0;
  let y = y0;

  for (let i = 0; i <= dx; i++) {
    plotPixel(x, y, color);

    if (p >= 0) {
      if (steep) x += sx;
      else       y += sy;
      p -= 2 * dx;
    }

    if (steep) y += sy;
    else       x += sx;

    p += 2 * dy;
  }
}

// --- Prueba temporal 
bresenhamLine(100, 100, 700, 700, "#00ff00");
bresenhamLine(700, 100, 100, 700, "#00ff00");