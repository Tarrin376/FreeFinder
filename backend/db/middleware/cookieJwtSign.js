import jwt from 'jsonwebtoken';
import { env } from 'process';

export function cookieJwtSign(req, res) {
    const access_token = jwt.sign({ ...req.userData }, env.JWT_SECRET_KEY, { expiresIn: "1h", algorithm: "HS256" });

    return res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production"
    })
    .json({ userData: req.userData, message: "success" })
    .status(200);
}