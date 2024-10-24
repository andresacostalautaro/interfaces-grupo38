import ElementFactory from './elementFactory.js';
import { SuggestedCarousel } from './suggestedCarousel.js';
import { Carousel } from './carousel.js'; 
import { setBreadcrumbs } from './breacrums.js';
import { submitSignInForm} from './userSystem.js';
import { submitSignUpForm} from './userSystem.js';
import { getUserCart} from './userSystem.js';
import { getUser} from './userSystem.js';
import { updateNav } from './userSystem.js';
import { fixedNav } from './userSystem.js';
import { createLoader } from './app.js';
import {simulateLoading} from './app.js';
import { loadCommentsFromFile, renderComments, setupLoadMoreButton, setupCommentSubmission } from './comments.js';
import { Circulo } from './Circulo.js';

//primera funcion que ocurre al cargar la pagina
document.addEventListener('DOMContentLoaded', function() {
    const loader = createLoader();
    document.body.appendChild(loader);
    // Simular carga durante 1.5 segundos
    simulateLoading(1500).then(() => {
        
        document.body.removeChild(loader);

        // prometemos traer el header
        console.log("cargando header...");
        let headerLoaded = fetch('frames/header.html')
        .then(response => response.text())
        .then(data => {
            console.log("header cargado.");
            const header = document.getElementById('header');
            header.innerHTML = data;

            // añadimos la posibilidad de desplegar el nav cliqueando en el boton hamburgesa
            document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);
        })
        .catch(error => console.error('Error fetching header:', error));


        // prometemos traer el breadcrums
        console.log("cargando breadcrums...");
        let breadcrumbsLoaded = fetch('frames/breadcrums.html')
        .then(response => response.text())
        .then(data => {
            console.log("breadcrums cargado.");
            const brms = document.getElementById('breadcrumbs');
            brms.innerHTML = data;

            //añadimos la posibilidad de ir siempre a la pagina principal si se cliquea el HOME del breadcrums
            document.getElementById('breadcrumbs_home_icon').addEventListener('click', function(event) {
                homePage();
            });
        })
        .catch(error => console.error('Error fetching breadcrums:', error));


        // prometemos traer el footer
        console.log("cargando footer...");
        let footerLoaded = fetch('frames/footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = document.getElementById('footer');
            footer.innerHTML = data;
            console.log("footer cargado");
        })
        .catch(error => console.error('Error fetching footer:', error));
            
        
        //cuando las promesas de header, breadcrums y footer se cumplen ejecutamos la pagina principal
        Promise.all([headerLoaded, breadcrumbsLoaded, footerLoaded])
        .then(() => {
            console.log("cargando página principal...");

            // Cargar Home Page solo después de que todos los fetch hayan terminado
            homePage();
        })
        .catch(error => console.error('Error en la carga de recursos:', error));
    });
});

//funcion para cargar la pagina principal
async function homePage() {
    console.log("cargando home page....");

    let breadcrumbs = setBreadcrumbs("Home");
    document.getElementById('page_content').innerHTML = ' ';

    let carrouseles = getCarousels();

    Promise.all([breadcrumbs, carrouseles])
    .then(() => {
        console.log("página principal cargada.");
        
    })
    .catch(error => console.error('Error en la carga de recursos:', error));
}

export function getCarousels() {
    console.log("llegamos a getCarousels en app.js");
    fetch('data/gamesByCategory.json')
        .then(response => response.json())
        .then(categories => {
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

            // crea los carruseles de las categorias restantes
            categories.forEach(category => {
                const categoryContainer = ElementFactory.createCategoryContainer(category);
                fragment.appendChild(categoryContainer);
                new Carousel(categoryContainer);
            });

            // ahora añadimos el fragment al contenedor de la página
            const pageContent = document.getElementById('page_content');
            pageContent.appendChild(fragment);

            // Agregar EventListener para los botones de carrito después de que se haya añadido el fragmento al DOM
            const cartBtns = document.querySelectorAll('.cart-btn');
            console.log(cartBtns);
            cartBtns.forEach(cartBtn => {
                cartBtn.addEventListener("click", function() {
                    // Cambiar la imagen del carrito
                    const cartIcon = this.querySelector('.cart-icon');
                    cartIcon.src = './assets/carrito-confirmado.svg'; // Cambia a la imagen de confirmación
                    // Mostrar el símbolo de confirmación
                    const confirmationIcon = this.querySelector('.confirmation-icon');
                    confirmationIcon.style.display = 'inline';
                    confirmationIcon.style.opacity = '1'; // Asegúrate de que esté visible

                    // Agregar una clase para manejar el estado del botón
                    this.classList.add('confirmed');

                    // Revertir el cambio después de 2 segundos
                    setTimeout(() => {
                        // Restablecer la imagen del carrito
                        cartIcon.src = './assets/carrito.svg'; // Cambia de nuevo a la imagen original
                        confirmationIcon.style.opacity = '0'; // Ocultar el símbolo de confirmación
                        confirmationIcon.style.display = "none";
                        this.classList.remove('confirmed');
                    }, 2000); // Cambiar a la imagen original después de 2 segundos
                });
            }); // Cierre correcto para forEach
        }).catch(error => console.error('Error fetching games:', error));
}


