import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class Scene2 extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars?: Phaser.Physics.Arcade.Group;

    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;

    private gameOver: boolean = false;

    constructor() {
        super({ key: "Scene2" });
    }
    create() {
        for (var x = 0; x <= this.cameras.main.width / 128; x++) {
            for (var y = 0; y <= this.cameras.main.height / 128; y++) {
                this.add.image(x * 128, y * 128, "background2").setOrigin(0);
            }
        }
        this.player = this.physics.add.sprite(100, 450, "idle", 0);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.fpsText = new FpsText(this);
        this.scoreText = this.add.text(
            this.cameras.main.width - 128,
            16,
            "Score: 0",
            {
                fontSize: "24px",
                color: "#000",
            }
        );
    }

    update() {
        this.fpsText.update();
        if (!this.cursors) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.anims.play("right", true);
        } else {
            this.player?.setVelocityX(0);
        }
        if (this.cursors.up.isDown) {
            this.player?.setVelocityY(-160);
            this.player?.anims.play("up", true);
        } else if (this.cursors.down.isDown) {
            this.player?.setVelocityY(160);
            this.player?.anims.play("down", true);
        } else {
            this.player?.setVelocityY(0);
        }
        if (
            this.cursors.left.isUp &&
            this.cursors.right.isUp &&
            this.cursors.up.isUp &&
            this.cursors.down.isUp
        ) {
            this.player?.anims.play("idle", true);
        }
    }
}
