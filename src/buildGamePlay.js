import {
  activateRootNode,
  activateMatrix,
  touchmove_mouseover,
  touchend_mouseup,
  debounce,
} from "./eventHandlers.js";

export const gamePlay = (ancestoryMatrix, user) => {
  const gameBoard = document.querySelector(".inner-game-container");

  gameBoard.addEventListener("mousedown", (e) => {
    e.preventDefault();
    activateMatrix(ancestoryMatrix);
  });

  gameBoard.addEventListener("touchstart", (e) => {
    e.preventDefault();
    activateMatrix(ancestoryMatrix);
    const [idx, jdx] = calculateCoords(e.touches[0]);

    // it's possible that user doesn't press on a tile
    if (idx >= 0 && jdx >= 0) {
      const root = ancestoryMatrix[idx][jdx];
      activateRootNode(root);
    }
  });

  gameBoard.addEventListener("mouseup", (e) => {
    e.preventDefault();
    touchend_mouseup(ancestoryMatrix, user);
  });

  gameBoard.addEventListener("touchend", (e) => {
    e.preventDefault();
    touchend_mouseup(ancestoryMatrix, user);
  });

  // I need to debounce the amount of time this event is fired
  // I need to learn debounce and request animation frame for this.
  // this is the FUCKING SOLUTION!!!

  const handleTouchMove = (e) => {
    // console.log("fire");
    e.preventDefault();

    const [idx, jdx] = calculateCoords(e.touches[0]);

    if (idx >= 0 && jdx >= 0) {
      const node = ancestoryMatrix[idx][jdx];
      requestAnimationFrame(() => {
        touchmove_mouseover(node);
      });
    }
  };

  gameBoard.addEventListener("touchmove", debounce(handleTouchMove, 0.5));

  // gameBoard.addEventListener("touchmove", (e) => {
  //   e.preventDefault();
  //   const [idx, jdx] = calculateCoords(e.touches[0]);

  //   if (idx >= 0 && jdx >= 0) {
  //     const node = ancestoryMatrix[idx][jdx];
  //     touchmove_mouseover(node);
  //   }
  // });

  const calculateCoords = (touchEvent) => {
    const boardData = gameBoard.getBoundingClientRect();
    const height = boardData.height;
    const width = boardData.width;

    const top = boardData.top;
    const left = boardData.left;

    const i = touchEvent.clientY - top;
    const j = touchEvent.clientX - left;

    // make sure to account for the spaces between tiles
    // 3 - 22 | 28 - 47 | 53 - 72 | 78 - 97
    const numI = (i / height) * 100;
    const numJ = (j / width) * 100;

    const idx = isValid(numI) ? Math.floor((numI - 1) / 25) : -1;
    const jdx = isValid(numJ) ? Math.floor((numJ - 1) / 25) : -1;

    return [idx, jdx];
  };

  const isValid = (num) => {
    return (
      (num >= 3 && num <= 22) ||
      (num >= 28 && num <= 47) ||
      (num >= 53 && num <= 72) ||
      (num >= 78 && num <= 97)
    );
  };
};
