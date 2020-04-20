const $sudokuBoard = document.getElementById("sudoku-board");
const $speedInput = document.getElementById("speed-input");
const $solveBtn = document.getElementById("solve-btn");
const $clearBtn = document.getElementById("clear-btn");
const $cancelBtn = document.getElementById("cancel-btn");

const sudokuBoard = new SudokuBoard($sudokuBoard);
const solver = sudokuSolver(sudokuBoard);

solver.delay = parseInt($speedInput.value);

$speedInput.addEventListener("input", () => {
  solver.delay = parseInt($speedInput.value);
});

$solveBtn.addEventListener("click", async () => {
  if (sudokuBoard.isClearing) {
    flareEffect($solveBtn);
    toast("Wait");
    return;
  }

  const message = await solver.solve();
  toast(message);
});

$clearBtn.addEventListener("click", () => {
  if (sudokuBoard.isClearing) {
    flareEffect($clearBtn);
    toast("Wait");
    return;
  }
  if (solver.isSolving) {
    flareEffect($clearBtn);
    toast("Not now");
    return;
  }
  sudokuBoard.clear();
});

$cancelBtn.addEventListener("click", () => {
  if (!solver.isSolving) {
    toast("Hey..");
    return;
  }
  solver.cancel();
});

const colorPicker = Pickr.create({
  el: "#color-picker",
  theme: "classic",

  swatches: [
    "#1b1b1b",
    "#f5f5f5",
    "#577284",
    "#d69c2f",
    "#00539c",
    "#8b2335",
    "#2a4b7c",
    "#55b4b0",
    "#264e36",
    "#f3e0be",
    "#343148",
    "#615550",
    "#616247",
    "#e8b5c3",
  ],

  components: {
    hue: true,
  },
});

colorPicker.on("change", (color, instance) => {
  const c = color.toHEXA().toString();
  $sudokuBoard.style.setProperty("--background", c);
  $sudokuBoard.style.setProperty("--text-color", getCSSTextColor(c));
});
