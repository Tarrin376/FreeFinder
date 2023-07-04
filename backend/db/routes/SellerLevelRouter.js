import { Router } from 'express';
import { 
    getSellerLevels, 
    createSellerLevel, 
    updateSellerLevel, 
    deleteSellerLevel 
} from "../controllers/SellerLevelController.js";

const sellerLevelRouter = Router();

sellerLevelRouter.post('/', createSellerLevel);
sellerLevelRouter.get('/', getSellerLevels);
sellerLevelRouter.delete('/:id', deleteSellerLevel);
sellerLevelRouter.put('/:id', updateSellerLevel);

export default sellerLevelRouter;