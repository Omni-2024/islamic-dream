import { Response } from 'express';
import { AuthenticatedRequest } from "../@types/express";
import Review, { IReview } from "../models/review";
import Meeting from "../models/meeting";

export const addReview = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { rakiId, meetingId, points, comment } = req.body;

        console.log(req.body)

        if (!rakiId || !meetingId || !points) {
            return res.status(400).json({
                message: 'Required fields missing: rakiId, meetingId, and points are required'
            });
        }

        if (points < 1 || points > 5) {
            return res.status(400).json({
                message: 'Points must be between 1 and 5'
            });
        }

        const meeting = await Meeting.findOne({
            meetingId: meetingId,
            userId: userId,
            rakiId: rakiId
        });

        if (!meeting) {
            return res.status(404).json({
                message: 'No matching meeting found for this user and raki'
            });
        }

        const existingReview = await Review.findOne({
            userId: userId,
            rakiId: rakiId
        });

        if (existingReview) {
            return res.status(409).json({
                message: 'You have already reviewed this raki',
                existingReview
            });
        }

        const review = new Review({
            rakiId,
            meetingId,
            userId,
            points,
            comment: comment || '',
        });

        const savedReview = await review.save();

        res.status(201).json({
            message: 'Review added successfully',
            review: savedReview
        });

    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            message: 'Failed to add review',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getReviewsByRakiId = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { rakiId } = req.params;

        if (!rakiId) {
            return res.status(400).json({
                message: 'Raki ID is required'
            });
        }

        const reviews = await Review.find({ rakiId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .exec();

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                message: 'No reviews found for this raki'
            });
        }

        const totalPoints = reviews.reduce((sum, review) => sum + review.points, 0);
        const averageRating = (totalPoints / reviews.length).toFixed(1);

        res.status(200).json({
            rakiId,
            totalReviews: reviews.length,
            averageRating: parseFloat(averageRating),
            reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            message: 'Failed to fetch reviews',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getRakiReviewStats = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { rakiId } = req.params;

        if (!rakiId) {
            return res.status(400).json({
                message: 'Raki ID is required'
            });
        }

        const reviews = await Review.find({ rakiId });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                message: 'No reviews found for this raki'
            });
        }

        // Calculate statistics
        const totalReviews = reviews.length;
        const totalPoints = reviews.reduce((sum, review) => sum + review.points, 0);
        const averageRating = (totalPoints / totalReviews).toFixed(1);

        // Calculate rating distribution
        const ratingDistribution = {
            5: reviews.filter(review => review.points === 5).length,
            4: reviews.filter(review => review.points === 4).length,
            3: reviews.filter(review => review.points === 3).length,
            2: reviews.filter(review => review.points === 2).length,
            1: reviews.filter(review => review.points === 1).length
        };

        res.status(200).json({
            rakiId,
            totalReviews,
            averageRating: parseFloat(averageRating),
            ratingDistribution,
            recentReviews: reviews.slice(0, 5) // Include 5 most recent reviews
        });

    } catch (error) {
        console.error('Error fetching review statistics:', error);
        res.status(500).json({
            message: 'Failed to fetch review statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkUserReview = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        const { rakiId } = req.params;

        if (!userId || !rakiId) {
            return res.status(400).json({
                message: 'Both user ID and raki ID are required'
            });
        }

        const existingReview = await Review.findOne({
            userId,
            rakiId
        });

        res.status(200).json({
            hasReviewed: !!existingReview,
            review: existingReview
        });

    } catch (error) {
        console.error('Error checking user review:', error);
        res.status(500).json({
            message: 'Failed to check user review status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};