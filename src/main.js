import Phaser from "phaser";
import { gameConfig } from "./game/config.js";

window.addEventListener("load", () => {
  new Phaser.Game(gameConfig);
});