import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class riverScene extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private bone?: Phaser.Physics.Arcade.Group;
    private score: number;
    private scoreText?: Phaser.GameObjects.Text;
    private playerX: number;

    constructor() {
        super({ key: "RiverScene" });
    }
    init(data: { score: number; playerX: number }) {
        this.score = data.score;
        this.playerX = data.playerX;
    }
    create() {
        let image = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "river"
        );
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);
        this.player = this.physics.add.sprite(
            this.playerX,
            this.cameras.main.height - 16,
            "idle",
            0
        );
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.bone = this.physics.add.group({
            key: "bone",
            repeat: 11,
            setXY: {
                x: 16,
                y: 16,
                stepX: this.cameras.main.width / 11,
                stepY:
                    (this.cameras.main.height / 11) *
                    Phaser.Math.FloatBetween(0.5, 0.9),
            },
        });

        this.physics.add.overlap(
            this.player,
            this.bone,
            this.handleCollectBone,
            undefined,
            this
        );
        this.fpsText = new FpsText(this);
        this.scoreText = this.add.text(
            this.cameras.main.width - 128,
            16,
            "Score:" + this.score,
            {
                fontSize: "24px",
                color: "#000",
            }
        );
    }
    private handleCollectBone(
        p:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        s: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ) {
        const bone = s as Phaser.Physics.Arcade.Image;
        bone.disableBody(true, true);
        this.score += 10;
        this.scoreText?.setText("Score:" + this.score);
        return true;
    }

    update() {
        this.fpsText.update();
        if (!this.cursors) {
            return;
        }
        if (this.cursors.up.isDown && this.cursors.right.isDown) {
            this.player?.setVelocityY(-160);
            this.player?.setVelocityX(160);
            this.player?.anims.play("upRight", true);
        } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
            this.player?.setVelocityY(160);
            this.player?.setVelocityX(160);
            this.player?.anims.play("downRight", true);
        } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
            this.player?.setVelocityY(-160);
            this.player?.setVelocityX(-160);
            this.player?.anims.play("upLeft", true);
        } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
            this.player?.setVelocityY(160);
            this.player?.setVelocityX(-160);
            this.player?.anims.play("downLeft", true);
        } else if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-160);
            this.player?.setVelocityY(0);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(160);
            this.player?.setVelocityY(0);
            this.player?.anims.play("right", true);
        } else if (this.cursors.up.isDown) {
            this.player?.setVelocityY(-160);
            this.player?.setVelocityX(0);
            this.player?.anims.play("up", true);
        } else if (this.cursors.down.isDown) {
            this.player?.setVelocityY(160);
            this.player?.setVelocityX(0);
            this.player?.anims.play("down", true);
        } else {
            this.player?.setVelocityX(0);
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
        if (this.player?.body) {
            if (this.player.body.y <= 0) {
                console.log("next scene");
                this.scene.start("TownScene", {
                    score: this.score,
                    playerX: this.player.x,
                });
                this.scene.stop;
            }
        }
    }
}
