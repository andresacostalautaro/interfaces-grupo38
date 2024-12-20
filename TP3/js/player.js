export class Player {
    constructor(id, name, side) {
        this.id = id;
        this.name = name;
        this.token = this.name.toLowerCase();
        this.avatarImg = new Image();
        this.tokenImg = new Image();
        this.isActive = true;
        this.side = side;

        this.updateToken(this.token); // Inicializa con el token inicial
    }

    updateToken(newToken) {
        this.token = newToken;
        this.avatarImg.src = `./assets/player-avatars/${this.token}.jpg`;
        this.tokenImg.src = `./assets/player-tokens/${this.token}.svg`;

        // Verifica si el token contiene "Alt"
        if (this.token.includes("Alt")) {
            this.applyAltStyles();
        } else {
            this.resetStyles();
        }
    }

    applyAltStyles() {
        // Aplica filtros CSS directamente a las imágenes
        this.avatarImg.style.filter = "hue-rotate(180deg) brightness(0.8)";
        this.tokenImg.style.filter = "hue-rotate(180deg) brightness(0.8)";
    }

    resetStyles() {
        // Elimina cualquier filtro previamente aplicado
        this.avatarImg.style.filter = "";
        this.tokenImg.style.filter = "";
    }

    loadImage(src) {
        this.image.src = src;
        return new Promise((resolve, reject) => {
            this.image.onload = resolve;
            this.image.onerror = reject;
        });
    }

    getTokenImage(){
        return this.tokenImg;
    }

    getName(){
        return this.name;
    }

    isActive(){
        return this.isActive;
    }

    setActive(){
        this.isActive = !this.isActive;
    }
}