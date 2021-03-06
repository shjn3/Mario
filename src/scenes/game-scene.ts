import { ArrowDirection } from "../objects/ArrowDirection";
import { Box } from "../objects/Box";
import { Brick } from "../objects/Brick";
import { Bullet } from "../objects/Bullet";
import { Collectible } from "../objects/Collectible";
import { Goomba } from "../objects/Goomba";
import { Mario } from "../objects/Mario";
import { Platform } from "../objects/Platform";
import { Portal } from "../objects/Portal";
import { Carnivorous } from "../objects/Carnivorous";
import { Enemy } from "../objects/enemy";

export class GameScene extends Phaser.Scene {
  // tilemap
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  private foregroundLayer: Phaser.Tilemaps.TilemapLayer;

  //variables
  private soundCollect: Phaser.Sound.BaseSound;

  // game objects
  private boxes: Phaser.GameObjects.Group;
  private bricks: Phaser.GameObjects.Group;
  private collectibles: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private platforms: Phaser.GameObjects.Group;
  private player: Mario;
  private portals: Phaser.GameObjects.Group;
  private arrowDirections: Phaser.GameObjects.Group;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {}

  create(): void {
    // *****************************************************************
    // SETUP TILEMAP
    // *****************************************************************

    // create our tilemap from Tiled JSON
    this.map = this.make.tilemap({ key: this.registry.get("level") });
    // add our tileset and layers to our tilemap
    this.tileset = this.map.addTilesetImage("tiles-2");
    this.backgroundLayer = this.map.createLayer(
      "backgroundLayer",
      this.tileset,
      0,
      0,
    );

    this.foregroundLayer = this.map.createLayer(
      "foregroundLayer",
      this.tileset,
      0,
      0,
    );
    this.foregroundLayer.setName("foregroundLayer");

    // set collision for tiles with the property collide set to true
    this.foregroundLayer.setCollisionByProperty({ collide: true });

    // *****************************************************************
    // GAME OBJECTS
    // *****************************************************************
    this.portals = this.add.group({
      /*classType: Portal,*/
      runChildUpdate: true,
    });

    this.boxes = this.add.group({
      /*classType: Box,*/
      runChildUpdate: true,
    });

    this.bricks = this.add.group({
      /*classType: Brick,*/
      runChildUpdate: true,
    });

    this.collectibles = this.add.group({
      /*classType: Collectible,*/
      runChildUpdate: true,
    });

    this.enemies = this.add.group({
      runChildUpdate: true,
    });

    this.platforms = this.add.group({
      /*classType: Platform,*/
      runChildUpdate: true,
    });
    this.arrowDirections = this.add.group();
    this.loadObjectsFromTilemap();

    // *****************************************************************
    // COLLIDERS
    // *****************************************************************
    this.physics.add.collider(this.player, this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.boxes);
    this.physics.add.collider(this.enemies, this.bricks);
    this.physics.add.collider(this.player, this.bricks);

    this.physics.add.collider(
      this.player,
      this.boxes,
      this.playerHitBox,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyOverlap,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.portals,
      this.handlePlayerPortalOverlap,
      null,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.platforms,
      this.handlePlayerOnPlatform,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.handlePlayerCollectiblesOverlap,
      null,
      this,
    );

    this.physics.add.collider(
      this.player.getBullets(),
      this.foregroundLayer,
      this.handleBulletHitForeGroundLayer,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player.getBullets(),
      this.enemies,
      this.handleBulletHitEnemy,
      null,
      this,
    );
    this.physics.add.collider(
      this.player.getBullets(),
      this.boxes,
      this.handleBulletHitBox,
      null,
      this,
    );
    this.physics.add.collider(
      this.player.getBullets(),
      this.bricks,
      this.handleBulletHitBrick,
      null,
      this,
    );

    // *****************************************************************
    // CAMERA
    // *****************************************************************
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );

