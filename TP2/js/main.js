import { getCarousels } from './app.js';
import { setBreadcrumbs } from './breacrums.js';
import { submitSignInForm} from './userSystem.js';
import { getUser} from './userSystem.js';

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

async function homePage() {
    document.getElementById('page_content').innerHTML = ' ';
    console.log("cargando home page....");

    setBreadcrumbs("Home");
    console.log("breadcrums > HOME....");

    getCarousels();
}

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
            headerNav.innerHTML = data;
            headerNav.classList.add('show-one'); // Primera clase de animación
            setTimeout(function() {
                headerNav.classList.add('show-two'); // Segunda fase de la animación
            }, 300); // Ajustar a la duración de la animación CSS
            icon.src = "assets/images/hamburger-menu-2.png";

            document.getElementById('sign-in').addEventListener('click', function(event){
                console.log("Botón clickeado, cargando formulario...");
                event.preventDefault();
                getSignInForm();
            });
            document.getElementById('sign-up').addEventListener('click', function(event){
                console.log("Botón clickeado, cargando formulario...");
                event.preventDefault();
                getSignUpForm();
            });


        })
        .catch(error => console.error('Error fetching nav:', error));
    } else {
        // Cerrar el menú sin animación
        headerNav.innerHTML = ''; // Vacía el contenido inmediatamente
        icon.src = "assets/images/hamburger-menu-1.png";
        headerNav.classList.remove('show-one', 'show-two'); // Asegúrate de eliminar las clases de animación
    }
}

function getSignInForm() {
    const page = document.getElementById('page_content');  
    setBreadcrumbs("sign in");

    console.log("ejecutandose funcion sign in form");
    fetch('frames/form-signIn.html')
        .then(response => response.text())
        .then(data => {
            page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
            page.innerHTML = data;  // Cargar el formulario

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
                console.log("Botón close-form encontrado");
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

export function iniciatedSesion() {
    if(getUser) {
        let profile = document.getElementById('user_nav_content');
        profile.innerHTML = `<tr>
                            <th><a><img id="user_photo_nav" class="user_photo_nav" src="" alt="Foto del usuario"></a></th>
                            <td class="user-panel" colspan="2">
                            <h1>${getUser.username}</h1>
                            <div>
                                <h5 id="btn-MySession">Mi Sesion</h5>
                                <h5>|</h5>
                                <h5 id="btn-Sign-out">Cerrar Sesion</h5>
                            </div>
                            </td>
                        </tr>`;
    
        let card = document.getElementById('card_game_numbers');
        card.innerHTML = ' ';
        card.innerHTML = `<h1 id="card_game_numbers">777</h1>`;
    } else {
        console.log("no hay getUSER");
    }
}
window.iniciatedSesion = iniciatedSesion;

function getSignUpForm() {
    const page = document.getElementById('page_content');    

    fetch('frames/form-signUp.html')
    .then(response => response.text())
    .then(data => {
        page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
        page.innerHTML = data;  // Cargar el formulario
        setBreadcrumbs("sign up");
        console.log("breadcrums > sign up.");
        document.getElementById('');

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


