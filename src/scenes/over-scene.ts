export class OverScene extends Phaser.Scene {
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  private playAgainKey: Phaser.Input.Keyboard.Key;
  constructor() {
    super("OverScene");
  }
  init(): void {
    this.playAgainKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.P,
    );
    this.playAgainKey.isDown = false;
  }
  create() {
    // this.cameras.main.setBackgroundColor("#000000");
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 50,
        30,
        "font",
        "Game Over",
        8,
      ),
    );
    // this.bitmapTexts.push(
    //   this.add.bitmapText(
    //     this.sys.canvas.width / 2 - 50,
    //     45,
    //     "font",
    //     `Score: ${this.registry.get("score")}`,
    //     8,
    //   ),
    // );
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 50,
        45,
        "font",
        `Press P to\n\nplay again`,
        8,
      ),
    );
  }
  update() {
    if (this.playAgainKey.isDown) {
      this.scene.start("MenuScene");
    }
  }
}
