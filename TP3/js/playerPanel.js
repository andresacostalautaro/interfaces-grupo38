export class PlayerPanel {
    constructor(canvas, ctx, players, turnTime, drawGameFunction ) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.players = players;
        this.turnTime = turnTime;
        this.height = 80;
        this.activePlayer = 0;
        this.currentTime = turnTime;
        this.timerInterval = null;
        this.redrawGame = drawGameFunction;
        
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
            this.redrawGame();
            console.log('timeee',this.currentTime);
            if (this.currentTime <= 0) {
                clearInterval(this.timerInterval);
                console.log('se acabo el tiempo para ' + this.players[this.activePlayer].name);
                
                const event = new CustomEvent('turnTimeUp');
                window.dispatchEvent(event);
                
            }
            
            
        }, 1000);
    }

    draw() {
        //this.ctx.clearRect(0, 0, this.canvas.width, this.height);
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Color negro completamente transparente
        this.ctx.fillRect(0, 0, this.canvas.width, this.height);

        const timerX = (this.canvas.width - this.timerWidth) / 2;
        const timerY = 10;
        
        // draw timer
        this.drawTimer(timerX, timerY)
        
        // dibuja la parte de los jugadores
        this.players.forEach((player, index) => {
            const isActive = index === this.activePlayer;

            // avatar
            const avatarSize = 63;
            const avatarX = index === 0 ? 10 : this.canvas.width - avatarSize - 10;
            this.ctx.drawImage(player.avatarImg, avatarX, 10, avatarSize, avatarSize);
            //color de borde para el avatar #544866

            let barX;
            //esto es provisorio, se tiene que poder optimizar
            if (index === 0) { 
                barX = avatarX + avatarSize + 10; // espacio entre el avatar y la barra
            } else { 
                barX = timerX + this.timerWidth + 50; // empieza post temporizador
            }

            const playerWidth = this.canvas.width * 0.31;
            
            this.drawNameBar(barX, 10, playerWidth, 30, player, isActive);
        });

        
    }

    /*
    * Este metodo dibuja la health bar que contiene ademas el nombre del jugador
    */
    drawNameBar(x, y, width, height, player, isActive) {
        // Calcula el porcentaje de vida restante
        const healthPercentage = Math.max(0, Math.min(1, (this.turnTime - this.currentTime) / this.turnTime));

        //  esta va a ser el color de la barra de vida
        this.ctx.fillStyle = '#0F0D9E';
        this.ctx.fillRect(x, y, width, height);

        if (isActive) {
            // esta va a ser la barra que va a ir creciendo con el tiemmpo
            const timeRemainingPercentage = Math.max(0, Math.min(1, this.currentTime / this.turnTime));
            this.ctx.fillStyle = '#840005';
        
            const redWidth = width * (1 - timeRemainingPercentage);
            if (player.side === 'right') {
              // Para el jugador de la izquierda, dibuja desde la derecha
              this.ctx.fillRect(x + width - redWidth, y, redWidth, height);
            } else {
              // para el jugador de la derecha tuki
              this.ctx.fillRect(x, y, redWidth, height);
            }
        }
        
        this.ctx.strokeStyle = '#C88249';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);


        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px "Alexandria", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const nameUpper = player.name.toUpperCase();
        this.ctx.fillText(nameUpper, x + width / 2, y + height / 2);
    }

    drawTimer(timerX, timerY) {
    
        // Limpiar el área del temporizador
        
        //this.ctx.clearRect(timerX, timerY, this.timerWidth, this.timerHeight);

        //fondo del timer
        this.ctx.fillStyle = 'rgba(0, 0, 0,0.5)'; // Fondo semitransparente
        this.ctx.fillRect(timerX, timerY, this.timerWidth, this.timerHeight);

        //barra de tiempo
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.font = 'bold 30px Arial';
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
        this.startTimer(); 
    }

    getHeight() {
        return this.height;
    }

    
    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}