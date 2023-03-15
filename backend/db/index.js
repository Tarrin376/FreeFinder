import express, { json } from 'express';
import userRouter from './routes/UserRouter.js';
import postRouter from './routes/PostRouter.js';

const app = express();
const PORT = 8000;

app.use(json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});