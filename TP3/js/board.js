import { Cell } from './cell.js';
export class Board {
    constructor(canvas, ctx, rows, columns, backgroundImage, getCurrentPlayerCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.rows = rows;
        this.columns = columns;
        this.backgroundImage = backgroundImage;

        this.cellSize = Math.min(
            (canvas.width - 20) / this.columns, 
            (canvas.height - 20) / this.rows
        );
        // Calcular el offset (desplazamiento) para centrar el tablero
        this.boardWidth = this.cellSize * this.columns;
        this.boardHeight = this.cellSize * this.rows;
        this.offsetX = (canvas.width - this.boardWidth) / 2;
        this.offsetY = (canvas.height - this.boardHeight) / 2;

        this.grid = this.initializeGrid();
        this.margin = 10;
        this.getCurrentPlayer = getCurrentPlayerCallback;

        // Fichas de cada jugador
        this.player1Pieces = this.createPieces('player1');
        this.player2Pieces = this.createPieces('player2');

        // Botón de reiniciar el juego
        this.restartButton = {
            text: 'Reiniciar',
            x: this.canvas.width - 90,  
            y: this.canvas.height - 40,
            width: 90,
            height: 40
        };

        // Guardo las referencias a los eventos
        this.handleClick = this.handleClick.bind(this);
        // nose porque era una funcion flecha pero lo cambie
        // this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('click', this.handleClick);

        this.onMouseMove = this.onMouseMove.bind(this);
        this.canvas.addEventListener('mousemove', this.onMouseMove);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);

        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);

        // el dragging es para el metodo relacionado con arrastrar las fichas
        this.dragging = false;
        this.selectedPiece = null;

        this.hoveredColumn = null;
        this.selectedCell = null;
    }

    
    initializeGrid() {
        return Array.from({ length: this.rows }, (_, row) => 
            Array.from({ length: this.columns }, (_, col) => 
                // Crea una nueva instancia de Celda para cada posición de la matriz
                new Cell(row, col, this.cellSize, this.offsetX, this.offsetY)
            )
        );
    }
    

    clearCanvas() {   
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpio el canvas
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Dibuja el tablero completo
    drawBoard() {
        this.clearCanvas();

        // Dibuja las fichas de ambos jugadores en los laterales
        this.drawPlayerPieces(this.player1Pieces, 50, 20); // Lado izquierdo
        this.drawPlayerPieces(this.player2Pieces, this.canvas.width - 70, 20); // Lado derecho

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const currentCell = this.grid[row][col];
                currentCell.draw(this.ctx);
            }
        }
        
        // Dibujo la ficha "fantasma" en la columna hover
        if (this.hoveredColumn !== null) {
            const lowestEmptyRow = this.getLowestEmptyRow(this.hoveredColumn);
            if (lowestEmptyRow !== -1) {
                this.drawGhostPiece(lowestEmptyRow, this.hoveredColumn);
            }
        }
        this.drawRestartButton(); // Dibujar boton de reinicio
    }
    
    /*
        Calculo la columna más cercana a la coordenada x del mouse
            añadi el offsetX al calculo para hacerlo acorde a los cambios
    */
    getColumnFromX(x) {
        return Math.floor((x - this.offsetX) / this.cellSize);
    }
    
    drawGhostPiece(row, col) {
        const cell = this.grid[row][col];
        const x = cell.getPosX();
        const y = cell.getPosY();
        const radius = this.cellSize / 2 - 5;

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        console.log('current player', this.getCurrentPlayer());
        this.ctx.drawImage(
            this.getCurrentPlayer().getTokenImage(),
            x - radius,
            y - radius,
            radius * 2,
            radius * 2
        );
        this.ctx.restore(); 
    }



    /*
        Este metodo busca la fila más baja vacía en una columna
        Si la columna está llena, devuelve -1

        DATO: Busco la fila mas baja porque es el movimiento 
        valido mas cercano a donde se encuentra el mouse
    */
    getLowestEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            const currentCell = this.grid[row][col];
            // Agregue para verificar si la celda existe para que no tire error en la consola
            // y no parpadee el tablero al mover el mouse fuera del mismo
            if (currentCell !== undefined && !currentCell.isOccupied()) {
                return row;
            }
        }
        return -1;
    }

    onMouseMove(event) {
        if (!this.dragging || !this.selectedPiece) return;
        const mousePos = this.getMousePosition(event);
        this.selectedPiece.x = mousePos.x - this.selectedPieceOffset.x;
        this.selectedPiece.y = mousePos.y - this.selectedPieceOffset.y;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        
        const hoveredColumn = this.getColumnFromX(mouseX);
        
        if (this.hoveredColumn !== hoveredColumn) {
            this.hoveredColumn = hoveredColumn;
            this.drawBoard();
        }
    }

    /*
    // El problema actual es que el metodo onClick (clase Game) llama a placePiece para colocar una ficha
    // y saber si alguien ya ganó o no.
    // con los cambios para implementar el drag & drop la colocacion de fichas ahora la manejan los eventos de Board.
    // pero el metodo onClick todavia necesita saber si hay un ganador o no para que el juego funcione.
    // No lo pude solucionar, actualmente ambos juegos colocan fichas por eso se colocan dobles.
    */
    placePiece(row, col) {
        const cell = this.grid[row][col];

        if (!cell.isOccupied()) {
            cell.fillWithPlayerImage(this.ctx, this.getCurrentPlayer());
            this.selectedCell = cell;
            return this.checkForWinner(row, col);
        }
        return false;
    }


    //el chequeo del ganaador nomas sirve para 4 en linea, 
    //tendria que hacerlo mas generico para que se adapte a cualquier cantidad de fichas en linea
    checkForWinner(row, col) {
        const directions = [
            [1, 0],  
            [0, 1],  
            [1, 1],  
            [1, -1]  
        ];

        const player = this.getCurrentPlayer();

        for (const [dx, dy] of directions) {
            if (this.checkDirection(row, col, dx, dy, player) >= 4) {
                return true;
            }
        }

        return false;
    }

    checkDirection(row, col, dx, dy, player) {
        let count = 0;
        let r = row - 3 * dx;
        let c = col - 3 * dy;

        for (let i = 0; i < 7; i++) {
            if (this.isWithinBounds(r, c)) {
                if (this.grid[r][c].isOccupiedBy(player)) {
                    count++;
                    if (count >= 4) return count;
                } else {
                    count = 0;
                }
            }
            r += dx;
            c += dy;
        }

        return count;
    }

    isWithinBounds(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
    }


    // Maneja el evento que corresponde al boton de reiniciar el juego
    handleClick(event) {
        console.log("Al parecer se hizo igual");
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (this.isRestartButtonClicked(x, y)) {
            this.resetGame();
        }
    }

    // Verifica que se haya clickeado el boton de reiniciar el juego
    isRestartButtonClicked(x, y) {
        const { x: btnX, y: btnY, width, height } = this.restartButton;
        return x >= btnX && x <= btnX + width && y >= btnY && y <= btnY + height;
    }

    // Lanza un evento para resetear el juego
    resetGame() {
        const event = new CustomEvent('resetGame');
        window.dispatchEvent(event);

        // borro los eventos
        this.removeEvents();
    }

    // Dibuja el boton de reiniciar el juego en el tablero
    // por ahora esta ahi hasta centrar las celdas y ver donde queda mejor
    drawRestartButton() {
        const ctx = this.ctx;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            this.restartButton.x,
            this.restartButton.y,
            this.restartButton.width,
            this.restartButton.height
        );

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.restartButton.text,
            this.restartButton.x + this.restartButton.width / 2,
            this.restartButton.y + this.restartButton.height / 2
        );
    }

    // Metodo que limpia el tablero
    clear() {
        // Reinicia la cuadricula
        this.grid = this.initializeGrid();
        this.hoveredColumn = null;
        this.selectedCell = null;
        
        // Dibuja el fondo y el tablero vacío
        this.clearCanvas();
        this.drawBoard();
    }

    // Metodo para dibujar la imagen del ganador
    drawWinnerImage(winnerImage, name) {
        winnerImage.onload = () => {
            this.clearCanvas(); // limpio
            this.ctx.drawImage(winnerImage, 320, 120, 100, 100); // dibujo la foto
            
            // estilo de fuente
            this.ctx.font = '50px Arial';

            // pos del texto
            const text = `¡${name} es el ganador!`;
            const x = 370;
            const y = 250;
    
            // borde amarillo
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillText(text, x + 2, y + 2);
    
            // borde negro
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(text, x - 2, y - 2);
    
            // texto principal en rojo
            this.ctx.fillStyle = 'red';
            this.ctx.fillText(text, x, y);
        };
    
        if (winnerImage.complete) {
            winnerImage.onload(); // Llama a la función para dibujar
        }
    }

    // metodo que crea las piezas para los jugadores
    createPieces(player) {
        // Crea una cantidad de fichas para cada jugador
        const pieces = [];
        for (let i = 0; i < 21; i++) {
            pieces.push({ x: 0, y: 0, radius: 20, player, draggable: true });
        }
        return pieces;
    }

    // metodo que dibuja las piezas en el canvas
    drawPlayerPieces(pieces, startX, startY) {
        pieces.forEach((piece, index) => {
            const y = startY + index * (piece.radius * 2 + 5); // Espaciado entre fichas
            piece.x = startX;
            piece.y = y;
            
            this.ctx.beginPath();
            this.ctx.arc(piece.x, piece.y, piece.radius, 0, Math.PI * 2);
            this.ctx.closePath();

            // Color según el jugador
            this.ctx.fillStyle = piece.player === 'player1' ? '#FF5733' : '#33A1FF';
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    // metodo que maneja el evento de cuando holdeas el click
    handleMouseDown(event) {
        const mousePos = this.getMousePosition(event);
        this.selectedPiece = this.getSelectedPiece(mousePos);
        
        if (this.selectedPiece) {
            this.dragging = true;
            this.selectedPieceOffset = {
                x: mousePos.x - this.selectedPiece.x,
                y: mousePos.y - this.selectedPiece.y,
            };
        }
    }

    // metodo que maneja el evento de cuando levantas el dedo del click
    handleMouseUp(event) {
        if (this.dragging && this.selectedPiece) {
            const mousePos = this.getMousePosition(event);
            const col = this.getColumnFromX(mousePos.x);

            if (col >= 0 && col < this.columns) {
                const row = this.getLowestEmptyRow(col);
                if (row !== -1) {
                    console.log("Llamado desde handleMouseUp");
                    this.placePiece(row, col);
                }
            }
        }

        this.dragging = false;
        this.selectedPiece = null;
        this.drawBoard();
    }

    // metodo que devuelve la pieza que estamos queriendo arrastrar
    getSelectedPiece(mousePos) {
        const allPieces = [...this.player1Pieces, ...this.player2Pieces];
        return allPieces.find(piece => 
            Math.hypot(piece.x - mousePos.x, piece.y - mousePos.y) < piece.radius
        );
    }

    // metodo que devuelve la posicion actual del mouse
    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    // metodo que borra el evento de mover el mouse sobre el tablero
    removeEvents() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }

}
    
    //ahora hay que trabajar el hover de las celdas
    //mientras el mouse este entre las coordenadas xy de la primer y ultima celda de la matriz, se debe pintar la primera celda valida de la columna
    //tomamos la coordenada x del mouse y vemos a que centro de columna se acerca mas
    //dibujamos la ficha en esa columna
    //si el mouse sale de la matriz, no se muestra ninguna ficha
    //cuando se hace click, se debe agregar la ficha a la matriz
    //se debe validar si hay un ganador
    //se debe validar si hay empate
    //se debe cambiar el turno
    //se debe mostrar el jugador que tiene el turno
    //se debe mostrar un timer con el tiempo restante
    //se debe mostrar un ganador


    

    

//mostrar tablero vacio. Solo imagen

//podria mostrar una animacion haciendo que aparezca un avatar por cada lado del tablero y que se muevan hacia el centro del tablero

// mostrar iconos de los jugadores con timer en tiempo max arriba con la barra de progreso llena

//abajo del contenedor de los avatares mostrar un menu 
    //iniciar juego
    //opciones de tamaño de tablero 
        //5 en linea
        //6 en linea
        //7 en linea
    //tiempo por turno (que sea un select con opciones que aumentan de 10 en 10)

    //reiniciar juego (este boton solo se activa cuando el juego ya comenzo)
    //Si sobra tiempo podriamos hacer un player vs player y player vs cpu

// mostrar iconos de los jugadores con timer en tiempo max 

//una vez iniciado el juego
//mostrar el tablero con los circulos vacios
//jugador que empieza = seleccionado
//jugador seleccionado toca una ficha 
