import ElementFactory from './elementFactory.js';
import { SuggestedCarousel } from './suggestedCarousel.js';
import { Carousel } from './carousel.js'; 
import { getProfile } from './userSystem.js';
import { setBreadcrumbs } from './breacrums.js';
import { submitSignInForm} from './userSystem.js';
import { getUser} from './userSystem.js';
import { updateProfile } from './userSystem.js';

//primera funcion para traer el header y el footer,
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el header
    let headerLoaded = fetch('frames/header.html')
    .then(response => response.text())
    .then(data => {
        console.log("cargando header...");
        const header = document.getElementById('header');
        header.innerHTML = data;

        // Añadir el evento del botón aquí
        document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);
    })
    .catch(error => console.error('Error fetching header:', error));

    // Cargar los breadcrumbs
    let breadcrumbsLoaded = fetch('frames/breadcrums.html')
    .then(response => response.text())
    .then(data => {
        console.log("cargando breadcrums...");
        const brms = document.getElementById('breadcrumbs');
        brms.innerHTML = data;
        document.getElementById('breadcrumbs_home_icon').addEventListener('click', function(event) {
            homePage();
        });
    })
    .catch(error => console.error('Error fetching breadcrums:', error));

    // Cargar el footer
    let footerLoaded = fetch('frames/footer.html')
    .then(response => response.text())
    .then(data => {
        const footer = document.getElementById('footer');
        footer.innerHTML = data;
        console.log("cargando footer...");
    })
    .catch(error => console.error('Error fetching footer:', error));

    // Usamos Promise.all para esperar a que todas las promesas de fetch se resuelvan
    Promise.all([headerLoaded, breadcrumbsLoaded, footerLoaded])
    .then(() => {
        console.log("Cargando la página principal...");
        // Cargar Home Page solo después de que todos los fetch hayan terminado
        homePage();
    })
    .catch(error => console.error('Error en la carga de recursos:', error));
});

//funcion para cargar la pagina en estado HOME
async function homePage() {
    document.getElementById('page_content').innerHTML = ' ';
    console.log("cargando home page....");

    setBreadcrumbs("Home");
    console.log("breadcrums > HOME....");

    getCarousels();
}


export function getCarousels() {
    console.log("llegamos a getCarousels en app.js");
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

                //agrego el evento click al primer juego del carrusel de sugerencias que SE que es el 4 en linea
                suggestionsContainer.querySelectorAll('.game-card')[0].addEventListener('click', () => {
                    console.log('click en el juego 4 en linea');
                    loadGameDetail();
                });
            }

            // creo los carruseles de las categorias restantes
            categories.forEach(category => {
                const categoryContainer = ElementFactory.createCategoryContainer(category);
                fragment.appendChild(categoryContainer);
                new Carousel(categoryContainer);
            });

            // ahora añadimos el fragment al contenedor de la página
            const pageContent = document.getElementById('page_content');
            pageContent.appendChild(fragment);
        }).catch(error => console.error('Error fetching games:', error));
}


//funcion para despleagar el nav al cliquear en el boton hamburgesa
var isMenuVisible = false;
function toggleMenu(event) {
    event.stopPropagation(); // Evita que el clic se propague al documento
    isMenuVisible = !isMenuVisible;
    var icon = document.querySelector('#hamburger-menu img');
    var headerNav = document.getElementById('header_nav');

    if (isMenuVisible) {
        // Abrir el menú con animación
        fetch('frames/nav.html')
        .then(response => response.text())
        .then(data => {
            headerNav.innerHTML = data; // Inyecta el contenido del nav
            headerNav.classList.add('show-one'); // Primera clase de animación
            setTimeout(function() {
                headerNav.classList.add('show-two'); // Segunda fase de la animación
            }, 300); // Ajustar a la duración de la animación CSS
            icon.src = "assets/images/hamburger-menu-2.png";

            console.log("llego a getProfile())");
            getProfile(); // Actualiza el thead con la información del usuario
            console.log("PASO");

            // Agregar eventos para los botones de inicio de sesión y registro aquí
            const signInButton = document.getElementById('sign-in');
            const signUpButton = document.getElementById('sign-up');

            if (signInButton) {
                signInButton.addEventListener('click', function(event) {
                    console.log("Botón de inicio de sesión clickeado, cargando formulario...");
                    event.preventDefault();
                    getSignInForm();
                });
            } else {
                console.error("No se encontró el botón de inicio de sesión");
            }

            if (signUpButton) {
                signUpButton.addEventListener('click', function(event) {
                    console.log("Botón de registro clickeado, cargando formulario...");
                    event.preventDefault();
                    getSignUpForm();
                });
            } else {
                console.error("No se encontró el botón de registro");
            }
        })
        .catch(error => console.error('Error fetching nav:', error));
    } else {
        // Cerrar el menú sin animación
        headerNav.innerHTML = ''; // Vacía el contenido inmediatamente
        icon.src = "assets/images/hamburger-menu-1.png";
        headerNav.classList.remove('show-one', 'show-two'); // Asegúrate de eliminar las clases de animación
    }
}

