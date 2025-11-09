import { type Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Referral from "../models/Referral";
import Purchase from "../models/Purchase";
import { type AuthRequest } from "../types/AuthRequest";

/**
 * @desc    Get user dashboard data
 * @route   GET /api/user/dashboard
 * @access  Private
 */
export const getDashboardData = async (req: AuthRequest, res: Response) => { // <-- Use AuthRequest
  // req.user is attached by our 'protect' middleware
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    const userId = req.user._id;

    const totalReferredUsers = await Referral.countDocuments({
      referrer: userId,
    });

    const convertedUsers = await Referral.countDocuments({
      referrer: userId,
      status: "converted",
    });

    const totalCreditsEarned = req.user.credits;
    const referralCode = req.user.referralCode;

    const referralLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/register?r=${referralCode}`;

    res.json({
      totalReferredUsers,
      convertedUsers,
      totalCreditsEarned,
      referralLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Simulate a user purchase
 * @route   POST /api/user/purchase
 * @access  Private
 */
export const handlePurchase = async (req: AuthRequest, res: Response) => { // <-- Use AuthRequest
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const existingPurchase = await Purchase.findOne({ user: userId }).session(
      session
    );

    if (existingPurchase) {
      await Purchase.create(
        [
          {
            user: userId,
            productName: "Another Product",
            amount: 15,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return res
        .status(200)
        .json({ message: "Purchase successful, but no credits awarded." });
    }

    await Purchase.create(
      [
        {
          user: userId,
          productName: "First Product",
          amount: 10,
        },
      ],
      { session }
    );

    const referral = await Referral.findOne({
      referred: userId,
      status: "pending",
    }).session(session);

    if (referral) {
      const referrerId = referral.referrer;

      await User.updateOne(
        { _id: userId },
        { $inc: { credits: 2 } },
        { session }
      );

      await User.updateOne(
        { _id: referrerId },
        { $inc: { credits: 2 } },
        { session }
      );

      referral.status = "converted";
      await referral.save({ session });

      await session.commitTransaction();
      res.status(200).json({
        message: "First purchase successful! You and your referrer earned 2 credits.",
      });
    } else {
      await session.commitTransaction();
      res.status(200).json({
        message: "First purchase successful! No referral credits applied.",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: "Server Error during purchase" });
  } finally {
    session.endSession();
  }
};