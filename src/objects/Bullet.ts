import { IBulletConstructor } from "../interfaces/bullet.interface";
export class Bullet extends Phaser.Physics.Arcade.Image {
  private life: number;
  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    // variable
    this.initImage(aParams.left);
    this.scene.add.existing(this);
  }
  private initImage(isLeft: boolean) {
    //variables
    this.life = 150;
    //image
    this.setScale(0.2);
    //physics
    this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
    this.scene.physics.world.enable(this);
    if (isLeft) {
      this.body.setVelocityX(-100);
      this.setRotation(-Math.PI / 2);
    } else {
      this.body.setVelocityX(100);
      this.setRotation(Math.PI / 2);
    }
    this.body.setAllowGravity(false);
  }

  update(): void {
    if (this.life > 0) {
      this.life--;
    } else {
      this.destroy();
    }
  }
}
