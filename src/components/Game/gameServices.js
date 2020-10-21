function checkDiagonal(squares, rowIdx, colIdx) {
  // last move not on the diagonal
  if (rowIdx !== colIdx) {
    return null;
  }

  let result = "";
  const wonSquares = Array(3)
    .fill()
    .map(() => Array(3).fill(null)); // matrix that only caused-won squares are not null

  for (let i = 0; i < squares.length; i++) {
    if (squares[i][i]) {
      result += squares[i][i];
      wonSquares[i][i] = squares[i][i];
    }
  }

  // not full line yet = no win
  if (result.length !== squares.length) {
    return null;
  }

  if (
    result.split("").every((e) => e === "X") ||
    result.split("").every((e) => e === "O")
  ) {
    return wonSquares;
  }

  return null;
}

function checkAntiDiagonal(squares, rowIdx, colIdx) {
  // last move not on the anti diagonal
  if (rowIdx !== squares.length - 1 - colIdx) {
    return null;
  }

  let result = "";
  const boardSize = squares.length;
  const wonSquares = Array(3)
    .fill()
    .map(() => Array(3).fill(null)); // matrix that only caused-won squares are not null

  for (let i = 0; i < squares.length; i++) {
    const j = boardSize - 1 - i;

    if (squares[i][j]) {
      result += squares[i][j];
      wonSquares[i][j] = squares[i][j];
    }
  }

  // not full line yet = no win
  if (result.length !== squares.length) {
    return null;
  }

  // result is 'XXX...X' or 'OOO...O'
  if (
    result.split("").every((e) => e === "X") ||
    result.split("").every((e) => e === "O")
  ) {
    return wonSquares;
  }

  return null;
}

function checkRows(squares, rowIdx, colIdx) {
  let result = "";
  const wonSquares = Array(3)
    .fill()
    .map(() => Array(3).fill(null)); // matrix that only caused-won squares are not null

  for (let i = 0; i < squares.length; i++) {
    if (squares[rowIdx][i]) {
      result += squares[rowIdx][i];
      wonSquares[rowIdx][i] = squares[rowIdx][i];
    }
  }

  // not full line yet = no win
  if (result.length !== squares.length) {
    return null;
  }

  // result is 'XXX...X' or 'OOO...O'
  if (
    result.split("").every((e) => e === "X") ||
    result.split("").every((e) => e === "O")
  ) {
    return wonSquares;
  }

  return null;
}

function checkCols(squares, rowIdx, colIdx) {
  let result = "";
  const wonSquares = Array(3)
    .fill()
    .map(() => Array(3).fill(null)); // matrix that only caused-won squares are not null

  for (let i = 0; i < squares.length; i++) {
    if (squares[i][colIdx]) {
      result += squares[i][colIdx];
      wonSquares[i][colIdx] = squares[i][colIdx];
    }
  }

  // not full line yet = no win
  if (result.length !== squares.length) {
    return null;
  }

  // result is 'XXX...X' or 'OOO...O'
  if (
    result.split("").every((e) => e === "X") ||
    result.split("").every((e) => e === "O")
  ) {
    return wonSquares;
  }

  return null;
}

// return: a matrix that only contain caused-won squares
function calWinner(squares, { rowIdx, colIdx }) {
  if (squares == null) {
    return null;
  }
  if (rowIdx === null || colIdx === null) {
    return null;
  }
  return (
    checkDiagonal(squares, rowIdx, colIdx) ||
    checkAntiDiagonal(squares, rowIdx, colIdx) ||
    checkRows(squares, rowIdx, colIdx) ||
    checkCols(squares, rowIdx, colIdx)
  );
}

// -------------------

/**
 *
 * @param {
 * xDiagonalCount: Số dấu X trên đường chéo chính
 * xAntiDiagonalCount: Số dấu X trên đường chéo phụ
 * xRowsCount: mảng ghi số lượng dấu X trên từng dòng
 * xColsCount: mảng ghi số lượng dấu X trên từng cột
 * } param0
 * @param {tọa độ dòng của lượt chơi} rowIdx
 * @param {tọa độ cột của lượt chơi} colIdx
 */
function checkWin(
  { diagonalCount, antiDiagonalCount, rowsCount, colsCount, squares },
  rowIdx,
  colIdx
) {
  const boardSize = squares.length;
  const player = squares[rowIdx][colIdx];
  const wonSquares = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(null));

  if (diagonalCount === boardSize) {
    for (let i = 0; i < boardSize; i++) {
      wonSquares[i][i] = player;
    }
  } else if (antiDiagonalCount === boardSize) {
    for (let i = 0; i < boardSize; i++) {
      wonSquares[i][boardSize - 1 - i] = player;
    }
  } else if (rowsCount[rowIdx] === boardSize) {
    for (let i = 0; i < boardSize; i++) {
      wonSquares[rowIdx][i] = player;
    }
  } else if (colsCount[colIdx] === boardSize) {
    for (let i = 0; i < boardSize; i++) {
      wonSquares[i][colIdx] = player;
    }
  } else {
    // No win status detected
    return null;
  }

  // return the 2d array that only mark the caused-win squares
  return wonSquares;
}

export { checkWin, calWinner };
