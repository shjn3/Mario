import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { HUDScene } from "./scenes/hud-scene";
import { MenuScene } from "./scenes/menu-scene";
import { OverScene } from "./scenes/over-scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "Super Mario Land",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "2.0",

  width: 400,
  height: 304,
  zoom: 2,
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
  backgroundColor: "#5C94FC",
  render: { pixelArt: false, antialias: false },
};
