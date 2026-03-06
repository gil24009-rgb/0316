import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CUT_Q_TIME_MS,
  CUT_SHAKE_MS,
  CUT_FALL_MS
} from "../constants.js";

import AudioManager from "../audio/AudioManager.js";
import { loadState, saveState } from "../state/SaveState.js";

export default class FallCutsceneScene extends Phaser.Scene {
  constructor() {
    super("FallCutsceneScene");
  }

  init(data) {
    this.equipped = data.equipped || {};
    this.audioUnlocked = !!data.audioUnlocked;
  }

  create() {
    this.save = loadState();

    this.audio = new AudioManager(this);
    if (this.audioUnlocked) this.audio.unlock();

    this.cameras.main.setBackgroundColor("#0b0b0f");

    this.sky = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "pxSky").setOrigin(0, 0);

    this.groundY = GAME_HEIGHT - 42;
    this.ground = this.add.tileSprite(0, this.groundY, GAME_WIDTH, 42, "pxGroundTile").setOrigin(0, 0);

    this.player = this.add.sprite(GAME_WIDTH / 2, this.groundY - 6, "pxPlayerBase").setOrigin(0.5, 1);

    this.overlayT = this.add.sprite(this.player.x, this.player.y, "pxOverlayTshirt").setOrigin(0.5, 1).setVisible(!!this.equipped.tshirt);
    this.overlayG = this.add.sprite(this.player.x, this.player.y, "pxOverlayGuitar").setOrigin(0.5, 1).setVisible(!!this.equipped.guitar);
    this.overlayH = this.add.sprite(this.player.x, this.player.y, "pxOverlayHat").setOrigin(0.5, 1).setVisible(!!this.equipped.hat);

    this.question = this.add.text(this.player.x, this.player.y - 70, "?", {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "28px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    this.audio.playSfx("question");

    this.time.delayedCall(CUT_Q_TIME_MS, () => {
      if (this.question) this.question.destroy();

      this.audio.playSfx("shake");
      this.cameras.main.shake(CUT_SHAKE_MS, 0.012);

      this.time.delayedCall(CUT_SHAKE_MS, () => {
        this.makeHoleAndFall();
      });
    });
  }

  makeHoleAndFall() {
    this.hole = this.add.image(GAME_WIDTH / 2, this.groundY + 10, "pxHole").setOrigin(0.5, 0.5);
    this.hole.setDepth(2);

    this.audio.playSfx("fall");

    const targets = [this.player, this.overlayT, this.overlayG, this.overlayH];

    this.tweens.add({
      targets,
      y: GAME_HEIGHT + 120,
      duration: CUT_FALL_MS,
      ease: "Cubic.easeIn",
      onComplete: () => {
        this.audio.playSfx("thud");

        this.save.progress.fellToUnderground = true;
        saveState(this.save);

        this.scene.start("UndergroundScene", {
          equipped: { ...this.equipped },
          audioUnlocked: this.audio.unlocked
        });
      }
    });
  }

  update(time, dt) {
    this.sky.tilePositionX += 0.04 * (dt / 16.666);
    this.ground.tilePositionX += 0.18 * (dt / 16.666);

    this.overlayT.setPosition(this.player.x, this.player.y);
    this.overlayG.setPosition(this.player.x, this.player.y);
    this.overlayH.setPosition(this.player.x, this.player.y);
  }
}