import Phaser from "phaser";
import GameScene from "../scenes/gameScene";

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }, 
      debug: false,
    },
  },
  scene: [GameScene],
};