    this.soundCollect = this.sound.add("soundCollect");
  }

  update(): void {
    this.player.update();
  }

  private loadObjectsFromTilemap(): void {
    // get the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer("objects").objects as any[];

    objects.forEach((object) => {
      if (object.type === "portal") {
        this.portals.add(
          new Portal({
            scene: this,
            x: object.x,
            y: object.y,
            height: object.width,
            width: object.height,
            spawn: {
              x: object.properties.marioSpawnX,
              y: object.properties.marioSpawnY,
              dir: object.properties.direction,
            },
          }).setName(object.name),
        );
      }
      if (object.type === "arrowDirectionUp") {
        this.arrowDirections.add(
          new ArrowDirection({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "arrowDirection",
            tweenProps: {
              y: {
                value: object.y + 5,
                duration: 1000,
                ease: "Power0",
              },
            },
          }),
        );
      }
      if (object.type === "arrowDirectionRight") {
        this.arrowDirections.add(
          new ArrowDirection({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "arrowDirection",
            tweenProps: {
              x: {
                value: object.x + 5,
                duration: 1000,
                ease: "Power0",
              },
            },
          }).setRotation((Math.PI * 3) / 2),
        );
      }

      if (object.type === "player") {
        this.player = new Mario({
          scene: this,
          x: this.registry.get("spawn").x,
          y: this.registry.get("spawn").y,
          texture: "mario1",
        });
      }

      if (object.type === "goomba") {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "goomba",
          }),
        );
      }
      if (object.type === "carni") {
        this.enemies.add(
          new Carnivorous({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "coin2",
          }),
        );
      }

      if (object.type === "brick") {
        this.bricks.add(
          new Brick({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "brick",
            value: 50,
          }),
        );
      }

      if (object.type === "box") {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties.content || object.properties[0].value,
            x: object.x,
            y: object.y,
            texture: "box",
          }),
        );
      }

      if (object.type === "collectible") {
        this.collectibles.add(
          new Collectible({
            scene: this,
            x: object.x,
            y: object.y,
            texture:
              object.properties.kindOfCollectible || object.properties[0].value,
            points: 100,
          }),
        );
      }

      if (object.type === "platformMovingUpAndDown") {
        this.platforms.add(
          new Platform({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "platform",
            tweenProps: {
              y: {
                value: 100,
                duration: 1500,
                ease: "Power0",
              },
            },
          }),
        );
      }

      if (object.type === "platformMovingLeftAndRight") {
        this.platforms.add(
          new Platform({
            scene: this,
            x: object.x,
            y: object.y,
            texture: "platform",
            tweenProps: {
              x: {
                value: object.x + 50,
                duration: 1200,
                ease: "Power0",
              },
            },
          }),
        );
      }
      if (object.type === "intro") {
        this.bitmapTexts.push(
          this.add.bitmapText(object.x, object.y, "font", object.text.text, 8),
        );
      }
    });
  }
  /**
   * bullet <-> brick collision
   * @param _bullet
   */
  private handleBulletHitBrick(_bullet: Bullet): void {
    _bullet.destroy();
  }
  /**
   * bullet <-> box collision
   * @param _bullet
   * @param _enemy
   */
  private handleBulletHitBox(_bullet: Bullet): void {
    _bullet.destroy();
  }
  /**
   * Player.Bullets <-> Enemy Overlap
   * @param _player.Bullets
   * @param _enemy
   */
  private handleBulletHitEnemy(_bullet: Bullet, _enemy: Goomba): void {
    _bullet.destroy();
    _enemy.gotHitOnHead();
    this.add.tween({
      targets: _enemy,
      props: { alpha: 0 },
      duration: 1000,
      ease: "Power0",
      yoyo: false,
      onComplete: function () {
        _enemy.isDead();
      },
    });
  }
  /**
   * Player.Bullets <-> foreGroundLayer conlission
   * @param _player.Bullets
   */
  private handleBulletHitForeGroundLayer(_bullet: Bullet) {
    _bullet.destroy();
  }
  /**
   * Player <-> Enemy Overlap
   * @param _player [Mario]
   * @param _enemy  [Enemy]
   */
  private handlePlayerEnemyOverlap(_player: Mario, _enemy: Enemy): void {
    if (_enemy instanceof Goomba) {
      if (_player.body.touching.down && _enemy.body.touching.up) {
        // player hit enemy on top
        _player.bounceUpAfterHitEnemyOnHead();
        _enemy.gotHitOnHead();
        this.add.tween({
          targets: _enemy,
          props: { alpha: 0 },
          duration: 1000,
          ease: "Power0",
          yoyo: false,
          onComplete: function () {
            _enemy.isDead();
          },
        });
      } else {
        // player got hit from the side or on the head
        if (_player.getVulnerable()) {
          _player.gotHit();
        }
      }
    }
    if (_enemy instanceof Carnivorous) {
      if (!_enemy.active) {
        _enemy.wakeUp();
      } else {
        _player.gotHit();
        _enemy.gotHitOnHead();
      }
    }
  }

  /**
   * Player <-> Box Collision
   * @param _player [Mario]
   * @param _box    [Box]
   */
  private playerHitBox(_player: Mario, _box: Box): void {
    if (_box.body.touching.down && _box.active) {
      // ok, mario has really hit a box on the downside
      _box.yoyoTheBoxUpAndDown();
      this.collectibles.add(_box.spawnBoxContent());

      switch (_box.getBoxContentString()) {
        // have a look what is inside the box! Christmas time!
        case "coin": {
          _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
            _box.getContent().destroy();
          });
          _box.addCoinAndScore(1, 100);
          break;
        }
        case "rotatingCoin": {
          _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
            _box.getContent().destroy();
          });

          _box.addCoinAndScore(1, 100);
          break;
        }
        case "flower": {
          _box.tweenBoxContent({ y: _box.y - 8 }, 200, function () {
            _box.getContent().anims.play("flower");
          });

          break;
        }
        case "mushroom": {
          _box.popUpCollectible();
          break;
        }
        case "star": {
          _box.popUpCollectible();
          break;
        }
        default: {
          break;
        }
      }
      _box.startHitTimeline();
    }
  }

  private handlePlayerPortalOverlap(_player: Mario, _portal: Portal): void {
    if (
      (_player.getKeys().get("DOWN").isDown &&
        _portal.getPortalDestination().dir === "down") ||
      (_player.getKeys().get("RIGHT").isDown &&
        _portal.getPortalDestination().dir === "right")
    ) {
      // set new level and new destination for mario
      this.registry.set("level", _portal.name);
      this.registry.set("spawn", {
        x: _portal.getPortalDestination().x,
        y: _portal.getPortalDestination().y,
        dir: _portal.getPortalDestination().dir,
      });
      // restart the game scene
      this.scene.restart();
    } else if (_portal.name === "exit") {
      this.completeLevel();
    }
  }

  private handlePlayerCollectiblesOverlap(
    _player: Mario,
    _collectible: Collectible,
  ): void {
    switch (_collectible.texture.key) {
      case "flower": {
        break;
      }
      case "mushroom": {
        _player.growMario();
        break;
      }
      case "star": {
        break;
      }
      default: {
        this.soundCollect.play();
        break;
      }
    }
    _collectible.collected();
  }

  // TODO!!!
  private handlePlayerOnPlatform(player: Mario, platform: Platform): void {
    // if (
    //   platform.body.moves &&
    //   platform.body.touching.up &&
    //   player.body.touching.down
    // ) {
    // }
  }
  //reset properties game world when Mario move to exit and update Level Map
  private completeLevel(): void {
    if (this.registry.get("level") === "level3") {
      this.scene.stop("GameScene");
      this.scene.stop("HUDScene");
      // this.scene.start("MenuScene");
      this.scene.start("OverScene");
    } else {
      this.registry.set("spawn", {
        x: 15,
        y: 44,
        dir: "down",
      });
      this.registry.set("marioSize", "small");
      this.registry.set("time", 400);
      if (this.registry.get("level") === "level2") {
        this.registry.set("level", "level3");
        this.registry.set("world", "3-3");
      } else {
        this.registry.set("level", "level2");
        this.registry.set("world", "2-3");
      }
      this.events.emit("resetLevel");
      this.scene.restart();
    }
  }
}
