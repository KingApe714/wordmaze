
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