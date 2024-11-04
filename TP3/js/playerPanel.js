export class PlayerPanel {
    constructor(canvas, ctx, players, turnTime) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.players = players;
        this.turnTime = turnTime;
        this.height = 80; // Increased height to accommodate the design
        this.activePlayer = 0;
        this.currentTime = turnTime;
        this.timerInterval = null;
        
        //timer
        this.timerWidth = 80;
        this.timerHeight = 40;
        this.startTimer();
        window.addEventListener('pauseTimer', this.pauseTimer.bind(this));

    }

    pauseTimer() {
        if (this.timerInterval) {
            console.log('pausa el contador para' + this.players[this.activePlayer].name);
            clearInterval(this.timerInterval);
            this.timerInterval = null; // Limpia el intervalo para que no se pueda reanudar accidentalmente
        }
    }

    resumeTimer() {
        if (!this.timerInterval) { // Solo reiniciar si no hay un intervalo en curso
            this.startTimer();
        }
    }

    
    startTimer() {
        console.log('empieza un contador para' + this.players[this.activePlayer].name);
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.currentTime = this.turnTime;
        this.timerInterval = setInterval(() => {
            this.currentTime--;
            this.draw();
            console.log('timeee',this.currentTime);
            if (this.currentTime <= 0) {
                clearInterval(this.timerInterval);
                console.log('se acabo el tiempo para ' + this.players[this.activePlayer].name);
                // Dispatch event for time up
                const event = new CustomEvent('turnTimeUp');
                window.dispatchEvent(event);
                
            }
            // Redraw to update timer
            
        }, 1000);
    }

    draw() {
        // Clear the panel area
        //this.ctx.clearRect(0, 0, this.canvas.width, this.height);
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Color negro completamente transparente
        this.ctx.fillRect(0, 0, this.canvas.width, this.height);

        const timerX = (this.canvas.width - this.timerWidth) / 2;
        const timerY = 10;
        // Draw timer
        this.drawTimer(timerX, timerY)
        
        // dibuja la parte de los jugadores
        this.players.forEach((player, index) => {
            const isActive = index === this.activePlayer;

            // Avatar
            const avatarSize = 60;
            const avatarX = index === 0 ? 10 : this.canvas.width - avatarSize - 10;
            this.ctx.drawImage(player.avatarImg, avatarX, 10, avatarSize, avatarSize);


            let barX;
            let playerWidth;

            //esto es provisorio, se tiene que poder optimizar
            if (index === 0) { 
                barX = avatarX + avatarSize + 10; // espacio entre el avatar y la barra
                playerWidth = timerX - barX - 10; // ancho de la barra para el jugador izquierdo
            } else { 
                barX = timerX + this.timerWidth + 10; // empieza post temporizador
                playerWidth = avatarX - barX - 10; // ancho de la barra para el jugador derecho
            }
            
            this.drawNameBar(barX, 10, playerWidth, 30, player.name, isActive);
        });

        
    }

    /*
    * Este metodo dibuja la health bar que contiene ademas el nombre del jugador
    */
    drawNameBar(x, y, width, height, name, isActive) {
        //dibuja el fondo de la barra
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, isActive ? '#4466aa' : '#222244');
        gradient.addColorStop(0.5, isActive ? '#6688cc' : '#444466');
        gradient.addColorStop(1, isActive ? '#4466aa' : '#222244');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x , y, width, height);

        //estilo del borde
        this.ctx.strokeStyle = isActive ? '#99aaff' : '#666699';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x , y, width, height);

        //estilo del nombre
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name.toUpperCase(), x + width/2, y + height/2);
    }

    drawTimer(timerX, timerY) {
        //fondo del timer


        // Limpiar el área del temporizador
        this.ctx.clearRect(timerX, timerY, this.timerWidth, this.timerHeight);

        // Dibujar el fondo del temporizador (opcional)
        // Puedes personalizar el fondo si lo deseas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Fondo semitransparente
        this.ctx.fillRect(timerX, timerY, this.timerWidth, this.timerHeight);

        // Draw timer value
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            this.currentTime.toString(),
            this.canvas.width / 2,
            timerY + this.timerHeight / 2
        );
    }

    updateActivePlayer(index) {
        this.activePlayer = index;
        this.startTimer(); // Restart timer when player changes
    }

    getHeight() {
        return this.height;
    }

    // Clean up timer when game ends
    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}