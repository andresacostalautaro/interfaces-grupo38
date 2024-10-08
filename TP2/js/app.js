import { Carousel } from './carousel.js'; 
import { SuggestedCarousel } from './suggestedCarousel.js';
import ElementFactory from './elementFactory.js';
// IDEA al detectar un cambio de dimensiones en la ventana, 
// se debe recalcular el ancho de los elementos del carrusel e ir a la coordenada 0

document.addEventListener('DOMContentLoaded', () => {

    const loader = createLoader();
    document.body.appendChild(loader);

    // Simular carga durante 5 segundos
    simulateLoading(5000).then(() => {
        
        document.body.removeChild(loader);

        
        console.log('ping');
    });


    // Inicializa el carrusel
    fetchAndLoadCarousels();

    
    
});

function fetchAndLoadCarousels() {
    fetch('data/gamesByCategory.json')
        .then(response => response.json())
        .then(categories => {
            // busco la categoria sugerencias
            const sugerenciasIndex = categories.findIndex(category => category.categoryTitle === 'Sugerencias');
            let sugerencias;
            const fragment = document.createDocumentFragment();

            // si esta la guardo y la elimino del array
            if (sugerenciasIndex !== -1) {
                // splice devuelve un array con los elementos eliminados, en este caso solo uno
                sugerencias = categories.splice(sugerenciasIndex, 1)[0];

                //creo el carrusel de sugerencias, lo agrego al fragment y lo instancio
                const suggestionsContainer = ElementFactory.createSuggestionsContainer(sugerencias);
                fragment.appendChild(suggestionsContainer);
                new SuggestedCarousel(suggestionsContainer);
            }

            // creo los carruseles de las categorias restantes
            categories.forEach(category => {
                const categoryContainer = ElementFactory.createCategoryContainer(category);
                fragment.appendChild(categoryContainer);
                new Carousel(categoryContainer);
            });

            // en lugar de body habria que usar un main
            document.querySelector('#page_content').appendChild(fragment);
        }).catch(error => console.error('Error fetching games:', error));
}

//esto puede ir en el factory
function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader-capa';
    loader.innerHTML = `
            <div class="loader-circle"></div>
            <div class="loader-percentage">0%</div>
    `;
    return loader;
}

function simulateLoading(duration) {

    return new Promise(resolve => {
        const loaderPercentage = document.querySelector('.loader-percentage');
        const startTime = Date.now();

        //esta funcion se va a llamar recursivamente hasta que se cumpla la condicion
        function updateLoader() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const percentage = Math.round(progress * 100);

            loaderPercentage.textContent = `${percentage}%`;

            if (progress < 1) {
                //mientras progress < 1 se va a llamar recursivamente a updateLoader
                requestAnimationFrame(updateLoader); 
            } else {
                // resolve se va a retornar cuando progress sea igual a 1. Es como un anuncio de que termino la carga
                resolve(); 
            }
        }

        requestAnimationFrame(updateLoader);
    });
}