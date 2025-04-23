import RakiAvailability from "../models/rakiAvailability";

require("dotenv").config();

import { AuthenticatedRequest } from "../@types/express";
import { response, Response } from "express";
import moment from "moment-timezone";
import { validateAndConvertTimezone } from "../utils/timezone";
import Meeting, { MeetingStatus } from "../models/meeting";
import { client } from "../config/streamConfig";
import User from "../models/user";

const MEETING_COST = Number(process.env.SESSION_COST) || 50;

interface MeetingRequest {
  meetingId: string;
  topic: string;
  date: string;
  rakiId: string;
  notificationSend?: boolean;
  timeZone?: string;
  duration?: number;
  status?: string;
}

interface StatisticsResponse {
  totalMeetings: number;
  revenue: number;
  completedMeetings: number;
  cancelledMeetings: number;
  averageMeetingsPerDay?: number;
  dailyBreakdown?: {
    date: string;
    meetings: number;
    revenue: number;
  }[];
}

interface DateRange {
  start: string;
  end: string;
}

const convertMeetingDates = (meetings: any[], timeZone: string): any[] => {
  return meetings.map((meeting) => ({
    ...meeting.toObject(),
    date: moment(meeting.date).tz(timeZone).format("YYYY-MM-DD HH:mm"),
    originalTimezone: timeZone,
  }));
};

export const getAllMeetings = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { timeZone = "UTC" } = req.query;
    const validatedTimeZone = validateAndConvertTimezone(timeZone.toString());

    const meetings = await Meeting.find({ status: { $ne: MeetingStatus.PENDING } });
    if (!meetings.length)
      return res.status(404).json({ message: "No meetings found" });

    res.status(200).json(convertMeetingDates(meetings, validatedTimeZone));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTodayAndFutureMeetings = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { timeZone = "UTC" } = req.query;
    const user = req.user;
    const validatedTimeZone = validateAndConvertTimezone(timeZone.toString());

    const nowUTC = moment().utc().startOf("minute").toDate(); // Current UTC time
    const endOfTodayUTC = moment().utc().add(24, "hours").toDate(); // 24 hours from now

    let meetings;

    if (user?.role === "super-admin") {
      meetings = await Meeting.find({
        date: {
          $gte: nowUTC.toISOString(),
          $lte: endOfTodayUTC.toISOString()
        },
        status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
      });
    } else {
      meetings = await Meeting.find({
        date: { $gte: nowUTC.toISOString(), $lte: endOfTodayUTC.toString() },
        rakiId: user?.id,
        status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
      });
    }

    res.status(200).json(convertMeetingDates(meetings, validatedTimeZone));
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const addMeeting = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User ID not found in request" });

    const {
      topic,
      date,
      rakiId,
      notificationSend = false,
      timeZone = "UTC",
      duration = 60,
      status = MeetingStatus.PENDING,
    } = req.body as MeetingRequest;
    if (!topic || !date || !rakiId) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    const validatedTimeZone = validateAndConvertTimezone(timeZone);

    const utcDate = moment
      .tz(date, "YYYY-MM-DD HH:mm", validatedTimeZone)
      .utc()
      .toISOString();

    const existingMeetings = await Meeting.find({
      $or: [{ rakiId }, { userId }],
      date: utcDate,
      status:MeetingStatus.SCHEDULED
    });

    if (existingMeetings.length > 0) {
      return res
        .status(409)
        .json({
          message: "Meeting scheduling conflict",
          conflictingMeetings: existingMeetings,
        });
    }

    const newMeeting = new Meeting({
      topic,
      date: utcDate,
      rakiId,
      userId,
      notificationSend,
      duration,
      status,
    });

    newMeeting.meetingId = newMeeting?.id.toString();

    const savedMeeting = await newMeeting.save();

    const getRakiDetails = await User.findOne({ _id: savedMeeting.rakiId });
    const getUserDetails = await User.findOne({ _id: savedMeeting.userId });

    try {
      console.log(
        `Creating Stream video call for meetingId: ${newMeeting.meetingId}`
      );

      const call = client.video.call("default", newMeeting.meetingId);
      const streamResponse = await call.create({
        data: {
          created_by_id: rakiId,
          members: [{ user_id: rakiId, role: "raki" }, { user_id: userId }],
          custom: { topic },
          // settings_override: {
          //     recording: { mode: 'available' }
          // }
        },
      });
    } catch (error: any) {
      console.error("Stream API Error:", error?.message || error);
      await Meeting.findByIdAndDelete(savedMeeting._id);
      return res
        .status(500)
        .json({
          message: "Failed to create Stream video call",
          error: error?.message || error,
        });
    }

    res.status(201).json({
      ...savedMeeting.toObject(),
      date: moment(savedMeeting.date)
        .tz(validatedTimeZone)
        .format("YYYY-MM-DD HH:mm:ss"),
      raki: getRakiDetails,
      user: getUserDetails,
    });
  } catch (error: any) {
    console.error("General Error:", error?.message || error);
    res
      .status(500)
      .json({
        message: "Failed to add meeting",
        error: error?.message || error,
      });
  }
};

