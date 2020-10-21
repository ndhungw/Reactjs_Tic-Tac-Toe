import React, { useState } from "react";
import Board from "../Board/index";
import { calWinner } from "./gameServices";

const boardSize = 3;
const moveBtnClickedStyle = {
  background: "#ff0",
  fontWeight: "bold",
};

function Game() {
  const [wonSquares, setWonSquares] = useState(null);
  const [history, setHistory] = useState([
    {
      squares: Array(boardSize)
        .fill()
        .map(() => Array(boardSize).fill(null)),
      moveDescription: {
        rowIdx: null,
        colIdx: null,
      },
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const [orderedByAcs, setOrderOfMoveList] = useState(true);
  
  const handleClick = (i, j) => {
    const contextHistory = history.slice(0, stepNumber + 1);
    const current = contextHistory[contextHistory.length - 1];
    // deep copy
    const squares = current.squares.map((row) => {
      return row.slice();
    });

    if (wonSquares || squares[i][j]) {
      return;
    }

    squares[i][j] = xIsNext ? "X" : "O";

    const newWonSquares = calWinner(squares, { rowIdx: i, colIdx: j});

    setWonSquares(newWonSquares);
    setHistory([
      ...contextHistory,
      {
        squares: squares,
        moveDescription: { rowIdx: i, colIdx: j},
      }
    ]);
    setStepNumber(contextHistory.length);
    setXisNext(!xIsNext);
  }

  function jumpTo(step) {
    const current = history[step];
    const newWonSquares = calWinner(current.squares, current.moveDescription);
    
    setStepNumber(step);
    setXisNext(step % 2 === 0);
    setWonSquares(newWonSquares);
  }

  const winner = wonSquares ? (xIsNext ? "O" : "X") : null;

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (stepNumber === boardSize * boardSize) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const moves = history.map((step, move) => {
    const description =
      move !== 0
        ? `Go to the move #${move} (${step.moveDescription.rowIdx}, ${step.moveDescription.colIdx})`
        : "Go to the start";

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          style={stepNumber === move ? moveBtnClickedStyle : null}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={history[stepNumber].squares}
          onClick={(i, j) => handleClick(i, j)}
          wonSquares={wonSquares}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <br />
        <button onClick={() => setOrderOfMoveList(!orderedByAcs)}>
          {orderedByAcs ? "Ascending" : "Descending"}
        </button>
        <ol>{orderedByAcs ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

export default Game;
