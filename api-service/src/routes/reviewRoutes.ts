import express from "express";
import {authorizeRoles, protect} from "../middleware/authMiddleware";
import {addReview, getReviewsByRakiId} from "../controllers/reviewController";

const router = express.Router();

router.post('/add-review',protect, authorizeRoles('user'), addReview);
router.get('/get-review/:rakiId', getReviewsByRakiId);

export default router