import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
  function renderSquare(i, j) {
    return <Square value={squares[i][j]} onSquareClick={() => onClick(i, j)} />;
  }

  const board = squares.map((row, i) => (
    <div className="board-row">
      {row.map((col, j) => {
        return renderSquare(i, j);
      })}
    </div>
  ));

  return <div>{board}</div>;
}

// function HistoryButton({move, description, isClicked}) {
//   return (
//     <button
//     onClick={() => this.jumpTo(move)}
//     isClicked={isClicked}
//     >{description}</button>
//   );
// }

const maxRow = 3;
const maxCol = 3;
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(maxRow)
            .fill()
            .map(() => Array(maxCol).fill(null)),
          moveDescription: {
            row: null,
            col: null,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // deep copy
    const squares = current.squares.map((row) => {
      return row.slice();
    });

    if (calWinner(squares) || squares[i][j]) {
      return;
    }

    squares[i][j] = this.state.xIsNext ? "X" : "O";

    const moveDescription = {
      row: i,
      col: j,
    };

    this.setState({
      history: [
        ...history,
        {
          squares,
          moveDescription,
        },
      ],
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.isClicked = true;
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calWinner(current.squares);
    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === maxRow * maxCol) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const description =
        move !== 0
          ? "Go to the move #" +
            move +
            " (row " +
            step.moveDescription.row +
            " col " +
            step.moveDescription.col +
            ")"
          : "Go to the start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function checkDiagonal(squares) {
  let result = "";
  for (let idx = 0; idx < squares.length; idx++) {
    if (squares[idx][idx]) {
      result += squares[idx][idx];
    }
  }
  return result === "XXX" ? "X" : result === "OOO" ? "O" : null;
}

function checkAntiDiagonal(squares) {
  let result = "";

  for (let colIdx = 0; colIdx < squares.length; colIdx++) {
    let rowIdx = squares.length - 1 - colIdx;

    if (squares[rowIdx][colIdx]) {
      result += squares[rowIdx][colIdx];
    }
  }
  return result === "XXX" ? "X" : result === "OOO" ? "O" : null;
}

function checkRows(squares) {
  for (let rowIdx = 0; rowIdx < squares.length; rowIdx++) {
    let result = "";
    for (let colIdx = 0; colIdx < squares[0].length; colIdx++) {
      if (squares[rowIdx][colIdx]) {
        result += squares[rowIdx][colIdx];
      }
    }

    if (result === "XXX") {
      return "X";
    } else if (result === "OOO") {
      return "O";
    }
  }
  return null;
}

function checkCols(squares) {
  for (let colIdx = 0; colIdx < squares[0].length; colIdx++) {
    let result = "";
    for (let rowIdx = 0; rowIdx < squares.length; rowIdx++) {
      if (squares[rowIdx][colIdx]) {
        result += squares[rowIdx][colIdx];
      }
    }

    if (result === "XXX") {
      return "X";
    } else if (result === "OOO") {
      return "O";
    }
  }
  return null;
}

function calWinner(squares) {
  return (
    checkDiagonal(squares) ||
    checkAntiDiagonal(squares) ||
    checkRows(squares) ||
    checkCols(squares)
  );
}
