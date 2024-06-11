import { useEffect, useState } from "react";
import Row from "./Row";
import { isGameOver, isValidMove, getRowsBursted } from "../utils/utils";
import { TETRIS_SHAPES } from "./TETRIS_SHAPES.js";

const shapes = ["T", "I", "J", "L", "O", "S", "Z"];
let c = 0;
const storedBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const Board = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [board, setBoard] = useState(storedBoard);
  const [score, setScore] = useState(0);
  let isRowsBursting = false;
  const [currentPiece, setCurrentPiece] = useState({
    shape: TETRIS_SHAPES[shapes[Math.floor(Math.random() * 7)]],
    i: 0,
    j: 4,
    rotation: 0,
  });
  // shapes[Math.floor(Math.random() * 7)]
  function mergeToBoard(board, shape, i, j) {
    const newBoard = board.map((row) => [...row]);
    shape.forEach((row, di) => {
      row.forEach((cell, dj) => {
        if (cell) {
          newBoard[i + di][j + dj] = cell;
        }
      });
    });
    return newBoard;
  }
  const movePieceLeft = () => {
    setCurrentPiece((prev) => {
      const newJ = prev.j - 1;
      if (isValidMove(board, prev.shape[prev.rotation], prev.i, newJ)) {
        return { ...prev, j: newJ };
      }
      return prev;
    });
  };
  const movePieceRight = () => {
    setCurrentPiece((prev) => {
      const newJ = prev.j + 1;
      if (isValidMove(board, prev.shape[prev.rotation], prev.i, newJ)) {
        return { ...prev, j: newJ };
      }
      return prev;
    });
  };
  function burstTheRows() {
    isRowsBursting = true;
    // console.log("burst rows", c++);
    const rowsBursted = getRowsBursted(board);
    if (rowsBursted.length > 0) {
      rowsBursted.sort((a, b) => a - b);
      rowsBursted.reverse();
      setBoard((prevBoard) => {
        let tempBoard = prevBoard.map((row) => [...row]);
        rowsBursted.forEach((rowIndex) => {
          tempBoard.splice(rowIndex, 1);
        });
        for (let i = 0; i < rowsBursted.length; i++) {
          tempBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0]);
        }
        // console.log("rows bursted---------------------------------------");
        return tempBoard;
      });
      setScore((score) => score + rowsBursted.length * rowsBursted.length * 10);
    }
    isRowsBursting = false;
  }
  function movePieceDown() {
    if (!isGameOver(board)) {
      burstTheRows();
      setCurrentPiece((prev) => {
        const newI = prev.i + 1;
        if (
          !isValidMove(board, prev.shape[prev.rotation], newI, prev.j) &&
          !isGameOver(board)
        ) {
          setBoard((prevBoard) =>
            mergeToBoard(prevBoard, prev.shape[prev.rotation], prev.i, prev.j)
          );
          if (!isGameOver(board)) {
            const selectedShape = shapes[Math.floor(Math.random() * 7)];
            const newTempShape = TETRIS_SHAPES[selectedShape];
            const newJ = Math.floor(
              Math.random() * (7 - newTempShape[0][0].length)
            );
            return {
              ...prev,
              i: 0,
              shape: newTempShape,
              j: newJ,
              rotation: 0,
            };
          }
        } else if (!isGameOver(board)) {
          return { ...prev, i: newI };
        }
      });
      // }
    }
  }
  function rotatePiece() {
    setCurrentPiece((prev) => {
      const newRotation = (prev.rotation + 1) % prev.shape.length;
      const newShape = prev.shape;
      if (isValidMove(board, newShape[newRotation], prev.i, prev.j)) {
        return { ...prev, shape: newShape, rotation: newRotation };
      }
      return prev;
    });
  }
  const handleKeyPress = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        movePieceLeft();
        break;
      case "ArrowRight":
        movePieceRight();
        break;
      case "ArrowDown":
        movePieceDown();
        break;
      case "ArrowUp":
        rotatePiece();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (isStarted && isPlaying && !isGameOver(board)) {
      const interval = setInterval(() => {
        movePieceDown();
      }, 500);
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        clearInterval(interval);
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [currentPiece, isPlaying, isStarted]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);
    if (isStarted && !isGameOver(board)) {
      currentPiece.shape[currentPiece.rotation].forEach((row, di) => {
        row.forEach((cell, dj) => {
          if (cell !== 0) {
            displayBoard[currentPiece.i + di][currentPiece.j + dj] = cell;
          }
        });
      });
    }
    return displayBoard.map((row, rowInd) => (
      <div style={{ gap: "1px" }} key={rowInd}>
        <div style={{ marginBottom: "1px" }}>
          <Row rowVal={row} />
        </div>
      </div>
    ));
  };
  return (
    <div>
      <h1 style={{ margin: "0px" }}>Tetris Board</h1>
      {isGameOver(board) && (
        <h3 style={{ margin: "0px", color: "Red" }}>Game Over</h3>
      )}
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          marginBottom: "20px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          {isStarted ? (
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              {isGameOver(board) ? "New Game" : "Restart"}
            </button>
          ) : (
            <button onClick={() => setIsStarted(true)}>Start</button>
          )}

          {!isGameOver(board) && (
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "Pause" : "Continue"}
            </button>
          )}
        </div>
        <div>
          <h2 style={{ float: "right", margin: "0px" }}>Score: {score}</h2>
        </div>
      </div>
      {renderBoard()}
      <br />
      {isStarted && !isGameOver(board) && (
        <div>
          <div>
            <button
              style={{ borderRadius: "50%", fontSize: "1rem" }}
              onClick={() => rotatePiece()}
            >
              {" "}
              &#x2B06;
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "50px",
            }}
          >
            <button
              style={{ borderRadius: "50%" }}
              onClick={() => movePieceLeft()}
            >
              {" "}
              &#x2B05;
            </button>
            <button
              style={{ borderRadius: "50%" }}
              onClick={() => movePieceRight()}
            >
              {" "}
              &#x27A1;
            </button>
          </div>
          <div>
            <button
              style={{ borderRadius: "50%" }}
              onClick={() => movePieceDown()}
            >
              {" "}
              &#x2B07;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
