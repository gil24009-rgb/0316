import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants.js";

import BootScene from "./scenes/BootScene.js";
import StartScene from "./scenes/StartScene.js";
import OverworldScene from "./scenes/OverworldScene.js";
import ItemPopupScene from "./scenes/ItemPopupScene.js";
import FallCutsceneScene from "./scenes/FallCutsceneScene.js";
import UndergroundScene from "./scenes/UndergroundScene.js";
import PartyScene from "./scenes/PartyScene.js";

export const gameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0b0b0f",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  input: {
    activePointers: 2
  },
  scene: [
    BootScene,
    StartScene,
    OverworldScene,
    ItemPopupScene,
    FallCutsceneScene,
    UndergroundScene,
    PartyScene
  ]
};