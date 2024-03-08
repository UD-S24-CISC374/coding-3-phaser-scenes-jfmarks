import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private bone?: Phaser.Physics.Arcade.Group;
    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;
    private playerX: number = 200;

    constructor() {
        super({ key: "MainScene" });
    }
    init(data: { score: number; playerX: number }) {
        this.score = this.score == 0 ? 0 : data.score;
        this.playerX = this.playerX == 200 ? 200 : data.playerX;
    }
    create() {
        let image = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "background"
        );
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);
        this.add.image(this.cameras.main.width / 2, 32, "arrow");
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
        console.log("winner");
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
                this.scene.start("RiverScene", {
                    score: this.score,
                    playerX: this.player.x,
                });
                this.scene.stop;
            }
        }
    }
}
