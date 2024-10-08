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
        cargarHomePage();
    })
    .catch(error => console.error('Error en la carga de recursos:', error));
});

async function cargarHomePage() {
    console.log("cargando home page....");

    setBreadcrumbs("Home");
    console.log("breadcrums > HOME....");

    const games = await getGames(); // Cargar juegos
    if (!games) return;
    fetch('frames/carousel.html')
    .then(response => response.text())
    .then(data => {
        const page = document.getElementById('page_content');
        page.innerHTML = data;
        console.log("cargando carousel 50%...");
        loadCarousel(games);
    });
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

    console.log("ejecutandose funcion sign in form");
    fetch('frames/form-signIn.html')
        .then(response => response.text())
        .then(data => {
            page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
            page.innerHTML = data;  // Cargar el formulario
            setBreadcrumbs("sign in");
            console.log("breadcrums > sign in.");

            // Asegúrate de que el DOM haya sido actualizado antes de agregar el evento
            const closeButton = document.getElementById('close-form');
            if (closeButton) {
                console.log("Botón close-form encontrado");
                closeButton.addEventListener('click', function(event) {
                    console.log("Botón clickeado, cerrando formulario...");
                    document.getElementById('form').classList.add('hidden');
                    event.preventDefault();
                    document.getElementById('page_content').innerHTML = ''; // Vacía el contenido para cerrar el formulario
                    cargarHomePage();
                });
            } else {
                console.error("No se encontró el botón close-form");
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function getSignUpForm() {
    const page = document.getElementById('page_content');    

    fetch('frames/form-signUp.html')
    .then(response => response.text())
    .then(data => {
        page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
        page.innerHTML = data;  // Cargar el formulario
        setBreadcrumbs("sign up");
        console.log("breadcrums > sign up.");

        // Asegúrate de que el DOM haya sido actualizado antes de agregar el evento
        const closeButton = document.getElementById('close-form');
        if (closeButton) {
            closeButton.addEventListener('click', function(event) {
                console.log("Botón clickeado, cerrando formulario...");
                document.getElementById('form').classList.add('hidden');
                event.preventDefault();
                document.getElementById('page_content').innerHTML = ''; // Vacía el contenido para cerrar el formulario
                cargarHomePage();
            });
        } else {
            console.error("No se encontró el botón close-form");
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}
// Funciones del carrusel
async function loadCarousel(games) {
    
    const carousel = document.getElementById('carousel');
    games.forEach(game => {
        const li = document.createElement('li');
        li.className = 'carousel-item';
        li.innerHTML = `
            <img src="assets/images/loading.jpg" alt="${game.title}">
            <div class="overlay">
                <h3>${game.title}</h3>
                <div>
                    <h4>$${game.price}</h4>
                    <img src="assets/images/card-1.png">
                </div>
            </div>
        `;
        carousel.appendChild(li);
    });
}

let currentSlide = 0;
function moveSlide(direction, carouselSelector) {
    const slides = document.querySelectorAll(`${carouselSelector} .carousel-item`);
    const totalSlides = slides.length;
    const carousel = document.querySelector(carouselSelector);

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    const slideWidth = slides[currentSlide].clientWidth;
    const position = -currentSlide * slideWidth;

    carousel.style.transform = `translateX(${position}px)`;
}


