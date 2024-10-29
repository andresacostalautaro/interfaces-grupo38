import {  Carousel } from './carousel.js'; 


export class SuggestedCarousel extends Carousel{

    constructor(container){
        super(container);
        this.bigCardWidth = 0;
        this.smallCardWidth = 0;
        this.updateDimensions();
    }

    updateDimensions(){
        //cuanto espacio van a ocupar las cards enteras
        this.gap = parseFloat(getComputedStyle(this.carousel).gap);
        this.bigCards = this.carousel.querySelectorAll('.big-card');
        this.smallCards = this.carousel.querySelectorAll('.small-card');
        this.bigCardWidth = this.bigCards[0].getBoundingClientRect().width;
        this.smallCardWidth = this.smallCards[0].getBoundingClientRect().width;
        this.visibleWidth = this.carousel.offsetWidth;

        //en este caso se que voy a tener 1 big-card y 4 small-card por frame entonces
        this.totalWidth = this.bigCards.length * this.bigCardWidth + this.smallCards.length / 2 * this.smallCardWidth +
                            (this.gap * (this.bigCards.length + this.smallCards.length / 2 - 1));
                            
    }

    calculateTranslateAmount(){
        this.updateDimensions();
        //se que voy a motrar una card grande y 4 small-card entonces
        const widthCompleteCards = (this.bigCardWidth + this.gap) + ((this.smallCardWidth + 15) * 2);

        console.log(widthCompleteCards);
        //calculo cuanto espacio consume esa "card cortada"
        const remainingWidth = this.visibleWidth - widthCompleteCards;

        // divide ese ancho disponible para mostrar "parcialmente dos cards incompletas en los extremos
        const widthOfPartialCards = remainingWidth / 2;

        console.log(widthCompleteCards - widthOfPartialCards);
        return widthCompleteCards - widthOfPartialCards;
    }

}