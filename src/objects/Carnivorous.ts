import { Enemy } from "./enemy";
import { ISpriteConstructor } from "../interfaces/sprite.interface";

export class Carnivorous extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  constructor(aParam: ISpriteConstructor) {
    super(aParam);
  }
}
