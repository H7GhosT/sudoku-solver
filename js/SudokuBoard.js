const SIZE = 9;

class SudokuBoard {
  constructor($sudokuBoard) {
    this.$sudokuBoard = $sudokuBoard;
    this.cells = new Array(SIZE ** 2).fill(null).map((_) => new SudokuCell());
    this.insertCells();
  }

  insertCells() {
    for (let i = 0; i < SIZE; i++) {
      const $subBoard = document.createElement("div");
      $subBoard.className = "sudoku-sub-board";
      this.$sudokuBoard.appendChild($subBoard);
    }

    for (let i = 0; i < SIZE ** 2; i++) {
      let { row, col } = get2dCoords(i, SIZE);

      row = floor(row / 3);
      col = floor(col / 3);
      const subBoardIdx = get1dCoord(row, col, 3) + 1;

      this.$sudokuBoard
        .querySelector(`.sudoku-sub-board:nth-child(${subBoardIdx})`)
        ?.appendChild(this.cells[i].$input);
    }
  }

  disableCells() {
    this.cells.forEach((cell) => cell.disable());
  }

  enableCells() {
    this.cells.forEach((cell) => cell.enable());
  }

  async clear() {
    if (this.isClearing) return;
    this.isClearing = true;
    const directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    const _delay = 80;
    const bfs = async (row, col) => {
      await delay(_delay);
      if (row >= SIZE || col >= SIZE || row < 0 || col < 0) return;

      for (const dir of directions) {
        const i = get1dCoord(row + dir[0], col + dir[1], SIZE);
        this.cells[i] && (this.cells[i].value = SudokuCell.NULL_VALUE);
        this.cells[i]?.upDown();
        if (!this.cells[i] || this.cells[i].visited) continue;
        this.cells[i].visited = true;
        bfs(row + dir[0], col + dir[1]);
      }
      return Promise.resolve();
    };

    this.cells[get1dCoord(4, 4, SIZE)].value = SudokuCell.NULL_VALUE;

    bfs(4, 4);
    await delay(_delay * 24);
    for (const cell of this.cells) delete cell.visited;
    await delay(100);
    this.isClearing = false;
  }

  isValid() {
    for (let i = 0; i < SIZE; i++) {
      if (!this.isRowValid(i)) return false;
      if (!this.isColValid(i)) return false;
      const { row, col } = get2dCoords(i, 3);
      if (!this.isSubBoardValid(row, col)) return false;
    }

    return true;
  }
  isRowValid(row) {
    const rowSet = new Set(); // cells in row

    const rowValues = this.getRowValues(row);

    for (const v of rowValues) {
      if (rowSet.has(v)) {
        return false;
      }
      if (v != SudokuCell.NULL_VALUE) rowSet.add(v);
    }
    return true;
  }

  isColValid(col) {
    const colSet = new Set(); // cells in column

    const colValues = this.getColValues(col);

    for (const v of colValues) {
      if (colSet.has(v)) {
        return false;
      }
      if (v != SudokuCell.NULL_VALUE) colSet.add(v);
    }
    return true;
  }

  isSubBoardValid(row, col) /* 3x3 */ {
    const subBoardSet = new Set(); // cells in subboard (subgrid) 3x3

    const subBoardValues = this.getSubBoardValues(row, col);

    for (const v of subBoardValues) {
      if (subBoardSet.has(v)) {
        return false;
      }
      if (v != SudokuCell.NULL_VALUE) subBoardSet.add(v);
    }
    return true;
  }

  getRowValues(row) {
    const rowArr = new Array(SIZE);
    for (let c = 0; c < SIZE; c++) /* column */ {
      rowArr[c] = this.cells[get1dCoord(row, c, SIZE)].value;
    }
    return rowArr;
  }

  getColValues(col) {
    const colArr = new Array(SIZE);
    for (let r = 0; r < SIZE; r++) /* row */ {
      colArr[r] = this.cells[get1dCoord(r, col, SIZE)].value;
    }
    return colArr;
  }

  getSubBoardValues(row, col) {
    const subBoardArr = new Array(SIZE);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        subBoardArr[get1dCoord(r, c, 3)] = this.cells[
          get1dCoord(row * 3 + r, col * 3 + c, SIZE)
        ].value;
      }
    }
    return subBoardArr;
  }

  isFull = () => this.cells.every((cell) => !!cell.value);
}
