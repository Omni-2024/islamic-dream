import express from "express";
import {
    addMeeting, cancelMeeting,
    getAllMeetings, getMeetingsByRakiId,
    getMeetingsByUserId, getMeetingStatistics,
    getTodayAndFutureMeetings, requestMeetingPayment, rescheduleMeeting, updateMeetingPayment,deleteMeeting
} from "../controllers/meetingControllers";
import {authorizeRoles, protect} from "../middleware/authMiddleware";

const router = express.Router();

router.get('/get-meetings', protect, authorizeRoles('super-admin'), getAllMeetings);
router.get('/get-today-meetings', protect, authorizeRoles('super-admin',"admin"), getTodayAndFutureMeetings);
router.post('/add-meetings', protect, authorizeRoles('admin', 'user'), addMeeting);
router.get('/get-meetings/user/', protect, authorizeRoles('user'), getMeetingsByUserId);
router.get('/get-meetings/raki/', protect, authorizeRoles('admin', 'super-admin'), getMeetingsByRakiId);
router.post('/reschedule/', protect, authorizeRoles('admin','super-admin'), rescheduleMeeting);
router.post('/cancel/', protect, authorizeRoles( 'super-admin'), cancelMeeting);
router.post('/delete/', protect, authorizeRoles( 'user'), deleteMeeting);
router.get('/get-meeting-statistics/', protect, authorizeRoles( 'super-admin'), getMeetingStatistics);
router.post('/update-payment/', protect, authorizeRoles( 'super-admin'), updateMeetingPayment);
router.post('/request-payment/', protect, authorizeRoles( 'admin'), requestMeetingPayment);



export default router