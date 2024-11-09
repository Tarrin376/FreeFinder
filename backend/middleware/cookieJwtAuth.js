import jwt from 'jsonwebtoken';
import { env } from 'process';

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.freefinder_session;
    if (!token) {
        return res.status(401).json({ message: "Your login session has expired. Please refresh the page and log back in." });
    }

    try {
        const { iat, exp, ...data } = jwt.verify(token, env.JWT_SECRET_KEY);
        req.userData = data;
        next();
    } catch (err) {
        res.clearCookie("freefinder_session");
        res.status(401).json({ message: "You do not have authorization to perform this action."});
    }
};