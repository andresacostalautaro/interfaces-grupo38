import { iniciatedSesion} from "./main.js";

let USER = {
    username: null,
    email: null,
    cart: []
};

//funcion para submit el boton del formulario de inicio de sesion
export function submitSignInForm(email, password) {
    console.log("boton submit form ejecutado pra iniciar sesion.");

    // Verificar que los campos no estén vacíos
    if (email && password) {
        fetch('data/users.json')
        .then(response => response.json())
        .then(data => {

            console.log("users.json fetch.");
            document.getElementById('email').classList.remove('input-warning');
            document.getElementById('password').classList.remove('input-warning');

            // Buscar el usuario en la base de datos
            const user = data.find(user => user.email === email || user.username === email);

            if (user) {
                // Verificar la contraseña del usuario
                if (user.password === password) {

                    USER.username = user.username;
                    USER.email = user.email;
                    USER.cart = user.history ? user.history.cart : []; // Verificar si history existe
                    console.log(USER.cart[0]);

                    console.log("contraseña correcta.");

                    iniciatedSesion();
                } else {
                    // Si la contraseña es incorrecta, mostrar advertencia en el campo de contraseña
                    document.getElementById('password').classList.add('input-warning');
                    console.log('contraseña incorrecta.');
                }
            } else {
                // Si no se encuentra el usuario, mostrar advertencia en el campo de email
                document.getElementById('email').classList.add('input-warning');
                console.log('User not found');
            }
        })
        .catch(error => console.log('Error fetching users.json:', error));
    } else {
        document.getElementById('email').classList.add('input-warning');
        document.getElementById('password').classList.add('input-warning');
        // Mostrar un mensaje si los campos están vacíos
        console.log('llenar todos los campos del formulario.');
    }
}

export function submitSignUpForm(name, lastname, username, birth, email, password1, password2) {
    let threeValid = 0;

    // Validar si las contraseñas coinciden
    if (password1 !== password2) {
        document.getElementById('password-2').classList.add('input-warning');
        console.log('Las contraseñas no coinciden');
    } else {
        threeValid++;
    }

    // Validar si el nombre de usuario es válido
    if (!validateUsername(username)) {
        document.getElementById('username').classList.add('input-warning');
        console.log('El nombre de usuario debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo');
    } else {
        threeValid++;
    }

    // Validar si el usuario tiene más de 13 años
    if (validateAge(birthDate) < 13) {
        document.getElementById('birth-date').classList.add('input-warning');
        console.log('Debes ser mayor de 13 años para registrarte');
    } else {
        threeValid++;
    }

    // Verificar si el email o el nombre de usuario ya existen en la base de datos
    if (threeValid === 3) {
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                const existingUser = data.users.find(user => user.username === username);
                const existingEmail = data.users.find(user => user.email === email);

                if (existingUser) {
                    document.getElementById('username').classList.add('input-warning');
                    console.log('El nombre de usuario ya está en uso');
                } else {
                    threeValid++;
                }

                if (existingEmail) {
                    document.getElementById('email').classList.add('input-warning');
                    console.log('El correo electrónico ya está en uso');
                } else {
                    threeValid++;
                }

                if (threeValid === 5) {
                    console.log("registro aprobado");
                    newId = data.length;
                    // Crear objeto de nuevo usuario
                    const newUser = {
                        id: newId,
                        username: username,
                        email: email,
                        password: password1,
                        name: name,
                        lastname: lastname,
                        birthDate: birth,
                        avatar: ["assets/images/0-avatar00.jpg"],
                        history: {
                            cart: []
                        }
                    };

                    // Agregar nuevo usuario a users.json
                    data.users.push(newUser);

                    fetch('users.json', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(() => console.log('Usuario registrado correctamente'))
                    .catch(error => console.error('Error al registrar el usuario:', error));
                }
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }
}
function validateUsername(username) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(username);
}
function validateAge(birthDate) {
    const currentDate = new Date();
    const birth = new Date(birthDate);
    const age = currentDate.getFullYear() - birth.getFullYear();
    const month = currentDate.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birth.getDate())) {
        return age - 1;
    }
    return age;
}

//funcion para traer el usuario
export function getUser() {
    return USER; // Retorna el usuario actualmente autenticado
}

//funcion para cambiar el perfil del usuario en el header_nav
let which = false;
export function updateNav() {
    console.log("actualizando nav.");
    which = !which;
    fixedNav();
}

//funcion para traer el perfil del usuario en el nav, ya sea en estado conectado o desconectado
export function fixedNav() {
    // Actualiza el contenido del perfil del usuario
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
                        <h5 style=" width: fit-content !important;">|</h5>
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

export function getUserCart() {
    
    if (USER.cart && USER.cart.length > 0) {
        let id_array = new Array(USER.cart.length);

        // Llenar el id_array con los IDs de los juegos en el carrito
        for (let i = 0; i < USER.cart.length; i++) {
            id_array[i] = USER.cart[i].id;
        }

        let cart = document.getElementById('cart-items');
        
        // Fetch al archivo JSON
        fetch('data/gamesByCategory.json')
            .then(response => response.json())
            .then(data => {
                console.log("buscando los juegos del carrito en gamesByCategory.json.");
                
                // Recorrer el array de IDs del carrito
                id_array.forEach(id => {

                    // Recorrer las categorías en el JSON
                    data.forEach(category => {
                        // Buscar el juego en la categoría
                        const game = category.games.find(game => game.id === id);

                        if (game) {
                            const item = ' ';
                            // Crear el elemento li
                            item.innerHTML = `
                                            <li>
                                                <img src="${game.image}" alt="${game.title}">
                                                <h4>${game.price}</h4>
                                                <h2>${game.title}</h2>
                                            </li>`;
                            cart.appendChild(li);
                        }
                    });
                });
            })
            .catch(error => console.error('Error fetching gamesByCategory.json:', error));
    } else {
        console.log('El carrito de compras está vacío');
    }
}
