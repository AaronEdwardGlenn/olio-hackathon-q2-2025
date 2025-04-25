import * as Phaser from 'phaser';
import ControllerKeys from '../utils/ControllerKeys';

export default class AstronautCharacter extends Phaser.Physics.Arcade.Image {

    private speed = 50;
    private jumpSpeed = 800; 
    private isJumping = false;
    private bodyOffset = { x: -10, y: 30 };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'moth'); // 👈 Use 'moth' directly instead of 'astronaut'

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5); // 👈 Usually better to center origin for sprites like moth
        this.setScale(0.25);      // 👈 Scale moth size
        this.setCollideWorldBounds(true);

        this.setPosition(0, (scene.cameras.main.height - this.height) / 2);
        this.setBounce(0, 0.5);
        this.setMaxVelocity(500, undefined);
        this.setVelocityX(this.speed);
        this.setDepth(1);

        this.setBodySize(this.width + this.bodyOffset.x, this.height - this.bodyOffset.y);
        this.setOffset(this.bodyOffset.x, this.bodyOffset.y);
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
            this.setVelocityY(-this.jumpSpeed);  // No delta for jump
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
