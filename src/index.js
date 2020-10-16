import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const wonSquareStyle = {
  color: '#FF0'
}

function Square({ value, onSquareClick, causedTheWin }) {
  return (
    <button 
    className="square" 
    onClick={onSquareClick}
    style={causedTheWin ? wonSquareStyle : null}
    >
      {value}
    </button>
  );
}

function Board({ squares, onClick, wonSquaresMarkedMatrix }) {
  function renderSquare(i, j) {
    return (
    <Square 
    value={squares[i][j]} 
    onSquareClick={() => onClick(i, j)} 
    causedTheWin={ wonSquaresMarkedMatrix ? (wonSquaresMarkedMatrix[i][j] ? true : false) : null}
    />);
  }

  const board = squares.map((row, i) => (
    <div className="board-row">
      {row.map((col, j) => {
        return renderSquare(i, j, wonSquaresMarkedMatrix);
      })}
    </div>
  ));

  return <div>{board}</div>;
}

const maxRow = 3;
const maxCol = 3;
const moveBtnClickedStyle = {
  background: "#ff0",
  fontWeight: "bold",
};
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
      wonSquaresMarkedMatrix: null,
      orderedByAcs: true,
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

    if (calWinner(squares)|| squares[i][j]) {
      return;
    }

    squares[i][j] = this.state.xIsNext ? "X" : "O";

    const moveDescription = {
      row: i,
      col: j,
    };

    this.setState({
      wonSquaresMarkedMatrix: calWinner(squares),
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
    // this.isClicked = true;
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  changeOrder() {
    this.setState({
      orderedByAcs: !this.state.orderedByAcs,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const wonSquaresMarkedMatrix = calWinner(current.squares);
    
    // if (wonSquaresMarkedMatrix) {
    //   this.setState({
    //     wonSquaresMarkedMatrix: wonSquaresMarkedMatrix
    //   })
    // }
    
    const winner = wonSquaresMarkedMatrix ? (this.state.xIsNext ? 'O' : 'X') : null;

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === maxRow * maxCol) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const description = move !== 0 ? "Go to the move #" + move + " (row " + step.moveDescription.row + " col " + step.moveDescription.col + ")" : 
      "Go to the start";

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={this.state.stepNumber === move ? moveBtnClickedStyle : null}
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
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
            wonSquaresMarkedMatrix={this.state.wonSquaresMarkedMatrix}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <button onClick={() => this.changeOrder()}>
            {this.state.orderedByAcs ? "Ascending" : "Descending"}
          </button>
          <ol>{this.state.orderedByAcs ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function checkDiagonal(squares) {
  let result = "";
  const wonMarker = Array(3).fill().map(() => Array(3).fill(null)); // matrix that only caused-won squares are not null

  for (let idx = 0; idx < squares.length; idx++) {
    if (squares[idx][idx]) {
      result += squares[idx][idx];
      wonMarker[idx][idx] = squares[idx][idx];
    }
  }

  if (result === "XXX" || result === "OOO") {
    return wonMarker;
  }

  return null;
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


// return: a matrix that only contain caused-won squares
function calWinner(squares) {
  return (
    checkDiagonal(squares) ||
    checkAntiDiagonal(squares) ||
    checkRows(squares) ||
    checkCols(squares)
  );
}
