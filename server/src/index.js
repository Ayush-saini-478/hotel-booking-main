import express from 'express';
import cors from 'cors';
import connectDb from './config/connect_db.js';
import { PORT } from './config/server_config.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './config/cloudinary.js';


await connectDb();
await connectCloudinary();


const app = express();

app.use(cors());// enable cross-origin resource sharing

// Middlewares
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerk Webhooks
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);



app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});