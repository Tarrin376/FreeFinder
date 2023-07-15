import { Router } from 'express';
import { createWorkTypes } from '../controllers/WorkTypeController.js';

const workTypeRouter = Router();

workTypeRouter.post('/:jobCategoryID', createWorkTypes);

export default workTypeRouter;