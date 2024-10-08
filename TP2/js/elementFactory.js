import { Carousel } from './carousel.js'; 
import { SuggestedCarousel } from './suggestedCarousel.js';

class ElementFactory {


    static createCarousel(category, isSuggestion = false) {
        const container = document.createElement('div');
        container.className = 'carousel-container';
        
        //cada 4 cards chicas va a haber una grande en el carrusel de sugerencias
        const additionalClasses = (index) => 
            isSuggestion ? (index % 5 === 0 ? 'big-card' : 'small-card') : '';


        /* el wrapper va a contener solo las flechas y la ul 
            es mas que nada porque el contenido de la ul sino 
            no respeta el padding del padre*/
        container.innerHTML = `
            <div class="carousel-wrapper" > 
                <ul class="carousel">
                    ${category.games.map((game, index) => 
                        this.createGameCard(game, additionalClasses(index))
                    ).join('')}
                </ul>
                ${this.createArrowButtons()}
            </div>
            ${this.createNavigationDots()}
        `;
        
        
        return container;
    }

    static createSuggestionsContainer(category) {
        const categoryContainer = this.createCategoryContainer(category, true);
        const carouselContainer = categoryContainer.querySelector('.carousel-container');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        
        //agrego el id suggestedGames porque a partir del id defino el layout del carousel grande
        carouselContainer.id = 'suggestedGames';
        dotsContainer.classList.add('hidden');

        return categoryContainer;
    }

    //additionaClasses va a ser != de '' cuando sean juegos del carousel de sugerencias
    static createGameCard(game, additionalClasses = '') {
    
        const classNames = `game-card ${additionalClasses}`.trim();

        return  `
        <li class="${classNames}">
            <article>
                <img src="${game.image}" alt="${game.title}"">
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                
                    ${game.price > 0 ? 
                        `
                        <div class="price-cart">
                            <span class="game-price">$${game.price}</span>
                            <button class="cart-btn" aria-label="Jugar Bloxd.io">
                                <img src="./assets/carrito.svg" alt="Agregar al carrito">
                            </button>
                        </div>
                        ` 
                    : ''}
                </div>
            </article>
        </li>
        `;
    }

    static createCategoryContainer(category, isSuggestion = false) {
        //<section class="category-container">
        const section = document.createElement('section');
        section.className = 'category-container';

        // <h2>${category.categoryTitle}</h2>
        const heading = document.createElement('h2');
        heading.textContent = "Juegos de " + category.categoryTitle;
        section.appendChild(heading);

        
        // Crea el carrusel y lo agrega al contenedor
        const carousel = this.createCarousel(category, isSuggestion);
        section.appendChild(carousel);       

        
        return section;
    }

    static createArrowButtons() {
        return `
            <button class="prev" aria-label="Juego anterior"></button>
            <button class="nav-btn next" aria-label="Siguiente juego"></button>
        `;
    }

    static createNavigationDots() {
        return`
            <div class="carousel-dots">
                <button class="carousel-dot active" aria-label="Ir al frame 1" aria-current="true"></button>
                <button class="carousel-dot" aria-label="Ir al frame 2" aria-current="false"></button>
                <button class="carousel-dot" aria-label="Ir al frame 3" aria-current="false"></button>
            </div>
        `;
    }

}

export default ElementFactory;