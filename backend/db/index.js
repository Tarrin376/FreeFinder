import express, { json } from 'express';
import userRouter from './routes/UserRouter.js';
import postRouter from './routes/PostRouter.js';
import sellerRouter from './routes/SellerRouter.js';
import { env } from 'process';
import cookieParser from 'cookie-parser';

export const paginationLimit = 10;
const app = express();
const PORT = env.PORT || 8000;
const router = express.Router();

app.use(json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.all('/api*', requireAuthentication);
app.use('/api', router);

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/sellers', sellerRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

function requireAuthentication(req, res, next) {
    next();
}