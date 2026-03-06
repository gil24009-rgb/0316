import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, UI_TEXT, VIDEO_FILE } from "../constants.js";
import AudioManager from "../audio/AudioManager.js";
import { sparkle, confettiBurst } from "../util/PixelFX.js";
import { loadState, saveState } from "../state/SaveState.js";
import VideoOverlay from "./VideoOverlay.js";

export default class PartyScene extends Phaser.Scene {
  constructor() {
    super("PartyScene");
  }

  init(data) {
    this.equipped = data.equipped || {};
    this.audioUnlocked = !!data.audioUnlocked;
  }

  create() {
    this.save = loadState();

    this.audio = new AudioManager(this);
    if (this.audioUnlocked) this.audio.unlock();

    this.cameras.main.setBackgroundColor("#15152a");

    this.stage = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 540, 180, 0x1b1b35, 1)
      .setStrokeStyle(2, 0xffffff, 0.12);

    this.banner = this.add.text(GAME_WIDTH / 2, 40, UI_TEXT.stageBanner, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "20px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    this.banner.y = -24;
    this.tweens.add({
      targets: this.banner,
      y: 40,
      duration: 520,
      ease: "Back.easeOut"
    });

    sparkle(this, GAME_WIDTH / 2, 58, 1400);
    confettiBurst(this, GAME_WIDTH / 2, 64, 20);

    this.player = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 76, "pxPlayerBase").setOrigin(0.5, 1);

    this.overlayT = this.add.sprite(this.player.x, this.player.y, "pxOverlayTshirt").setOrigin(0.5, 1).setVisible(!!this.equipped.tshirt);
    this.overlayG = this.add.sprite(this.player.x, this.player.y, "pxOverlayGuitar").setOrigin(0.5, 1).setVisible(!!this.equipped.guitar);
    this.overlayH = this.add.sprite(this.player.x, this.player.y, "pxOverlayHat").setOrigin(0.5, 1).setVisible(!!this.equipped.hat);

    // 피아노는 무대 오른쪽
    this.piano = this.add.rectangle(GAME_WIDTH / 2 + 128, GAME_HEIGHT / 2 + 104, 92, 52, 0x0a0a10, 1).setStrokeStyle(2, 0xffffff, 0.12);

    // 무대 주변에 장식처럼 흩어 배치
    this.partner = this.makeNpc(GAME_WIDTH / 2 + 190, GAME_HEIGHT / 2 + 86, "애인");
    this.grandma = this.makeNpc(GAME_WIDTH / 2 - 230, GAME_HEIGHT / 2 + 92, "할머니");
    this.parrot = this.makeNpc(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 + 40, "앵무새");

    this.chii1 = this.makeNpc(GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 96, "치이카와");
    this.chii2 = this.makeNpc(GAME_WIDTH / 2 - 10, GAME_HEIGHT / 2 + 96, "하치와레");
    this.chii3 = this.makeNpc(GAME_WIDTH / 2 + 50, GAME_HEIGHT / 2 + 96, "우사기");

    this.gundam1 = this.makeNpc(GAME_WIDTH / 2 + 250, GAME_HEIGHT / 2 + 94, "건담 1");
    this.gundam2 = this.makeNpc(GAME_WIDTH / 2 + 285, GAME_HEIGHT / 2 + 94, "건담 2");

    this.audio.startBgmParty();

    this.startCheerLoop();

