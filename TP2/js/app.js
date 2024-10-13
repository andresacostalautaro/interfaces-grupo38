
// IDEA al detectar un cambio de dimensiones en la ventana, 
// se debe recalcular el ancho de los elementos del carrusel e ir a la coordenada 0


//esto puede ir en el factory
function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader-capa';
    loader.innerHTML = `
            <div class="loader-circle"></div>
            <div class="loader-percentage">0%</div>
    `;
    return loader;
}

function simulateLoading(duration) {

    return new Promise(resolve => {
        const loaderPercentage = document.querySelector('.loader-percentage');
        const startTime = Date.now();

        //esta funcion se va a llamar recursivamente hasta que se cumpla la condicion
        function updateLoader() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const percentage = Math.round(progress * 100);

            loaderPercentage.textContent = `${percentage}%`;

            if (progress < 1) {
                //mientras progress < 1 se va a llamar recursivamente a updateLoader
                requestAnimationFrame(updateLoader); 
            } else {
                // resolve se va a retornar cuando progress sea igual a 1. Es como un anuncio de que termino la carga
                resolve(); 
            }
        }

        requestAnimationFrame(updateLoader);
    });
}