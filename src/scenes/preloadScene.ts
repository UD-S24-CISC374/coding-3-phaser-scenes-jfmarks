import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.image("background2", "assets/background2.png");
        this.load.image("bone", "assets/bone.png"); // bone sprite is from Minecraft
        this.load.spritesheet("idle", "assets/idle.png", {
            // dog sprite is from Enter the Gungeon
            frameWidth: 36,
            frameHeight: 28,
        });
        this.load.spritesheet("walkRight", "assets/walkRight.png", {
            frameWidth: 34,
            frameHeight: 32,
        });
        this.load.spritesheet("walkLeft", "assets/walkLeft.png", {
            frameWidth: 34,
            frameHeight: 32,
        });
        this.load.spritesheet("walkUp", "assets/walkUp.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.spritesheet("walkDown", "assets/walkDown.png", {
            frameWidth: 24,
            frameHeight: 24,
        });

        this.load.spritesheet("walkDownRight", "assets/walkDownRight.png", {
            frameWidth: 30,
            frameHeight: 24,
        });
        this.load.spritesheet("walkDownLeft", "assets/walkDownLeft.png", {
            frameWidth: 30,
            frameHeight: 24,
        });
        this.load.spritesheet("walkUpRight", "assets/walkUpRight.png", {
            frameWidth: 32,
            frameHeight: 26,
        });
        this.load.spritesheet("walkUpLeft", "assets/walkUpLeft.png", {
            frameWidth: 32,
            frameHeight: 26,
        });
    }

    create() {
        this.scene.start("MainScene");
    }
}
