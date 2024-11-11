import { Router, Request, Response } from 'express';
import { getUserPoints, getTotalPoints, getAllPoints, updateUserPoints } from '../controllers/userController';

const router = Router();

router.get('/points_details', getUserPoints);
router.get('/total_points', getTotalPoints);
router.get('/all_points', getAllPoints);
router.put('/put', updateUserPoints);

export default router;