export const getMeetingsByUserId = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User ID not found in request" });

    const { timeZone = "UTC" } = req.query;
    const validatedTimeZone = validateAndConvertTimezone(timeZone.toString());

    const meetings = await Meeting.find({ userId,status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
    });
    res.status(200).json(convertMeetingDates(meetings, validatedTimeZone));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meetings", error });
  }
};

export const rescheduleMeeting = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { meetingId, newDate, timeZone = "UTC" } = req.body;
    if (!meetingId || !newDate) {
      return res
        .status(400)
        .json({
          message: "Meeting ID and new date are required for rescheduling",
        });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone);
    } catch (error) {
      return res
        .status(400)
        .json({
          message: error instanceof Error ? error.message : "Invalid timezone",
        });
    }

    const utcNewDate = moment
      .tz(newDate, "YYYY-MM-DD HH:mm", validatedTimeZone)
      .utc()
      .toISOString();

    // Find the meeting
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return res
        .status(404)
        .json({
          message:
            "Meeting not found or you do not have permission to reschedule it",
        });
    }

    if (meeting.status === MeetingStatus.CANCELLED) {
      return res
        .status(400)
        .json({ message: "Cannot reschedule a cancelled meeting" });
    }

    if (meeting.status === MeetingStatus.PENDING) {
      return res
          .status(400)
          .json({ message: "Cannot reschedule a pending meeting" });
    }

    // Check if the new date is available
    const isAvailabilityForRaki = await RakiAvailability.findOne({
      rakiId: meeting?.rakiId,
      startTime: utcNewDate,
    });

    if (!isAvailabilityForRaki) {
      return res
        .status(409)
        .json({ message: "No availability found for raki", data: null });
    }
    if (!isAvailabilityForRaki.isAvailable) {
      return res
        .status(409)
        .json({
          message: "Raki already scheduled for another meeting",
          data: null,
        });
    }

    // Check for scheduling conflicts
    const dayStart = moment(utcNewDate).startOf("day");
    const dayEnd = moment(utcNewDate).endOf("day");

    const existingMeetings = await Meeting.find({
      _id: { $ne: meeting._id },
      date: { $gte: dayStart.toDate(), $lte: dayEnd.toDate() },
      status: { $ne: MeetingStatus.CANCELLED },
    });

    if (existingMeetings.length > 0) {
      return res.status(409).json({
        message: "Scheduling conflict on the new date",
        conflictingMeetings: existingMeetings.map((m) => ({
          ...m.toObject(),
          date: moment(m.date).tz(validatedTimeZone).format("YYYY-MM-DD HH:mm"),
        })),
      });
    }

    // Update the meeting
    const updatedMeeting = await Meeting.findOneAndUpdate(
      { meetingId },
      {
        date: utcNewDate,
        status: MeetingStatus.RESCHEDULED,
        note: "Meeting rescheduled",
        notificationSend: false,
      },
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(500).json({ message: "Failed to reschedule meeting" });
    }

    // Mark old availability as unavailable
    await RakiAvailability.findOneAndUpdate(
      { rakiId: meeting?.rakiId, startTime: meeting.date },
      { isAvailable: true }
    );

    await RakiAvailability.findOneAndUpdate(
      { rakiId: meeting?.rakiId, startTime: utcNewDate },
      { isAvailable: false }
    );

    // Fetch user and raki details
    const getRakiDetails = await User.findOne({ _id: updatedMeeting.rakiId });
    const getUserDetails = await User.findOne({ _id: updatedMeeting.userId });

    res.status(200).json({
      message: "Meeting rescheduled successfully",
      meeting: {
        ...updatedMeeting.toObject(),
        date: moment(updatedMeeting.date)
          .tz(validatedTimeZone)
          .format("YYYY-MM-DD HH:mm:ss"),
        raki: getRakiDetails,
        user: getUserDetails,
      },
    });
  } catch (error) {
    console.error("Error rescheduling meeting:", error);
    res.status(500).json({
      message: "Failed to reschedule meeting",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const cancelMeeting = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { meetingId, note } = req.body;

    if (!note || !meetingId) {
      return res.status(400).json({
        message: "Cancellation note is required",
      });
    }

    const meeting = await Meeting.findOne({
      meetingId,
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found or you do not have permission to cancel it",
      });
    }

    if (meeting.status === MeetingStatus.CANCELLED) {
      return res.status(400).json({
        message: "Meeting is already cancelled",
      });
    }

    const updatedMeeting = await Meeting.findOneAndUpdate(
      { meetingId },
      {
        status: MeetingStatus.CANCELLED,
        note,
        notificationSend: false, // Reset notification flag
      },
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(200).json({ message: "No meeting  found", data: null });
    }

    const deletedAvailability = await RakiAvailability.findOneAndUpdate(
      { rakiId: meeting?.rakiId, startTime: updatedMeeting?.date },
      { isAvailable: false }
    );

    if (!deletedAvailability) {
      return res
        .status(200)
        .json({ message: "No availability found", data: null });
    }

    const getRakiDetails = await User.findOne({ _id: updatedMeeting.rakiId });
    const getUserDetails = await User.findOne({ _id: updatedMeeting.userId });

    res.status(200).json({
      message: "Meeting cancelled successfully",
      meeting: {
        ...updatedMeeting.toObject(),
        raki: getRakiDetails,
        user: getUserDetails,
      },
    });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    res.status(500).json({
      message: "Failed to cancel meeting",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getMeetingStatistics = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { filterType, startDate, endDate, timeZone = "UTC" } = req.query;
    const rakiId = req.user?.id;

    console.log(req.query);

    if (!rakiId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone.toString());
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid timezone",
      });
    }

    let dateRange: DateRange | null = null;

    switch (filterType) {
      case "last_week":
        const end = moment().tz(validatedTimeZone).endOf("day");
        const start = moment()
          .tz(validatedTimeZone)
          .subtract(7, "days")
          .startOf("day");
        dateRange = {
          start: start.toDate().toISOString(),
          end: end.toDate().toISOString(),
        };
        break;

      case "range":
        if (!startDate || !endDate) {
          return res.status(400).json({
            message: "Start and end dates are required for range filter",
          });
        }
        dateRange = {
          start: moment
            .tz(startDate.toString(), validatedTimeZone)
            .startOf("day")
            .toDate()
            .toISOString(),
          end: moment
            .tz(endDate.toString(), validatedTimeZone)
            .endOf("day")
            .toDate()
            .toISOString(),
        };
        break;

      case "all":
        break;

      default:
        return res.status(400).json({
          message:
            'Invalid filter type. Must be "all", "last_week", or "range"',
        });
    }

    let query: any = {status: { $ne: MeetingStatus.PENDING }};
    if (dateRange) {
      query.date = {
        $gte: dateRange.start,
        $lte: dateRange.end,
      };
    }

    console.log(query);

    const meetings = await Meeting.find(query);

    // Calculate statistics
    const completedMeetings = meetings.filter(
      (m) => m.status !== MeetingStatus.CANCELLED
    ).length;
    const cancelledMeetings = meetings.filter(
      (m) => m.status === MeetingStatus.CANCELLED
    ).length;

    const validMeetings = meetings.filter(
        (m) => m.status !== MeetingStatus.PENDING && m.status !== MeetingStatus.CANCELLED
    ).length;

    const revenue = validMeetings * MEETING_COST;

    let response: StatisticsResponse = {
      totalMeetings: meetings.length,
      completedMeetings,
      cancelledMeetings,
      revenue,
    };

    if (dateRange) {
      const daysDifference =
        moment(dateRange.end).diff(moment(dateRange.start), "days") + 1;
      response.averageMeetingsPerDay = Number(
        (completedMeetings / daysDifference).toFixed(2)
      );
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching meeting statistics:", error);
    res.status(500).json({
      message: "Failed to fetch meeting statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getMeetingsByRakiId = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const rakiId = req.user?.id;
    if (!rakiId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const { timeZone = "UTC" } = req.query;

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone.toString());
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid timezone",
      });
    }

    const meetings = await Meeting.find({
      rakiId,
      status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
    });

    if (!meetings || meetings.length === 0) {
      return res
        .status(404)
        .json({ message: "No meetings found for this Raki ID" });
    }

    const convertedMeetings = convertMeetingDates(meetings, validatedTimeZone);
    res.status(200).json(convertedMeetings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meetings", error });
  }
};

