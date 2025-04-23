import express from 'express';
import {
    changePassword,
    getAllUsers, getUserByEmail,
    getUserById, getUserProfile, resetPassword,
    updateUser, updateUserEmailVerification,
    updateUserRole
} from '../controllers/userController';
import {authorizeRoles, protect} from "../middleware/authMiddleware";

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user-profile',protect, getUserProfile);
router.post('/update',protect, updateUser);
router.post('/update-emailVerification', updateUserEmailVerification);
router.post('/change-password', protect, changePassword);
router.post('/reset-password', resetPassword);
router.post('/update-role', protect, authorizeRoles('super-admin'), updateUserRole);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);



export default router;
