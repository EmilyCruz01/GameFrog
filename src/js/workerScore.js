onmessage = function (e) {
  if (e.data.action === "increaseScore") {
    postMessage({ action: "addPoints", points: 15 }); // Cada hongo esquivado suma 15 puntos
  }
};
