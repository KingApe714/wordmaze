export const endRound = (user, ancestoryMatrix) => {
  console.log(user.points);
  console.log(user);
  console.log(ancestoryMatrix);
  const modalBtn = document.querySelector(".modal-button");
  const modalBg = document.querySelector(".modal-bg");
  const modalClose = document.querySelector(".modal-close");
  const modalChild = document.querySelector(".modal-child");
  const modalTitle = document.querySelector(".modal-title");

  const modalInner = document.querySelector(".modal-inner");
  modalBg.classList.add("bg-active");

  // from here i want to display to the user all of the board data and their points and demerites
};
