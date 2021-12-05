import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { HUDScene } from "./scenes/hud-scene";
import { MenuScene } from "./scenes/menu-scene";
import { OverScene } from "./scenes/over-scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "Super Mario Land",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "2.0",
  width: 160,
  height: 144,
  zoom: 5,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, MenuScene, HUDScene, GameScene, OverScene],
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 475 },
      debug: false,
    },
  },
  backgroundColor: "#f8f8f8",
  // render: { pixelArt: false, antialias: false },
};
