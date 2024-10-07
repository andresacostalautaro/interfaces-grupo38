// Function to populate carousel with game data
function loadAllGames() {
    fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
        console.log("cargando juegos...");

        const carousel = document.querySelector('.carousel');

        date.forEach(date => {
            const gameItem = document.createElement('li');
            gameItem.classList.add('carousel-item');
            gameItem.innerHTML = `<img src="${date.caps[0]}" alt="${date.title}">`;
            carousel.appendChild(gameItem);
        });

    })
    .catch(error => console.error('Error fetching breadcrums:', error));
}


let currentSlide = 0;
function moveSlide(direction) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Update current slide index
    currentSlide += direction;

    // Infinite looping logic
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    // Move carousel by percentage
    const carousel = document.querySelector('.carousel');
    carousel.style.transform = `translateX(-${(currentSlide * 100) / 4}%)`; // 4 items shown at a time
}

// Automatically move to the next slide every 5 seconds
setInterval(() => moveSlide(1), 5000);