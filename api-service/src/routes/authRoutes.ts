import express from 'express';
import { registerUser, loginUser, loginWithGoogle } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/social', loginWithGoogle);

export default router;
