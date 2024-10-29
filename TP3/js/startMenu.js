import { Board } from './board.js';
export class StartMenu {
    constructor(canvas, ctx, backgroundImage) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.backgroundImage = backgroundImage;

        // Lista de botones del menú de inicio
        this.buttons = [
            { text: 'Iniciar Juego', x: this.canvas.width / 2 - 75, y: 60, width: 150, height: 40 },
            { text: 'Tamaño del Tablero', x: this.canvas.width / 2 - 100, y: 120, width: 200, height: 40, isSelect: true, options: ['4 en línea', '5 en línea', '6 en línea', '7 en línea'] },
            { text: 'Tiempo por Turno', x: this.canvas.width / 2 - 100, y: 180, width: 200, height: 40, isSelect: true, options: [10, 20, 30, 40, 50, 60] }
        ];

        this.boardSizeMap = {
            '4 en línea': { rows: 6, columns: 7 },
            '5 en línea': { rows: 7, columns: 8 },
            '6 en línea': { rows: 8, columns: 9 },
            '7 en línea': { rows: 9, columns: 10 }
        };

        // Valores por defecto
        this.selectedBoardSize = this.boardSizeMap['4 en línea'];  
        this.selectedTurnTime = 10; 
        this.showBoardSizeOptions = false;
        this.showTurnTimeOptions = false;


        // Crear un método manejador de clics y usarlo para poder eliminarlo después
        this.handleCanvasClick = this.handleCanvasClick.bind(this); 
        this.canvas.addEventListener('click', this.handleCanvasClick);
    }

    drawButton(button) {
        const { text, x, y, width, height } = button;

        // Fondo y borde del botón
        this.ctx.fillStyle = '#007bff';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeStyle = '#0056b3';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, width, height);

        // Texto del botón
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        let displayText = text;
        if (text === 'Tamaño del Tablero') displayText += `: ${this.selectedBoardSize}`;
        if (text === 'Tiempo por Turno') displayText += `: ${this.selectedTurnTime}s`;

        this.ctx.fillText(displayText, x + width / 2, y + height / 2);
    }

    drawOptions(button) {
        const { x, y, width, height, options } = button;

        options.forEach((option, index) => {
            this.ctx.fillStyle = '#333';
            const optionY = y + height * (index + 1);
            this.ctx.fillRect(x, optionY, width, height);
            this.ctx.strokeRect(x, optionY, width, height);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(option, x + width / 2, optionY + height / 2);
        });
    }

    showStartMenu() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el canvas
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.buttons.forEach(button => this.drawButton(button));

        // Dibujar opciones encima si están desplegadas
        this.buttons.forEach(button => {
            if ((this.showBoardSizeOptions && button.text === 'Tamaño del Tablero') || 
                (this.showTurnTimeOptions && button.text === 'Tiempo por Turno')) {
                this.drawOptions(button);
            }
        });
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.buttons.forEach(button => {
            if (this.isInsideButton(mouseX, mouseY, button.x, button.y, button.width, button.height)) {
                if (button.text === 'Tamaño del Tablero') {
                    console.log('Tamaño del Tablero');
                    this.showBoardSizeOptions = !this.showBoardSizeOptions;
                    this.showTurnTimeOptions = false;
                } else if (button.text === 'Tiempo por Turno') {
                    console.log('Tiempo por Turno');
                    this.showTurnTimeOptions = !this.showTurnTimeOptions;
                    this.showBoardSizeOptions = false;
                } else if (button.text === 'Iniciar Juego') {
                    // Notificar que se inicia el juego
                    this.removeClickEvent(); // Remover evento de clic del menú                    
                    this.notifyGameStart(this.selectedBoardSize, this.selectedTurnTime);
                }
                //this.showStartMenu(); // Redibujar el menú después de cualquier acción
            } else if (button.isSelect) {
                this.handleOptionClick(mouseX, mouseY, button);
            }
        });
    }

    handleOptionClick(mouseX, mouseY, button) {
        const { x, y, width, height, options } = button;
    
        options.forEach((option, index) => {
            const optionY = y + height * (index + 1);
    
            // Solo procesa el clic si el menú desplegable de esta opción está visible
            if ((button.text === 'Tamaño del Tablero' && this.showBoardSizeOptions) ||
                (button.text === 'Tiempo por Turno' && this.showTurnTimeOptions)) {
                
                if (this.isInsideButton(mouseX, mouseY, x, optionY, width, height)) {
                    if (button.text === 'Tamaño del Tablero') {
                        this.selectedBoardSize = this.boardSizeMap[option]; // Mapeo de opción a tamaño
                        this.showBoardSizeOptions = false; // Oculta opciones después de seleccionar
                    } else if (button.text === 'Tiempo por Turno') {
                        this.selectedTurnTime = option;
                        this.showTurnTimeOptions = false; // Oculta opciones después de seleccionar
                    }
                    this.showStartMenu(); // Redibujar el menú después de seleccionar la opción
                }
            }
        });
    }

    isInsideButton(x, y, buttonX, buttonY, buttonWidth, buttonHeight) {
        return x > buttonX && x < buttonX + buttonWidth &&
               y > buttonY && y < buttonY + buttonHeight;
    }

    notifyGameStart(boardSize, turnTime) {
        const event = new CustomEvent('gameStart', { detail: { boardSize, turnTime } });
        window.dispatchEvent(event);
    }

    removeClickEvent() {
        this.canvas.removeEventListener('click', this.handleCanvasClick);
    }
}
