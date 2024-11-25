onmessage = function (e) {
  if (e.data.action === "increaseScore") {
    postMessage({ action: "addPoints", points: 15 }); 
  }
};
