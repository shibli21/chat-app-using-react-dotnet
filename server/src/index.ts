import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const main = async () => {
    const app = express();

    app.use(
        cors({
            origin: ["http://localhost:3000", "http://localhost:3001"],
            credentials: true,
        })
    );


    const server = http.createServer(app);
    const io = new Server(
        server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:3001"],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        }
    })


    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
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
