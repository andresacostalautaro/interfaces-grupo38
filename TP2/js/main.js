import { getCarousels } from './app.js';
import { setBreadcrumbs } from './breacrums.js';
import { submitSignInForm} from './userSystem.js';
import { submitSignUpForm} from './userSystem.js';
import { getUserCard} from './userSystem.js';
import { getUser} from './userSystem.js';
import { updateNav } from './userSystem.js';
import { fixedNav } from './userSystem.js';

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
            fixedNav(); // Actualiza el nav con la información del usuario

            // Agregar eventos para los botones de inicio de sesión
            const signInButton = document.getElementById('sign-in');
            if (signInButton) {
                signInButton.addEventListener('click', function(event) {
                    console.log("Botón de inicio de sesión clickeado, cargando formulario...");
                    event.preventDefault();
                    getSignInForm();
                });
            } else {
                console.log("No se encontró el botón de inicio de sesión");
            }

            // Agregar eventos para los botones de registro
            const signUpButton = document.getElementById('sign-up');
            if (signUpButton) {
                signUpButton.addEventListener('click', function(event) {
                    console.log("Botón de registro clickeado, cargando formulario...");
                    event.preventDefault();
                    getSignUpForm();
                });
            } else {
                console.log("No se encontró el botón de registro");
            }

            // Agregar eventos para los botones para visualizarcarrito
            const cardButton = document.getElementById('cart-btn');
            if(cardButton) {
                cardButton.addEventListener('click', function(event) {
                    console.log("Botón de carrito clickeado, cargando seccion...");
                    event.preventDefault();
                    getCard();
                });
            } else {
                console.log("no se encontro el boton del carrito en el nav");
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
            let log_in = document.getElementById('login-form');
            if(log_in) {
                document.getElementById('login-form').addEventListener('submit', function(event) {
                    //0. impedir que se recargue la pagina
                    event.preventDefault();
    
                    //1. Obtener valores del formulario
                    console.log("sign in paso 1");
                    const email = document.getElementById('email').value.trim();
                    const password = document.getElementById('password').value.trim();
    
                    //2. enviar la informacion a userSystem
                    console.log("sign in paso 3");
                    submitSignInForm(email, password);
    
                });
            }

            //si el usuario ejecuta un formulario
            let log_up = document.getElementById('logUp-form')
            if(log_up) {
                document.getElementById('logUp-form').addEventListener('submit', function(event) {
                    //0. impedir que se recargue la pagina
                    event.preventDefault();
    
                    //1. Obtener valores del formulario
                    const name = document.getElementById('firstname').value.trim();
                    const lastname = document.getElementById('lastname').value.trim();
                    const username = document.getElementById('username').value.trim();
                    const birth = document.getElementById('birthday').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const password1 = document.getElementById('password1').value.trim();
                    const password2 = document.getElementById('password2').value.trim();
                    
                    //2. enviar la informacion a userSystem
                    submitSignUpForm(name, lastname, username, birth, email, password1, password2);
                });
            }


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
    console.log("sign in paso 8");

    homePage();
    const user = getUser(); // Llama a getUser() para obtener el objeto USER

    if (user.username) { // Verifica si hay un nombre de usuario
        console.log("sign in paso 9");
        updateNav();

    } else {
        console.log("No hay usuario autenticado.");
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

window.getCard = function() {
    console.log("cargando card section.")

    const page = document.getElementById('page_content');

    fetch('frames/card.html')
    .then(response => response.text())
    .then(data => {
        page.innerHTML += data;

        const user = getUser(); // Llama a getUser() para obtener el objeto USER
        if (user.username) { // Verifica si hay un nombre de usuario
            getUserCard();
            console.log("cargando datos del usuario al card.")
        }
    })
    .catch(error => console.error('Error fetching nav:', error));
}
