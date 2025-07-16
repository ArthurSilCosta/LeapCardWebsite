const http = require("http");

console.log("Starting the server...");

const server = http.createServer((req, res) => {
    console.log("Received a request.");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World!");
});

server.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
