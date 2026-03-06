import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  MOVE_SPEED,
  WORLD_START_X,
  BOX1_X,
  BOX2_X,
  BOX3_X,
  FALL_TRIGGER_X,
  INTERACT_DIST,
  BUBBLE_DELAY_MS,
  ITEM_TSHIRT,
  ITEM_GUITAR,
  ITEM_HAT
} from "../constants.js";

import TouchControls from "../ui/TouchControls.js";
import TextBubble from "../ui/TextBubble.js";
import AudioManager from "../audio/AudioManager.js";
import { sparkle } from "../util/PixelFX.js";
import { loadState, saveState } from "../state/SaveState.js";

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  init(data) {
    this.audioUnlocked = !!data.audioUnlocked;
  }

  create() {
    this.save = loadState();

    this.audio = new AudioManager(this);
    if (this.audioUnlocked) this.audio.unlock();
    this.audio.startBgmOverworld();

    this.worldW = FALL_TRIGGER_X + 700;

    this.sky = this.add.tileSprite(0, 0, this.worldW, GAME_HEIGHT, "pxSky").setOrigin(0, 0);

    this.groundY = GAME_HEIGHT - 42;
    this.ground = this.add.tileSprite(0, this.groundY, this.worldW, 42, "pxGroundTile").setOrigin(0, 0);

    this.add.image(120, this.groundY + 2, "pxHill").setOrigin(0.5, 1).setAlpha(0.9);
    this.add.image(320, this.groundY + 2, "pxHill").setOrigin(0.5, 1).setScale(0.85).setAlpha(0.8);
    this.add.image(560, this.groundY + 2, "pxHill").setOrigin(0.5, 1).setScale(0.65).setAlpha(0.75);

    this.player = this.add.sprite(80, this.groundY - 6, "pxPlayerBase").setOrigin(0.5, 1);

    this.overlayT = this.add.sprite(this.player.x, this.player.y, "pxOverlayTshirt").setOrigin(0.5, 1);
    this.overlayG = this.add.sprite(this.player.x, this.player.y, "pxOverlayGuitar").setOrigin(0.5, 1);
    this.overlayH = this.add.sprite(this.player.x, this.player.y, "pxOverlayHat").setOrigin(0.5, 1);

    this.overlayT.setVisible(!!this.save.equipped.tshirt);
    this.overlayG.setVisible(!!this.save.equipped.guitar);
    this.overlayH.setVisible(!!this.save.equipped.hat);

    this.leftWallX = WORLD_START_X;

    this.boxes = [
      this.makeBox(BOX1_X, ITEM_TSHIRT),
      this.makeBox(BOX2_X, ITEM_GUITAR),
      this.makeBox(BOX3_X, ITEM_HAT)
    ];

    this.controls = new TouchControls(this);

    this.cameras.main.setBounds(0, 0, this.worldW, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12, -120, 0);

    this.bubble = new TextBubble(this, "pxBubble");

    this.nearTarget = null;
    this.nearEnterAt = 0;
    this.nearShown = false;

    this.input.on("pointerdown", (p) => {
      const interacted = this.tryPointerInteract(p.worldX, p.worldY);
      if (interacted) return;
    });
  }

  makeBox(x, itemKey) {
    const tex = this.save.opened[itemKey] ? "pxGiftOpen" : "pxGiftClosed";
    const box = this.add.sprite(x, this.groundY + 12, tex).setOrigin(0.5, 1);
    box.itemKey = itemKey;
    box.opened = !!this.save.opened[itemKey];
    return box;
  }

  update(time, dt) {
    const dx = this.controls.rightDown ? 1 : this.controls.leftDown ? -1 : 0;

    if (dx !== 0) {
      this.player.x += dx * (MOVE_SPEED * dt) / 1000;
    }

    if (this.player.x < this.leftWallX) this.player.x = this.leftWallX;

    this.overlayT.setPosition(this.player.x, this.player.y);
    this.overlayG.setPosition(this.player.x, this.player.y);
    this.overlayH.setPosition(this.player.x, this.player.y);

    this.sky.tilePositionX = this.cameras.main.scrollX * 0.08;
    this.ground.tilePositionX = this.cameras.main.scrollX * 0.35;

    this.updateNearestBubble(time);

    if (this.player.x >= FALL_TRIGGER_X && this.allEquipped()) {
      this.save.progress.overworldDone = true;
      this.save.progress.fellToUnderground = true;
      saveState(this.save);

      this.audio.stopBgm();
      this.scene.start("FallCutsceneScene", {
        equipped: { ...this.save.equipped },
        audioUnlocked: this.audio.unlocked
      });
    }
  }

  allEquipped() {
    return !!this.save.equipped.tshirt && !!this.save.equipped.guitar && !!this.save.equipped.hat;
  }

  updateNearestBubble(time) {
    const target = this.findNearestInteractable();

    if (!target) {
      this.bubble.hide();
      this.nearTarget = null;
      this.nearShown = false;
      this.nearEnterAt = time;
      return;
    }

    if (this.nearTarget !== target) {
      this.nearTarget = target;
      this.nearEnterAt = time;
      this.nearShown = false;
      this.bubble.hide();
    }

    if (!this.nearShown) {
      if (time - this.nearEnterAt >= BUBBLE_DELAY_MS) {
        this.nearShown = true;
        this.audio.playSfx("bubbleAppear");
        this.bubble.show("눌러줘");
        this.bubble.setWorldPosition(target.x, target.y - 44);
      }
    } else {
      this.bubble.setWorldPosition(target.x, target.y - 44);
    }
  }

  findNearestInteractable() {
    let best = null;
    let bestD = 999999;

    for (const b of this.boxes) {
      if (b.opened) continue;
      const d = Math.abs((b.x - 10) - this.player.x);
      if (d < bestD) {
        bestD = d;
        best = b;
      }
    }

    if (!best) return null;
    if (bestD <= INTERACT_DIST) return best;
    return null;
  }

  tryPointerInteract(wx, wy) {
    if (this.nearShown && this.nearTarget) {
      const d = Phaser.Math.Distance.Between(wx, wy, this.bubble.worldX, this.bubble.worldY);
      if (d <= 34) {
        this.tryInteract(this.nearTarget);
        return true;
      }
    }

    const hit = this.hitTestObject(wx, wy);
    if (hit) {
      this.tryInteract(hit);
      return true;
    }
    return false;
  }

  hitTestObject(wx, wy) {
    for (const b of this.boxes) {
      if (b.opened) continue;
      const d = Phaser.Math.Distance.Between(wx, wy, b.x, b.y - 10);
      if (d <= 26) return b;
    }
    return null;
  }

  tryInteract(target) {
    if (!target || target.opened) return;

    this.bubble.hide();

    this.scene.launch("ItemPopupScene", {
      itemKey: target.itemKey,
      onWear: () => {
        this.applyEquip(target.itemKey);

        target.opened = true;
        target.setTexture("pxGiftOpen");

        this.save.opened[target.itemKey] = true;
        saveState(this.save);

        sparkle(this, target.x, target.y - 14, 2000);
      }
    });

    this.scene.pause();
    this.audio.playSfx("itemOpen");
  }

  applyEquip(itemKey) {
    this.save.equipped[itemKey] = true;

    if (itemKey === ITEM_TSHIRT) this.overlayT.setVisible(true);
    if (itemKey === ITEM_GUITAR) this.overlayG.setVisible(true);
    if (itemKey === ITEM_HAT) this.overlayH.setVisible(true);

    saveState(this.save);

    sparkle(this, this.player.x, this.player.y - 26, 2000);
    this.audio.playSfx("equip");
  }
}