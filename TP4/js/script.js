/*
    logica para la pantalla de carga
*/

window.onload = () => {
    showLoader();
    initializeObserver(); // Inicia el IntersectionObserver después de la pantalla de carga
};

// Bloquea el scroll
function disableScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth; // Calcula el ancho de la barra de desplazamiento
    document.body.style.paddingRight = `${scrollbarWidth}px`; // Añade el espacio para compensar la barra de desplazamiento
    document.body.style.background = 'linear-gradient(to bottom, #c2e9fb, #a1c4fd)'; // Fondo de la pantalla de carga
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

// Desbloquea el scroll
function enableScroll() {
    document.body.style.paddingRight = ''; // Elimina el padding cuando se desbloquea el scroll
    document.body.style.background = ''; // Restaura el fondo original
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

// Muestra el loader y bloquea el scroll
function showLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
    disableScroll();
    simulateLoading();
}

// Oculta el loader y habilita el scroll
function hideLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = 0;
    loadingScreen.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        enableScroll();
    }, 500);
}

// Simula el progreso de la barra de carga
function simulateLoading() {
    const progressBar = document.querySelector('.loading-progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10; // Incrementa el progreso
        progressBar.style.width = progress + '%'; // Actualiza la barra de progreso

        if (progress >= 100) {
            clearInterval(interval); // Detiene el intervalo al llegar al 100%
            setTimeout(hideLoader, 500); // Esconde el loader al completar
        }
    }, 300); // Incrementa cada 300ms
}

// Generar partículas mágicas
const particlesContainer = document.getElementById('particles-container');
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '100%';
    particle.style.animationDuration = Math.random() * 2 + 3 + 's';
    particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), 5000); // Eliminar después de la animación
}

setInterval(createParticle, 200); // Crear partículas cada 200ms

// FIN CODIGO PANTALLA DE CARGA

const sidebar = document.getElementById('sidebar');

/*
    evento click para el boton hamburguesa
*/
document.getElementById('hamburger-menu').addEventListener('click', function() {
    this.classList.toggle('open');
    sidebar.classList.toggle('open');
});



/* 
    evento scroll para que una vez que se haga scroll se muestre el header
    y se achiquen los elementos del header
*/
updateStickyHeader = () => {
    let header = document.getElementById('header');
    
    if (window.scrollY > 0) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateStickyHeader);
});



/* -------- logica para efecto parallax en el hero  */
document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const layers = document.querySelectorAll('.layer');

    //velocidades para cada tipo de capa
    const layerSpeeds = {
        background: 0.1,  
        midground: 0.2,   
        foreground: 0.3,  
        
    };

    layers.forEach((layer) => {
        
        let speed = 0.1;  // Valor por defecto
        if (layer.classList.contains('midground')) {
            speed = layerSpeeds.midground;
        } else if (layer.classList.contains('foreground')) {
            speed = layerSpeeds.foreground;
        }

        // si tiene clase 'right', va a la derecha
        const direction = layer.classList.contains('right') ? 1 : -1;

        // movimiento lateral según la velocidad y dirección
        layer.style.transform = `translateX(${scrollY * speed * direction}px)`;
    });

    const characters = document.querySelectorAll('.characters');
    characters.forEach((character) => {
        const scaleValue = 1 + scrollY * 0.0008; 

        character.style.transform = `translateY(${scrollY * -0.5}px) scale(${scaleValue}`;
    });


    const logo = document.querySelector('.logo img');
    const header = document.getElementById('header'); 
    const headerLogo = header.querySelector('.header-logo'); 

    // rect trae la informacion de la posicion y tamaño de un elemento
    const logoRect = logo.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();

    // alturas del logo y header
    const logoHeight = logoRect.height;
    const headerHeight = headerRect.height;

    // calculo cuanto del logo está detrás del header
    const overlap = headerRect.bottom - logoRect.top;
    const overlapPercentage = Math.min(overlap / logoHeight, 1); // porcentaje de superposición
    
    // logo grande se desliza hacia arriba
    const scaleValue = Math.max(1 - scrollY * 0.001, 0.5); // entre 1 y 0.5
    logo.style.transform = `translateY(${scrollY * -0.5}px) scale(${scaleValue})`;

    // desde css inicie el logo desplazado hacia abajo
    if (headerLogo) {
        const headerTranslate = overlapPercentage * headerHeight;
        headerLogo.style.transform = `translateY(${headerHeight - headerTranslate}px)`;

        // Solo cambia la opacidad cuando el logo grande paso 0.79 por debajo del header
        if (overlapPercentage > 0.79) {
            headerLogo.style.opacity = overlapPercentage;
        } else {
            headerLogo.style.opacity = 0; // si el logo grande aun esta visible en gran parte entonces sigo escondiendo el logo chiquito del header
        }
    }
});

