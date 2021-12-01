export interface IBulletConstructor {
  scene: Phaser.Scene;
  left: boolean;
  content?: any;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
}
