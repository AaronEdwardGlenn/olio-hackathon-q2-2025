import * as Phaser from 'phaser';
import ControllerKeys from '../utils/ControllerKeys';
import { Contributor } from '../Contributor';

export default class AstronautCharacter extends Phaser.Physics.Arcade.Image {

    private speed = 50;
    private jumpSpeed = 700; 
    private isJumping = false;
    scale = .35

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'moth'); // Use 'moth' directly

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5); 
          // ✅ Set jumpSpeed based on total commits
          const scaleidge = parseInt(Contributor.totalCommits.toString());
          console.log(scaleidge, "COOL")
          if (scaleidge > 6) {
              this.scale = .2; 
          } else if (scaleidge > 3) {
              this.scale = .35; 
          } else {
              this.scale = .4;
          }
          console.log(this.scale, "COOL SCALE")
        this.setScale(this.scale);

        this.setCollideWorldBounds(true);

        this.setPosition(0, (scene.cameras.main.height - this.height) / 2);
        this.setBounce(0, 0.5);
        this.setMaxVelocity(500, 1000); 

        this.setVelocityX(this.speed);
        this.setDepth(1);

        // ✅ Shrink and center hitbox after scaling
        const bodyWidth = this.width * 0.4; // make it 40% of visual width
        const bodyHeight = this.height * 0.4; // make it 40% of visual height

        const offsetX = (this.width - bodyWidth) / 2;
        const offsetY = (this.height - bodyHeight) / 2;

        this.setBodySize(bodyWidth, bodyHeight);
        this.setOffset(offsetX, offsetY);

            // ✅ Set jumpSpeed based on total commits
            const totalCommits = parseInt(Contributor.totalCommits.toString(), 10);
            if (totalCommits > 6) {
                this.jumpSpeed = 800; // 🚀 highest jump
            } else if (totalCommits > 3) {
                this.jumpSpeed = 700; // 🚀 medium jump
            } else {
                this.jumpSpeed = 500; // 🚀 default smaller jump
            }

        // ❌ DO NOT overwrite hitbox later! (deleted those lines)
    }

    update(time: number, delta: number, controllerKeys: ControllerKeys): void {
        super.update(time, delta);

        const speed = { x: 0, y: 0 };

        if (controllerKeys.left.isDown)
            speed.x = -1 * this.speed * delta;
        else if (controllerKeys.right.isDown)
            speed.x = 1 * this.speed * delta;

        if (controllerKeys.jump.isDown && !this.isJumping) {
            this.isJumping = true;
            this.setVelocityY(-this.jumpSpeed);
        }

        if (this.isJumping && controllerKeys.down.isDown) {
            speed.y = 1 * this.speed * delta;
            this.setVelocityY(speed.y);
        }

        this.setAccelerationX(speed.x);
    }

    onCharacterCollidesWithFloor(): void {
        this.isJumping = false;
    }
}
