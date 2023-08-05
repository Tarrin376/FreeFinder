import { prisma } from "../index.js";
import { DBError } from "../customErrors/DBError.js";

export function checkUser(userID, username) {
    return new Promise(async (resolve, reject) => {
        const user = await prisma.user.findUnique({ 
            where: { 
                username: username 
            }
        });
        
        if (!user) reject(new DBError("User not found.", 404));
        else if (userID !== user.userID) reject(new DBError("You are not authorized to perform this action.", 403));
        else resolve(user);
    });
}