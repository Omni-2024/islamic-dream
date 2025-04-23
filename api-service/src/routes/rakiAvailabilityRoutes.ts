import express from 'express';
import {getAllAdmins, getAvailability, removeAvailability, setAvailability,getRakiByAvailabilityByDate,updateAvailability} from "../controllers/availabiltyController";
import {authorizeRoles, protect} from "../middleware/authMiddleware";

const router = express.Router();

router.get('/rakis', getAllAdmins);
router.get('/get-availability',protect, getAvailability);
router.get('/get-rakis-date',protect, getRakiByAvailabilityByDate);
router.post('/set-availability', protect, authorizeRoles('admin','super-admin'), setAvailability);
router.post('/remove-availability', protect, authorizeRoles('admin','super-admin'), removeAvailability);
router.post('/update-availability', protect, authorizeRoles('user'), updateAvailability);

export default router;
