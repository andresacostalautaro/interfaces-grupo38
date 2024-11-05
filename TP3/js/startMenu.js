
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
                text: 'Juego',
                isSelect: true,
                options: [
                    { text: '4 en línea', rows: 6, columns: 7, connect: 4 },
                    { text: '5 en línea', rows: 7, columns: 8, connect: 5 },
                    { text: '6 en línea', rows: 8, columns: 9, connect: 6 },
                    { text: '7 en línea', rows: 9, columns: 10, connect: 7 }
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
                    { text: '5 seg', time: 5 },
                    { text: '15 seg', time: 15 },
                    { text: '25 seg', time: 25 }
                ],
                selectedOption: 0,
                isDropdownOpen: false,
                x: 0,
                y: 0,
            }
        ];
        
        this.activeDropdown = null; // Nuevo: para rastrear el dropdown activo
        this.hoveredOption = null;
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);

        this.addEventListeners();
        removeEventListener('gameStart', () => {
            this.removeClickEvent();
            this.removeMousemoveEvent();
        });
    }

    showStartMenu() {
        this.clearCanvas();
    
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const menuX = centerX - this.menuWidth / 2;
        const menuY = centerY - this.menuHeight / 2;
    
        const gradient = ctx.createLinearGradient(menuX, menuY, menuX, menuY + this.menuHeight);
        gradient.addColorStop(0, '#3d3d3d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(menuX, menuY, this.menuWidth, this.menuHeight);
    
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 12;
        ctx.strokeRect(menuX, menuY, this.menuWidth, this.menuHeight);
    
        ctx.save()
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    
        const titleY = menuY + this.menuGap + ctx.lineWidth;
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('Menú de Inicio', centerX, titleY);
        ctx.restore();

        let itemY = titleY + this.menuGap;
 
        this.menuItems.forEach((item, index) => {
            const itemX = menuX + this.menuWidth / 2 - this.buttonWidth / 2 - 1;

            this.drawMenuItem(item, itemX, itemY);
            
            //asigno las coordenadas y dimensiones de cada item
            item.x = itemX;
            item.y = itemY;
            item.width = this.buttonWidth;
            item.height = this.buttonHeight;

            itemY += this.buttonHeight + this.menuGap;
        });

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        
        if (this.activeDropdown) { // si hay un dropwdown activo, dibujar sus opciones
            this.drawDropdownOptions(this.activeDropdown);
        }
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      
    }
    
    drawMenuItem(item, x, y) {
        const ctx = this.ctx;
        const width = this.buttonWidth;
        const height = this.buttonHeight;

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

        // Si el item es un select, muestro el texto de la opcion seleccionada
        let text = item.isSelect 
            ? `${item.text}: ${item.options[item.selectedOption].text} ▼`
            : item.text;
        
        ctx.fillText(text, x + width / 2, y + height / 2);
    
        ctx.shadowBlur = 0;
    }


    drawSelectedDropdown() {
        const selectedItem = this.menuItems.find(item => item.isSelect && item.isDropdownOpen);
        if (selectedItem) {
            this.drawDropdownOptions(selectedItem);
        }
    }

    drawDropdownOptions(item) {
        const ctx = this.ctx;
        if (!item.isDropdownOpen) return; //si el dropdown no esta abierto, no dibuja nada

        const dropdownY = item.y + this.buttonHeight;
        const optionsHeight = item.options.length * this.buttonHeight;

        ctx.clearRect(item.x, dropdownY, this.buttonWidth, optionsHeight);

        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(item.x, dropdownY, this.buttonWidth, optionsHeight);

        item.options.forEach((option, index) => {
            const optionY = dropdownY + (index * this.buttonHeight);

            //si la opcion esta seleccionada o si esta siendo hovereada, se pinta de gris clarito
            if (index === item.selectedOption || index === this.hoveredOption) {
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(item.x, optionY, this.buttonWidth, this.buttonHeight);
            }

            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                option.text,
                item.x + this.buttonWidth / 2,
                optionY + this.buttonHeight / 2
            );
        });

        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x, dropdownY, this.buttonWidth, optionsHeight);
    }

    // por las coordenadas x e y, devuelve el boton clickeado
    getClickedButton(buttonsArray, x, y) {
        return buttonsArray.find(item => 
            x > item.x && x < item.x + this.buttonWidth && 
            y > item.y && y < item.y + this.buttonHeight
        );
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // chequeo si se hizo click en una opción del dropdown activo
        if (this.activeDropdown) {
            const optionClicked = this.handleSelectOptions(this.activeDropdown, mouseX, mouseY);
            if (optionClicked) {
                this.activeDropdown.isDropdownOpen = false;
                this.activeDropdown = null;
                this.showStartMenu();
                return;
            }
        }


        //Si no es una opcion de un dropdown, me fijo en que boton ppal del menu se hizo click
        const clickedItem = this.getClickedButton(this.menuItems, mouseX, mouseY);
        
        if (clickedItem) {
            if (!clickedItem.isSelect) { //si el clickeado no es un select, al menos en este casso se que es el boton de inicio
                this.removeClickEvent();
                this.notifyGameStart();
            } else if (clickedItem.isSelect) {
                if (this.activeDropdown === clickedItem) {
                    // si se clickea el dropdown que ya estaba activo, cerrarlo
                    clickedItem.isDropdownOpen = false;
                    this.activeDropdown = null;
                } else {
                    // si se hace clic en un nuevo dropdown, cerrar el anterior y abrir el nuevo
                    if (this.activeDropdown) {
                        this.activeDropdown.isDropdownOpen = false;
                    }
                    clickedItem.isDropdownOpen = true;
                    this.activeDropdown = clickedItem;
                }
                this.showStartMenu();
            }
        } else if (this.activeDropdown) {
            // Si se hace clic fuera de cualquier botón y hay un dropdown activo, cerrarlo
            this.activeDropdown.isDropdownOpen = false;
            this.activeDropdown = null;
            this.showStartMenu();
        }
    }

    handleSelectOptions(item, x, y) {
        const dropdownY = item.y + this.buttonHeight; // donde empiezan las opciones del dropdown
        let optionClicked = false;
        
        item.options.forEach((option, index) => { //recorro las opciones del dropdown para ver si se hizo click en alguna
            const optionY = dropdownY + (index * this.buttonHeight);
            
            if (
                x >= item.x && 
                x <= item.x + this.buttonWidth &&
                y >= optionY && 
                y <= optionY + this.buttonHeight
            ) {
                item.selectedOption = index;
                optionClicked = true;
            }
        });

        return optionClicked;
    }

    /*
    * para este caso, nomas me interesa el hover de las opciones del dropdown
    */
    handleCanvasMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        //busco el dropdown que esta abierto desplegado
        const hoveredItem = this.menuItems.find(item => item.isSelect && item.isDropdownOpen);
        
        //aca en los if me fijo por las coordenadas sobre donde esta, como siempre etcetc
        if (hoveredItem) {
            const dropdownY = hoveredItem.y + this.buttonHeight;
            let newHoveredOption = null;

            hoveredItem.options.forEach((option, index) => {
                const optionY = dropdownY + (index * this.buttonHeight);
                
                if (
                    mouseX >= hoveredItem.x && 
                    mouseX <= hoveredItem.x + this.buttonWidth &&
                    mouseY >= optionY && 
                    mouseY <= optionY + this.buttonHeight
                ) {
                    newHoveredOption = index;
                }
            });

            if (this.hoveredOption !== newHoveredOption) {
                this.hoveredOption = newHoveredOption;
                this.drawSelectedDropdown();
            }
        } else {
            if (this.hoveredOption !== null) {
                this.hoveredOption = null;
                this.drawSelectedDropdown();
            }
        }
    }

    removeClickEvent() {
        this.canvas.removeEventListener('click', this.handleCanvasClick);
    }

    removeMousemoveEvent() {
        this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);
    }

    notifyGameStart() {
        const boardOption = this.menuItems[1].options[this.menuItems[1].selectedOption];
        const { rows, columns } = boardOption;
        const turnTime = this.menuItems[2].options[this.menuItems[2].selectedOption].time;
        const winCondition = boardOption.connect;
        const event = new CustomEvent('gameStart', { 
            detail: { 
                boardSize: { rows, columns }, 
                turnTime: turnTime, 
                winCondition: winCondition 
            } 
        });
        window.dispatchEvent(event);
    }

    addEventListeners() {
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
    }

    
}
