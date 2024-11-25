onmessage = function (e) {
  if (e.data.action === "start") {
 
    postMessage({ action: "setLives", lives: 3 }); 
  }

  if (e.data.action === "decreaseLife") {
    
    let lives = e.data.lives - 1;
    postMessage({ action: "setLives", lives: lives });

    if (lives <= 0) {
      postMessage({ action: "gameOver" });
    }
  }
};
