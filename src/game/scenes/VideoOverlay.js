export default class VideoOverlay {
  constructor(src, onClosedOrEnded) {
    this.src = src;
    this.onClosedOrEnded = onClosedOrEnded;

    this.wrap = null;
    this.video = null;
    this.closeBtn = null;

    this._called = false;
  }

  open() {
    const parent = document.body;

    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.inset = "0";
    wrap.style.background = "rgba(0,0,0,0.85)";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "center";
    wrap.style.zIndex = "9998";

    const v = document.createElement("video");
    v.src = this.src;
    v.controls = true;
    v.playsInline = true;
    v.preload = "auto";
    v.style.width = "92vw";
    v.style.maxWidth = "980px";
    v.style.maxHeight = "78vh";
    v.style.background = "black";
    v.style.borderRadius = "12px";

    const close = document.createElement("button");
    close.textContent = "닫기";
    close.style.position = "fixed";
    close.style.top = "14px";
    close.style.right = "14px";
    close.style.zIndex = "9999";
    close.style.padding = "10px 12px";
    close.style.borderRadius = "12px";
    close.style.border = "0";
    close.style.background = "white";
    close.style.fontSize = "14px";

    const done = () => {
      if (this._called) return;
      this._called = true;
      if (typeof this.onClosedOrEnded === "function") this.onClosedOrEnded();
    };

    close.addEventListener("click", () => {
      this.close();
      done();
    });

    v.addEventListener("ended", () => {
      this.close();
      done();
    });

    wrap.appendChild(v);
    parent.appendChild(wrap);
    parent.appendChild(close);

    this.wrap = wrap;
    this.video = v;
    this.closeBtn = close;

    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }

  close() {
    try {
      if (this.video) this.video.pause();
    } catch (e) {
    }

    if (this.wrap && this.wrap.parentNode) this.wrap.parentNode.removeChild(this.wrap);
    if (this.closeBtn && this.closeBtn.parentNode) this.closeBtn.parentNode.removeChild(this.closeBtn);

    this.wrap = null;
    this.video = null;
    this.closeBtn = null;
  }
}