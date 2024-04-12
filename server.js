const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, 'example.txt');
const PORT = 8001;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET requests
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow certain headers

  if (req.method === 'GET' && req.url === '/lastModifiedTime') {
    console.log('Received GET request for /lastModifiedTime');
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    let isResponseEnded = false;

    const sendResponse = () => {
      fs.stat(FILE_PATH, (err, stats) => {
        if (err) {
          clearInterval(intervalId);
          if (!isResponseEnded) {
            res.end('Error fetching file last modified time');
            isResponseEnded = true;
          }
          return;
        }

        const lastModifiedTime = stats.mtime.getTime();
        console.log(`Last modified time: ${new Date(lastModifiedTime).toLocaleString()}`);
        res.end(`Last modified time: ${new Date(lastModifiedTime).toLocaleString()}`);
        clearInterval(intervalId);
        isResponseEnded = true;
      });
    };

    sendResponse(); // Send response immediately upon request

    const intervalId = setInterval(sendResponse, 5000);

    req.on('close', () => {
      clearInterval(intervalId);
      isResponseEnded = true;
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
