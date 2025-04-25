import * as Phaser from 'phaser';
import { Contributor } from '../Contributor';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(): void {
        this.load.image('floor', 'assets/floor5.png');
        this.load.image('sky', 'assets/b4.png');
        this.load.image('astronaut', 'assets/astronaut.png');
        this.load.image('enemy', Contributor.avatar_url);
        this.load.image('logo', 'assets/woe_logo_trans.png');
        this.load.image('avatar', 'assets/shark.png');
        this.load.image('avatar-mask', 'assets/avatar-mask.png');
        this.load.image('menu-avatar-mask', 'assets/menu-avatar-mask.png');

        // 🌟 Load different moth based on total commits
        if (parseInt(Contributor.totalCommits) > 6) {
            this.load.image('moth', 'assets/moth_2.png');
        } else if (parseInt(Contributor.totalCommits) > 3) {
            this.load.image('moth', 'assets/moth_1.png');
        } else {
            this.load.image('moth', 'assets/moth.png');
        }
    }

    create(): void {
        this.scene.start('main-menu');
    }
}
