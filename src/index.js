import game from './game.js'

document.addEventListener("DOMContentLoaded", () => {
    game()
    
    window.time = 120;
    window.selectedClueWordContainer = null;
    window.completeBoard = false;

    const restartButton = document.querySelector('.restart-button')
    
    restartButton.addEventListener('click', () => {
        localStorage.clear()
        window.localStorage.setItem('gameScore', 0);
        window.location.reload()
    })
})