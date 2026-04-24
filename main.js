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


/**
 
 * @param {number} r - Radio de la órbita
 * @param {number} n - Cantidad de polígonos
 * @returns {Array} Array de objetos {x, y} con los centros
 */
function getOrbitalPositions(r, n) {
  const positions = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n; // Ángulo equidistante
    const x = CX + r * Math.cos(angle);
    const y = CY + r * Math.sin(angle);
    positions.push({ x, y });
  }
  return positions;
}

/**
 * Calcula los vértices de un polígono regular.
 * @param {number} cx - Centro X del polígono
 * @param {number} cy - Centro Y del polígono
 * @param {number} radius - Radio (tamaño) del polígono
 * @param {number} sides - Número de lados
 * @returns {Array} Array de objetos {x, y} con los vértices
 */
function getPolygonVertices(cx, cy, radius, sides) {
  const vertices = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    vertices.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return vertices;
}

/**
 * Dibuja un polígono regular usando Bresenham para cada lado.
 * @param {number} cx - Centro X
 * @param {number} cy - Centro Y
 * @param {number} radius - Tamaño del polígono
 * @param {number} sides - Número de lados
 * @param {string} color - Color
 */
function drawPolygon(cx, cy, radius, sides, color) {
  const vertices = getPolygonVertices(cx, cy, radius, sides);
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    bresenhamLine(current.x, current.y, next.x, next.y, color);
  }
}

/**
 * Genera un número entero aleatorio entre min y max (inclusive).
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===================== PARÁMETROS PRINCIPALES =====================
const R = randInt(150, 280);   // Radio de la órbita
const N = randInt(4, 10);      // Número de polígonos
const K = randInt(3, 8);       // Lados de cada polígono
const polyRadius = randInt(20, 45); // Tamaño de cada polígono

// Paleta de colores para los polígonos
const colors = ["#e94560", "#0f3460", "#e2b714", "#16213e", "#a8ff78", "#78ffd6", "#f7971e", "#ffd200", "#f953c6", "#b91d73"];

// ===================== DIBUJO PRINCIPAL =====================
// 1. Dibujar la órbita (tenue)
midpointCircle(CX, CY, R, "#2a2a2a");

// 2. Obtener posiciones de los polígonos sobre la órbita
const centers = getOrbitalPositions(R, N);

// 3. Dibujar cada polígono en su posición orbital
centers.forEach((center, i) => {
  const color = colors[i % colors.length];
  drawPolygon(center.x, center.y, polyRadius, K, color);
});