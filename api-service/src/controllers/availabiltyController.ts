import { Request, Response } from "express";
import RakiAvailability, {
  IRakiAvailability,
} from "../models/rakiAvailability";
import Review, { IReview } from "../models/review";
import moment from "moment-timezone";
import { AuthenticatedRequest } from "../@types/express";
import User from "../models/user";
import { validateAndConvertTimezone } from "../utils/timezone";

export const getAvailability = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<any> => {
  try {
    const { rakiId, date, timeZone = "UTC" } = req.query;
    const userId = req.user?.id;

    if (!userId) {
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

    if (typeof date !== "string" || !date.trim()) {
      return res.status(400).json({ message: "Invalid or missing date" });
    }

    console.log("Raw date input:", date);

    const parsedDate = moment(date, "YYYY-MM-DD", true);

    console.log("Converted date input:", parsedDate);

    if (!parsedDate.isValid()) {
      return res
          .status(400)
          .json({ message: "Invalid date format. Expected YYYY-MM-DD" });
    }

    const convertedDate = parsedDate.format("YYYY-MM-DD");
    console.log("Converted Date:", convertedDate);

    const startOfDayUTC = moment
        .tz(date, "YYYY-MM-DD", validatedTimeZone)
        .startOf("day")
        .utc()
        .toISOString();
    const endOfDayUTC = moment
        .tz(date, "YYYY-MM-DD", validatedTimeZone)
        .endOf("day")
        .utc()
        .toISOString();

    console.log("Start to End UTC:", startOfDayUTC, endOfDayUTC);

    const availabilityRecords = await RakiAvailability.find({
      rakiId,
      startTime: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).exec();

    console.log("Availability Records:", availabilityRecords);

    if (!availabilityRecords || availabilityRecords.length === 0) {
      return res
          .status(200)
          .json({ message: "No availability found", data: null });
    }

    // Extract and convert time slots
    const convertedSlots = availabilityRecords.map((record) => {
      const startTimeInTimeZone = moment
          .utc(record.startTime)
          .tz(validatedTimeZone)
          .format("HH:mm");

      return {
        startTime: startTimeInTimeZone,
        isAvailable: record.isAvailable, // Include isAvailable
      };
    });

    res.status(200).json({
      rakiId,
      date: convertedDate,
      timeZone: validatedTimeZone,
      timeSlots: convertedSlots, // Now includes isAvailable
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Error fetching availability", error });
  }
};

export const getRakiByAvailabilityByDate = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { date, timeZone = "UTC" } = req.query;
    const userId = req.user?.id;

    if (!userId) {
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

    if (typeof date !== "string" || !date.trim()) {
      return res.status(400).json({ message: "Invalid or missing date" });
    }

    const parsedDate = moment(date, "YYYY-MM-DD", true);

    if (!parsedDate.isValid()) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Expected YYYY-MM-DD" });
    }

    const convertedDate = parsedDate.format("YYYY-MM-DD");

    const startOfDayUTC = moment
      .tz(date, "YYYY-MM-DD", validatedTimeZone)
      .startOf("day")
      .utc()
      .toISOString();
    const endOfDayUTC = moment
      .tz(date, "YYYY-MM-DD", validatedTimeZone)
      .endOf("day")
      .utc()
      .toISOString();

    const availabilityRecords = await RakiAvailability.find({
      startTime: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).exec();

    if (!availabilityRecords || availabilityRecords.length === 0) {
      return res
        .status(200)
        .json({ message: "No availability found", data: null });
    }

    const rakiIds = availabilityRecords.map((record) =>
      record.rakiId.toString()
    );

    const uniqueRakiIds = Array.from(new Set(rakiIds));

    return res.status(200).json({
      date: convertedDate,
      timeZone: validatedTimeZone,
      rakiIds: uniqueRakiIds, // Return the unique rakiIds
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Error fetching availability", error });
  }
};

export const setAvailability = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const rakiId = req.user?.id;
    if (!rakiId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const { date, timeSlots, timeZone } = req.body;

    if (
      !Array.isArray(timeSlots) ||
      timeSlots.length === 0 ||
      !timeZone ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Invalid input. Required: date, at least one time slot, and timeZone",
      });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid timezone",
      });
    }

    const firstSlot = timeSlots[0];

    // 🛠 Fix: Combine date and startTime properly
    const startDateTime = moment.tz(
      `${date} ${firstSlot.startTime}`,
      "YYYY-MM-DD HH:mm",
      validatedTimeZone
    );

    if (!startDateTime.isValid()) {
      return res.status(400).json({
        message: "Invalid date or time format",
      });
    }

    const utcStartTime = startDateTime.utc().toISOString();

    const existingRecord = await RakiAvailability.findOne({
      rakiId,
      startTime: utcStartTime,
    }).exec();

    if (existingRecord) {
      return res.status(409).json({ message: "Availability already exists" });
    }

    const newAvailability = new RakiAvailability({
      rakiId,
      startTime: utcStartTime,
      isAvailable: true,
    });

    await newAvailability.save();

    return res.status(201).json({
      message: "Availability created successfully",
      availability: newAvailability,
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    res.status(500).json({
      message: "Error setting availability",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const removeAvailability = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const rakiId = req.user?.id;
    const { startTime, timeZone = "UTC", date } = req.body;

    if (!rakiId || !startTime || !date) {
      return res
        .status(400)
        .json({
          message: "Invalid input. Required: date, startTime, and timeZone",
        });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid timezone",
      });
    }

    const localDateTime = `${date} ${startTime}`;
    const startDateTimeUTC = moment
      .tz(localDateTime, "YYYY-MM-DD HH:mm", validatedTimeZone)
      .utc()
      .toISOString();

    const availability = await RakiAvailability.findOne({
      rakiId,
      startTime: startDateTimeUTC,
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (!availability.isAvailable) {
      return res
          .status(400)
          .json({
            message: "Cannot remove this booking because a meeting is scheduled for this slot.",
          });
    }

    // Proceed with deletion
    const deletedAvailability = await RakiAvailability.findOneAndDelete({
      rakiId,
      startTime: startDateTimeUTC,
    });

    res.status(200).json({
      message: "Availability removed successfully",
      deletedAvailability,
    });

  } catch (error) {
    console.error("Error removing availability:", error);
    res
      .status(500)
      .json({
        message: "Error removing availability",
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export const updateAvailability = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<any> => {
  try {
    const { timeZone = "UTC", date, rakiId, isAvailable } = req.body;

    if ( !date || !rakiId || isAvailable === undefined) {
      return res.status(400).json({
        message: "Invalid input. Required: date, startTime, rakiId, and isAvailable",
      });
    }

    let validatedTimeZone: string;
    try {
      validatedTimeZone = validateAndConvertTimezone(timeZone);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid timezone",
      });
    }

    const startDateTimeUTC = moment
        .tz(date, "YYYY-MM-DD HH:mm", validatedTimeZone)
        .utc()
        .toISOString();


    const availability = await RakiAvailability.findOne({
      rakiId,
      startTime: startDateTimeUTC,
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Update isAvailable instead of deleting
    const updatedAvailability = await RakiAvailability.findOneAndUpdate(
        { rakiId, startTime: startDateTimeUTC },
        { isAvailable },
        { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Availability updated successfully",
      updatedAvailability,
    });

  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      message: "Error updating availability",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const getAllAdmins = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const admins = await User.find({ role: "admin" });

    if (!admins || admins.length === 0) {
      res.status(404).json({ message: "No admins found" });
      return;
    }

    const adminsWithRatings = await Promise.all(
      admins.map(async (admin) => {
        const reviews = await Review.find({ rakiId: admin._id });

        // Calculate statistics
        const totalReviews = reviews.length;
        const totalPoints = reviews.reduce((sum, review) => sum + review.points, 0);
        const averageRating = totalReviews > 0 ? parseFloat((totalPoints / totalReviews).toFixed(1)) : undefined;

        return {
          ...admin.toObject(),
          averageRating,
        };
      })
    );

    res.status(200).json(adminsWithRatings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