// Función genérica para cargar un formulario y configurar los eventos de cierre
function loadForm(formPath, breadcrumbsText) {
    const page = document.getElementById('page_content');
    setBreadcrumbs(breadcrumbsText);

    fetch(formPath)
        .then(response => response.text())
        .then(data => {
            page.innerHTML = ''; // Limpiar antes de cargar el nuevo contenido
            page.innerHTML = data; // Cargar el formulario

            //si el usuario ejecuta un formulario
            document.getElementById('login-form').addEventListener('submit', function(event) {
                //impedir que se recargue la pagina
                event.preventDefault();
    
                // Obtener valores del formulario
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
    
                // Verificar que los campos no estén vacíos
                if (email && password) {
                    submitSignInForm(email, password);
                } else {
                    document.getElementById('email').classList.add('input-warning');
                    document.getElementById('password').classList.add('input-warning');
                    // Mostrar un mensaje si los campos están vacíos
                    console.log('Please fill in all fields');
                }
            });

            // Asegúrate de que el DOM haya sido actualizado antes de agregar el evento
            const closeButton = document.getElementById('close-form');
            if (closeButton) {
                closeButton.addEventListener('click', function(event) {
                    console.log("Botón clickeado, cerrando formulario...");
                    document.getElementById('form').classList.add('hidden');
                    event.preventDefault();
                    document.getElementById('page_content').innerHTML = ''; // Vacía el contenido para cerrar el formulario
                    homePage();
                });
            } else {
                console.error("No se encontró el botón close-form");
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

//funcion para alternar la pagina al iniciar secion
export function iniciatedSesion() {
    homePage();
    const user = getUser(); // Llama a getUser() para obtener el objeto USER

    if (user.username) { // Verifica si hay un nombre de usuario
        console.log(user); // Muestra el objeto USER en la consola
        updateProfile();
        // Actualiza el contenido del perfil del usuario


        // Actualiza el contenido de la tarjeta de juego

        let card = document.getElementById('card_game_numbers');
        card.innerHTML = `<h1 id="card_game_numbers">${user.cardshop.length}</h1>`;
    } else {
        console.log("No hay usuario autenticado.");
        // Opcionalmente, puedes limpiar el contenido del perfil si no hay sesión activa
        let profile = document.getElementById('user_nav_content');
        profile.innerHTML = ''; // Limpia el contenido del perfil
    }
}
window.iniciatedSesion = iniciatedSesion;

// Llamar la función genérica para el formulario de inicio de sesión
window.getSignInForm = function() {
    loadForm('frames/form-signIn.html', 'sign in');
    console.log("ejecutandose funcion sign in form");
}

// Llamar la función genérica para el formulario de registro
window.getSignUpForm = function() {
    loadForm('frames/form-signUp.html', 'sign up');
    console.log("breadcrums > sign up.");
}


// Llamar a la funcion loadGamePage
function loadGameDetail() {
    const mainContent = document.getElementById('page_content');

    fetch('frames/game-details.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;
            console.log('Detalle del juego cargada');
        })
        .catch(error => {
            console.error('Error al cargar el detalle del juego:', error);
            mainContent.innerHTML = '<p>Error al cargar el detalle del juego. Por favor, intenta de nuevo más tarde.</p>';
        });
}
