import { Board } from './board.js';
export class StartMenu {
    constructor(canvas, ctx, backgroundImage) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.backgroundImage = backgroundImage;

        this.menuWidth = this.canvas.width * 0.45;
        this.menuHeight = this.canvas.height * 0.5;
        this.menuGap = this.menuHeight * 0.09;
        this.buttonWidth = this.canvas.width * 0.4;
        this.buttonHeight = this.canvas.height * 0.08;
        this.menuItems = [
            { 
                text: 'Iniciar Juego', 
                isSelect: false,
                x: 0,
                y: 0,
            },
            { 
                text: 'Tamaño del Tablero', 
                isSelect: true,
                options: [
                    { text: '4 en linea', rows: 6, columns: 7, connect: 4 },
                    { text: '5 en linea', rows: 7, columns: 8, connect: 5 },
                    { text: '6 en linea', rows: 8, columns: 9, connect: 6 },
                    { text: '7 en linea', rows: 9, columns: 10, connect: 7 }
                ],
                selectedOption: 0,
                isDropdownOpen: false,
                x: 0,
                y: 0,
            },
            { 
                text: 'Tiempo por Turno',
                isSelect: true,
                options: [
                    { text: '5 segundos', time: 5 },
                    { text: '15 segundos', time: 15 },
                    { text: '25 segundos', time: 25 }
                ],
                selectedOption: 0,
                isDropdownOpen: false,
                x: 0,
                y: 0,
            }
        ];
        
        //este bind es para enlazar el metodo con el objeto
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.canvas.addEventListener('click', this.handleCanvasClick);
    }

    showStartMenu() {
        this.clearCanvas();
    
        const ctx = this.ctx;
    
        const centerX = this.canvas.width / 2; // el centro del canvas
        const centerY = this.canvas.height / 2; // el centro del canvas   
        const menuX = centerX - this.menuWidth / 2; // la coordenada x del menu
        const menuY = centerY - this.menuHeight / 2; // la coordenada y del menu
    
        const gradient = ctx.createLinearGradient(menuX, menuY, menuX, menuY + this.menuHeight);
        gradient.addColorStop(0, '#3d3d3d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(menuX, menuY, this.menuWidth, this.menuHeight);
    
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 12;
        ctx.strokeRect(menuX, menuY, this.menuWidth, this.menuHeight);
    
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    
        //titulo del menu (capaz lo saco)
        const titleY = menuY + this.menuGap + ctx.lineWidth;
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('Menú de Inicio', centerX, titleY);
    
        //dibuja todo lo que son los items del menu
        let itemY = titleY + this.menuGap //aca va a empezar a dibujar el primer item
 
        this.menuItems.forEach((item, index) => {
            const itemX = menuX + this.menuWidth / 2 - this.buttonWidth / 2 - 1;

            this.drawMenuItem(item.text, itemX, itemY);
            item.x = itemX;  
            item.y = itemY;
            item.width = this.buttonWidth;
            item.height = this.buttonHeight;

           //actualiza y pasa al siguiente item
            itemY += this.buttonHeight + this.menuGap;
        });

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawMenuItem(text, x, y) {
        const ctx = this.ctx;
        const width = this.buttonWidth;
        const height = this.buttonHeight;

        // fondo del boton con gradiente
        const itemGradient = ctx.createLinearGradient(x, y, x, y + height); 
        itemGradient.addColorStop(0, '#5e5e5e'); 
        itemGradient.addColorStop(1, '#3a3a3a');
        ctx.fillStyle = itemGradient;
        ctx.fillRect(x, y, width, height);
    
        
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
    
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    
        //restaurar sombras
        ctx.shadowBlur = 0;
    }
    

    /*
    * Devuelve el ítem del menu que esta siendo clickeado    
    */
    getClickedButton(buttonsArray, x, y) {
        console.log(buttonsArray);
        return buttonsArray.find(item => 
            x > item.x && x < item.x + this.buttonWidth && 
            y > item.y && y < item.y + this.buttonHeight
        );
    }

    handleCanvasClick(e) {
        console.log(this.canvas);
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left; // rect.left es donde empieza el canvas
        const mouseY = e.clientY - rect.top; // rect.top es donde empieza el canvas

        const clickedItem = this.getClickedButton(this.menuItems, mouseX, mouseY);
        console.log('clickedItem', clickedItem);
        if (clickedItem) {
            if (!clickedItem.isSelect) {
                this.removeClickEvent();
                this.notifyGameStart();
            }else if (clickedItem.isSelect && clickedItem.isDropdownOpen)
                handleSelectOptions(clickedItem, mouseX, mouseY);
            else if (clickedItem.isSelect)
                toggleOptions(clickedItem);
        }
    }

    handleSelectOptions(item, x, y) {
        item.options.forEach((option, index) => {
            const optionY = item.y + this.buttonHeight * (index + 1);
            if ((x, y, item.x, optionY, item.width, item.height)) {
                item.selectedOption = index;
                item.isDropdownOpen = false;
            }
        });
    }

    removeClickEvent() {
        this.canvas.removeEventListener('click', this.handleCanvasClick);
    }

    notifyGameStart() {
        const boardOption = this.menuItems[1].options[this.menuItems[1].selectedOption];
        const { rows, columns } = boardOption;
        const turnTime = this.menuItems[2].options[this.menuItems[2].selectedOption].time;

        const event = new CustomEvent('gameStart', { detail: { boardSize: { rows, columns }, turnTime } });
        window.dispatchEvent(event);
    }

    //Y no, el menu no va a quedar con este estilo tan feo, es solo para probar
    //falta un drawOptions que dibuje las opciones de los items
    //falta que al dibujar los items, muestre los valores por defecto
    //en una esquina podria tener un boton para volver al menu principal o restart
    //tambien podria enviar el valor de connect en el evento de gameStart
}
