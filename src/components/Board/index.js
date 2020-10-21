import React from 'react'
import Square from '../Square/index'

function Board({ squares, onClick, wonSquares }) {
  function renderSquare(i, j) {
    return (
      <Square
        value={squares[i][j]}
        onSquareClick={() => onClick(i, j)}
        causedTheWin={
          wonSquares
            ? wonSquares[i][j]
              ? true
              : false
            : null
        }
      />
    );
  }

  const board = squares.map((row, i) => (
    <div className="board-row">
      {row.map((col, j) => {
        return renderSquare(i, j, wonSquares);
      })}
    </div>
  ));

  return <div>{board}</div>;
}

export default Board;

