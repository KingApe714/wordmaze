import {
  activateRootNode,
  touchmove_mousemove,
  touchend_mouseup,
  debounce,
} from "./eventHandlers.js";

export const gamePlay = (ancestoryMatrix, user, paths, points) => {
  const gameBoard = document.querySelector(".inner-game-container");

  const activatePlay = (event) => {
    user.activeBoard = true;

    const [idx, jdx] = calculateCoords(event);

    // it's possible that user doesn't press on a tile
    if (idx >= 0 && jdx >= 0) {
      const root = ancestoryMatrix[idx][jdx];
      activateRootNode(root, paths, user, ancestoryMatrix);
    }
  };

  gameBoard.addEventListener("mousedown", (e) => {
    e.preventDefault();
    activatePlay(e);
  });

  gameBoard.addEventListener("touchstart", (e) => {
    e.preventDefault();
    activatePlay(e.touches[0]);
  });

  gameBoard.addEventListener("mouseup", (e) => {
    e.preventDefault();
    touchend_mouseup(ancestoryMatrix, user, paths, points);
  });

  gameBoard.addEventListener("touchend", (e) => {
    e.preventDefault();
    touchend_mouseup(ancestoryMatrix, user, paths, points);
  });

  const handleMove = (event, paths) => {
    const [idx, jdx] = calculateCoords(event);

    if (idx >= 0 && jdx >= 0) {
      const node = ancestoryMatrix[idx][jdx];
      // requestAnimationFrame(() => {
      touchmove_mousemove(node, paths, user, ancestoryMatrix);
      // });
    }
  };

  const handleMouseMove = (e, paths) => {
    e.preventDefault();
    handleMove(e, paths);
  };

  const handleMouseMoveWrapper = (e) => handleMouseMove(e, paths);

  gameBoard.addEventListener(
    "mousemove",
    debounce(handleMouseMoveWrapper, 0.02)
  );

  const handleTouchMove = (e, paths) => {
    e.preventDefault();
    handleMove(e.touches[0], paths);
  };

  const handleTouchMoveWrapper = (e) => handleTouchMove(e, paths);

  gameBoard.addEventListener(
    "touchmove",
    debounce(handleTouchMoveWrapper, 0.02)
  );

  const calculateCoords = (event) => {
    const boardData = gameBoard.getBoundingClientRect();
    const height = boardData.height;
    const width = boardData.width;

    const top = boardData.top;
    const left = boardData.left;

    const i = event.clientY - top;
    const j = event.clientX - left;

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
