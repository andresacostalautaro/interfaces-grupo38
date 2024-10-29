import { Circulo } from './Circulo.js';

// Crear las posiciones del tablero
function createBoard(canvas, ctx, figures) {
    
    console.log("canvas", canvas); 
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    
    let rows = 6; // Número de filas
    let cols = 7; // Número de columnas
    let cellSize = 60; // Tamaño de cada celda del tablero
    let margin = 10; // Margen entre celdas

    let startX = (canvasWidth - (cols * (cellSize + margin))) / 2;
    let startY = (canvasHeight - (rows * (cellSize + margin))) / 2;

    for (let row = 0; row < rows; row++) {
        let rowCircles = [];
        for (let col = 0; col < cols; col++) {
            let posX = startX + col * (cellSize + margin) + cellSize / 2;
            let posY = startY + row * (cellSize + margin) + cellSize / 2;
            let circle = new Circulo(posX, posY, cellSize / 2, '#fff', ctx); // Color blanco para celdas vacías
            rowCircles.push(circle);
            circle.draw(); // Dibuja cada círculo
        }
        figures.push(rowCircles); // Añadir fila al tablero
    }
}

// Limpiar el canvas
function clearCanvas(canvas, ctx) {   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Dibuja el tablero completo
function drawBoard(canvas, ctx, figures) {
    clearCanvas(canvas, ctx);
    figures.forEach(row => {
        row.forEach(circle => {
            circle.draw();
        });
    });
}

// Detectar clic en un círculo
function findClickedCircle(x, y, figures) {
    for (let row = 0; row < figures.length; row++) {
        for (let col = 0; col < figures[row].length; col++) {
            let circle = figures[row][col];
            if (circle.isPointInside(x, y)) {
                return circle;
            }
        }
    }
    return null;
}

// Cargar el script del círculo
export function loadCircleScript() {
    const script = document.createElement('script');
    script.src = 'js/Circulo.js';
    script.type = "module";
    script.onload = () => {
        console.log('Script de Circulo.js cargado');
        initializeGame(); // Inicia el 4 en línea después de cargar el script
    }
    document.body.appendChild(script);
}

// Iniciar el juego
function initializeGame() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let figures = []; 
    createBoard(canvas, ctx, figures); // Crear el tablero

    // Cargar las imágenes antes de agregar el evento
    const playerImages = [new Image(), new Image()];
    playerImages[0].src = './assets/userIcons/userIcon1.png'; 
    playerImages[1].src = './assets/userIcons/userIcon2.png'; 

    let currentPlayer = 0; // 0 para el jugador 1, 1 para el jugador 2
    // Esperar hasta que las imágenes estén cargadas
    let imagesLoaded = 0;

    playerImages.forEach((image, index) => {
        image.onload = () => {
            imagesLoaded++;
            // Si ambas imágenes están cargadas, se puede iniciar el juego
            if (imagesLoaded === playerImages.length) {
                // Añadir el evento de clic al canvas
                canvas.addEventListener('click', function (e) {
                    let rect = canvas.getBoundingClientRect();
                    let mouseX = e.clientX - rect.left;
                    let mouseY = e.clientY - rect.top;
                    
                    let clickedCircle = findClickedCircle(mouseX, mouseY, figures);
                    if (clickedCircle) {
                        console.log("Círculo clicado en posición:", clickedCircle.getPosition());
                        // Cambiar imagen del círculo clicado
                        clickedCircle.setImage(playerImages[currentPlayer]); // Establecer la imagen del jugador actual
                        drawBoard(canvas, ctx, figures); // Redibujar el tablero con los cambios
                        // Cambiar al siguiente jugador
                        currentPlayer = (currentPlayer + 1) % playerImages.length; // Alternar entre 0 y 1
                    }
                });
                // Dibujar el tablero por primera vez
                drawBoard(canvas, ctx, figures);
            }
        };
        image.onerror = () => {
            console.error(`Error al cargar la imagen para el jugador ${index + 1}`);
        };
        image.src = image.src; // Iniciar la carga de la imagen
    });
}

