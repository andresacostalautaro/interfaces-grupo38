// Funcionalidad del header y su nav ==>

let isMenuVisible = false; //la barra de navegacion se inicia cerrada

document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);//click boton hamburgesa
document.addEventListener('click', closeMenus); //click cerrar la barra de navegacion


function toggleMenu(event) {//abrir la barra de navegacion
    //El boton hamburgesa cierra o abre la barra de navegacion:

    event.stopPropagation(); // Evitar que marcas no funcionales en el DOM produzcan eventos (no targest de eventos)
    isMenuVisible = !isMenuVisible;// cambiar el estado del menu de navegacion (cerrar o abrir)
    const headerNav = document.getElementById('header_nav'); //referencia de barra de navegacion en el DOM
    const icon = document.querySelector('#hamburger-menu img');//referencia deL boton hamburgesa en el DOM

    // Alterna la visibilidad del menú
    if (isMenuVisible) {//si se ordeno que se abra es true
        headerNav.classList.add('show');//animagion de despliegue o colapso
        icon.src = "assets/png/hamburger-menu-2.png"; // nav abierto
    } else {
        headerNav.classList.remove('show');
        icon.src = "assets/png/hamburger-menu-1.png"; // nav cerrado
    }
}

function closeMenus() {
    if (isMenuVisible) {
        isMenuVisible = false;
        const headerNav = document.getElementById('header_nav');
        const icon = document.querySelector('#hamburger-menu img');
        headerNav.classList.remove('show');
        icon.src = "assets/png/hamburger-menu-1.png"; // Cambia el ícono al de menú cerrado
    }
}
// <== Funcionalidad del header y su nav

// Funcionalidad del Breadcrumbs, cambia a partir del String(palabra) dado ==>
document.getElementById("nav_category_icon_home").addEventListener("click", () => {
    setBreadcrumbs("Home");
});

document.querySelectorAll('#nav_categories_list a').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que el enlace realice su acción por defecto
        const categoryName = item.textContent; // Obtén el texto del enlace
        setBreadcrumbs(categoryName);
    });
});

function setBreadcrumbs(palabra) {
    const bcsContent = document.getElementById("bcs_content");
    if (palabra.toLowerCase() === "home" || palabra.toLowerCase() === "login") {
        bcsContent.innerHTML = `<h3>${palabra}</h3>`;
    } else {
        bcsContent.innerHTML = `
            <h3>Categoria</h3>
            <img src="assets/icons/breadcrums-greater-than.svg" alt=">" class="breadcrumbs_greaterthan_icon">
            <h3>${palabra}</h3>
        `;
    }
    closeMenus();
}
// <== Funcionalidad del Breadcrumbs


// Funcionalidad del formulario Log In - frame("form_LogIn") ==>

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;

    if (email && password) {
        // Aquí puedes agregar la lógica para autenticar el usuario
        console.log('Login successful with', email);
    } else {
        console.log('Please fill in all fields');
    }
});
document.querySelector('.google-button').addEventListener('click', function() {
    // Aquí puedes añadir la funcionalidad de Google Sign-In
    console.log('Google Sign-In');
});
document.querySelector('.facebook-button').addEventListener('click', function() {
    // Aquí puedes añadir la funcionalidad de Facebook Sign-In
    console.log('Facebook Sign-In');
});
function handleCredentialResponse(response) {
    decodeJwtResponse(response.credential);
}
function decodeJwtResponse(data) {
    console.log(parseJwt(data));
}
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
        .atob(base64)
        .split("")
        .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
}

// <== Funcionalidad del formulario Log In - frame("form_LogIn")
