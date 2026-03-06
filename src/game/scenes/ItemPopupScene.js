import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, UI_TEXT } from "../constants.js";
import { sparkle } from "../util/PixelFX.js";

export default class ItemPopupScene extends Phaser.Scene {
  constructor() {
    super("ItemPopupScene");
  }

  init(data) {
    this.itemKey = data.itemKey;
    this.onWear = data.onWear;
  }

  create() {
    const meta = UI_TEXT.items[this.itemKey];

    const overlay = this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.62)
      .setOrigin(0, 0);

    const cardW = 440;
    const cardH = 200;

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const card = this.add
      .rectangle(cx, cy, cardW, cardH, 0x111111, 1)
      .setStrokeStyle(2, 0xffffff, 0.25);

    const acquired = this.add.text(cx, cy - 82, UI_TEXT.acquired, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      color: "#ffd166"
    }).setOrigin(0.5, 0.5);

    const title = this.add.text(cx, cy - 60, meta.name, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    const iconBox = this.add
      .rectangle(cx - 160, cy - 8, 72, 72, 0x222222, 1)
      .setStrokeStyle(2, 0xffffff, 0.18);

    const iconLabel = this.add.text(cx - 160, cy - 8, "아이템", {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "12px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    iconBox.setScale(0.3);
    iconLabel.setScale(0.3);

    this.tweens.add({
      targets: [iconBox, iconLabel],
      scale: 1,
      duration: 320,
      ease: "Back.easeOut"
    });

    sparkle(this, cx - 160, cy - 8, 900);

    const lines = meta.descLines || ["", ""];
    const desc1 = this.add.text(cx - 110, cy - 18, lines[0], {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "13px",
      color: "#ffffff"
    }).setOrigin(0, 0.5);

    const desc2 = this.add.text(cx - 110, cy + 8, lines[1] || "", {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "13px",
      color: "#ffffff"
    }).setOrigin(0, 0.5);

    const btnW = 180;
    const btnH = 44;

    const btn = this.add
      .rectangle(cx, cy + 66, btnW, btnH, 0xffffff, 1)
      .setStrokeStyle(2, 0x000000, 0.2);

    const btnText = this.add.text(cx, cy + 66, UI_TEXT.wearBtn, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "16px",
      color: "#000000"
    }).setOrigin(0.5, 0.5);

    btn.setInteractive({ useHandCursor: true });
    btn.on("pointerdown", () => {
      if (typeof this.onWear === "function") this.onWear();
      this.scene.stop();
      this.scene.resume("OverworldScene");
    });

    overlay.setInteractive();
    overlay.on("pointerdown", () => {
      this.scene.stop();
      this.scene.resume("OverworldScene");
    });

    this.tweens.add({
      targets: [acquired, title],
      y: "-=2",
      duration: 420,
      yoyo: true,
      repeat: 2
    });
  }
}