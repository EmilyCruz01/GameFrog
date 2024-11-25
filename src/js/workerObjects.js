onmessage = function (e) {
  if (e.data.action === "start") {
    
    setInterval(() => {
      const x = Math.floor(Math.random() * 800); 
      const y = 0;
      postMessage({ action: "createHongo", x: x, y: y });
    }, 2000);
  }
};
