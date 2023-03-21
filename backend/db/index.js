import express, { json } from 'express';
import userRouter from './routes/UserRouter.js';
import postRouter from './routes/PostRouter.js';
import sellerRouter from './routes/SellerRouter.js';
import { env } from 'process';

const app = express();
const PORT = env.PORT || 8000;
const router = express.Router();

app.use(json());
app.use(express.urlencoded({ extended: false }));
app.all('/api*', requireAuthentication);
app.use('/api', router);

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/seller', sellerRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

function requireAuthentication(req, res, next) {
    next();
}