// Funcionalidad del header y su nav ==>
    let isMenuVisible = false;

document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);
document.addEventListener('click', closeMenus);

function toggleMenu(event) {
    event.stopPropagation(); // Evita que el clic en el botón cierre el menú inmediatamente
    isMenuVisible = !isMenuVisible;
    const headerNav = document.getElementById('header_nav');
    const icon = document.querySelector('#hamburger-menu img');

    // Alterna la visibilidad del menú
    if (isMenuVisible) {
        headerNav.classList.add('show');
        icon.src = "assets/png/hamburger-menu-2.png"; // Nueva imagen al abrir
    } else {
        headerNav.classList.remove('show');
        icon.src = "assets/png/hamburger-menu-1.png"; // Volver a la imagen original
    }
}

function closeMenus(event) {
    const headerNav = document.getElementById('header_nav');
    const hamburgerButton = document.getElementById('hamburger-menu');

    // Verifica si el clic es fuera del header_nav y del botón de hamburguesa
    if (isMenuVisible && !headerNav.contains(event.target) && !hamburgerButton.contains(event.target)) {
        isMenuVisible = false;
        headerNav.classList.remove('show');
        const icon = document.querySelector('#hamburger-menu img');
        icon.src = "assets/png/hamburger-menu-1.png";
    }
}// Funcionalidad del header y su nav <==

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

    // Cierra el menú después de establecer las migas de pan
    isMenuVisible = false; // Actualiza el estado
    const headerNav = document.getElementById('header_nav');
    headerNav.classList.remove('show');
    const icon = document.querySelector('#hamburger-menu img');
    icon.src = "assets/png/hamburger-menu-1.png"; // Vuelve a la imagen original
}
// Funcionalidad del Breadcrumbs <==

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
}// Funcionalidad del formulario Log In - frame("form_LogIn") <==
