import Phaser from "phaser";

export default class TextBubble {
  constructor(scene, bubbleTextureKey) {
    this.scene = scene;

    this.container = scene.add.container(0, 0).setDepth(1200);
    this.bg = scene.add.image(0, 0, bubbleTextureKey).setOrigin(0.5, 0.5);
    this.text = scene.add.text(0, -2, "", {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "12px",
      color: "#000000"
    }).setOrigin(0.5, 0.5);

    this.container.add([this.bg, this.text]);
    this.container.setVisible(false);

    this.worldX = 0;
    this.worldY = 0;
  }

  show(label) {
    this.text.setText(label);
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }

  setWorldPosition(x, y) {
    this.worldX = x;
    this.worldY = y;
    this.container.setPosition(x, y);
  }
}