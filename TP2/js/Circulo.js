"use strict"

export class Circulo {
    constructor(posX, posY, radio, fill, context){
        this.posX = posX;
        this.posY = posY;
        this.radio = radio;
        this.fill = fill;
        this.context = context;
    }

    draw(){
        this.context.fillStyle = this.fill;
        this.context.beginPath();
        this.context.arc(this.posX, this.posY, this.radio, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    setFill(fill){
        this.fill = fill;
    }

    getPosition(){
        return{
            x: this.getPosX(),
            y: this.getPosY()
        };
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
    }

    getRadio(){
        return this.radio;
    }

    getFill(){
        return this.fill;
    }

    isPointInside(x, y){
        let _x = this.posX - x;
        let _y = this.posY - y;
        return Math.sqrt(_x * _x + _y * _y) < this.radio;
    }

    calcularArea() {
        return Math.PI * Math.pow(this.radio, 2);
    }

    setUpFunctions(){
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let figures = []; // Tablero
    }
}