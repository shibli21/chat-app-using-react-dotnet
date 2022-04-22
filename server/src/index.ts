import cors from 'cors';
import express from 'express';


const main = async () => {
    const app = express();

    app.use(
        cors({
            origin: ["http://localhost:3000", "http://localhost:3001"],
            credentials: true,
        })
    );

    app.get('/', (_, res) => {
        res.send('Hello World!');
    });
    const port = process.env.PORT || 4000;

    app.listen(port, () => {
        console.log(`server : http://localhost:${port}`);
    });
};

main();
