import { iniciatedSesion } from "./main.js";

let USER = null;
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

                    USER = user;
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
    .catch(error => console.log('Error fetching user.json:', error));
}
window.submitSignInForm = submitSignInForm;

export function getUser () {
    return USER;
}
window.getUser = getUser;