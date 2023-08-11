import jwt from 'jsonwebtoken';
import { env } from 'process';

export function cookieJwtSign(res, updatedUser) {
    const access_token = jwt.sign({ ...updatedUser }, env.JWT_SECRET_KEY, { expiresIn: "1d", algorithm: "HS256" });

    return res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Strict"
    }).json({ 
        userData: updatedUser, 
        message: "success" 
    });
}