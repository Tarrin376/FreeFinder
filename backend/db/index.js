import express, { json } from 'express';
import userRouter from './routes/UserRouter.js';
import postRouter from './routes/PostRouter.js';
import sellerRouter from './routes/SellerRouter.js';

const app = express();
const PORT = 8000;

app.use(json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/seller', sellerRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});