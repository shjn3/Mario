import { IBulletConstructor } from "../interfaces/bullet.interface";
export class Bullet extends Phaser.Physics.Arcade.Image {
  private life: number;
  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);
    this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    aParams.left ? this.body.setVelocityX(-100) : this.body.setVelocityX(100);
    this.body.setAllowGravity(false);
    this.life = 150;
  }

  update(): void {
    if (this.life > 0) {
      this.life--;
    } else {
      this.destroy();
    }
  }
}