// Funcion para despleagar el nav al clickear el boton hamburgesa
var isMenuVisible = false;
function toggleMenu(event) {
    event.stopPropagation(); // Evita que el clic se propague al documento

    // Si es true abre, si es false cierra.
    isMenuVisible = !isMenuVisible;

    var icon = document.querySelector('#hamburger-menu img');
    var headerNav = document.getElementById('header_nav');

    if (isMenuVisible) {

        fetch('frames/nav.html')
        .then(response => response.text())
        .then(data => {
            headerNav.innerHTML = data; // Inyecta el contenido del nav

            headerNav.classList.add('show-one'); // Primera animación
            setTimeout(function() {
                headerNav.classList.add('show-two'); // Segunda animación
            }, 300);

            icon.src = "assets/images/hamburger-menu-2.png"; // Cambiar el icono de hamburgesa

            fixedNav(); // Actualiza el nav con la información del usuario

            // Boton de inicio de sesión
            const signInButton = document.getElementById('sign-in');
            if (signInButton) {
                signInButton.addEventListener('click', function(event) {
                    event.preventDefault();

                    console.log("Botón de inicio de sesión clickeado, cargando formulario...");

                    getSignInForm();//funcion para el form de iniciar sesion
                });
            } else {
                console.log("No se encontró el botón de inicio de sesión");
            }

            // boton de registro
            const signUpButton = document.getElementById('sign-up');
            if (signUpButton) {
                signUpButton.addEventListener('click', function(event) {
                    event.preventDefault();

                    console.log("Botón de registro clickeado, cargando formulario...");

                    getSignUpForm();//funcion para el form de registro
                });
            } else {
                console.log("No se encontró el botón de registro");
            }

            // boton para visualizar carrito
            const cardButton = document.getElementById('cart-btn');
            if(cardButton) {
                cardButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    
                    console.log("Botón de carrito clickeado, cargando seccion...");

                    updateCart();
                });
            } else {
                console.log("no se encontro el boton del carrito en el nav");
            }

        })
        .catch(error => console.error('Error fetching nav:', error));
    } else {
        headerNav.innerHTML = ''; // Vacía el contenido previo

        icon.src = "assets/images/hamburger-menu-1.png"; //cambiar la imagen del nav

        headerNav.classList.remove('show-one', 'show-two'); //eliminar las clases de animación

        closeCart();//cerrar el carrito si estaba abierto
    }
}

// Función para cargar un formulario y configurar los eventos de cierre
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
                    const email = document.getElementById('email').value.trim();
                    const password = document.getElementById('password').value.trim();
    
                    //2. enviar la informacion a userSystem
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

//función para el formulario de inicio de sesión
window.getSignInForm = function() {
    loadForm('frames/form-signIn.html', 'sign in');
    console.log("ejecutandose funcion sign in form");
}

//función para el formulario de registro
window.getSignUpForm = function() {
    loadForm('frames/form-signUp.html', 'sign up');
    console.log("breadcrums > sign up.");
}


/*
Llamar a la funcion loadGameDetail
TODO: agregar "video", animacion a los botones de socialmedia y actualizar breadcrumbs
*/
function loadGameDetail() {
    const mainContent = document.getElementById('page_content');

    fetch('frames/game-details.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;
            console.log('Detalle del juego cargada');
            loadCircleScript(); // Carga y ejecuta el script necesario para el 4 En Línea
            loadCommentsScript(); // Carga y ejecuta el script de comentarios
        })
        .catch(error => {
            console.error('Error al cargar el detalle del juego:', error);
            mainContent.innerHTML = '<p>Error al cargar el detalle del juego.</p>';
        });
}

function loadCommentsScript() {
    const script = document.createElement('script');
    script.src = 'js/comments.js'; // Ruta del script de comentarios
    script.type = 'module'; // Asegúrate de que se ejecute como un módulo
    script.onload = () => {
        console.log('Script de comentarios cargado');
        // Llama a la función para cargar los comentarios
        const jsonFilePath = './data/initialComments.json'; // Ajusta la ruta según sea necesario
        loadCommentsFromFile(jsonFilePath, (comments) => {
            renderComments(comments, 2);  // Mostrar inicialmente 2 comentarios
            setupLoadMoreButton(comments);
            setupCommentSubmission(comments);
        });
    };   
    document.body.appendChild(script);
}