    this.celebrateBubble = this.add.image(this.partner.body.x, this.partner.body.y - 78, "pxBubble").setDepth(50);
    this.celebrateText = this.add.text(this.partner.body.x, this.partner.body.y - 80, UI_TEXT.celebrateBubble, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "12px",
      color: "#000000"
    }).setOrigin(0.5, 0.5).setDepth(51);

    this.celebrateBubble.setInteractive({ useHandCursor: true });
    this.celebrateText.setInteractive({ useHandCursor: true });

    const play = () => this.playVideo();

    this.celebrateBubble.on("pointerdown", play);
    this.celebrateText.on("pointerdown", play);

    this.afterVideo = !!this.save.progress.videoWatchedOrClosed;
    if (this.afterVideo) {
      this.applyAfterVideoState();
    }
  }

  makeNpc(x, y, label) {
    const body = this.add.rectangle(x, y, 34, 44, 0x222244, 1).setOrigin(0.5, 1).setStrokeStyle(2, 0xffffff, 0.12);

    const t = this.add.text(x, y - 54, label, {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      color: "#ffffff"
    }).setOrigin(0.5, 0.5);

    return { body, t };
  }

  startCheerLoop() {
    const jumpTargets = [
      this.partner.body,
      this.grandma.body,
      this.parrot.body,
      this.chii1.body,
      this.chii2.body,
      this.chii3.body,
      this.gundam1.body,
      this.gundam2.body
    ];

    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => {
        this.tweens.add({
          targets: jumpTargets,
          y: "-=6",
          duration: 160,
          yoyo: true
        });

        this.tweens.add({
          targets: this.stage,
          x: GAME_WIDTH / 2 + Phaser.Math.Between(-1, 1),
          duration: 120,
          yoyo: true,
          repeat: 1
        });

        sparkle(this, Phaser.Math.Between(60, GAME_WIDTH - 60), Phaser.Math.Between(40, 140), 600);
        confettiBurst(this, Phaser.Math.Between(80, GAME_WIDTH - 80), Phaser.Math.Between(50, 120), 6);

        const pick = ["party1", "party2", "party3"];
        this.audio.playSfx(pick[Math.floor(Math.random() * pick.length)]);
      }
    });
  }

  playVideo() {
    if (this._playing) return;
    this._playing = true;

    this.celebrateBubble.setVisible(false);
    this.celebrateText.setVisible(false);

    // 정책: 영상 중간에 닫아도 후반 상태로 전환
    const overlay = new VideoOverlay(VIDEO_FILE, () => {
      this._playing = false;
      this.onVideoEndOrClosed();
    });
    overlay.open();
  }

  onVideoEndOrClosed() {
    if (this.afterVideo) return;

    this.afterVideo = true;
    this.save.progress.videoWatchedOrClosed = true;
    saveState(this.save);

    this.applyAfterVideoState();
  }

  applyAfterVideoState() {
    // 케이크 들고 있는 상태
    if (!this.cake) {
      this.cake = this.add.image(this.player.x + 44, this.player.y - 24, "pxCake").setOrigin(0.5, 1).setDepth(20);
      this.candle = this.add.image(this.player.x + 44, this.player.y - 50, "pxCandle").setOrigin(0.5, 1).setDepth(21);

      this.tweens.add({
        targets: this.candle,
        alpha: 0.45,
        duration: 120,
        yoyo: true,
        repeat: -1
      });
    }

    // 다운로드 버튼 + 안내 문구
    if (!this.downloadBtn) {
      const btnY = GAME_HEIGHT - 34;

      this.downloadBtn = this.add
        .rectangle(GAME_WIDTH / 2, btnY, 240, 42, 0xffffff, 1)
        .setStrokeStyle(2, 0x000000, 0.2)
        .setDepth(100);

      this.downloadText = this.add.text(GAME_WIDTH / 2, btnY, UI_TEXT.downloadBtn, {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        color: "#000000"
      }).setOrigin(0.5, 0.5).setDepth(101);

      this.downloadHint = this.add.text(GAME_WIDTH / 2, btnY + 26, UI_TEXT.downloadHint, {
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "11px",
        color: "#ffffff"
      }).setOrigin(0.5, 0.5).setDepth(101).setAlpha(0.8);

      const openVideo = () => {
        window.open(VIDEO_FILE, "_blank", "noopener,noreferrer");
      };

      this.downloadBtn.setInteractive({ useHandCursor: true });
      this.downloadText.setInteractive({ useHandCursor: true });

      this.downloadBtn.on("pointerdown", openVideo);
      this.downloadText.on("pointerdown", openVideo);
    }
  }
}