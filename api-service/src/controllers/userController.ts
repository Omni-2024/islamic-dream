import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import { AuthenticatedRequest } from "../@types/express";
import moment from "moment-timezone";
import { getAllCountries, getTimezone } from "countries-and-timezones";
import generateToken from "../utils/generateToken";
import { client, serverClientChat } from "../config/streamConfig";
import { getStreamAdminRole } from "../utils/getStreamAdminRole";

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      country,
      languages,
      mobileNumber,
      age,
      yearOfExperience,
      description,
      gender,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "User ID not found in request" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const countries = getAllCountries();

    if (name) user.name = name;
    if (email) user.email = email;
    if (country) user.country = country;
    if (languages) user.languages = languages;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (age) user.age = age;
    if (gender) user.gender = gender;

    if (user.role === "admin") {
      if (yearOfExperience) user.yearOfExperience = yearOfExperience;
      if (description) user.description = description;
    }

    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      timezone: user.timezone,
      languages: user.languages,
      mobileNumber: user.mobileNumber,
      age: user.age,
      yearOfExperience: user.yearOfExperience,
      description: user.description,
      gender: user.gender,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateUserEmailVerification = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
  try {
    const {
      isEmailVerified,
      email
    } = req.body;


    const user = await User.findOne({email});

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (isEmailVerified) user.isEmailVerified = isEmailVerified;


    await user.save();

    res.status(200).json({
      user,
      success:true
    });
  } catch (error) {
    console.error("Error updating user email verification:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "User ID not found in request" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    user.password = newPassword;
    await user.save();

    await client.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    await serverClientChat.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;


    const user = await User.findOne({email});
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.password = newPassword;
    await user.save();

    await client.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    await serverClientChat.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId, role } = req.body;
    console.log(req.body);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = role;
    await user.save();

    await client.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    await serverClientChat.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: getStreamAdminRole({ role: user.role }),
        image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`,
      },
    ]);

    console.log("User updated successfully in Stream Video.");

    res
      .status(200)
      .json({ message: `Role updated to ${role} for user ${user.name}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserByEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await User.findOne({email});

    if (!user) {
      res.status(200).json({status:false});
      // res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
