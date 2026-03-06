export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.unlocked = false;
    this.bgmTimer = null;
    this.bgmMode = "none";
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
  }

  stopBgm() {
    if (this.bgmTimer) {
      this.bgmTimer.remove(false);
      this.bgmTimer = null;
    }
    this.bgmMode = "none";
  }

  startBgmOverworld() {
    if (!this.unlocked) return;
    if (this.bgmMode === "overworld") return;

    this.stopBgm();
    this.bgmMode = "overworld";

    this.bgmTimer = this.scene.time.addEvent({
      delay: 420,
      loop: true,
      callback: () => {
        this.beep(240, 0.04, "square", 0.03);
        this.scene.time.delayedCall(120, () => this.beep(320, 0.03, "square", 0.025));
        this.scene.time.delayedCall(240, () => this.beep(280, 0.03, "square", 0.025));
      }
    });
  }

  startBgmUnderground() {
    if (!this.unlocked) return;
    if (this.bgmMode === "underground") return;

    this.stopBgm();
    this.bgmMode = "underground";

    this.bgmTimer = this.scene.time.addEvent({
      delay: 520,
      loop: true,
      callback: () => {
        this.beep(150, 0.06, "triangle", 0.025);
        this.scene.time.delayedCall(220, () => this.beep(110, 0.05, "triangle", 0.022));
      }
    });
  }

  startBgmParty() {
    if (!this.unlocked) return;
    if (this.bgmMode === "party") return;

    this.stopBgm();
    this.bgmMode = "party";

    this.bgmTimer = this.scene.time.addEvent({
      delay: 360,
      loop: true,
      callback: () => {
        this.beep(440, 0.05, "sine", 0.03);
        this.scene.time.delayedCall(120, () => this.beep(660, 0.04, "sine", 0.026));
        this.scene.time.delayedCall(240, () => this.beep(550, 0.04, "sine", 0.026));
      }
    });
  }

  playSfx(name) {
    if (!this.unlocked) return;

    const map = {
      bubbleAppear: [660, 0.05, "square", 0.03],
      itemOpen: [520, 0.08, "square", 0.03],
      equip: [740, 0.06, "square", 0.03],
      question: [400, 0.08, "square", 0.03],
      shake: [120, 0.12, "sawtooth", 0.02],
      fall: [200, 0.12, "sawtooth", 0.02],
      thud: [80, 0.18, "square", 0.03],
      blink: [980, 0.03, "square", 0.02],
      lightOn: [900, 0.07, "square", 0.02],
      fanfare: [520, 0.12, "sine", 0.03],
      party1: [700, 0.06, "sine", 0.02],
      party2: [850, 0.06, "sine", 0.02],
      party3: [1020, 0.06, "sine", 0.02]
    };

    const v = map[name];
    if (!v) return;

    this.beep(v[0], v[1], v[2], v[3]);
  }

  beep(freq, dur, type = "square", gainValue = 0.03) {
    try {
      const ctx = this.scene.sound.context;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;

      gain.gain.value = gainValue;

      osc.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime;
      osc.start(t);
      osc.stop(t + dur);
    } catch (e) {
    }
  }
}