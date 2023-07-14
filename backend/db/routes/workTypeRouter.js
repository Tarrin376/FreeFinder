import { Router } from 'express';
import { createWorkTypes } from '../controllers/workTypeController.js';

const workTypeRouter = Router();

workTypeRouter.post('/:jobCategoryID', createWorkTypes);

export default workTypeRouter;