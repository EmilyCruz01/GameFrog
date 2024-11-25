onmessage = function (e) {
  if (e.data.action === "start") {
    // Generar hongos cada 2 segundos
    setInterval(() => {
      const x = Math.floor(Math.random() * 800); // Posición aleatoria en el eje X
      const y = 0; // Los objetos caen desde la parte superior
      postMessage({ action: "createHongo", x: x, y: y });
    }, 2000);
  }
};
