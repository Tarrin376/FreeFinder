import jwt from 'jsonwebtoken';
import { env } from 'process';

export const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json({ message: "Your login session has expired. Please log back in." });
    }

    try {
        const { iat, exp, ...data } = jwt.verify(token, env.JWT_SECRET_KEY);
        req.userData = data;
        return next();
    } catch (err) {
        console.log(err);
        res.clearCookie("access_token");
        return res.status(403).json({ message: "You do not have authorization to perform this action."});
    }
};