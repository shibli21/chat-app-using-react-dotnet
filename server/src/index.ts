import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const main = async () => {
    const app = express();

    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST"],
        })
    );

    const server = http.createServer(app);

    const io = new Server(
        server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    })


    io.on('connection', (socket) => {
        socket.on("join_room", (room) => {
            socket.join(room);
        });

        socket.on("send_message", (data) => {
            socket.to(data.room).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    })


    app.get('/', (_, res) => {
        res.send('Hello World!');
    });

    const port = process.env.PORT || 4000;

    server.listen(port, () => {
        console.log(`server : http://localhost:${port}`);
    });
};

main();