export const updateMeetingPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { meetingId, isPaid } = req.body;

    const meeting = await Meeting.findOne({
      meetingId,
      status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found or you do not have permission to update it",
      });
    }

    const updatedMeeting = await Meeting.findOneAndUpdate(
      { meetingId },
      {
        isPaid: isPaid,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Meeting payment update successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error("Error updating payment of  meeting:", error);
    res.status(500).json({
      message: "Failed to update  meeting payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const requestMeetingPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { meetingId } = req.body;

    const meeting = await Meeting.findOne({
      meetingId,
      status: { $in: [MeetingStatus.SCHEDULED, MeetingStatus.RESCHEDULED] }
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found or you do not have permission to cancel it",
      });
    }

    const requestedAt = new Date().toISOString();

    const updatedMeeting = await Meeting.findOneAndUpdate(
      { meetingId },
      {
        requestedAt,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Meeting payment request successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error("Error request payment of  meeting:", error);
    res.status(500).json({
      message: "Failed to request  meeting payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const deleteMeeting = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { rakiId,date,timeZone } = req.body;

    if ( !rakiId || !date || !timeZone) {
      return res.status(400).json({
        message: "meetingId and date  is required",
      });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone);
    } catch (error) {
      return res
          .status(400)
          .json({
            message: error instanceof Error ? error.message : "Invalid timezone",
          });
    }

    const utcNewDate = moment
        .tz(date, "YYYY-MM-DD HH:mm", validatedTimeZone)
        .utc()
        .toISOString();

    const deleteMeeting = await Meeting.findOneAndDelete(
        { rakiId,date:utcNewDate,status: MeetingStatus.PENDING }
    );

    res.status(200).json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({
      message: "Failed to cancel meeting",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
