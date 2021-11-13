import game from './game.js'

document.addEventListener("DOMContentLoaded", () => {
    game()
    
    window.time = 120;
    window.selectedClueWordContainer = null;

    const restartButton = document.querySelector('.restart-button')
    
    restartButton.addEventListener('click', () => {
        localStorage.clear()
        window.localStorage.setItem('gameScore', 0);
        window.location.reload()
    })
})