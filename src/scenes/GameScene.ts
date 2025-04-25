import * as Phaser from 'phaser';
import ControllerKeys from '../utils/ControllerKeys';
import InfiniteScrollingImageHelper from '../utils/InfiniteScrollingImageHelper';
import SceneEventManager from '../utils/SceneEventManager';
import AstronautCharacter from '../characters/AstronautCharacter';
import EnemyCharacter from '../characters/EnemyCharacter';

export default class GameScene extends Phaser.Scene {
    private sceneEventManager: SceneEventManager;

    private characterSprite!: AstronautCharacter;

    private infiniteScrollingFloorHelper!: InfiniteScrollingImageHelper;
    private infiniteScrollingSkyHelper!: InfiniteScrollingImageHelper;

    private enemyGroup !: Phaser.GameObjects.Group;

    private controllerKeys!: ControllerKeys;

    private floorSpeed = 50;
    private points!: number;

    private enemyPositions?: { x: number[], y: number[] }

    constructor() {
        super('game');

        this.sceneEventManager = SceneEventManager.getInstance();
    }

    create(): void {
        this.scene.run('game-ui');
        this.points = 0;
        this.controllerKeys = new ControllerKeys(this, 'wasd');
    
        // 🌤️ 1. Create sky first!
        this.infiniteScrollingSkyHelper = new InfiniteScrollingImageHelper(this, 0, 0, 'sky', 10);
    
        // 🧱 2. Create floor
        this.infiniteScrollingFloorHelper = new InfiniteScrollingImageHelper(this, 0, 0, 'floor', this.floorSpeed);
    
        // 🧱 3. Create floor body
        const floorBody = this.add.rectangle(
            0,
            this.cameras.main.height - this.infiniteScrollingFloorHelper.img1.height + 20,
            this.infiniteScrollingFloorHelper.img1.width - 20,
            this.infiniteScrollingFloorHelper.img1.height - 20
        );
        floorBody.setOrigin(0, 0);
        this.physics.add.existing(floorBody, true);
        (floorBody.body as Phaser.Physics.Arcade.Body).debugBodyColor = 0x018852;
    
        // 🚀 4. Create character
        this.characterSprite = new AstronautCharacter(this, 200, 200);
        this.physics.add.collider(this.characterSprite, floorBody, this.characterSprite.onCharacterCollidesWithFloor, undefined, this.characterSprite);
    
        // 👾 5. Create enemy group
        this.enemyGroup = this.add.group({
            classType: EnemyCharacter,
            runChildUpdate: true
        });
    
        // 👾 6. Create enemy spawner
        this.time.addEvent({
            callback: () => {
                const newEnemy = this.enemyGroup.get(0, 0) as EnemyCharacter;
                const offset = this.getRandomEnemyPositionOffset(newEnemy);
    
                const enemyLowerOffset = 1;
                newEnemy.setPosition(
                    this.cameras.main.width + offset.x,
                    (floorBody.y - floorBody.height - offset.y) + enemyLowerOffset
                );
                newEnemy.setSpeed(this.floorSpeed);
    
                this.physics.add.overlap(this.characterSprite, newEnemy.hitbox, this.onCharacterEnemyOverlap, undefined, this);
            },
            delay: 1000,
            loop: true
        });
    }
    
    update(time: number, delta: number): void {
        super.update(time, delta);

        this.points++;
        this.sceneEventManager.events.emit('points-updated', this.points);

        // Background scroll.
        this.infiniteScrollingFloorHelper.update(time, delta);
        this.infiniteScrollingSkyHelper.update(time, delta);

        this.characterSprite.update(time, delta, this.controllerKeys);
    }

    private onCharacterEnemyOverlap() {
        this.sceneEventManager.events.emit('game-over');
        this.scene.pause();
    }

    private getRandomEnemyPositionOffset(enemy: EnemyCharacter) {
        if (!this.enemyPositions) {

            const x = [0, enemy.width * 2, enemy.width * 4];
            const y = [
                10, 
                this.characterSprite.height / 2 - enemy.height / 2, 
                this.characterSprite.height,
                this.characterSprite.height + enemy.height
            ];

            this.enemyPositions = { x, y };
        }

        return {
            x: this.enemyPositions.x[Phaser.Math.Between(0, this.enemyPositions.x.length - 1)],
            y: this.enemyPositions.y[Phaser.Math.Between(0, this.enemyPositions.y.length - 1)]
        };
    }
}