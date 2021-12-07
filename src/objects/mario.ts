import { ISpriteConstructor } from "../interfaces/sprite.interface";
import { Bullet } from "./Bullet";

export class Mario extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;
  private marioSize: string;
  private acceleration: number;
  private isJumping: boolean;
  private isDying: boolean;
  private isVulnerable: boolean;
  private vulnerableCounter: number;
  private bullets: Phaser.GameObjects.Group;
  private isShooting: boolean;

  private soundDie: Phaser.Sound.BaseSound;
  private soundJumpSmall: Phaser.Sound.BaseSound;
  private soundJumpLarge: Phaser.Sound.BaseSound;

  // input
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }

  public getVulnerable(): boolean {
    return this.isVulnerable;
  }

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
    this.soundDie = this.currentScene.sound.add("soundDie");
    this.soundJumpSmall = this.currentScene.sound.add("soundJumpSmall");
    this.soundJumpLarge = this.currentScene.sound.add("soundJumpLarge");
  }

  private initSprite() {
    // variables
    this.marioSize = this.currentScene.registry.get("marioSize");
    this.acceleration = 500;
    this.isJumping = false;
    this.isDying = false;
    this.isVulnerable = true;
    this.vulnerableCounter = 100;
    this.isShooting = false;
    this.bullets = this.scene.add.group();

    // sprite
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    // input
    this.keys = new Map([
      ["LEFT", this.addKey("LEFT")],
      ["RIGHT", this.addKey("RIGHT")],
      ["DOWN", this.addKey("DOWN")],
      ["JUMP", this.addKey("UP")],
      ["SHOOT", this.addKey("SPACE")],
    ]);

    // physics
    this.currentScene.physics.world.enable(this);
    this.adjustPhysicBodyToSmallSize();
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 500;
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(): void {
    if (!this.isDying) {
      this.handleInput();
      this.handleAnimations();
    } else {
      this.setFrame(1);
      if (this.y > this.currentScene.sys.canvas.height) {
        this.currentScene.scene.stop("GameScene");
        this.currentScene.scene.stop("HUDScene");
        // this.currentScene.scene.start("MenuScene");
        this.currentScene.scene.start("OverScene");
      }
    }

    if (!this.isVulnerable) {
      if (this.vulnerableCounter > 0) {
        this.vulnerableCounter -= 1;
      } else {
        this.vulnerableCounter = 100;
        this.isVulnerable = true;
      }
    }
    this.updateBullets();
  }

  private handleInput() {
    if (this.y > this.currentScene.sys.canvas.height) {
      // mario fell into a hole
      this.soundDie.play();
      this.isDying = true;
    }

    // evaluate if player is on the floor or on object
    // if neither of that, set the player to be jumping
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      this.body.blocked.down
    ) {
      this.isJumping = false;
      //this.body.setVelocityY(0);
    }

    // handle movements to left and right
    if (this.keys.get("RIGHT").isDown) {
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    } else if (this.keys.get("LEFT").isDown) {
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }

    // handle jumping
    if (this.keys.get("JUMP").isDown && !this.isJumping) {
      this.marioSize === "big"
        ? this.soundJumpLarge.play()
        : this.soundJumpSmall.play();
      this.body.setVelocityY(-300);
      this.isJumping = true;
    }
    //handle shoot
    if (this.keys.get("SHOOT").isDown && !this.isShooting) {
      this.isShooting = true;
      this.shoot();
    }
    if (this.keys.get("SHOOT").isUp) {
      this.isShooting = false;
    }
  }

  private handleAnimations(): void {
    if (this.body.velocity.y !== 0) {
      // mario is jumping or falling
      this.anims.stop();
      if (this.marioSize === "small") {
        this.setFrame(6);
      } else {
        this.setFrame(13);
      }
    } else if (this.body.velocity.x !== 0) {
      // mario is moving horizontal

      // check if mario is making a quick direction change
      if (
        (this.body.velocity.x < 0 && this.body.acceleration.x > 0) ||
        (this.body.velocity.x > 0 && this.body.acceleration.x < 0)
      ) {
        if (this.marioSize === "small") {
          this.setFrame(2);
        } else {
          this.setFrame(9);
        }
      }

      if (this.body.velocity.x > 0) {
        this.anims.play(this.marioSize + "MarioWalk", true);
      } else {
        this.anims.play(this.marioSize + "MarioWalk", true);
      }
    } else {
      // mario is standing still
      this.anims.stop();
      if (this.marioSize === "small") {
        this.setFrame(0);
      } else {
        if (this.keys.get("DOWN").isDown) {
          this.setFrame(7);
        } else {
          this.setFrame(8);
        }
      }
    }
  }

  public growMario(): void {
    this.marioSize = "big";
    this.currentScene.registry.set("marioSize", "big");
    this.adjustPhysicBodyToBigSize();
  }

  private shrinkMario(): void {
    this.marioSize = "small";
    this.currentScene.registry.set("marioSize", "small");
    this.adjustPhysicBodyToSmallSize();
  }

  private adjustPhysicBodyToSmallSize(): void {
    this.body.setSize(8, 16);
    this.body.setOffset(4, 16);
  }

  private adjustPhysicBodyToBigSize(): void {
    this.body.setSize(12, 32);
    this.body.setOffset(2, 0);
  }

  public bounceUpAfterHitEnemyOnHead(): void {
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 5 },
      duration: 200,
      ease: "Power1",
      yoyo: true,
    });
  }

  public gotHit(): void {
    this.isVulnerable = false;
    this.soundDie.play();
    if (this.marioSize === "big") {
      this.shrinkMario();
    } else {
      // mario is dying
      this.isDying = true;

      // sets acceleration, velocity and speed to zero
      // stop all animations
      this.body.stop();
      this.anims.stop();

      // make last dead jump and turn off collision check
      this.body.setVelocityY(-180);

      // this.body.checkCollision.none did not work for me
      this.body.checkCollision.up = false;
      this.body.checkCollision.down = false;
      this.body.checkCollision.left = false;
      this.body.checkCollision.right = false;
    }
  }
  private shoot(): void {
    this.bullets.add(
      this.flipX
        ? new Bullet({
            scene: this.scene,
            left: this.flipX,
            x: this.x - 5,
            y: this.y + 5,
            texture: "bullet",
          })
        : new Bullet({
            scene: this.scene,
            left: this.flipX,
            x: this.x + 5,
            y: this.y + 5,
            texture: "bullet",
          }),
    );
  }
  private updateBullets(): void {
    this.bullets.children.each((_bullet: Bullet) => {
      _bullet.update();
    });
  }
  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }
}
