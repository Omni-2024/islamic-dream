import { AuthenticatedRequest } from "../@types/express";
import { Response , Request } from "express";
import dotenv from "dotenv";
import {stripeClient} from "../config/stripeConfig";
import Stripe from "stripe";
import { Query } from 'express-serve-static-core';


dotenv.config();

const price = Math.round(parseFloat(process.env.SESSION_COST ?? "50"));


export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id ?? "";
        const { topic, date, rakiId,rakiEmail,rakiName,userEmail,userName,timeZone } = req.body;

        if (!topic || !date || !rakiId || !timeZone) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const session = await stripeClient.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: `1-on-1 Session: ${topic}`,
                            description: `Session with Raki ${rakiName} on ${date}`,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/Raqi/${rakiId}/book/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/Raqi/${rakiId}/book/failed?rakiId=${rakiId}&date=${date}`,
            customer_email: req.user?.email || undefined,
            metadata: {
                rakiId: rakiId.toString(),
                date: date.toString(),
                topic: topic.toString(),
                userId: userId?.toString(),
                rakiEmail:rakiEmail?.toString(),
                rakiName:rakiName?.toString(),
                userEmail:userEmail?.toString(),
                userName:userName?.toString(),
                timeZone:timeZone?.toString()
            }
        });

        if (!session.url) {
            throw new Error('Failed to create checkout session URL');
        }

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({ message: "Stripe session creation failed" });
    }
};


export const verifySession=async (req: Request<{}, {}, {}, Query & { session_id?: string }>, res: Response):Promise<any> =>{

    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({
                error: 'Missing session_id parameter'
            });
        }

        const session = await stripeClient.checkout.sessions.retrieve(session_id);

        const isValid = session.payment_status === 'paid';

        const isExpired = new Date(session.expires_at * 1000) < new Date();
        const hasValidCustomer = !!session.customer;

        if (isExpired) {
            return res.status(400).json({
                error: 'Session has expired'
            });
        }

        return res.json({
            isValid,
            paymentStatus: session.payment_status,
            customerId: session.customer,
            amount: session.amount_total,
            currency: session.currency,
            paymentIntent: session.payment_intent,
            metadata: session.metadata
        });

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Stripe session verification error:', error);
        return res.status(500).json({
            error: 'Failed to verify session'
        });
    }

}
