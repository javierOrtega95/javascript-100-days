const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let startX, startY;
let snapshot;
let currentTool = 'draw';
let currentColor = '#000000';
let currentSize = 4;

// Classic Win95 Paint palette (2 rows × 14)
const COLORS = [
  '#000000',
  '#808080',
  '#800000',
  '#808000',
  '#008000',
  '#008080',
  '#000080',
  '#800080',
  '#808040',
  '#004040',
  '#0080ff',
  '#004080',
  '#8000ff',
  '#804000',
  '#ffffff',
  '#c0c0c0',
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ffff80',
  '#00ff80',
  '#80ffff',
  '#8080ff',
  '#ff0080',
  '#ff8040',
];

const CURSORS = {
  draw: "url('./cursors/pincel.png') 0 20, crosshair",
  erase: "url('./cursors/erase.png') 0 20, crosshair",
  picker: "url('./cursors/picker.png') 0 0, crosshair",
  fill: 'crosshair',
  rectangle: 'crosshair',
  ellipse: 'crosshair',
};

// ── Init canvas ──────────────────────────────────────────────────

function initCanvas() {
  const main = document.querySelector('.paint-main');
  canvas.width = main.clientWidth - 16; // 8px padding each side
  canvas.height = main.clientHeight - 16;
}

window.addEventListener('load', initCanvas);

// ── Tool selection ───────────────────────────────────────────────

function activateTool(name) {
  currentTool = name;

  document.querySelector('.tool-btn.active')?.classList.remove('active');
  document.querySelector(`[data-tool="${name}"]`)?.classList.add('active');

  canvas.style.cursor = CURSORS[name] ?? 'crosshair';
}

document.querySelectorAll('[data-tool]').forEach((btn) => {
  btn.addEventListener('click', () => activateTool(btn.dataset.tool));
});

// ── Actions ──────────────────────────────────────────────────────

document.getElementById('clear-btn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('save-btn').addEventListener('click', () => {
  const anchor = document.createElement('a');

  anchor.download = 'paint.png';
  anchor.href = canvas.toDataURL('image/png');

  anchor.click();
});

// ── Color ────────────────────────────────────────────────────────

const colorPicker = document.getElementById('color-picker');
const colorFg = document.getElementById('color-fg');

function setColor(hex) {
  currentColor = hex;

  colorFg.style.background = hex;

  colorPicker.value = hex;
}

colorPicker.addEventListener('input', (e) => {
  setColor(e.target.value);

  document.querySelector('.swatch.active')?.classList.remove('active');
});

// ── Swatches ─────────────────────────────────────────────────────

const swatchContainer = document.querySelector('.paint-footer__swatches');

COLORS.forEach((color, i) => {
  const btn = document.createElement('button');

  btn.className = 'swatch';
  btn.style.background = color;
  btn.title = color;
  btn.setAttribute('aria-label', color);

  btn.addEventListener('click', () => {
    document.querySelector('.swatch.active')?.classList.remove('active');

    btn.classList.add('active');

    setColor(color);
  });

  swatchContainer.appendChild(btn);

  if (i === 0) btn.classList.add('active');
});

setColor('#000000');

// ── Size ─────────────────────────────────────────────────────────

const sizeRange = document.getElementById('size-range');
const sizeLabel = document.getElementById('size-label');

sizeRange.addEventListener('input', () => {
  currentSize = Number(sizeRange.value);
  sizeLabel.textContent = currentSize;
});

// ── Flood fill ───────────────────────────────────────────────────

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function floodFill(startX, startY) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // Each pixel occupies 4 consecutive bytes (R, G, B, A) in the flat array
  const startByteIndex = (startY * width + startX) * 4;

  const targetR = data[startByteIndex];
  const targetG = data[startByteIndex + 1];
  const targetB = data[startByteIndex + 2];
  const targetA = data[startByteIndex + 3];

  const [fillR, fillG, fillB] = hexToRgb(currentColor);

  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === 255
  )
    return;

  // Stack holds flat pixel positions (row * width + col), not byte indices
  const stack = [startY * width + startX];
  const visited = new Uint8Array(width * height);

  while (stack.length) {
    const pixelPos = stack.pop();

    if (visited[pixelPos]) continue;

    visited[pixelPos] = 1;

    const byteIndex = pixelPos * 4;

    if (
      data[byteIndex] !== targetR ||
      data[byteIndex + 1] !== targetG ||
      data[byteIndex + 2] !== targetB ||
      data[byteIndex + 3] !== targetA
    ) {
      continue;
    }

    data[byteIndex] = fillR;
    data[byteIndex + 1] = fillG;
    data[byteIndex + 2] = fillB;
    data[byteIndex + 3] = 255;

    const x = pixelPos % width;
    const y = Math.floor(pixelPos / width);

    if (x > 0) stack.push(pixelPos - 1);
    if (x < width - 1) stack.push(pixelPos + 1);
    if (y > 0) stack.push(pixelPos - width);
    if (y < height - 1) stack.push(pixelPos + width);
  }

  ctx.putImageData(imageData, 0, 0);
}

// ── Eyedropper ───────────────────────────────────────────────────

function pickColor(x, y) {
  const {
    data: [R, G, B],
  } = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1);

  // Convert [R, G, B] bytes to "#rrggbb"
  const hex =
    '#' + [R, G, B].map((v) => v.toString(16).padStart(2, '0')).join('');

  setColor(hex);

  document.querySelector('.swatch.active')?.classList.remove('active');

  activateTool('draw');
}

// ── Drawing ──────────────────────────────────────────────────────

function getPos(e) {
  const rect = canvas.getBoundingClientRect();

  // Scale from CSS pixels to canvas pixels (handles zoom and HiDPI displays)
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function applyStyle() {
  ctx.strokeStyle = currentTool === 'erase' ? '#ffffff' : currentColor;
  ctx.lineWidth = currentTool === 'erase' ? currentSize * 3 : currentSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

const freehand = (x, y) => {
  ctx.lineTo(x, y);
  ctx.stroke();
};

const DRAW_HANDLERS = {
  draw: freehand,
  erase: freehand,
  rectangle: (x, y) => {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  },
  ellipse: (x, y) => {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.ellipse(
      startX + (x - startX) / 2,
      startY + (y - startY) / 2,
      Math.abs(x - startX) / 2,
      Math.abs(y - startY) / 2,
      0,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  },
};

canvas.addEventListener('mousedown', (e) => {
  const { x, y } = getPos(e);

  if (currentTool === 'fill') {
    floodFill(Math.floor(x), Math.floor(y));

    return;
  }

  if (currentTool === 'picker') {
    pickColor(x, y);

    return;
  }

  isDrawing = true;
  startX = x;
  startY = y;

  applyStyle();
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (currentTool === 'draw' || currentTool === 'erase') {
    // Paint a dot at the click point so single clicks leave a mark
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const { x, y } = getPos(e);

  applyStyle();

  DRAW_HANDLERS[currentTool]?.(x, y);
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
  isDrawing = false;
});
