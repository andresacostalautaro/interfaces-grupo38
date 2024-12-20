import ElementFactory from './elementFactory.js';
import { SuggestedCarousel } from './suggestedCarousel.js';
import { Carousel } from './carousel.js'; 
import { Session } from './session.js';
import { setBreadcrumbs } from './breadcrumbs.js';
import { loadMoreComments } from './comments.js';
import{ loadHTML } from './loaders.js';
import { updateAuthUI } from './session.js';
import { displaySidebar } from './nav.js';
import { createLoader } from './loader.js';
import {simulateLoading} from './loader.js';

//primera funcion que ocurre al cargar la pagina
document.addEventListener('DOMContentLoaded', function() {

    
    const loader = createLoader();
    document.body.appendChild(loader);

    // Simula la carga durante 5 segundos
    simulateLoading(5000).then(() => {
        
        document.body.removeChild(loader);
        console.log('ping');
    });
    
    
    const session = new Session('User1234'); // Usuario logueado inicialmente

    document.addEventListener('signUpSuccess', () => {
        getCarousels(session); // Actualizar los carruseles después de un registro exitoso
        updateAuthUI(session);
    });
    
   

    //funcion para cargar el contenido de un archivo HTML en un elemento del DOM    
    Promise.all([
        loadHTML('frames/header.html', 'header-placeholder'),
        loadHTML('frames/breadcrumbs.html', 'breadcrumbs-placeholder'),
        loadHTML('frames/footer.html', 'footer-placeholder'),
        loadHTML('frames/nav.html', 'nav-placeholder')
    ])
    .then(() => {
        console.log('Todos los HTMLs cargados', session);
        getCarousels(session);  // Ahora se ejecuta después de que todos los fragmentos se carguen
        displaySidebar(session); // Lo mismo para displaySidebar
    })

    
    
});


export function getCarousels(session) {

    fetch('data/gamesByCategory.json')
        .then(response => response.json())
        .then(categories => {
            setBreadcrumbs('Home');
            
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
                //agrego el evento click al primer juego del carrusel de sugerencias que SE que es el 4 en linea
                suggestionsContainer.querySelectorAll('.game-card')[0].addEventListener('click', () => {
                    console.log('click en el juego 4 en linea');
                    loadGameDetail(session);
                });
            }

            // crea los carruseles de las categorias restantes
            categories.forEach(category => {
                const categoryContainer = ElementFactory.createCategoryContainer(category);
                fragment.appendChild(categoryContainer);
                new Carousel(categoryContainer);
            });

            // ahora añadimos el fragment al contenedor de la página
            const pageContent = document.getElementById('page_content');
            pageContent.innerHTML = '';
            pageContent.appendChild(fragment);
            

            // Agregar EventListener para los botones de carrito después de que se haya añadido el fragmento al DOM
            const cartBtns = document.querySelectorAll('.cart-btn');
            
            cartBtns.forEach(cartBtn => {
                cartBtn.addEventListener("click", handleAddCartClick);
            });

        }).catch(error => console.error('Error fetching games:', error));
}

function handleAddCartClick() {
    // Verificar si el elemento ya tiene la clase 'confirmed'
    const isConfirmed = this.classList.contains('confirmed');
    const cartIcon = this.querySelector('.cart-icon');
    const confirmationIcon = this.querySelector('.confirmation-icon');

    if (isConfirmed) {
        cartIcon.src = './assets/carrito.svg';
        confirmationIcon.style.display = 'none';
        confirmationIcon.style.opacity = '0';
    } else {
        // Si no está confirmado, cambiar al estado "confirmado"
        cartIcon.src = './assets/carrito-confirmado.svg';
        confirmationIcon.style.display = 'inline';
        confirmationIcon.style.opacity = '1';
    }
    this.classList.toggle('confirmed');
    
    
}

function loadGameDetail(session) {
    console.log('loadGameDetail, session:', session);
    console.log('mortal kombat');
    setBreadcrumbs("Estrategia","4 en linea: Mortal Kombat Edition");
    const mainContent = document.getElementById('page_content');
    mainContent.innerHTML = '';
    loadHTML('frames/game-details.html', 'page_content').then(() => {
        loadGameDetailComments(session);
    });
}


function loadGameDetailComments(session) {
    console.log('loadGameDetailComments, session:', session);
    updateCommentInput(session);
    loadMoreComments();
}

function updateCommentInput(session) {
    console.log('updateCommentInput, session:', session);
    const userLogged = session.user;
    const commentInput = document.getElementById('loggedUser');
    commentInput.innerText = userLogged;
}


