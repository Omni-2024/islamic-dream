import {AuthenticatedRequest} from "../@types/express";
import {Response} from "express";
import {client} from "../config/streamConfig";

export const getCallDetails = async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    try {
        const { meetingId } = req.params;

        if (!meetingId) {
            return res.status(400).json({ message: 'Meeting ID is required' });
        }

        try {
            const call = client.video.call('default', meetingId);
            const callDetails = await call.get();

            return res.status(200).json({ callDetails });
        } catch (error: any) {
            if (error.code === 16) {
                return res.status(404).json({ message: 'Meeting not found in GetStream', error: error.metadata });
            }
            throw error;
        }

    } catch (error) {
        console.error('Failed to fetch call details:', error);
        res.status(500).json({ message: 'Failed to retrieve call details', error });
    }
};


export const  getCallToken =async (req:AuthenticatedRequest,res:Response):Promise<any> =>{

    const { userId,role } = req.body;

    if (!userId || !role ) {
        return res.status(400).json({ error: "userId and role required" });
    }

    try {
        const token = client.generateUserToken({ user_id: userId, role });

        res.json({ token });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: "Failed to generate token" });
    }

}

export const startRecording = async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    try {
        const { meetingId } = req.body;
        const call = client.video.call('default', meetingId);

        await call.startRecording();
        res.status(200).json({ message: 'Recording started' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to start recording', error });
    }
};

export const stopRecording = async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    try {
        const { meetingId } = req.body;
        const call = client.video.call('default', meetingId);

        await call.stopRecording();
        res.status(200).json({ message: 'Recording stopped' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to stop recording', error });
    }
};

// export const getRecording = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         const { meetingId } = req.params;
//         const call = client.video.call('default', meetingId);
//         const recordings = await call.getRecordings();
//
//         res.status(200).json({ recordings });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve recordings', error });
//     }
// };