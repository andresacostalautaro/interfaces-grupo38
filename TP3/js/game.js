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

        this.canvas.addEventListener('click', (e) => this.onClick(e));
        
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
            () => this.getCurrentPlayer());
        this.board.drawBoard();
    }

    // funcion para actualizar turno
    updateTurn(){
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    
    }


    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }


    onClick(event) {
        if (!this.gameOver) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            
            const clickedColumn = this.board.getColumnFromX(mouseX);
            const lowestEmptyRow = this.board.getLowestEmptyRow(clickedColumn);
            
            if (lowestEmptyRow !== -1) {
                
                const hasAWinner = this.board.placePiece(lowestEmptyRow, clickedColumn);
                if (hasAWinner) {
                    console.log(`¡El jugador ${this.getCurrentPlayer().name} ha ganado!`);
                    this.gameOver = true;
                } else {
                    this.updateTurn();
                    this.board.drawBoard();
                    console.log('ahora le toca a', this.getCurrentPlayer());
                }
            }
        }
    }
}