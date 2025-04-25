import * as Phaser from 'phaser';

export default class EnemyCharacter extends Phaser.GameObjects.Image {
    private speed = 10;
    hitbox!: Phaser.GameObjects.Arc;
    maskShape!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemy');

        this.setOrigin(0.5, 0.5); // Center origin
        this.setScale(0.3);       // Shrink image
        scene.add.existing(this); // ✅ Add to scene early so width/height are correct

        // Get actual radius after scaling
        const radius = (this.displayWidth) / 2;

        // 🔵 Draw circular mask
        this.maskShape = scene.add.graphics();
        this.maskShape.fillStyle(0xffffff);
        this.maskShape.beginPath();
        this.maskShape.arc(0, 0, radius, 0, Math.PI * 2);
        this.maskShape.fill();
        this.maskShape.setPosition(this.x, this.y);
        this.maskShape.setVisible(false);

        const mask = this.maskShape.createGeometryMask();
        this.setMask(mask);

        // ⚪ Create circular hitbox
        this.hitbox = scene.add.circle(this.x, this.y, radius);
        scene.physics.add.existing(this.hitbox);
        const body = this.hitbox.body as Phaser.Physics.Arcade.Body;
        body.setCircle(radius);
        body.allowGravity = false;
    }

    update(time: number, delta: number): void {
        super.update(time, delta);

        // Move image
        this.x -= this.speed * delta;

        // Move mask and hitbox to match
        this.maskShape.setPosition(this.x, this.y);
        this.hitbox.setPosition(this.x, this.y);

        // Destroy when offscreen
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
