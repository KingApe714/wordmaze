import game from './game.js'

document.addEventListener("DOMContentLoaded", () => {
    game()
    
    window.time = 120;
    window.selectedClueWordContainer = null;
    window.completeBoard = false;
    //ensure that gameScore is set even on a new machine
    if (!window.localStorage.getItem('gameScore')) {
        window.localStorage.setItem('gameScore', 0)
    }

    const restartButton = document.querySelector('.restart-button')
    
    restartButton.addEventListener('click', () => {
        localStorage.clear()
        window.localStorage.setItem('gameScore', 0);
        window.location.reload()
    })
})