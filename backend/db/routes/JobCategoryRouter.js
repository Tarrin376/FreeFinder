import { Router } from 'express';
import { createJobCategory, getJobCategories } from '../controllers/jobCategoryController.js';
import workTypeRouter from './workTypeRouter.js';

const jobCategoryRouter = Router();

jobCategoryRouter.use('/work-types', workTypeRouter);
jobCategoryRouter.post('/', createJobCategory);
jobCategoryRouter.get('/', getJobCategories)

export default jobCategoryRouter;