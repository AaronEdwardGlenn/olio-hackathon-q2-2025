import * as Phaser from 'phaser';

export default class EnemyCharacter extends Phaser.GameObjects.Image {
    private speed = 10;
    hitbox!: Phaser.Physics.Arcade.Image;
    maskShape!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemy');

        // Add enemy to scene and scale
        this.setOrigin(0.5, 0.5);
        this.setScale(0.3);
        scene.add.existing(this);

        // Get scaled display radius
        const visibleRadius = this.displayWidth / 2;

        // Apply circular mask to enemy sprite
        this.maskShape = scene.add.graphics();
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.beginPath();
        this.maskShape.arc(0, 0, visibleRadius, 0, Math.PI * 2);
        this.maskShape.fill();
        this.maskShape.setPosition(this.x, this.y);
        this.maskShape.setVisible(false);

        const mask = this.maskShape.createGeometryMask();
        this.setMask(mask);

        // 🛡️ Create invisible hitbox (smaller than visible sprite)
        const hitboxRadius = visibleRadius * 0.7;

        this.hitbox = scene.physics.add.image(this.x, this.y, '').setVisible(false);
        this.hitbox.setCircle(
            hitboxRadius,
            visibleRadius - hitboxRadius, // offsetX to center the circle
            visibleRadius - hitboxRadius  // offsetY to center the circle
        );
        (this.hitbox.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    }

    update(time: number, delta: number): void {
        super.update(time, delta);

        // Move enemy to the left
        this.x -= this.speed * delta;

        // Keep mask and hitbox in sync
        this.maskShape.setPosition(this.x, this.y);
        this.hitbox.setPosition(this.x, this.y);

        // Destroy when off-screen
        if (this.x + this.displayWidth / 2 < 0) {
            this.destroy();
            this.hitbox.destroy();
            this.maskShape.destroy();
        }
    }

    setSpeed(speed: number): void {
        this.speed = speed / 100;
    }
}
