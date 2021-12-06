import { Enemy } from "./enemy";
import { ISpriteConstructor } from "../interfaces/sprite.interface";

export class Carnivorous extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  constructor(aParam: ISpriteConstructor) {
    super(aParam);
    this.body.enable = false;
    this.isActivated = false;
    //   this.wakeUp();
  }
  update() {}
  public isDead(): void {
    this.destroy();
  }
  public wakeUp(): void {
    this.currentScene.tweens.add({
      targets: this,
      duration: 300,
      ease: "power0",
      props: {
        y: this.y - 10,
        alpha: 1,
      },
      yoyo: false,
      onComplete: () => {
        this.body.enable = true;
      },
    });
  }
  public gotHitOnHead(): void {
    this.body.enable = false;
  }
}
