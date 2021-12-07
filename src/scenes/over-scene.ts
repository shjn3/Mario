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
    this.cameras.main.setBackgroundColor("#f8f8f8");
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 100,
        100,
        "font",
        "Game Over",
        20,
      ),
    );
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 100,
        140,
        "font",
        `Press P to\n\nplay again`,
        20,
      ),
    );
  }
  update() {
    if (this.playAgainKey.isDown) {
      this.scene.start("MenuScene");
    }
  }
}
