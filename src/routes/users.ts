import { Router } from 'express';
import { getUserPoints } from '../controllers/userController';

const router = Router();

router.get('/points', getUserPoints);

export default router;
