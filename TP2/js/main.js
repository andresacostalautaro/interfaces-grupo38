import ElementFactory from './elementFactory.js';
import { SuggestedCarousel } from './suggestedCarousel.js';
import { Carousel } from './carousel.js'; 
import { Session } from './session.js';
import { setBreadcrumbs } from './breadcrumbs.js';
import { loadMoreComments } from './comments.js';
import{ loadHTML } from './loaders.js';
import { updateAuthUI } from './session.js';
import { displaySidebar } from './nav.js';

//primera funcion que ocurre al cargar la pagina
document.addEventListener('DOMContentLoaded', function() {

    /*
    const loader = createLoader();
    document.body.appendChild(loader);

    // Simula la carga durante 5 segundos
    simulateLoading(5000).then(() => {
        
        document.body.removeChild(loader);
        console.log('ping');
    });
     */
    
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

/*cargo el html del form y asigno los eventos 
function initSignInForm(session){
    showForm('signin').then(() => {
        setBreadcrumbs(getCarousels, "Inicio de sesión");

        const signUpForm = document.getElementById('sign-up'); //anchor que lleva al otro form
        const submitForm = document.getElementById('login-form'); //boton de submit

        submitForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById("email").value;
            const emailUsername = email.split("@")[0]; // me quedo nomas con la parte antes del @
            session.login(emailUsername); //como no tenemos db para buscar el usuario, usamos el email como username
            signIn();
        });

        signUpForm.addEventListener('click', initSignUpForm);
    });
}

function initSignUpForm(session){
    showForm('signup').then(() => {
        setBreadcrumbs(getCarousels, "Registro");
        
        const signInForm = document.getElementById('sign-in'); //anchor que lleva al otro form
        const submitForm = document.getElementById('logUp-form'); //boton de submit

        submitForm.addEventListener('submit',function(event) {
            event.preventDefault();  // Evitar el comportamiento por defecto de envío del formulario
            
            // Recoger los valores de los campos del formulario
            const userData = {
              firstname: document.getElementById("firstname").value,
              lastname: document.getElementById("lastname").value,
              username: document.getElementById("username").value,
              birthDate: document.getElementById("birth-date").value,
              email: document.getElementById("email").value,
              password1: document.getElementById("password-1").value,
              password2: document.getElementById("password-2").value
            };

            session.login(userData.username); //aca si, como tengo el username, lo uso para loguear al usuario
          
            // Llamar a la función signUp con los datos del usuario
            signUp(userData);
        });
        signInForm.addEventListener('click', initSignInForm);
    });
}*/


/*

function displaySidebar(session) {
    const menuToggle = document.getElementById('hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const navSection = document.querySelector('.nav-section');
    const socialFooter = document.getElementById('socialFooter');

    // Manejo el toggle del menú
    menuToggle.addEventListener('click', (event) => {
        event.preventDefault(); // Previene el salto al inicio de la página
        sidebar.classList.toggle('collapsed');

        // Cambiar la imagen del hijo de `menuToggle`
        const menuIcon = menuToggle.querySelector('img'); // Asegúrate de que el ícono sea una etiqueta <img>
        if (sidebar.classList.contains('collapsed')) {
            menuIcon.src = 'assets/images/hamburger-menu-1.png';
        } else {
            menuIcon.src = 'assets/images/hamburger-menu-2.png';
        }
    });

    // Acá agrego evento al evento cerrar sesión
    updateAuthUI(session);

    // Manejo la vista de los social media en el footer
    function checkScroll() {
        const isAtBottom = navSection.scrollHeight - navSection.scrollTop <= navSection.clientHeight + 1;
        socialFooter.classList.toggle('visible', isAtBottom);
    }

    navSection.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    checkScroll();
}


function updateAuthUI(session) {
    const authContainer = document.querySelector('.sidebar-top');
    const username = session.user;

    if (username) {
        authContainer.innerHTML = `
            <div class="user-profile">
                <img class="user-avatar" src="./assets/images/user-icon.png" alt="User">
                <div class="user-info">
                    <div class="user-name">${username}</div>
                    <div class="user-actions">
                        <button type="button" class="user-action-btn" id="profileBtn">Mi perfil</button>
                        <div class="separator"></div>
                        <button type="button" class="user-action-btn" id="logoutBtn">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click',  () => {
            session.logout();
            updateAuthUI(session);
        });

    } else {
        authContainer.innerHTML = `
            <div class="auth-buttons">
                <button type="button" class="auth-btn login-btn" id="loginBtn">Iniciar Sesión</button>
                <button type="button" class="auth-btn register-btn" id="registerBtn">Registrarse</button>
            </div>
        `;
        document.getElementById('loginBtn').addEventListener('click', function(event) {
            event.preventDefault();
            initSignInForm(session);
        });
        
        document.getElementById('registerBtn').addEventListener('click', function(event) {
            event.preventDefault();
            initSignUpForm(session);
        });
    }
}

function loadHTML(url, elementId) {
    return new Promise((resolve, reject) => {  // Devuelve una promesa
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text(); // Procesar la respuesta como texto si todo va bien
            } else {
                throw new Error(`Error loading ${url}: ${response.statusText}`);
            }
        })
        .then(data => {
            const placeholder = document.getElementById(elementId);
            placeholder.innerHTML = data;
            resolve();  // Resuelve la promesa cuando la carga haya terminado
        })
        .catch(error => {
            console.error('Error fetching content:', error);
            reject(error);  // Rechaza la promesa si hay un error
        });
    });
}

async function showForm(formTitle) {
    const pageContent = document.getElementById('page_content');
    pageContent.innerHTML = '';
    return loadHTML(`frames/form-${formTitle}.html`, 'page_content');
}

*/

