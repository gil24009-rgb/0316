import Phaser from "phaser";

export function sparkle(scene, x, y, durationMs = 2000) {
  const count = 14;
  const dots = [];

  for (let i = 0; i < count; i++) {
    const img = scene.add.image(x, y, "pxConfetti").setDepth(5000);
    img.setScale(Phaser.Math.FloatBetween(0.4, 0.85));
    dots.push(img);

    const angle = (Math.PI * 2 * i) / count;
    const r = 6 + Math.random() * 10;

    scene.tweens.add({
      targets: img,
      x: x + Math.cos(angle) * r,
      y: y + Math.sin(angle) * r,
      alpha: 0,
      duration: 220 + Math.random() * 220,
      repeat: Math.floor(durationMs / 280),
      onRepeat: () => {
        img.x = x;
        img.y = y;
        img.alpha = 1;
      }
    });
  }

  scene.time.delayedCall(durationMs, () => {
    dots.forEach((d) => d.destroy());
  });
}

export function confettiBurst(scene, x, y, count = 22) {
  for (let i = 0; i < count; i++) {
    const img = scene.add.image(x, y, "pxConfetti").setDepth(5000);
    img.setScale(Phaser.Math.FloatBetween(0.35, 0.9));

    const vx = Phaser.Math.FloatBetween(-80, 80);
    const vy = Phaser.Math.FloatBetween(-160, -60);

    scene.tweens.add({
      targets: img,
      x: x + vx,
      y: y + vy,
      alpha: 0,
      angle: Phaser.Math.FloatBetween(-180, 180),
      duration: Phaser.Math.Between(520, 900),
      ease: "Cubic.easeOut",
      onComplete: () => img.destroy()
    });
  }
}