import { Router, Request, Response } from 'express';
import { getUserPoints, getTotalPoints, updateUserPoints } from '../controllers/userController';

const router = Router();

router.get('/points_details', getUserPoints);
router.get('/total_points', getTotalPoints);
router.put('/put', updateUserPoints);

export default router;
