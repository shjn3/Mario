import { IArrowDirection } from '../interfaces/arrowDirection.interface';

export class ArrowDirection extends Phaser.GameObjects.Image {
  private currentScene: Phaser.Scene;
  protected tweenprops: any;
  constructor(aParam: IArrowDirection) {
    super(aParam.scene, aParam.x, aParam.y, aParam.texture);
    this.currentScene = aParam.scene;
    this.tweenprops = aParam.tweenProps;
    this.initImage();
    this.initTween();
    this.currentScene.add.existing(this);
  }
  initImage() {
    this.setDisplaySize(16, 10);
    this.setOrigin(0, 1);
  }
  initTween() {
    this.currentScene.tweens.add({
      targets: this,
      props: this.tweenprops,
      yoyo: true,
      repeat: -1
    });
  }
}
