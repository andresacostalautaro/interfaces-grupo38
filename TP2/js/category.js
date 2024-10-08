async function getGames() {
    try {
        const response = await fetch('data/games.json');
        const data = await response.json();
        console.log('se llego a getGames()');
        return data;
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}
window.getGames = getGames;