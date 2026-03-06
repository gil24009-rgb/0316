export default class TouchControls {
  constructor(scene) {
    this.scene = scene;

    this.leftDown = false;
    this.rightDown = false;

    this.container = scene.add.container(0, 0).setDepth(2000);

    this.btnW = 46;
    this.btnH = 46;
    this.gap = 10;
    this.margin = 16;

    this.leftBtn = scene.add.image(0, 0, "pxBtn").setOrigin(0, 0);
    this.rightBtn = scene.add.image(0, 0, "pxBtn").setOrigin(0, 0);

    this.leftIcon = scene.add.triangle(0, 0, 10, 12, 10, -12, -12, 0, 0xffffff, 1);
    this.rightIcon = scene.add.triangle(0, 0, -10, 12, -10, -12, 12, 0, 0xffffff, 1);

    this.container.add([this.leftBtn, this.rightBtn, this.leftIcon, this.rightIcon]);

    this.leftBtn.setInteractive({ useHandCursor: true });
    this.rightBtn.setInteractive({ useHandCursor: true });

    const bindHold = (obj, setter) => {
      obj.on("pointerdown", () => setter(true));
      obj.on("pointerup", () => setter(false));
      obj.on("pointerout", () => setter(false));
      obj.on("pointercancel", () => setter(false));
    };

    bindHold(this.leftBtn, (v) => (this.leftDown = v));
    bindHold(this.rightBtn, (v) => (this.rightDown = v));

    this.relayout();
    scene.scale.on("resize", () => this.relayout());
  }

  relayout() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    const rightX = w - this.margin - this.btnW;
    const leftX = rightX - this.gap - this.btnW;
    const y = h - this.margin - this.btnH;

    this.leftBtn.setPosition(leftX, y);
    this.rightBtn.setPosition(rightX, y);

    this.leftIcon.setPosition(leftX + this.btnW / 2, y + this.btnH / 2);
    this.rightIcon.setPosition(rightX + this.btnW / 2, y + this.btnH / 2);
  }

  destroy() {
    this.container.destroy(true);
  }
}