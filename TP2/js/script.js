// Funcionalidad del header y su nav ==>
    let isMenuVisible = false;

document.getElementById('hamburger-menu').addEventListener('click', toggleBurgerMenu);
document.addEventListener('click', closeMenus);

function closeMenus(event) {
    const container = document.getElementById('header_nav');
    const hamburgerButton = document.getElementById('hamburger-menu');

    // Verifica si el clic fue fuera del menú y del botón
    if (!container.contains(event.target) && !hamburgerButton.contains(event.target)) {
        container.classList.add('hidden');
        isMenuVisible = false;
    }
}
function toggleBurgerMenu() {
    const menu = document.getElementById('header_nav');
    if (isMenuVisible) {
        menu.classList.add('hidden');
        isMenuVisible = false;
    } else {
        menu.classList.remove('hidden');
        isMenuVisible = true;
    }
} // Funcionalidad del header y su nav <==

// Funcionalidad del Breadcrumbs, cambia a partir del String(palabra) dado
document.getElementById("nav_category_icon_home").addEventListener("click", () => {
    setBreadcrumbs("Home");
    closeHeaderNav(); // Cierra el menú después de establecer "Home"
});

document.querySelectorAll('#nav_categories_list a').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que el enlace realice su acción por defecto
        const categoryName = item.textContent; // Obtén el texto del enlace
        setBreadcrumbs(categoryName);
        
        // Cierra el menú después de seleccionar la categoría
        const menu = document.getElementById('header_nav');
        menu.classList.add('hidden'); // Oculta el menú
        isMenuVisible = false; // Cierra el menú después de seleccionar la categoría
    });
});

function setBreadcrumbs(palabra) {
    const bcsContent = document.getElementById("bcs_content");
    if (palabra.toLowerCase() === "home" || palabra.toLowerCase() === "logIn") {
        bcsContent.innerHTML = `<h3>${palabra}</h3>`;
    } else {
        bcsContent.innerHTML = `
            <h3>Categoria</h3>
            <img src="assets/icons/breadcrums-greater-than.svg" alt=">" class="breadcrumbs_greaterthan_icon">
            <h3>${palabra}</h3>
        `;
    }
}// Funcionalidad del Breadcrumbs <==

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
