export function checkPasswordStrength() {
    const password1 = document.getElementById('password-1');

    
    const strengthIndicators = document.createElement('div');
    strengthIndicators.className = 'password-strength';
    strengthIndicators.innerHTML = `
        <p><span class="indicator" id="uppercase"><i class="fa-solid fa-circle-check"></i></span> Al menos una mayúscula</p>
        <p><span class="indicator" id="lowercase"><i class="fa-solid fa-circle-check"></i></span> Al menos una minúscula</p>
        <p><span class="indicator" id="number"><i class="fa-solid fa-circle-check"></i></span> Al menos un número</p>
        <p><span class="indicator" id="special"><i class="fa-solid fa-circle-check"></i></span> Al menos un carácter especial</p>
        <p><span class="indicator" id="length"><i class="fa-solid fa-circle-check"></i></span> Al menos 8 caracteres</p>
    `;
    password1.parentNode.insertBefore(strengthIndicators, password1.nextSibling);

    console.log('password1',password1);
    
    password1.addEventListener('input', () => updatePasswordStrength(password1)); // Corrección: Usar función anónima para pasar la referencia correctamente

} 

function updatePasswordStrength(password1) {
    const password = password1.value;
    console.log('current password',password)
    const checks = {
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        length: password.length >= 8
    };

    for (let check in checks) {
        console.log('checks, check',checks,check);
        console.log('check',check);
        const indicator = document.getElementById(check);
        if (checks[check]) {
            indicator.style.color = 'green';
        } else {
            indicator.style.color = 'grey';
        }
    }
}


export async function signIn() {
  try {
    //es una maqueta, no necesitamos chequear que el usuario exista
    //como ya desde el front se chequea que el email y password no esten vacios, no es necesario chequear aca
    showSuccessMessage('Inicio de Sesion exitoso').then(() => {
      const event = new CustomEvent('signUpSuccess');
      document.dispatchEvent(event);
    });

  } catch (error) {
    console.error('Error during sign in:', error);
    updateUI('error', 'An error occurred during sign in');
    return false;
  }
}

export async function signUp(userData) {
  const ageError = document.getElementById('age-error');
  try {

    if (userData.age < 13) {
      ageError.textContent = 'Lo sentimos, debes tener al menos 13 años para registrarte.';
      ageError.style.color = 'red';
      return false;
    }

    if (!checkPassword(userData)) {
      updateUI('validateSignUp', 'Las contraseñas no coinciden');
      return false;
    }

    //si las validaciones pasaron, muestro el mensaje de exito y despacho el evento
    showSuccessMessage('Registro exitoso').then(() => { 
      const event = new CustomEvent('signUpSuccess');
      document.dispatchEvent(event);
    });

    return true;

  } catch (error) {
    updateUI('error', 'Ocurrio un error al registrarse');
    return false;
  }
}

function checkPassword(userData) {
  const { password1, password2 } = userData;
  return password1 === password2;
}

function showSuccessMessage(action) {  
  console.log(action);
  const successMessage = document.getElementById('successMessage');
  const successMessageText = document.querySelector('.message');
  successMessageText.innerText = action;

  const form = document.querySelector('.form-container');
  
  form.classList.add('success');

  successMessage.classList.add('show');
  successMessage.setAttribute('aria-hidden', 'false');
  
  successMessage.focus();
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();  
    }, 1400);
  });
} 

// ui.js
export function updateUI(action, data) {
  switch (action) {
    case 'signedIn':
      console.log(`logueado como ${data.username}`);
      showSuccessMessage('Inicio de Sesion exitoso');
      break;
    case 'signUpSuccess':
      console.log('User registered successfully');
      showSuccessMessage('Registro exitoso');
      break;
    case 'error':
      console.error('Error:', data);
      break;
    default:
      console.log('Unknown UI update action:', action);
  }
}

console.log('Auth module loaded');