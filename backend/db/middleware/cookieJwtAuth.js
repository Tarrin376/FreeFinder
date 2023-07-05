import jwt from 'jsonwebtoken';
import { env } from 'process';

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json({ message: "Your login session has expired. Please refresh the page and log back in." });
    }

    try {
        const { iat, exp, ...data } = jwt.verify(token, env.JWT_SECRET_KEY);
        req.userData = data;
        next();
    } catch (err) {
        res.clearCookie("access_token");
        res.status(403).json({ message: "You do not have authorization to perform this action."});
    }
};