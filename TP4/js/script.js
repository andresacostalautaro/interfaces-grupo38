/* //TODO: 
    -ajustar mejor las velocidades del parallax para que no quede tan feo
    -arreglar el desplazamiento sticky de la seccion mas amigos mas diversion porque se rompio
    -preferentemente no tocar secciones que ya empece
*/
const sidebar = document.getElementById('sidebar');
document.getElementById('hamburger-menu').addEventListener('click', function() {
    this.classList.toggle('open');
    sidebar.classList.toggle('open');
});

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

    layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.1; // Velocidad variable según la profundidad
        const direction = index === 0 ? 1 : -1; // Foreground se mueve a la derecha, otras a la izquierda

        // Movimiento lateral
        layer.style.transform = `translateX(${scrollY * speed * direction}px)`;

        // Escalar los hijos de la capa
        const images = layer.querySelectorAll('img');
        images.forEach((image, i) => {
            const scaleValue = 1 + scrollY * 0.0001 * (3 - index); // Escalado proporcional
            image.style.transform = `scale(${scaleValue})`; // Aplica el scale a cada imagen
        });
    });
});

/* -------- logica para mostrar cards emergentes --------*/
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        ;
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.8 }); //threshold es el porcentaje visible del elemento que dispara el evento

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
        root: null, // Viewport como contenedor
        rootMargin: `-${headerHeight}px 0px 0px 0px`, // Considera el header
        threshold: 0.4, // Activa cuando el 40% de la sección es visible
    }
);

// Observa todas las secciones
sections.forEach((section) => observerStickySections.observe(section));







