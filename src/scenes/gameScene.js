import Phaser from "phaser";

import Rana from "../assets/frog.png";
import Hongo from "../assets/object.png";
import PuntosNegativos from "../assets/negative.png";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene" });
  }

  preload() {
    this.load.image("player", Rana);
    this.load.image("object", Hongo);
    this.load.image("negative", PuntosNegativos);
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.objectsGroup = this.physics.add.group();
    this.negativeObjectsGroup = this.physics.add.group();
    this.scoreText = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "32px",
      fill: "#FFF",
    });
    this.livesText = this.add.text(16, 50, "Vidas: 3", {
      fontSize: "32px",
      fill: "#FFF",
    });

    this.player = this.physics.add.sprite(400, 500, "player");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBackgroundColor(0x87ceeb);

    this.physics.world.gravity.y = 1000;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.worker1 = new Worker("../js/workerScore.js"); 
    this.worker2 = new Worker("../js/workerObjects.js"); 
    this.worker3 = new Worker("../js/workerLive.js"); 
    this.worker3 = new Worker("../js/workerNegative.js"); 

    this.worker1.postMessage({ action: "start" });
    this.worker2.postMessage({ action: "start" });
    this.worker3.postMessage({ action: "start" });

    this.worker1.onmessage = (e) => {
      if (e.data.action === "addPoints") {
        this.score += e.data.points;
        this.scoreText.setText("Puntos: " + this.score);

        if (this.score >= 200) {
          this.winGame();
        }
      }
    };

    this.worker2.onmessage = (e) => {
      if (e.data.action === "createHongo") {
        this.createObject(e.data.x, e.data.y);
      }
    };

    this.worker3.onmessage = (e) => {
      if (e.data.action === "createNegativeObject") {
        this.createNegativeObject(e.data.x, e.data.y, e.data.points);
      }
    };

    
  }

  update() {
    if (!this.gameOverFlag) {
      this.movePlayer();
      this.handleCollisions();

      this.objectsGroup.getChildren().forEach((object) => {
        console.log(object.y);
        if (object.y >= 560) {
          object.destroy();
        }
      });

      this.negativeObjectsGroup.getChildren().forEach((object) => {
        if (object.y >= 560) {
          object.destroy();
        }
      });
    }
  }

  movePlayer() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);
    } else {
      this.player.setVelocityX(0);
    }
  }

  handleCollisions() {
    this.physics.collide(
      this.player,
      this.objectsGroup,
      this.hitObject,
      null,
      this
    );
    this.physics.collide(
      this.player,
      this.negativeObjectsGroup,
      this.hitNegativeObject,
      null,
      this
    );
  }

  createObject(x, y) {
    let object = this.objectsGroup.create(x, y, "object");
    object.setVelocityY(200); 
    object.setCollideWorldBounds(true);
  }

  createNegativeObject(x, y, points) {
    let negativeObject = this.negativeObjectsGroup.create(x, y, "negative");
    negativeObject.setVelocityY(200); 
    negativeObject.setCollideWorldBounds(true);
    negativeObject.points = points; 
  }

  hitObject(player, object) {
    object.destroy(); 
    this.worker1.postMessage({ action: "increaseScore" });
  }

  hitNegativeObject(player, object) {
    this.lives--; 
    object.destroy();
    this.livesText.setText("Vidas: " + this.lives);

    if (this.lives <= 0) {
      this.gameOver();
    }

    this.score -= object.points;
    this.scoreText.setText("Puntos: " + this.score);
  }

  gameOver() {
    this.gameOverFlag = true;

    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.5);
    background.fillRect(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height
    );

    const gameOverText = this.add
      .text(400, 250, "¡Fin del juego!", {
        fontSize: "48px",
        fill: "#FF0000",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const restartText = this.add
      .text(400, 300, "Iniciar otra vez", {
        fontSize: "32px",
        fill: "#00FF00",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.restartGame())
      .on("pointerover", () => restartText.setStyle({ fill: "#FFFF00" }))
      .on("pointerout", () => restartText.setStyle({ fill: "#00FF00" }));

    this.tweens.add({
      targets: [gameOverText],
      alpha: { start: 0, to: 1 },
      duration: 1000,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [restartText],
      alpha: { start: 0, to: 1 },
      duration: 1000,
      ease: "Power2",
    });
  }

  winGame() {
    this.gameOverFlag = true;

    const background = this.add.graphics();
    background.fillStyle(0x000000, 0.5);
    background.fillRect(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height
    );

    const winText = this.add
      .text(400, 250, "¡Ganaste el juego!", {
        fontSize: "48px",
        fill: "#00FF00",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const restartText = this.add
      .text(400, 300, "Iniciar otra vez", {
        fontSize: "32px",
        fill: "#00FF00",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.restartGame())
      .on("pointerover", () => restartText.setStyle({ fill: "#FFFF00" }))
      .on("pointerout", () => restartText.setStyle({ fill: "#00FF00" }));

    this.tweens.add({
      targets: [winText],
      alpha: { start: 0, to: 1 },
      duration: 1000,
      ease: "Power2",
    });

    this.tweens.add({
      targets: [restartText],
      alpha: { start: 0, to: 1 },
      duration: 1000,
      ease: "Power2",
    });
  }

  restartGame() {
    this.scene.restart(); 
    this.gameOverFlag = false; 
    this.score = 0; 
    this.lives = 3; 
    this.scoreText.setText("Puntos: " + this.score); 
    this.livesText.setText("Vidas: " + this.lives); 
  }
}
