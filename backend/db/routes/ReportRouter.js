import { Router } from 'express';
import { cookieJwtAuth } from '../middleware/cookieJwtAuth.js';
import { reportSeller } from '../controllers/ReportController.js';

const reportRouter = Router();

reportRouter.post('/:sellerID', cookieJwtAuth, reportSeller);

export default reportRouter;