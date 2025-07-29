window.onload = function () {
  setBoard();
};

function setBoard() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("input");
      tile.id = r.toString() + "-" + c.toString();

      if (r == 2 || r == 5) {
        tile.classList.add("horizontal-line");
      }

      if (c == 2 || c == 5) {
        tile.classList.add("vertical-line");
      }

      tile.classList.add("tile");
      document.querySelector(".board").appendChild(tile);
    }
  }
}

function getBoard() {
  let board = [];

  for (let r = 0; r < 9; r++) {
    let row = [];
    for (let c = 0; c < 9; c++) {
      let id = r.toString() + "-" + c.toString();
      let val = document.getElementById(id).value;

      // Jika kosong atau bukan angka, isi 0
      if (val === "" || isNaN(val)) {
        row.push(0);
      } else {
        row.push(parseInt(val));
      }
    }
    board.push(row);
  }

  return board;
}

function solveSudokuUI() {
  const board = getBoard();

  function findEmpty() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) return [i, j];
      }
    }
    return null;
  }

  function isValid(num, pos) {
    const [row, col] = pos;

    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num && i !== col) return false;
    }

    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num && i !== row) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num && (i !== row || j !== col)) return false;
      }
    }

    return true;
  }

  function solve() {
    const currPos = findEmpty();
    if (!currPos) return true;

    const [row, col] = currPos;

    for (let num = 1; num <= 9; num++) {
      if (isValid(num, [row, col])) {
        board[row][col] = num;

        if (solve()) return true;

        board[row][col] = 0;
      }
    }

    return false;
  }

  if (solve()) {
    updateBoardUI(board);
  } else {
    alert("Tidak ada solusi untuk puzzle ini.");
  }
}

function updateBoardUI(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let id = r.toString() + "-" + c.toString();
      document.getElementById(id).value = board[r][c] !== 0 ? board[r][c] : "";
    }
  }
}
