function sudokuSolver(sudokuBoard) {
  const config = {
    delay: 0,
    isSolving: false,
    isCanceling: false,
  };

  async function start() {
    const forbbidenPositions = fillForbbidenPositions();
    setForbbidenPositions();

    config.isSolving = true;

    const result = await makeChange(getMaxN(), 0, 0);

    config.isSolving = false;

    return result;

    async function makeChange(n, row) {
      if (!config.isSolving) return false;
      if (row >= SIZE) {
        n = getMaxN();
        if (n === -1) return true;
        row = 0;
      }

      const {
        rows: forbRows,
        cols: forbCols,
        subBoards: forbSubBoards,
      } = forbbidenPositions[n];

      let i = get1dCoord(row, 0, SIZE);

      for (let r = row; r < SIZE; r++) {
        if (forbRows.has(r)) {
          i += SIZE;
          continue;
        }
        for (let c = 0; c < SIZE; c++, i++) {
          const val = sudokuBoard.cells[i].value;
          if (!config.isSolving) return false;
          if (val !== SudokuCell.NULL_VALUE) continue;
          if (forbCols.has(c)) continue;
          if (forbSubBoards.has(get1dCoord(floor(r / 3), floor(c / 3), 3)))
            continue;

          addForbPos(n, r, c);
          sudokuBoard.cells[i].value = n;
          await delay(config.delay);

          if (await makeChange(n, r + 1)) return true;

          sudokuBoard.cells[i].value = SudokuCell.NULL_VALUE;
          removeForbPos(n, r, c);
        }
        if (!forbRows.has(r)) return false;
      }

      if (forbbidenPositions[n].count < 9) return false;
      return makeChange(0, SIZE);
    }

    function fillForbbidenPositions() {
      const res = new Array(9).fill(null).map((_) => ({
        rows: new Set(),
        cols: new Set(),
        subBoards: new Set(),
        count: 0,
      }));
      res.unshift(null);
      return res;
    }

    function addForbPos(n, row, col) {
      forbbidenPositions[n].rows.add(row);
      forbbidenPositions[n].cols.add(col);
      const sb = get1dCoord(floor(row / 3), floor(col / 3), 3);
      forbbidenPositions[n].subBoards.add(sb);
      forbbidenPositions[n].count++;
    }

    function removeForbPos(n, row, col) {
      forbbidenPositions[n].rows.delete(row);
      forbbidenPositions[n].cols.delete(col);
      const sb = get1dCoord(floor(row / 3), floor(col / 3), 3);
      forbbidenPositions[n].subBoards.delete(sb);
      forbbidenPositions[n].count--;
    }

    function setForbbidenPositions() {
      for (let i = 0; i < SIZE ** 2; i++) {
        const n = sudokuBoard.cells[i].value;

        if (n !== SudokuCell.NULL_VALUE) {
          const { row, col } = get2dCoords(i, SIZE);
          addForbPos(n, row, col);
        }
      }
    }
    function getMaxN() {
      let maxN = -1;
      for (let i = 1; i < forbbidenPositions.length; i++) {
        if (
          forbbidenPositions[i].count < 9 &&
          (maxN === -1 ||
            forbbidenPositions[i].count > forbbidenPositions[maxN].count)
        )
          maxN = i;
      }
      return maxN;
    }
  }

  return {
    set delay(val) {
      config.delay = val;
    },
    get isSolving() {
      return config.isSolving;
    },
    cancel: () => {
      config.isSolving = false;
      config.isCanceling = true;
      sudokuBoard.enableCells();
    },
    solve: async () => {
      if (config.isSolving) {
        return "In progress";
      }
      if (!sudokuBoard.isValid()) {
        return "Board is not valid";
      }
      if (sudokuBoard.isFull()) {
        return "Nothing to do";
      }

      sudokuBoard.disableCells();
      const result = await start();
      if (!result && config.isCanceling) {
        sudokuBoard.enableCells();
        config.isCanceling = false;
        return "Canceled";
      } else if (!result) {
        sudokuBoard.enableCells();
        return "Not possible";
      }
      sudokuBoard.enableCells();
      return "Done";
    },
  };
}
