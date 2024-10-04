// Menu Hamburgesa =>
var isMenuVisible = false;
document.getElementById('hamburger-menu').addEventListener('click', function(event) {
    event.stopPropagation(); // Evita que el clic se propague al documento
    isMenuVisible = !isMenuVisible;
    var headerNav = document.getElementById('header_nav');
    var icon = document.querySelector('#hamburger-menu img');

    if (isMenuVisible) {
        headerNav.classList.add('show-one');
        icon.src = "assets/png/hamburger-menu-2.png"; 

        setTimeout(function() {
            headerNav.classList.add('show-two'); // Muestra el nav después de la transición
        }, 700); 
    } else {
        // Primero se elimina 'show-two'
        setTimeout(function() {
            headerNav.classList.remove('show-two');
        }, 300);

        // Después de un timeout, se elimina 'show-one'
        setTimeout(function() {
            headerNav.classList.remove('show-one');
            icon.src = "assets/png/hamburger-menu-1.png"; 
        }, 300); // Cambié el timeout a 700ms para coincidir con la duración de las transiciones
    }
});

//Funcion para cerrar el nav =>
function closeMenu(){
    var headerNav = document.getElementById('header_nav');

        // Primero se elimina 'show-two'
        setTimeout(function() {
            headerNav.classList.remove('show-two');
        }, 300);

        // Después de un timeout, se elimina 'show-one'
        setTimeout(function() {
            headerNav.classList.remove('show-one');
            icon.src = "assets/png/hamburger-menu-1.png"; 
        }, 300); // Cambié el timeout a 700ms para coincidir con la duración de las transiciones
};

//Breadcrumbs =>
function setBreadcrumbs(palabra) {
    const bcsContent = document.getElementById("bcs_content");
    if (palabra.toLowerCase() === "home" || palabra.toLowerCase() === "login" || palabra.toLowerCase() === "sign up" || palabra.toLowerCase() === "log in") {
        bcsContent.innerHTML = `<h3>${palabra}</h3>`;
    } else {
        bcsContent.innerHTML = `
            <h3>Categoria</h3>
            <img src="assets/icons/breadcrums-greater-than.svg" alt=">" class="breadcrumbs_greaterthan_icon">
            <h3>${palabra}</h3>
        `;
    }
}

//Cambia breadcrums > home =>
document.getElementById("nav_category_icon_home").addEventListener("click", () => {
    setBreadcrumbs("Home");
});

//Cambia breadcrums > Category > #nav_icon =>
document.querySelectorAll('#nav_categories_list a').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Evita que el enlace realice su acción por defecto
        const categoryName = item.textContent; // Obtén el texto del enlace
        setBreadcrumbs(categoryName);
    });
});

//Formulario de Inicio de Sesion =>
document.getElementById('sign-in-button').addEventListener('click', function(event) {
    event.preventDefault();
    console.log("Botón clickeado, cargando formulario...");
    fetch('js/frames.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos del JSON:", data);
            
            // Limpiar contenido anterior
            const pageContent = document.getElementById('page_content');
            if (!pageContent) {
                console.error("No se encontró el contenedor 'page_content'");
                return;
            }

            pageContent.innerHTML = ''; // Limpiamos lo que pueda haber antes

            // Crear el formulario usando la información de JSON
            const formContainer = document.createElement('div');
            formContainer.innerHTML = data.sign_in.form; // Asumimos que en el JSON, form_log_in es HTML

            // Insertamos el formulario en el contenedor
            pageContent.appendChild(formContainer);
            setBreadcrumbs("log in");
            console.log("Formulario cargado");
        })
    .catch(error => console.error('Error fetching data:', error));
});

//Cargar formulario de Inicio de Sesion =>
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Verificar que los campos no estén vacíos
    if (email && password) {
        // Realizar una petición al archivo user.json
        fetch('js/users.json')  // Asegúrate de que el nombre sea correcto
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Buscar el usuario en la base de datos
                const user = data.find(user => user.email === email || user.username === email);

                if (user) {
                    // Verificar la contraseña del usuario
                    if (user.password === password) {  // Cambiado a HashPassword
                        // Llamar a la función que inicia la sesión
                        SesionInicieted(user);  // Asegúrate de que esta función esté definida
                        console.log('Login successful');
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
            .catch(error => console.error('Error fetching data:', error));

    } else {
        // Mostrar un mensaje si los campos están vacíos
        console.log('Please fill in all fields');
    }
});

