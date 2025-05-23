import * as Phaser from 'phaser';
import WebFont from 'webfontloader';
import { Contributor } from '../Contributor';
import TypeWriterEffectHelper from '../utils/TypeWriterEffectHelper';

export default class InitialScene extends Phaser.Scene {

    constructor() {
        super('main-menu');
    }

    create(): void {
        /* eslint-disable  @typescript-eslint/no-this-alias */
        const scene = this;

        const fontFamily = 'Oxanium';
        WebFont.load({
            google: {
                families: [fontFamily]
            },
            active: function () {
                scene.addComponents(fontFamily, '42px', '38px', '22px');
            },
            inactive: function () {
                scene.addComponents('Verdana', '40px', '32px', '20px');
            }
        });


        this.input?.keyboard?.on('keyup', this.anyKey, this);
    }

    private anyKey(event: { keyCode: number }): void {
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
            this.scene.start('game');
        }
    }

    private addComponents(fontFamily: string, titleSize: string, labelSize: string, smallLabelSize: string): void {
        const fontColor = '#ffffff';

        const title = this.add.image(0, 0, 'logo');
        title.setAlpha(0);
        const paddingTop = 600;
        title.setPosition(this.cameras.main.width / 2, paddingTop);
        
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // const startText = this.add.text(16, 0, 'Press enter to start', { fontFamily: fontFamily, fontSize: titleSize, color: fontColor });
        // startText?.setPosition(this.cameras.main.width / 2 - (startText.width / 2), 100);

        const explorerLabel = this.add.text(16, 0, '', { fontFamily: fontFamily, fontSize: smallLabelSize, color: fontColor });
        explorerLabel.setPosition(400, 400);

        const username = this.add.text(16, 0, '', { fontFamily: fontFamily, fontSize: labelSize, color: fontColor });
        username.setPosition(explorerLabel.x, explorerLabel.y + explorerLabel.height);

        const commit_countLabel = this.add.text(16, 0, '', { fontFamily: fontFamily, fontSize: smallLabelSize, color: fontColor });
        commit_countLabel.setPosition(username.x, username.y + username.height * 2);

        const commit_count = this.add.text(16, 0, '', { fontFamily: fontFamily, fontSize: labelSize, color: fontColor, wordWrap: { width: 700, useAdvancedWrap: true } });
        commit_count.setPosition(commit_countLabel.x, commit_countLabel.y + commit_countLabel.height);
        commit_count.setMaxLines(4);


        TypeWriterEffectHelper.startTypewriter(this, [
            { text: 'Welcome:', label: explorerLabel },
            { text: Contributor.username.toUpperCase().trim(), label: username },
            { text: 'Total Commits:', label: commit_countLabel },
            { text: Contributor.commit_count.toString(), label: commit_count }
        ], 50);

        const avatar = this.add.image(200, 550, 'enemy');
        avatar.setScale(0.45, 0.45);

        const avatarMask = this.make.image({ x: 0, y: 0, key: 'menu-avatar-mask', add: false });
        avatar.mask = new Phaser.Display.Masks.BitmapMask(this, avatarMask);
        avatarMask.copyPosition(avatar);
    }
}
