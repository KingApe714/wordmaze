
export function modal() {
    const modalBtn = document.querySelector('.modal-button');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');
    const modalChild = document.querySelector('.modal-child');

    modalBtn.addEventListener('click', function() {
        modalBg.classList.add('bg-active')
        modalChild.innerHTML = "TESTING"
    })

    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })
}

export function timer() {
    let time = 120;
    const countdownEl = document.querySelector('.countdown');
    let t = setInterval(updateCountdown, 1000);

    function updateCountdown() {
        const minutes = Math.floor(time / 60)
        let seconds = time % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        countdownEl.innerHTML = `${minutes}:${seconds}`

        if (time > 0) time--;

        if (time === 0) {

        }
    }
}

export function gamePoints(word) {
    
}