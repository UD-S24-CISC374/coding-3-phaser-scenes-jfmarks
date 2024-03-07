import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private bone?: Phaser.Physics.Arcade.Group;

    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;

    private gameOver: boolean = false;

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        for (var x = 0; x <= this.cameras.main.width / 128; x++) {
            for (var y = 0; y <= this.cameras.main.height / 128; y++) {
                this.add.image(x * 128, y * 128, "background").setOrigin(0);
            }
        }
        this.player = this.physics.add.sprite(100, 450, "idle", 0);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("idle", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("walkLeft", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "walkDown", frame: 0 }],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("walkRight", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("walkUp", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("walkDown", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "downRight",
            frames: this.anims.generateFrameNumbers("walkDownRight", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "downLeft",
            frames: this.anims.generateFrameNumbers("walkDownLeft", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "upRight",
            frames: this.anims.generateFrameNumbers("walkUpRight", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "upLeft",
            frames: this.anims.generateFrameNumbers("walkUpLeft", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

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
            "Score: 0",
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
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);
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
                this.scene.pause;
                this.scene.start("Scene2", { score: this.score });
            }
        }
    }
}
