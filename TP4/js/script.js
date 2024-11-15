document.getElementById('hamburger-menu').addEventListener('click', function() {
    this.classList.toggle('open');
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


// muestro los primeros elementos
images[0].classList.add('active');
sections[0].classList.add('active');

// esta funcion es la que le paso al evento scroll para ver si la imagen esta en el viewport
const checkSections = () => {
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach((section, index) => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom && sectionTop > -section.offsetHeight) {
            console.log('seccion', index, 'visible');
            // oculto todas las imagenes

            images.forEach(img => img.classList.remove('active'));
            // nomas muestro la imagen que corresponde a la seccion actual
            images[index].classList.add('active');

            console.log('imagen actual', images[index]);
            sections.forEach(section => section.classList.remove('active'));
            sections[index].classList.add('active');
        }
    });
};

//FALTA QUE SEA MAS ANIMADO Y SUAVE LA TRANSICION DEL TEXTO Y LA IMAGEN AL APARECER
//todo:  podria usar el observer asi no se pasa constantemente por el if


window.addEventListener('scroll', checkSections);
// verificar al cargar la página
checkSections();