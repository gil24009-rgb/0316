import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  MOVE_SPEED,
  UNDERGROUND_INTERACT_X,
  INTERACT_DIST,
  BUBBLE_DELAY_MS
} from "../constants.js";

import TouchControls from "../ui/TouchControls.js";
import TextBubble from "../ui/TextBubble.js";
import AudioManager from "../audio/AudioManager.js";
import { confettiBurst } from "../util/PixelFX.js";
import { loadState, saveState } from "../state/SaveState.js";

export default class UndergroundScene extends Phaser.Scene {
  constructor() {
    super("UndergroundScene");
  }

  init(data) {
    this.equipped = data.equipped || {};
    this.audioUnlocked = !!data.audioUnlocked;
  }

  create() {
    this.save = loadState();

    this.audio = new AudioManager(this);
    if (this.audioUnlocked) this.audio.unlock();

    this.cameras.main.setBackgroundColor("#05050a");

    this.worldW = UNDERGROUND_INTERACT_X + 900;

    this.floorY = GAME_HEIGHT - 34;
    this.floor = this.add.rectangle(0, this.floorY, this.worldW, 34, 0x0c0c14, 1).setOrigin(0, 0);

    this.spot = this.add.image(90, this.floorY + 8, "pxSpot").setOrigin(0.5, 1).setAlpha(0.55);

    this.player = this.add.sprite(80, this.floorY + 6, "pxPlayerBase").setOrigin(0.5, 1);
    this.player.setAlpha(0.16);

    this.overlayT = this.add.sprite(this.player.x, this.player.y, "pxOverlayTshirt").setOrigin(0.5, 1).setVisible(!!this.equipped.tshirt).setAlpha(0.16);
    this.overlayG = this.add.sprite(this.player.x, this.player.y, "pxOverlayGuitar").setOrigin(0.5, 1).setVisible(!!this.equipped.guitar).setAlpha(0.16);
    this.overlayH = this.add.sprite(this.player.x, this.player.y, "pxOverlayHat").setOrigin(0.5, 1).setVisible(!!this.equipped.hat).setAlpha(0.16);

    this.audio.startBgmUnderground();

    this.controls = new TouchControls(this);

    this.cameras.main.setBounds(0, 0, this.worldW, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12, -120, 0);

    this.trigger = this.add.rectangle(UNDERGROUND_INTERACT_X, this.floorY - 10, 34, 48, 0xffffff, 0).setOrigin(0.5, 1);

    this.bubble = new TextBubble(this, "pxBubble");
    this.nearEnterAt = 0;
    this.nearShown = false;

    this.startBlinkLoop();

    this.input.on("pointerdown", (p) => {
      const interacted = this.tryPointerInteract(p.worldX, p.worldY);
      if (interacted) return;
    });

    this.nearEnterAt = this.time.now;
  }

  startBlinkLoop() {
    const eye = this.add.rectangle(this.player.x, this.player.y - 34, 10, 4, 0xffffff, 1).setOrigin(0.5, 0.5).setDepth(200);
    eye.setAlpha(0);

    this.time.addEvent({
      delay: 1400,
      loop: true,
      callback: () => {
        this.audio.playSfx("blink");
        eye.setPosition(this.player.x, this.player.y - 34);
        eye.setAlpha(1);

        this.time.delayedCall(120, () => eye.setAlpha(0));
        this.time.delayedCall(280, () => {
          this.audio.playSfx("blink");
          eye.setAlpha(1);
        });
        this.time.delayedCall(420, () => eye.setAlpha(0));
      }
    });
  }

  update(time, dt) {
    const dx = this.controls.rightDown ? 1 : this.controls.leftDown ? -1 : 0;

    if (dx !== 0) {
      this.player.x += dx * (MOVE_SPEED * dt) / 1000;
    }

    if (this.player.x < 0) this.player.x = 0;

    this.overlayT.setPosition(this.player.x, this.player.y);
    this.overlayG.setPosition(this.player.x, this.player.y);
    this.overlayH.setPosition(this.player.x, this.player.y);

    this.spot.x = this.player.x;

    this.updateBubble(time);
  }

  updateBubble(time) {
    const dist = Math.abs(this.trigger.x - this.player.x);

    if (dist > INTERACT_DIST) {
      this.bubble.hide();
      this.nearShown = false;
      this.nearEnterAt = time;
      return;
    }

    if (!this.nearShown) {
      if (time - this.nearEnterAt >= BUBBLE_DELAY_MS) {
        this.nearShown = true;
        this.audio.playSfx("bubbleAppear");
        this.bubble.show("눌러줘");
        this.bubble.setWorldPosition(this.trigger.x, this.floorY - 74);
      }
    } else {
      this.bubble.setWorldPosition(this.trigger.x, this.floorY - 74);
    }
  }

  tryPointerInteract(wx, wy) {
    if (!this.nearShown) return false;

    const dBubble = Phaser.Math.Distance.Between(wx, wy, this.bubble.worldX, this.bubble.worldY);
    if (dBubble <= 34) {
      this.lightOnAndParty();
      return true;
    }

    const dTrig = Phaser.Math.Distance.Between(wx, wy, this.trigger.x, this.trigger.y - 10);
    if (dTrig <= 30) {
      this.lightOnAndParty();
      return true;
    }

    return false;
  }

  lightOnAndParty() {
    if (this._transitioning) return;
    this._transitioning = true;

    this.bubble.hide();

    this.save.progress.partyUnlocked = true;
    saveState(this.save);

    this.audio.playSfx("lightOn");

    const flash = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 0).setOrigin(0, 0).setDepth(999);

    this.tweens.add({
      targets: flash,
      alpha: 1,
      duration: 140,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.audio.playSfx("fanfare");
        confettiBurst(this, GAME_WIDTH / 2, 70, 26);

        this.audio.stopBgm();
        this.scene.start("PartyScene", {
          equipped: { ...this.equipped },
          audioUnlocked: this.audio.unlocked
        });
      }
    });
  }
}