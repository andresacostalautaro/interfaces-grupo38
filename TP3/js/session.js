import { initSignInForm, initSignUpForm } from './authForms.js';

export class Session {
    constructor(username) {
        this.currentUser = username; // Usuario logueado
    }


    login(user) {
        this.currentUser = user;
        console.log(`Usuario ${user.username} logueado con éxito.`);
    }

   
    logout() {
        console.log(`Usuario ${this.currentUser?.username || "ninguno"} ha cerrado sesión.`);
        this.currentUser = null;
    }

    
    get user() {
        return this.currentUser;
    }

    
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

export function updateAuthUI(session) {
    console.log('Actualizando UI de autenticación...', session);
    const authContainer = document.querySelector('.sidebar-top');
    const username = session.user;

    if (username) {
        authContainer.innerHTML = `
            <div class="user-profile">
                <img class="user-avatar" src="./assets/images/user-icon.png" alt="User">
                <div class="user-info">
                    <div class="user-name">${username}</div>
                    <div class="user-actions">
                        <button type="button" class="user-action-btn" id="profileBtn">Mi perfil</button>
                        <div class="separator"></div>
                        <button type="button" class="user-action-btn" id="logoutBtn">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click',  () => {
            session.logout();
            updateAuthUI(session);
        });

    } else {
        authContainer.innerHTML = `
            <div class="auth-buttons">
                <button type="button" class="auth-btn login-btn" id="loginBtn">Iniciar Sesión</button>
                <button type="button" class="auth-btn register-btn" id="registerBtn">Registrarse</button>
            </div>
        `;
        document.getElementById('loginBtn').addEventListener('click', function(event) {
            event.preventDefault();
            initSignInForm(session);
        });
        
        document.getElementById('registerBtn').addEventListener('click', function(event) {
            event.preventDefault();
            initSignUpForm(session);
        });
    }
}