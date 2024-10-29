import { Cell } from './cell.js';
export class Board {

    constructor(canvas, ctx, rows, columns, backgroundImage, getCurrentPlayerCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.rows = rows;
        this.columns = columns;
        this.backgroundImage = backgroundImage;
        this.cellSize = Math.min(canvas.width / this.columns, canvas.height / this.rows);
        this.grid = this.initializeGrid();
        this.margin = 10;
        this.getCurrentPlayer = getCurrentPlayerCallback;
        
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.hoveredColumn = null;
        this.selectedCell = null;
    }

    
    initializeGrid() {
        return Array.from({ length: this.rows }, (_, row) => 
            Array.from({ length: this.columns }, (_, col) => 
                // Crea una nueva instancia de Celda para cada posición de la matriz
                new Cell(row, col, this.cellSize)
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
    }
    
    /*
        Calculo la columna más cercana a la coordenada x del mouse
    */
    getColumnFromX(x) {
        return Math.floor(x / this.cellSize);
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
            if (!currentCell.isOccupied()) {
                return row;
            }
        }
        return -1;
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        
        const hoveredColumn = this.getColumnFromX(mouseX);
        
        if (this.hoveredColumn !== hoveredColumn) {
            this.hoveredColumn = hoveredColumn;
            this.drawBoard();
        }
    }

  
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
}