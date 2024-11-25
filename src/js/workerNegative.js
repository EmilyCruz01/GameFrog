onmessage = function (e) {
  if (e.data.action === "start") {
    // Generar objetos negativos cada 4 segundos
    setInterval(() => {
      const x = Math.floor(Math.random() * 800); // Posición aleatoria en el eje X
      const y = 0; // Los objetos caen desde la parte superior
      const pointsToSubtract = Math.floor(Math.random() * 16) + 5; // Restar entre 5 y 20 puntos
      postMessage({
        action: "createNegativeObject",
        x: x,
        y: y,
        points: pointsToSubtract,
      });
    }, 4000); // Generar cada 4 segundos
  }
};
