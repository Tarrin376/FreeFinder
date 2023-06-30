import { prisma } from "../services/UserService.js";
import { DBError } from "../customErrors/DBError.js";

export async function checkUser(userID, username) {
    const user = await prisma.user.findUnique({ 
        where: { 
            username: username 
        }
    });
    
    if (!user) {
        throw new DBError("User not found.", 404);
    }

    if (userID !== user.userID) {
        throw new DBError("You are not authorized to view this user's saved posts.", 403);
    }
}