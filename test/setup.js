const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');

// Mock `fetch` to use `node-fetch`, + make it work ONLY with local files
// ===========================
const Request = nodeFetch.Request;
const Response = nodeFetch.Response;

global.fetch = function (url, options) {
  const request = new Request(url, options);
  return new Promise((resolve, reject) => {
    const filePath = path.join(path.dirname(__dirname), url);
    if (!fs.existsSync(filePath)) {
      reject(`File not found: ${filePath}`);
    }
    const readStream = fs.createReadStream(filePath);
    readStream.on('open', function () {
      resolve(new Response(readStream, {
        url: request.url,
        status: 200,
        statusText: 'OK',
        size: fs.statSync(filePath).size,
        timeout: request.timeout
      }));
    });
  });
};
// ===========================
