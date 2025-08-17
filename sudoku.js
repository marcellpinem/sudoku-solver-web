window.onload = function () {
  setBoard();
};

function setBoard() {
  const tbody = document.querySelector(".board tbody");
  for (let r = 0; r < 9; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < 9; c++) {
      const td = document.createElement("td");
      const tile = document.createElement("input");

      tile.id = `${r}-${c}`;
      tile.type = "text";
      tile.inputMode = "numeric";
      tile.pattern = "[1-9]";
      tile.maxLength = 1;

      tile.addEventListener("input", (e) => {
        let val = e.target.value;
        if (!/^[1-9]$/.test(val)) e.target.value = "";
      });

      td.appendChild(tile);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function getBoard() {
  let board = [];
  for (let r = 0; r < 9; r++) {
    let row = [];
    for (let c = 0; c < 9; c++) {
      let id = `${r}-${c}`;
      let val = document.getElementById(id).value;
      row.push(val === "" || isNaN(val) ? 0 : parseInt(val));
    }
    board.push(row);
  }
  return board;
}

function hasConflict(board) {
  for (let r = 0; r < 9; r++) {
    const seen = new Set();
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === 0) continue;
      if (seen.has(v)) return true;
      seen.add(v);
    }
  }
  for (let c = 0; c < 9; c++) {
    const seen = new Set();
    for (let r = 0; r < 9; r++) {
      const v = board[r][c];
      if (v === 0) continue;
      if (seen.has(v)) return true;
      seen.add(v);
    }
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const v = board[br * 3 + i][bc * 3 + j];
          if (v === 0) continue;
          if (seen.has(v)) return true;
          seen.add(v);
        }
      }
    }
  }
  return false;
}

function solveSudoku() {
  const board = getBoard();
  if (hasConflict(board)) {
    alert("Tidak ada solusi (input bentrok).");
    return;
  }

  function findEmpty() {
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if (board[i][j] === 0) return [i, j];
    return null;
  }

  function isValid(num, pos) {
    const [row, col] = pos;
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num && i !== col) return false;
      if (board[i][col] === num && i !== row) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++)
      for (let j = boxCol; j < boxCol + 3; j++) if (board[i][j] === num && (i !== row || j !== col)) return false;
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
    updateBoard(board);
  } else {
    alert("Tidak ada solusi untuk puzzle ini.");
  }
}

function updateBoard(board) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      let id = `${r}-${c}`;
      document.getElementById(id).value = board[r][c] !== 0 ? board[r][c] : "";
    }
}

function clearBoard() {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) document.getElementById(`${r}-${c}`).value = "";
}