//Iniciar Sesion
var isUserLog = false;
const USER = [ ];
function SesionInicieted(user) {
    chargeNavProfile(user);
    USER = user;
    changeCardShop(user);
}

//Funcion para cambiar el perfil de usuario en el Nav
function chargeNavProfile(user) {
    var header_nav = document.getElementById('nav_profile');
    header_nav = " ";
    header_nav.innerHTML = `
                <tr id="nav_profile">
                    <th><a><img id="user_photo_nav" class="user_photo_nav" src="${user.username}" alt="Foto del usuario"></a></th>
                    <td class="user-panel" colspan="2">
                      <h1>${user.username}</h1>
                      <div>
                        <h5 id="btn-MySession">Mi Sesion</h5>
                        <h5>|</h5>
                        <h5 id="btn-Sign-out">Cerrar Sesion</h5>
                      </div>
                    </td>
                </tr>`;
}
//Funcion para cambiar el perfil al Cerrar Sesion
function changeNavProfile() {
    var header_nav = document.getElementById('nav_profile');
    header_nav = " ";
    fetch('js/frames.json')
    .t
}

//Formulario de Registro =>
document.getElementById('sign-up-button').addEventListener('click', function(event) {
    event.preventDefault();
    console.log("Botón clickeado, cargando formulario...");
    fetch('js/frames.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos del JSON:", data);
            
            // Limpiar contenido anterior
            const pageContent = document.getElementById('page_content');
            if (!pageContent) {
                console.error("No se encontró el contenedor 'page_content'");
                return;
            }

            pageContent.innerHTML = ''; // Limpiamos lo que pueda haber antes

            // Crear el formulario usando la información de JSON
            const formContainer = document.createElement('div');
            formContainer.innerHTML = data.sign_up.form; // Asumimos que en el JSON, form_log_in es HTML

            // Insertamos el formulario en el contenedor
            pageContent.appendChild(formContainer);
            setBreadcrumbs("sign up");
            console.log("Formulario cargado");
        })
    .catch(error => console.error('Error fetching data:', error));
});

//Cargar formulario de Registro
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const name = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const username = document.getElementById('username').value.trim();
    const birthDate = document.getElementById('birth-date').value;
    const email = document.getElementById('email').value.trim();
    const password1 = document.getElementById('password-1').value.trim();
    const password2 = document.getElementById('password-2').value.trim();

    let isValid = true;

    // Validar si las contraseñas coinciden
    if (password1 !== password2) {
        document.getElementById('password-2').classList.add('input-warning');
        console.log('Las contraseñas no coinciden');
        isValid = false;
    }

    // Validar si el nombre de usuario es válido
    if (!validateUsername(username)) {
        document.getElementById('username').classList.add('input-warning');
        console.log('El nombre de usuario debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo');
        isValid = false;
    }

    // Validar si el usuario tiene más de 13 años
    if (validateAge(birthDate) < 13) {
        document.getElementById('birth-date').classList.add('input-warning');
        console.log('Debes ser mayor de 13 años para registrarte');
        isValid = false;
    }

    // Verificar si el email o el nombre de usuario ya existen en la base de datos
    if (isValid) {
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                const existingUser = data.users.find(user => user.username === username);
                const existingEmail = data.users.find(user => user.email === email);

                if (existingUser) {
                    document.getElementById('username').classList.add('input-warning');
                    console.log('El nombre de usuario ya está en uso');
                    isValid = false;
                }

                if (existingEmail) {
                    document.getElementById('email').classList.add('input-warning');
                    console.log('El correo electrónico ya está en uso');
                    isValid = false;
                }

                if (isValid) {
                    // Crear objeto de nuevo usuario
                    const newUser = {
                        name: name,
                        lastname: lastname,
                        username: username,
                        birthDate: birthDate,
                        email: email,
                        password: password1
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
});

//Validar si el usuario es 
function validateUsername(username) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(username);
}

// Función para validar si el usuario tiene más de 13 años
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