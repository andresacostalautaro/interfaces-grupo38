import { Board } from './board.js';
import { Player } from './player.js';
import { StartMenu } from './startMenu.js';
import { PlayerPanel } from './playerPanel.js';

export class Game{
    constructor(){
        this.board = null; //hasta que el usuario no ingrese el tamaño del tablero no puedo instanciarlo
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');


        this.gameOver = false;

        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/game-background.svg'

        this.players = [
            new Player(1, 'Scorpion', 'right'),
            new Player(2, 'Subzero', 'left')
        ];
        this.currentPlayerIndex = 0;
        this.playersPanel = null;

        // observador de eventos, cuando se dispara el evento gameStart desde el startMenu, se ejecuta la función startGame
        window.addEventListener('gameStart', (e) => {
            this.startGame(e.detail.boardSize, e.detail.turnTime, e.detail.winCondition);
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

        window.addEventListener('turnTimeUp', () => {
            this.handleTimeUp();
        });

    }

    createBoardUI(){
        // Establezco la imagen de fondo del tabler
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.startMenu.showStartMenu();
    }

    startGame(boardSize, turnTime, winCondition) {
        
        this.playersPanel = new PlayerPanel(this.canvas, this.ctx, this.players, turnTime, this.drawGame.bind(this));

        const panelHeight = this.playersPanel.getHeight(); // altura del panel de jugadores pero puede ser mas
        const boardTop = panelHeight + 20; // son 20px de margen

        this.board = new Board(
            this.canvas,
            this.ctx,
            boardSize.rows,
            boardSize.columns, 
            () => this.getCurrentPlayer(),
            boardTop, // a partir de aca se va a poder empezar a "construir" el tablero
            winCondition,
            this.drawGame.bind(this), // Pasa la función drawGame
        );

        this.drawGame();
    }

    drawGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        
        this.playersPanel.draw();

        console.log(this.playersPanel);
        this.board.drawBoard();
    }

    // funcion para actualizar turno
    updateTurn() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        this.playersPanel.updateActivePlayer(this.currentPlayerIndex);
        this.drawGame();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    // Metodo para manejar el evento de pieza soltada
    handlePieceDropped(event) {
        const { row, col } = event.detail;

        // pauso el timer porque no tiene sentido que siga corriendo mientras cae la ficha
        this.playersPanel.pauseTimer(); 
        // Chequear si hay un ganador
        const hasAWinner = this.board.checkForWinner(row, col);
        this.hasAWinner(hasAWinner); //
    }

    hasAWinner(hasAWinner){

        if (hasAWinner) {
            console.log(`¡El jugador ${this.getCurrentPlayer().name} ha ganado!`);
            this.gameOver = true;

            this.playersPanel.pauseTimer();

            // Aca se llama para poner la imagen del ganador 
            const winnerImg = this.getCurrentPlayer().avatarImg; 
            this.drawWinnerImage(winnerImg, this.getCurrentPlayer().name); // Dibuja el cuadrado del ganador
            
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
        if (this.playersPanel) {
            this.playersPanel.cleanup();
        }

        if (this.board) {
            this.clearCanvas();
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



    // Metodo para dibujar la imagen del ganador
    drawWinnerImage(winnerImage, name) {
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
        
    }

    clearCanvas() {   
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpio el canvas
        //this.ctx.clearRect(this.offsetX, this.boardTop , this.boardWidth, this.boardHeight); // Limpio solo el tablero
        
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    handleTimeUp() {
        console.log('expiro el turno del jugador', this.getCurrentPlayer().getName());
        this.currentPlayerIndex = 1 - this.currentPlayerIndex; //no llama a updateTurn porque no quiero que se actualice el panel ni que se dibuje el tablero
        this.hasAWinner(true);
    }

}