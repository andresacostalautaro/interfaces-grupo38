export class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        
        // this.image = new Image();
        // Asignar las rutas de acuerdo con el nombre del jugador
        this.avatarImg = new Image();
        this.avatarImg.src = `./assets/player-avatars/${name.toLowerCase()}.jpg`;
        this.tokenImg = new Image();
        this.tokenImg.src = `./assets/player-tokens/${name.toLowerCase()}.svg`;
        this.isActive = true;
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