onmessage = function (e) {
  if (e.data.action === "start") {
    // Worker para controlar vidas
    postMessage({ action: "setLives", lives: 3 }); // Inicializar con 3 vidas
  }

  if (e.data.action === "decreaseLife") {
    // Restar una vida y verificar si el juego termina
    let lives = e.data.lives - 1;
    postMessage({ action: "setLives", lives: lives });

    if (lives <= 0) {
      postMessage({ action: "gameOver" });
    }
  }
};
