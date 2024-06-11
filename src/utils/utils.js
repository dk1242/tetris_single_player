export const isGameOver = (board) => {
  for (let j = 0; j < board[0].length; j++) {
    if (board[0][j]) {
      return true;
    }
  }
  return false;
};

export const isValidMove = (board, shape, i, j) => {
  return (
    !isGameOver(board) &&
    shape.every((row, di) => {
      // console.log(row);
      return row.every((cell, dj) => {
        const newI = i + di;
        const newJ = j + dj;
        // console.log(newI + shape.length, newJ + shape[0].length);
        return (
          newI >= 0 &&
          newI < 11 &&
          newJ >= 0 &&
          newJ < 8 &&
          (!cell || (board[newI] && board[newI][newJ] === 0))
        );
      });
    })
  );
};
export const getRowsBursted = (board) => {
  let rows = [];
  board.forEach((row, rowsIndex) => {
    let flag = 1;
    row.forEach((cell) => {
      if (cell === 0) {
        flag = 0;
      }
    });
    if (flag) {
      rows.push(rowsIndex);
    }
  });
  return rows;
};