/* logica para seccion la app mas divertida... */

const numberBlock4 = document.querySelector('.numberBlock4');
const numberBlock5 = document.querySelector('.numberBlock5');
const infoApp = document.querySelector('.info-app');
const thumbnail = document.querySelector('.thumbnail');

// Evento de scroll para detectar la posición del scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;  // Obtiene el desplazamiento vertical actual del scroll

    // Movimiento de los muñequitos
    numberBlock4.style.transform = `translateY(${scrollY * 0.15}px)`; // Movimiento moderado
    numberBlock5.style.transform = `translateY(${scrollY * 0.15}px)`; 

    // Movimiento del texto y fotos
    infoApp.style.transform = `translateY(${scrollY * 0.1}px)`; 
    thumbnail.style.transform = `translateY(${scrollY * 0.05}px)`;  // Movimiento muy sutil
});



/* -------- logica para mostrar cards emergentes --------*/
/*
    Selecciona todas las cards
    y crea un nuevo IntersectionObserver
    que se encarga de detectar cuando una card
    está visible en el viewport
    Si esta visible, se le agrega la clase 'animate'
    que muestra la card con una animación.
    Si no, se le quita la clase.
*/
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }else{
            entry.target.classList.remove('animate');
        }
    });
}, { threshold: [0, 0.8] }); //threshold es el porcentaje visible del elemento que dispara el evento

cards.forEach(card => observer.observe(card));



/* -------- logica para mover la imagen en direccion contraria al mouse --------*/
const characterImage = document.querySelector('.numberBlocks');

function handleMouseMove (e){
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    

    /* si el mouse esta muy a la derecha la resta va a dar muy negativo y al multip por - va a dar positivo */ 
    const moveX = (clientX - innerWidth / 2) / innerWidth * - 20;
    const moveY = (clientY - innerHeight / 2) / innerHeight * - 20;
    

    characterImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

document.addEventListener('mousemove', handleMouseMove);


/* ---------- logica para la seccion de "mas amigos, mas diversion" ---------- */
/*
    aca el observer va a detectar que seccion esta visible en el viewport
    y va a cambiar la clase 'active' a la seccion que esta visible
*/
const sections = document.querySelectorAll('.char-info');
const images = document.querySelectorAll('.character-img');
const headerHeight = document.querySelector('header')?.offsetHeight || 0;
const stickyColumn = document.querySelector('.sticky-column');

let currentIndex = 0;
const observerStickySections = new IntersectionObserver(
    (entries) => { 
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);

                // Actualiza las clases activas solo si cambia la sección
                if (currentIndex !== index) {
                    sections[currentIndex].classList.remove('active');
                    images[currentIndex].classList.remove('active');

                    sections[index].classList.add('active');
                    images[index].classList.add('active');

                    currentIndex = index;
                }
            }
        });
    },
    {
        root: null, 
        rootMargin: `-${headerHeight}px 0px 0px 0px`, // Considera el header
        threshold: 0.4, // Activa cuando el 40% de la sección es visible
    }
);

// Observa todas las secciones
//sections.forEach((section) => observerStickySections.observe(section));

function initializeObserver() {
    sections.forEach((section) => observerStickySections.observe(section));
}