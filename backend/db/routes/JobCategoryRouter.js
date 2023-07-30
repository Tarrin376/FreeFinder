import { Router } from 'express';
import { createJobCategory, getJobCategories } from '../controllers/JobCategoryController.js';
import workTypeRouter from './WorkTypeRouter.js';

const jobCategoryRouter = Router();

jobCategoryRouter.use('/work-types', workTypeRouter);

jobCategoryRouter.post('/', createJobCategory);
jobCategoryRouter.get('/', getJobCategories)

export default jobCategoryRouter;