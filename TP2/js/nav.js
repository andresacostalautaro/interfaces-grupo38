import { updateAuthUI } from './session.js';

export function displaySidebar(session) {
    console.log('Cargando barra lateral...', session);
    const menuToggle = document.getElementById('hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const navSection = document.querySelector('.nav-section');
    const socialFooter = document.getElementById('socialFooter');

    // Manejo el toggle del menú
    menuToggle.addEventListener('click', (event) => {
        event.preventDefault(); 
        sidebar.classList.toggle('collapsed');

        // Cambiar la imagen del hijo de `menuToggle`
        const menuIcon = menuToggle.querySelector('img'); 
        if (sidebar.classList.contains('collapsed')) {
            menuIcon.src = 'assets/images/hamburger-menu-1.png';
        } else {
            menuIcon.src = 'assets/images/hamburger-menu-2.png';
        }
    });

    console.log('Cargando barra lateral antes...', session);
    // Acá agrego evento al evento cerrar sesión
    updateAuthUI(session);

    // Manejo la vista de los social media en el footer
    function checkScroll() {
        const isAtBottom = navSection.scrollHeight - navSection.scrollTop <= navSection.clientHeight + 1;
        socialFooter.classList.toggle('visible', isAtBottom);
    }

    navSection.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    checkScroll();
}