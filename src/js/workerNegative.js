onmessage = function (e) {
  if (e.data.action === "start") {
    
    setInterval(() => {
      const x = Math.floor(Math.random() * 800); 
      const y = 0; 
      const pointsToSubtract = Math.floor(Math.random() * 16) + 5; 
      postMessage({
        action: "createNegativeObject",
        x: x,
        y: y,
        points: pointsToSubtract,
      });
    }, 4000); 
  }
};
