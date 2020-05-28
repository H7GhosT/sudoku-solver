class SudokuCell {
  static NULL = 0;
  static MIN = 1;
  static MAX = 9;
  constructor(initialValue = SudokuCell.NULL) {
    const $input = document.createElement("input");
    $input.type = "text";
    $input.classList.add("sudoku-cell");
    this.$input = $input;
    this.value = initialValue;
    this.$input.addEventListener("input", this.inputHandler.bind(this));
    this.$input.addEventListener(
      "beforeinput",
      this.beforeInputHandler.bind(this)
    );
    this.$input.addEventListener("focusin", this.focusHandler.bind(this));
    this.$input.required = true;

    this._disabled = false;
  }
  disable() {
    this._disabled = true;
  }

  enable() {
    this._disabled = false;
  }

  up() {
    this.$input.classList.add("up");
  }
  down() {
    this.$input.classList.remove("up");
  }
  async upDown() {
    this.up();
    await delay(100);
    this.down();
  }
  set value(val) {
    const newVal = SudokuCell.validateNum(val);
    if (newVal == SudokuCell.NULL) this.$input.value = "";
    else {
      this.$input.value = newVal;
    }
    if (this._value !== newVal) this.upDown();
    this._value = newVal;
  }
  get value() {
    return this._value;
  }
  inputHandler(e) {
    if (this._disabled) {
      this.value = this._value;
      return;
    }
    this.value = parseInt(this.$input.value);
  }
  beforeInputHandler(e) {
    if (!this._disabled && this.$input.value) this.$input.value = "";
  }
  focusHandler(e) {
    if (this._disabled) this.$input.blur();
  }
  static validateNum(num) {
    num = parseInt(num);
    if (isNaN(num)) return SudokuCell.NULL;
    if (num >= SudokuCell.MIN && num <= SudokuCell.MAX) return num;
    else return SudokuCell.NULL;
  }
}
