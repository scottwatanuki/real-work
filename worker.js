// Code for the web worker

// Listen for messages from the main script
self.addEventListener('message', function (event) {
    // Perform intensive computations or long-running tasks here
    // Access the data sent from the main script using event.data
    // Send the result back to the main script using postMessage()
    const result = event.data * 2;
    self.postMessage(result);
});
  