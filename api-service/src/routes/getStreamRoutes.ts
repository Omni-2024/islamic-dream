import express from "express";
import {
    getCallDetails, getCallToken
} from "../controllers/vedioGetStreamController";
import {createChatToken} from "../controllers/chatGetStreamController"

const router = express.Router();


router.get('/getCallDetails/:meetingId', getCallDetails);
router.post('/getuserToken/', createChatToken);
router.post('/getCallToken/', getCallToken);


export default router