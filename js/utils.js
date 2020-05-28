const delay = (_delay) =>
  new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, _delay);
  });

const { floor } = Math;

function getCSSTextColor(bgHexcolor) {
  bgHexcolor = bgHexcolor.replace("#", "");
  var r = parseInt(bgHexcolor.substr(0, 2), 16);
  var g = parseInt(bgHexcolor.substr(2, 2), 16);
  var b = parseInt(bgHexcolor.substr(4, 2), 16);
  var brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128 ? "var(--dark)" : "var(--light)";
}

const get2dCoords = (idx1d, width) => {
  const row = floor(idx1d / width);
  const col = idx1d % width;
  return { row, col };
};

const get1dCoord = (row, col, width) => row * width + col;

async function flareEffect($elem, className = "red-bg", duration = 200) {
  $elem.classList.add(className);
  await delay(duration);
  $elem.classList.remove(className);
}

async function toast(message, duration = 5000) {
  const t = new Toast();

  t.show(message);
  await delay(duration);
  t.hide();
  await delay(1000);
  t.remove();
}
