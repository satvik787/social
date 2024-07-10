import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import chatHandler from "./socketHandler/chatHandler.js"
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;


const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const userSocket = new Map();
const userData = new Map();
const channels = new Map();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        chatHandler(io, socket, userSocket, userData,channels);
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});