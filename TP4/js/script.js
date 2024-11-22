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
sections.forEach((section) => observerStickySections.observe(section));

