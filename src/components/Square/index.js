import React from "react";

const wonSquareStyle = {
  color: "#F00",
};

function Square({ value, onSquareClick, causedTheWin }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={causedTheWin ? wonSquareStyle : {}}
    >
      {value}
    </button>
  );
}

export default Square;