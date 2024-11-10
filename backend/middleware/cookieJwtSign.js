import jwt from 'jsonwebtoken';
import { env } from 'process';

export function cookieJwtSign(res, updatedUser) {
    const freefinder_session = jwt.sign({ ...updatedUser }, env.JWT_SECRET_KEY, { expiresIn: "1d" });

    return res.cookie("freefinder_session", freefinder_session, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Strict"
    }).json({ 
        userData: updatedUser, 
        message: "success" 
    });
}