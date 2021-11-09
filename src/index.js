import game from './game.js'

document.addEventListener("DOMContentLoaded", () => {
    game()

    const restartButton = document.querySelector('.restart-button')

    restartButton.addEventListener('click', () => {
        window.location.reload()
    })
})