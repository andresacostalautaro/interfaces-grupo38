//Funcionalidad del Breadcrums, cambia a partir del String(palabra) dado ==>
function setBreadcrumbs(palabra) {
    const bcsContent = document.getElementById("bcs_content");
    if (palabra.toLowerCase() === "home" || palabra.toLowerCase() === "log in") {
        bcsContent.innerHTML = `<h3>${palabra}</h3>`;
    } else {
        bcsContent.innerHTML = `
            <h3>Category</h3>
            <img src="breadcrums-greater-than.svg" alt=">" class="breadcrumbs_greaterthan_icon">
            <h3>${palabra}</h3>
        `;
    }
}//Funcionalidad del Breadcrums <==

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