//funcionalidad para el carrito de compra
function getCart() {
    console.log("cargando card section.");

    const page = document.getElementById('page_content');

    fetch('frames/cart.html')
    .then(response => response.text())
    .then(data => {
        page.innerHTML += data;

        // Agrega el evento al botón de cerrar carrito
        const btn_close = document.getElementById('close-cart');
        if (btn_close) {
            btn_close.addEventListener('click', function(event) {
                event.preventDefault(); // Asegúrate de que esto se llame
                closeCart(); // Llama a closeCart para cerrar el carrito
            });
        } else {
            console.log("No se encontró el botón de cerrar carrito.");
        }

        const user = getUser(); // getUser() para obtener el objeto USER
        if (user.username) { // Verifica si hay un nombre de usuario
            getUserCart(); // Cargar datos del carrito de usuario
            console.log("cargando datos del usuario al card.");
        }
    })
    .catch(error => console.error('Error fetching cart:', error));
}

let iscart = false;
function updateCart() {
    console.log("updateCart()");

    iscart = !iscart;
    if(!iscart) {
        closeCart();
    } else {
        getCart();
    }
}

function closeCart() {
    // Obtener el elemento del carrito
    const cart = document.getElementById('cart_container');

    // Verificar si el carrito existe
    if (cart) {
        cart.remove(); // Elimina el carrito directamente
    } else {
        console.log("No se pudo encontrar el carrito.");
    }
}

// LO RELACIONADO AL CANVAS DEBAJO ///////////////////////////////////



// Crear las posiciones del tablero
function createBoard(canvas, ctx, figures) {
    
    console.log("canvas", canvas); 
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    
    let rows = 6; // Número de filas
    let cols = 7; // Número de columnas
    let cellSize = 60; // Tamaño de cada celda del tablero
    let margin = 10; // Margen entre celdas

    let startX = (canvasWidth - (cols * (cellSize + margin))) / 2;
    let startY = (canvasHeight - (rows * (cellSize + margin))) / 2;

    for (let row = 0; row < rows; row++) {
        let rowCircles = [];
        for (let col = 0; col < cols; col++) {
            let posX = startX + col * (cellSize + margin) + cellSize / 2;
            let posY = startY + row * (cellSize + margin) + cellSize / 2;
            let circle = new Circulo(posX, posY, cellSize / 2, '#fff', ctx); // Color blanco para celdas vacías
            rowCircles.push(circle);
            circle.draw(); // Dibuja cada círculo
        }
        figures.push(rowCircles); // Añadir fila al tablero
    }
}

// Limpiar el canvas
function clearCanvas(canvas, ctx) {   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Dibuja el tablero completo
function drawBoard(canvas, ctx, figures) {
    clearCanvas(canvas, ctx);
    figures.forEach(row => {
        row.forEach(circle => {
            circle.draw();
        });
    });
}

// Detectar clic en un círculo
function findClickedCircle(x, y, figures) {
    for (let row = 0; row < figures.length; row++) {
        for (let col = 0; col < figures[row].length; col++) {
            let circle = figures[row][col];
            if (circle.isPointInside(x, y)) {
                return circle;
            }
        }
    }
    return null;
}

// Cargar el script del círculo
function loadCircleScript() {
    const script = document.createElement('script');
    script.src = 'js/Circulo.js';
    script.type = "module";
    script.onload = () => {
        console.log('Script de Circulo.js cargado');
        initializeGame(); // Inicia el 4 en línea después de cargar el script
    }
    document.body.appendChild(script);
}

// Iniciar el juego
function initializeGame() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let figures = []; 
    createBoard(canvas, ctx, figures); // Crear el tablero

    // Cargar las imágenes antes de agregar el evento
    const playerImages = [new Image(), new Image()];
    playerImages[0].src = './assets/userIcons/userIcon1.png'; 
    playerImages[1].src = './assets/userIcons/userIcon2.png'; 

    let currentPlayer = 0; // 0 para el jugador 1, 1 para el jugador 2
    // Esperar hasta que las imágenes estén cargadas
    let imagesLoaded = 0;

    playerImages.forEach((image, index) => {
        image.onload = () => {
            imagesLoaded++;
            // Si ambas imágenes están cargadas, se puede iniciar el juego
            if (imagesLoaded === playerImages.length) {
                // Añadir el evento de clic al canvas
                canvas.addEventListener('click', function (e) {
                    let rect = canvas.getBoundingClientRect();
                    let mouseX = e.clientX - rect.left;
                    let mouseY = e.clientY - rect.top;
                    
                    let clickedCircle = findClickedCircle(mouseX, mouseY, figures);
                    if (clickedCircle) {
                        console.log("Círculo clicado en posición:", clickedCircle.getPosition());
                        // Cambiar imagen del círculo clicado
                        clickedCircle.setImage(playerImages[currentPlayer]); // Establecer la imagen del jugador actual
                        drawBoard(canvas, ctx, figures); // Redibujar el tablero con los cambios
                        // Cambiar al siguiente jugador
                        currentPlayer = (currentPlayer + 1) % playerImages.length; // Alternar entre 0 y 1
                    }
                });
                // Dibujar el tablero por primera vez
                drawBoard(canvas, ctx, figures);
            }
        };
        image.onerror = () => {
            console.error(`Error al cargar la imagen para el jugador ${index + 1}`);
        };
        image.src = image.src; // Iniciar la carga de la imagen
    });
}


