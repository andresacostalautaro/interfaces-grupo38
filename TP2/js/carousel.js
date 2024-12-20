export class Carousel{
    constructor(container){
        this.container = container;
        this.carousel = container.querySelector('.carousel');
        this.leftArrow = container.querySelector('.prev');
        this.rightArrow = container.querySelector('.next');
        this.carouselItems = this.carousel.querySelectorAll('.game-card');


        this.startX = 0;
        this.currentTranslate = 0;
        this.pressed = false;
        this.prevTranslate = 0;

        
        this.updateDimensions();
        this.initEventListeners();

        this.animationTimeout = null;
    }


    updateDimensions(){
        //el gap lo dejo para calcular el tamaño total del carousel
        this.gap = parseFloat(getComputedStyle(this.carousel).gap); 
        //este es el width visible del carousel
        this.visibleWidth = this.carousel.offsetWidth;
        this.cardWidth = this.carouselItems[0].getBoundingClientRect().width;
        this.totalWidth = (this.carouselItems.length * this.cardWidth) + (this.gap * (this.carouselItems.length - 1));
        // Calculo cuántas cards completas caben en el viewport
        this.completeCardsVisible = Math.floor(this.visibleWidth / (this.cardWidth));
    }

    initEventListeners(){
        // Eventos para las flechas de navegación
        this.rightArrow.addEventListener('click', () => this.move('right'));
        this.leftArrow.addEventListener('click', () => this.move('left'));
        
        // Eventos para el touch. 
        this.carousel.addEventListener('touchstart', this.touchStart.bind(this), {passive: true});
        this.carousel.addEventListener('touchend', this.touchEnd.bind(this));
        this.carousel.addEventListener('touchmove', this.touchMove.bind(this) , {passive: true});
        
    }

    getPositionX(event) {
        return event.touches[0].clientX;
    }

    touchStart(e) {
        this.pressed = true;
        this.startX = this.getPositionX(e);
    }


    touchEnd() {
        this.pressed = false;
        this.prevTranslate = this.currentTranslate;
    }

    touchMove(e) {
        if (!this.pressed) return;
        const currentX = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + (currentX - this.startX);

        this.setTranslate(this.currentTranslate);
    }

    
    setTranslate(translate) {
        this.updateDimensions();

        if (translate > 0) {
            translate = 0;
        } else if (Math.abs(translate) > this.totalWidth - this.carousel.offsetWidth) {
            translate = -(this.totalWidth - this.carousel.offsetWidth);
        }

        this.currentTranslate = translate;
        this.carousel.style.transform = `translateX(${translate}px)`;
    }

    updateArrowVisibility() {
        const isAtStart = this.currentTranslate >= 0;
        const isAtEnd = Math.abs(this.currentTranslate) >= this.totalWidth - this.visibleWidth;

        this.leftArrow.classList.toggle('nav-btn', !isAtStart);
        this.rightArrow.classList.toggle('nav-btn', !isAtEnd);
    }

    calculateTranslateAmount(){
        this.updateDimensions(); // podria no recalcularlo pero las imagenes tardan en cargar  y no se calcula bien el ancho total
    
        // cuantas cards completas entran en el espacio visible
        this.completeCardsVisible = Math.floor(this.visibleWidth / (this.cardWidth + this.gap));
    
        // ancho total que ocupan las cards completas visibles
        const totalWidthOfFullCards = this.completeCardsVisible * (this.cardWidth + this.gap);
    
        //ancho disponible ademas de las cards completas
        const remainingWidth = this.visibleWidth - totalWidthOfFullCards;
    
        // divide ese ancho disponible para mostrar "parcialmente dos cards incompletas
        const widthOfPartialCards = remainingWidth / 2;
    
        return totalWidthOfFullCards - widthOfPartialCards;
    }

    move(direction) {
        const translateAmount = this.calculateTranslateAmount();
        let newTranslate;

        if (direction === 'left') {
            newTranslate = this.currentTranslate + translateAmount;
            this.applyTiltEffect('left');
        } else {
            newTranslate = this.currentTranslate - translateAmount;
            this.applyTiltEffect('right');
        }

        
        this.setTranslate(newTranslate);
        this.updateArrowVisibility();
        this.updateActiveDot();

        
        clearTimeout(this.animationTimeout);
        this.animationTimeout = setTimeout(() => {
            this.removeTiltEffect();
        }, 550); //un poquito mas largo que la duracion de la transicion
    }

    updateActiveDot() {
        const currentFrame = Math.round(Math.abs(this.currentTranslate) / this.visibleWidth);
        this.dots = this.container.querySelectorAll('.carousel-dot');
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentFrame);
            dot.setAttribute('aria-current', index === currentFrame ? 'true' : 'false');
        });
    }

    applyTiltEffect(direction) {
        this.carouselItems.forEach(item => {
            item.classList.remove('tilt-left', 'tilt-right');
            item.classList.add(direction === 'left' ? 'tilt-right' : 'tilt-left');
        });
    }

    removeTiltEffect() {
        this.carouselItems.forEach(item => {
            item.classList.remove('tilt-left', 'tilt-right');
        });
    }

}
