class Toast {
  static $toastWrapper = null;
  constructor() {
    const $toast = document.createElement("span");
    $toast.classList.add("toast");
    Toast.$toastWrapper.insertAdjacentElement("afterbegin", $toast);
    this.$toast = $toast;
  }
  show(message) {
    this.$toast.innerText = message;
    this.$toast.classList.add("toast--active");
  }
  hide() {
    this.$toast.classList.remove("toast--active");
  }
  remove() {
    Toast.$toastWrapper.removeChild(this.$toast);
  }

  static DOMContentLoadedListener = () => {
    Toast.$toastWrapper = document.getElementById("toast-wrapper");
    document.removeEventListener(
      "DOMContentLoaded",
      Toast.DOMContentLoadedListener
    );
  };
}

document.addEventListener("DOMContentLoaded", Toast.DOMContentLoadedListener);
