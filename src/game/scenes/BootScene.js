import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, TILE } from "../constants.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.createPlaceholderTextures();
    this.scene.start("StartScene");
  }

  createPlaceholderTextures() {
    const makeTex = (key, w, h, drawFn) => {
      const rt = this.make.renderTexture({ x: 0, y: 0, width: w, height: h }, false);
      rt.clear();
      drawFn(rt);
      rt.saveTexture(key);
      rt.destroy();
    };

    makeTex("pxSky", 64, 64, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x2a2a40, 1);
      g.fillRect(0, 0, 64, 64);
      g.fillStyle(0x34345a, 1);
      g.fillRect(0, 32, 64, 32);
      g.fillStyle(0xffffff, 0.06);
      g.fillRect(6, 10, 12, 4);
      g.fillRect(40, 16, 16, 4);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxGroundTile", TILE, TILE, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x2f6b3d, 1);
      g.fillRect(0, 0, TILE, TILE);
      g.fillStyle(0x214d2b, 1);
      g.fillRect(0, TILE - 4, TILE, 4);

      g.fillStyle(0x3f8a52, 1);
      g.fillRect(2, 2, 3, 3);
      g.fillRect(10, 5, 3, 3);

      g.fillStyle(0x1a1a1f, 0.15);
      g.fillRect(0, 0, TILE, 1);

      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxPlayerBase", 32, 48, (rt) => {
      const g = this.add.graphics();

      g.fillStyle(0xffe4d2, 1);
      g.fillRect(12, 8, 8, 10);

      g.fillStyle(0x111118, 1);
      g.fillRect(10, 2, 12, 10);
      g.fillRect(10, 12, 12, 4);

      g.fillStyle(0xbfdcff, 1);
      g.fillRect(9, 18, 14, 10);
      g.fillStyle(0xffffff, 1);
      g.fillRect(9, 20, 14, 2);
      g.fillRect(9, 24, 14, 2);

      g.fillStyle(0xbfdcff, 1);
      g.fillRect(9, 28, 14, 8);
      g.fillStyle(0xffffff, 1);
      g.fillRect(9, 30, 14, 2);
      g.fillRect(9, 34, 14, 2);

      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 38, 6, 8);
      g.fillRect(16, 38, 6, 8);

      g.fillStyle(0x000000, 0.18);
      g.fillRect(10, 46, 12, 2);

      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxOverlayTshirt", 32, 48, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillRect(9, 18, 14, 10);
      g.fillStyle(0xe8e8e8, 1);
      g.fillRect(14, 22, 4, 3);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxOverlayGuitar", 32, 48, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.12);
      g.fillRect(20, 14, 4, 28);

      g.fillStyle(0x7a3f20, 1);
      g.fillRect(20, 14, 3, 28);

      g.fillStyle(0xf2a24a, 1);
      g.fillRect(14, 24, 10, 10);
      g.fillStyle(0x000000, 0.35);
      g.fillRect(16, 28, 6, 2);

      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxOverlayHat", 32, 48, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x2a6cff, 1);
      g.fillTriangle(16, 0, 9, 12, 23, 12);
      g.fillStyle(0xffffff, 1);
      g.fillRect(11, 6, 10, 2);
      g.fillRect(12, 9, 8, 2);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxGiftClosed", 24, 24, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xff4d6d, 1);
      g.fillRect(0, 4, 24, 20);
      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 4, 4, 20);
      g.fillRect(0, 12, 24, 4);
      g.fillStyle(0xffd166, 1);
      g.fillRect(6, 0, 12, 6);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxGiftOpen", 24, 24, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xaa2c44, 1);
      g.fillRect(0, 8, 24, 16);
      g.fillStyle(0xff4d6d, 1);
      g.fillRect(2, 10, 20, 12);
      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 8, 4, 16);
      g.fillStyle(0xffd166, 1);
      g.fillRect(0, 4, 10, 4);
      g.fillRect(14, 4, 10, 4);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxBubble", 48, 24, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(0, 0, 48, 20, 6);
      g.fillTriangle(16, 20, 22, 20, 18, 24);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxHill", 90, 46, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x2e7b45, 1);
      g.fillEllipse(45, 32, 90, 50);
      g.fillStyle(0x1f5a32, 0.35);
      g.fillEllipse(52, 36, 70, 40);
      g.fillStyle(0xffffff, 0.2);
      g.fillEllipse(30, 26, 20, 12);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxCloud", 70, 28, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillEllipse(18, 16, 26, 16);
      g.fillEllipse(34, 12, 32, 18);
      g.fillEllipse(52, 16, 28, 16);
      g.fillStyle(0x000000, 0.08);
      g.fillEllipse(36, 20, 50, 14);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxSign", 44, 44, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x8a5a2b, 1);
      g.fillRect(20, 20, 4, 24);
      g.fillStyle(0xc18a4a, 1);
      g.fillRoundedRect(2, 4, 40, 20, 4);
      g.fillStyle(0x000000, 0.15);
      g.fillRect(4, 6, 36, 1);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxFlower", 20, 26, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x2f6b3d, 1);
      g.fillRect(9, 12, 2, 14);
      g.fillStyle(0xffd166, 1);
      g.fillCircle(10, 10, 4);
      g.fillStyle(0xff6b6b, 1);
      g.fillCircle(10, 4, 4);
      g.fillStyle(0x000000, 0.12);
      g.fillRect(8, 25, 4, 1);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxArrowRight", 18, 18, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(4, 4, 4, 14, 14, 9);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxConfetti", 6, 6, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 6, 6);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxCake", 28, 26, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffc6d9, 1);
      g.fillRoundedRect(0, 8, 28, 18, 4);
      g.fillStyle(0xffffff, 1);
      g.fillRect(2, 14, 24, 2);
      g.fillStyle(0xffffff, 0.3);
      g.fillRect(2, 10, 24, 1);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxCandle", 6, 14, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 1);
      g.fillRect(2, 2, 2, 12);
      g.fillStyle(0xfff1a6, 1);
      g.fillCircle(3, 2, 2);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxSpot", 120, 34, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x000000, 1);
      g.fillEllipse(60, 20, 110, 24);
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(60, 24, 90, 20);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxHole", 100, 30, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x000000, 1);
      g.fillEllipse(50, 15, 96, 24);
      g.fillStyle(0x000000, 0.35);
      g.fillEllipse(58, 17, 70, 18);
      rt.draw(g, 0, 0);
      g.destroy();
    });

    makeTex("pxBtn", 46, 46, (rt) => {
      const g = this.add.graphics();
      g.fillStyle(0x222222, 1);
      g.fillRoundedRect(0, 0, 46, 46, 12);
      g.fillStyle(0xffffff, 0.08);
      g.fillRoundedRect(2, 2, 42, 18, 10);
      rt.draw(g, 0, 0);
      g.destroy();
    });
  }
}