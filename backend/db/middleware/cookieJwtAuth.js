import jwt from 'jsonwebtoken';
import { env } from 'process';

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const {iat, exp, ...data} = jwt.verify(token, env.JWT_SECRET_KEY);
        req.userData = data;
        return next();
    } catch (err) {
        res.clearCookie("access_token");
        return res.sendStatus(403);
    }
};