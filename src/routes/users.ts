import { Router, Request, Response } from 'express';
import { getUserPoints, getTotalPoints } from '../controllers/userController';

const router = Router();

router.get('/points_details', getUserPoints);
router.get('/total_points', getTotalPoints);

export default router;
