import { Board } from './board.js';
import { Player } from './player.js';
import { StartMenu } from './startMenu.js';

export class Game{
    constructor(){
        this.board = null; //hasta que el usuario no ingrese el tamaño del tablero no puedo instanciarlo
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');


        this.gameOver = false;

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/game-background.svg'

        this.players = [
            new Player(1, 'Scorpion'),
            new Player(2, 'Subzero')
        ];
        this.currentPlayerIndex = 0;


        // observador de eventos, cuando se dispara el evento gameStart desde el startMenu, se ejecuta la función startGame
        window.addEventListener('gameStart', (e) => {
            this.startGame(e.detail.boardSize, e.detail.turnTime);
        });

        // Evento para volver al menú
        window.addEventListener('resetGame', () => {
            this.resetGame()
        });

        // Agregar listener para el evento pieceDropped
        window.addEventListener('pieceDropped', this.handlePieceDropped.bind(this));

        /*
        this.onClick = this.onClick.bind(this);
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        */
        
        this.startMenu = new StartMenu(this.canvas, this.ctx, this.backgroundImage);

        this.backgroundImage.onload = () => {
            this.createBoardUI();
        };

    }

    createBoardUI(){
        // Establezco la imagen de fondo del tabler
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.startMenu.showStartMenu();
    }

    startGame(boardSize, turnTime) {
        this.board = new Board(
            this.canvas,
            this.ctx,
            boardSize.rows,
            boardSize.columns,
            this.backgroundImage, 
            () => this.getCurrentPlayer()
        );
        this.board.drawBoard();
    }

    // funcion para actualizar turno
    updateTurn(){
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    /*
    // ESTE METODO YA NO HACE FALTA DADO QUE AHORA SE MANEJA LA LOGICA DE GANADOR CON UN EVENTO
    // DESPACHADO DESDE LA CLASE BOARD
    onClick(event) {
        if (!this.gameOver && this.board) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            
            const clickedColumn = this.board.getColumnFromX(mouseX);
            const lowestEmptyRow = this.board.getLowestEmptyRow(clickedColumn);
            
            if (lowestEmptyRow !== -1) {
                
                //const hasAWinner = this.board.placePiece(lowestEmptyRow, clickedColumn);
                //console.log("Llamado desde onClick");
                //this.hasAWinner(hasAWinner);
            
            }
        }
    }
    */

    // Metodo para manejar el evento de pieza soltada
    handlePieceDropped(event) {
        const { row, col } = event.detail;

        // Chequear si hay un ganador
        const hasAWinner = this.board.checkForWinner(row, col);
        this.hasAWinner(hasAWinner); //
    }

    hasAWinner(hasAWinner){

        if (hasAWinner) {
            console.log(`¡El jugador ${this.getCurrentPlayer().name} ha ganado!`);
            this.gameOver = true;

            // Aca se llama para poner la imagen del ganador 
            const winnerImg = this.getCurrentPlayer().avatarImg; 
            this.board.drawWinnerImage(winnerImg, this.getCurrentPlayer().name); // Dibuja el cuadrado del ganador
            
            // borro los eventos del board para que no interfieran con la pantalla de ganador
            this.board.removeEvents();
            // pausa antes de reiniciar el juego
            setTimeout(() => {
                this.resetGame();
            }, 5000); // 5000 milisegundos = 5 segundos

        } else {
            this.updateTurn();
            this.board.drawBoard();
            console.log('ahora le toca a', this.getCurrentPlayer());
        }
    }


    // Metodo para reiniciar el juego
    resetGame() {
        if (this.board) {
            this.board.clearCanvas();
            this.board = null; // Eliminar referencia al tablero actual
        }

        // reinicio variables
        this.currentPlayerIndex = 0;
        this.gameOver = false;

        // Redibujar el menú inicial
        this.startMenu = null;
        this.startMenu = new StartMenu(this.canvas, this.ctx, this.backgroundImage);
        this.createBoardUI();
    }
}