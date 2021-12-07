import { Game } from "phaser";

export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: "MenuScene",
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.startKey.isDown = false;
    this.initGlobalDataManager();
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#f8f8f8");
    this.add
      .image(
        this.sys.canvas.width / 2 - 80,
        this.sys.canvas.height / 2 - 60,
        "title",
      )
      .setOrigin(0, 0);

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 40,
        this.sys.canvas.height / 2 + 50,
        "font",
        "START",
        18,
      ),
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("HUDScene");
      this.scene.start("GameScene");
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set("time", 400);
    this.registry.set("level", "level1");
    this.registry.set("world", "1-3");
    this.registry.set("worldTime", "WORLD TIME");
    this.registry.set("score", 0);
    this.registry.set("coins", 0);
    this.registry.set("lives", 2);
    this.registry.set("spawn", { x: 15, y: 44, dir: "down" });
    this.registry.set("marioSize", "small");
  }
}
