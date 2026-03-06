import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, UI_TEXT } from "../constants.js";
import AudioManager from "../audio/AudioManager.js";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.tryLockLandscape();

    this.audio = new AudioManager(this);

    this.sky = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "pxSky").setOrigin(0, 0);

    const groundY = GAME_HEIGHT - 42;
    this.ground = this.add.tileSprite(0, groundY, GAME_WIDTH, 42, "pxGroundTile").setOrigin(0, 0);

    this.add.image(120, groundY + 2, "pxHill").setOrigin(0.5, 1).setAlpha(0.95);
    this.add.image(60, groundY + 4, "pxHill").setOrigin(0.5, 1).setScale(0.75).setAlpha(0.9);
    this.add.image(210, groundY + 6, "pxHill").setOrigin(0.5, 1).setScale(0.65).setAlpha(0.85);

    this.cloud1 = this.add.image(140, 48, "pxCloud").setOrigin(0.5, 0.5).setAlpha(0.95);
    this.cloud2 = this.add.image(360, 34, "pxCloud").setOrigin(0.5, 0.5).setScale(1.15).setAlpha(0.95);
    this.cloud3 = this.add.image(500, 62, "pxCloud").setOrigin(0.5, 0.5).setScale(0.9).setAlpha(0.95);

    this.sign = this.add.image(430, groundY + 2, "pxSign").setOrigin(0.5, 1);
    this.flow1 = this.add.image(470, groundY + 2, "pxFlower").setOrigin(0.5, 1);
    this.flow2 = this.add.image(500, groundY + 2, "pxFlower").setOrigin(0.5, 1).setScale(0.9);
    this.flow3 = this.add.image(530, groundY + 2, "pxFlower").setOrigin(0.5, 1).setScale(0.85);

    this.player = this.add.sprite(170, groundY - 6, "pxPlayerBase").setOrigin(0.5, 1);

    this.rightHint = this.add.image(GAME_WIDTH - 28, 18, "pxArrowRight").setOrigin(0.5, 0.5).setAlpha(0.9);

    this.title = this.add.text(GAME_WIDTH / 2, 24, UI_TEXT.title, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "22px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    this.hint = this.add.text(GAME_WIDTH / 2, groundY + 18, UI_TEXT.startHint, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "16px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this.hint,
      alpha: 0.35,
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    this.input.once("pointerdown", () => {
      this.audio.unlock();
      this.scene.start("OverworldScene", { audioUnlocked: true });
    });
  }

  tryLockLandscape() {
    const so = screen.orientation;
    if (so && so.lock) {
      so.lock("landscape").catch(() => {});
    }
  }

  update(time, dt) {
    this.sky.tilePositionX += 0.05 * (dt / 16.666);
    this.ground.tilePositionX += 0.22 * (dt / 16.666);

    this.cloud1.x += 0.06 * (dt / 16.666);
    this.cloud2.x += 0.04 * (dt / 16.666);
    this.cloud3.x += 0.05 * (dt / 16.666);

    if (this.cloud1.x > GAME_WIDTH + 60) this.cloud1.x = -60;
    if (this.cloud2.x > GAME_WIDTH + 60) this.cloud2.x = -60;
    if (this.cloud3.x > GAME_WIDTH + 60) this.cloud3.x = -60;

    this.rightHint.alpha = 0.65 + 0.25 * Math.sin(time / 400);
  }
}