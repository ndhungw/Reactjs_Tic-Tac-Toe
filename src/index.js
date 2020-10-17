import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./components/Board/index";
import { calWinner } from "./components/Game/gameServices";

const boardSize = 3;
const moveBtnClickedStyle = {
  background: "#ff0",
  fontWeight: "bold",
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // winCheck: {
      //   xPlayer: {
      //     xDiagonalCount: 0,
      //     xAntiDiagonalCount: 0,
      //     xRowsCount: Array(boardSize).fill(0),
      //     xColsCount: Array(boardSize).fill(0),
      //   },
      //   oPlayer: {
      //     oDiagonalCount: 0,
      //     oAntiDiagonalCount: 0,
      //     oRowsCount: Array(boardSize).fill(0),
      //     oColsCount: Array(boardSize).fill(0),
      //   },
      // },
      history: [
        {
          squares: Array(boardSize)
            .fill()
            .map(() => Array(boardSize).fill(null)),
          moveDescription: {
            rowIdx: null,
            colIdx: null,
          },
        },
      ],
      wonSquares: null,
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

    const wonSquares = calWinner(squares, current.moveDescription);

    if (wonSquares || squares[i][j]) {
      return;
    }

    squares[i][j] = this.state.xIsNext ? "X" : "O";

    const moveDescription = {
      rowIdx: i,
      colIdx: j,
    };

    this.setState({
      wonSquares: calWinner(squares, moveDescription),
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
    const history = this.state.history;
    const current = history[step];
    const wonSquares = calWinner(current.squares, current.moveDescription);

    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      wonSquares: wonSquares,
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
    const wonSquares = calWinner(current.squares, current.moveDescription);

    const winner = wonSquares
      ? this.state.xIsNext
        ? "O"
        : "X"
      : null;

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === boardSize * boardSize) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const description =
        move !== 0
          ? `Go to the move #${move} (${step.moveDescription.rowIdx}, ${step.moveDescription.colIdx})`
          : "Go to the start";

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
            wonSquares={this.state.wonSquares}
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
