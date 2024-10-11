import { iniciatedSesion } from "./main.js";

let USER = {
    username: null,
    email: null,
    cardshop: []
};

//funcion para submit el boton del formulario de inicio de sesion
export function submitSignInForm(email, password) { 
    fetch('data/users.json')
        .then(response => response.json())
        .then(data => {
            console.log("users.json fetched");
            document.getElementById('email').classList.remove('input-warning');
            document.getElementById('password').classList.remove('input-warning');

            // Buscar el usuario en la base de datos
            const user = data.find(user => user.email === email || user.username === email);

            if (user) {
                // Verificar la contraseña del usuario
                if (user.password === password) {
                    console.log('Login successful');

                    USER.username = user.username;
                    USER.email = user.email;
                    USER.cardshop = user.history ? user.history.cardshop : []; // Verificar si history existe

                    iniciatedSesion();
                } else {
                    // Si la contraseña es incorrecta, mostrar advertencia en el campo de contraseña
                    document.getElementById('password').classList.add('input-warning');
                    console.log('Incorrect password');
                }
            } else {
                // Si no se encuentra el usuario, mostrar advertencia en el campo de email
                document.getElementById('email').classList.add('input-warning');
                console.log('User not found');
            }
        })
        .catch(error => console.log('Error fetching users.json:', error));
}

//funcion para traer el usuario
export function getUser() {
    return USER; // Retorna el usuario actualmente autenticado
}

//funcion para cambiar el perfil del usuario en el header_nav
let which = false;
export function updateProfile() {
    which = !which;

    getProfile();
}

//funcion para traer el perfil del usuario en el nav, ya sea en estado conectado o desconectado
export function getProfile() {

    let profile = document.getElementById('user_nav_content');
    if(which && USER.username) {
        console.log("profile del nav habierto");
        profile.innerHTML = `
        <tr>
            <th>
                <a>
                    <img id="user_photo_nav" class="user_photo_nav" src="assets/images/profile_connect.png" alt="Foto del usuario">
                </a>
            </th>
            <td class="user-panel" colspan="2">
                <h1>${USER.username}</h1>
                <div>
                    <h5 id="btn-MySession">Mi Sesion</h5>
                    <h5>|</h5>
                    <h5 id="btn-Sign-out">Cerrar Sesion</h5>
                </div>
            </td>
        </tr>
    `;
    } else {
        console.log("profile del nav cerrado");
        profile.innerHTML = `
                <tr>
		            <th><a><img id="user_photo_nav" class="user_photo_nav" src="assets/images/profile_disconect.png" alt="Foto del usuario"></a></th>
                    <td class="user-panel" colspan="2">
                        <h4 class="button" id="sign-in">Iniciar Sesion</h4>
                        <h4 class="button" id="sign-up">Registrarse</h4>
                    </td>
                </tr>
        `;
    }
}