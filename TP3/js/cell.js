"use strict";

export class Cell {
    constructor(row, col, cellSize, offsetX, offsetY) {
        this.row = row; 
        this.col = col; 
        this.cellSize = cellSize - 10; 
        this.hovered = false; 
        this.occupied = false; 

        this.imageToken = null; // Imagen de la ficha a menos que este ocupada

        // Calcula la posición de cada celda considerando el offset
        this.posX = col * cellSize + cellSize / 2 + offsetX; 
        this.posY = row * cellSize + cellSize / 2 + offsetY;
    }

    draw(ctx) {
        const x = this.getPosX();
        const y = this.getPosY();
        const radius = this.cellSize / 2 - 5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();

        if (this.occupied && this.imageToken) {
            // imagen sin opacidad para las celdas ocupadas
            ctx.save();
            ctx.clip();
            ctx.drawImage(
                this.imageToken, 
                x - radius, 
                y - radius, 
                radius * 2, 
                radius * 2
            );
            ctx.restore();
        } else if (this.hovered) {
            // imagen del currentPlayer con opacidad cuando la celda está en "hover"
            ctx.save();
            ctx.globalAlpha = 0.5;
            console.log('current player', currentPlayer);
            ctx.drawImage(
                this.imageToken,
                x - radius,
                y - radius,
                radius * 2,
                radius * 2
            );
            ctx.restore();
        } else {
            ctx.fillStyle = '#ecf0f1';
            ctx.fill();
        }

    
        ctx.strokeStyle = '#2980b9';
        ctx.stroke();
    }


    setHovered(hovered) {
        this.hovered = hovered;
    }

    getPosition() {
        return {
            x: this.getPosX(),
            y: this.getPosY()
        };
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    isOccupied(){
        return this.occupied;
    }

    setOccupied(occupied) {
        this.occupied = occupied;
    }

    fillWithPlayerImage(ctx, player) {
        this.setOccupied(true);
        this.imageToken = player.getTokenImage();

        ctx.drawImage(
            this.imageToken,
            this.posX - this.radius,
            this.posY - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }

    isOccupiedBy(player) {
        return this.imageToken === player.getTokenImage();
    }

    getTokenImage() {
        return this.imageToken;
    }
}