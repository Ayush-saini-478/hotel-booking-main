import express from 'express';
import cors from 'cors';
import connectDb from './config/connect_db.js';
import { PORT } from './config/server_config.js';

const app = express();

app.use(cors());// enable cross-origin resource sharing

app.get('/', (req, res) => {
    return res.send("API is working");
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDb();
});