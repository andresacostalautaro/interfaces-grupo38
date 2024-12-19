import { signIn, signUp, checkPasswordStrength } from './userSystem.js';
import { showForm } from './loaders.js';
import { setBreadcrumbs } from './breadcrumbs.js';


/*cargo el html del form y asigno los eventos */
export function initSignInForm(session){
    showForm('signin').then(() => {
        setBreadcrumbs("Inicio de sesión");

        const signUpForm = document.getElementById('sign-up'); //anchor que lleva al otro form
        const submitForm = document.getElementById('login-form'); //boton de submit

        submitForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById("email").value;
            const emailUsername = email.split("@")[0]; // me quedo nomas con la parte antes del @
            session.login(emailUsername); //como no tenemos db para buscar el usuario, usamos el email como username
            signIn();
        });

        signUpForm.addEventListener('click', initSignUpForm);
    });
}

export function initSignUpForm(session){
    showForm('signup').then(() => {
        setBreadcrumbs("Registro");
        checkPasswordStrength();
        const signInForm = document.getElementById('sign-in'); //anchor que lleva al otro form
        const submitForm = document.getElementById('logUp-form'); //boton de submit


        submitForm.addEventListener('submit',function(event) {
            event.preventDefault();  // Evitar el comportamiento por defecto de envío del formulario
            
            // Recoger los valores de los campos del formulario
            const userData = {
              firstname: document.getElementById("firstname").value,
              lastname: document.getElementById("lastname").value,
              username: document.getElementById("username").value,
              birthDate: document.getElementById("birth-date").value,
              email: document.getElementById("email").value,
              password1: document.getElementById("password-1").value,
              password2: document.getElementById("password-2").value
            };

            session.login(userData.username); //aca si, como tengo el username, lo uso para loguear al usuario
          
            // Llamar a la función signUp con los datos del usuario
            signUp(userData);
        });
        signInForm.addEventListener('click', initSignInForm);
    });
}
