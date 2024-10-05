document.addEventListener('DOMContentLoaded', function() {
    // Cargar el header
    fetch('frames/header.html')
    .then(response => response.text())
    .then(data => {
        const header = document.getElementById('header');
        header.innerHTML = data;

        // Añadir el evento del botón aquí
        document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);
    })
    .catch(error => console.error('Error fetching header:', error));

    //Cargar Home Page
    cargarHomePage();

    // Cargar el footer
    fetch('frames/footer.html')
    .then(response => response.text())
    .then(data => {
        const footer = document.getElementById('footer');
        footer.innerHTML = data;
    })
    .catch(error => console.error('Error fetching footer:', error));
});

function cargarHomePage() {
    const page = document.getElementById('page_content');

    fetch('frames/breadcrums.html')
    .then(response => response.text())
    .then(data => {
        page.appendChild(data);
        setBreadcrumbs("Home");
    })
    .catch(error => console.error('Error fetching footer:', error));

    fetch('frames/game-corousel-main.html')
    .then(response => response.text())
    .then(data => {
        page.appendChild(data);
    })
    .catch(error => console.error('Error fetching footer:', error));

    fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
        const games = data;
        
        // Contar objetos en el JSON
        let count = 0;
        for (let i = 0; i < games.length; i++) {
            count++;
        }

        

    // Imprimir el número total de juegos
    console.log('Total games:', count);
    })
    .catch(error => console.error('Error fetching footer:', error));
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
            console.log("form-signIn.html fetch");

            page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
            page.innerHTML = data;  // Cargar el formulario
            setBreadcrumbs("log in");
            console.log("Formulario cargado");

            // Asegúrate de que el DOM haya sido actualizado antes de agregar el evento
            const closeButton = document.getElementById('close-form');
            if (closeButton) {
                console.log("Botón close-form encontrado");
                closeButton.addEventListener('click', function(event) {
                    console.log("Botón clickeado, cerrando formulario...");
                    document.getElementById('form').classList.add('hidden');
                    event.preventDefault();
                    document.getElementById('page_content').innerHTML = ''; // Vacía el contenido para cerrar el formulario
                });
            } else {
                console.error("No se encontró el botón close-form");
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function getSignUpForm() {
    const page = document.getElementById('page_content');    

    console.log("ejecutandose funcion sign up form");
    fetch('frames/form-signUp.html')
    .then(response => response.text())
    .then(data => {
        console.log("form-signUp.html fetch");

        page.innerHTML = '';  // Limpiar antes de cargar el nuevo contenido
        page.innerHTML = data;  // Cargar el formulario
        setBreadcrumbs("log in");
        console.log("Formulario cargado");

        // Asegúrate de que el DOM haya sido actualizado antes de agregar el evento
        const closeButton = document.getElementById('close-form');
        if (closeButton) {
            console.log("Botón close-form encontrado");
            closeButton.addEventListener('click', function(event) {
                console.log("Botón clickeado, cerrando formulario...");
                document.getElementById('form').classList.add('hidden');
                event.preventDefault();
                document.getElementById('page_content').innerHTML = ''; // Vacía el contenido para cerrar el formulario
            });
        } else {
            console.error("No se encontró el botón close-form");
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}



