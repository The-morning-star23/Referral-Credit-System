import { type Request, type Response } from "express";
import User, { type IUser } from "../models/User";
import Referral from "../models/Referral";
import { generateReferralCode } from "../utils/generateReferralCode";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret", {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, referralCode: referrerCode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Find the referrer user, if a code was provided
    let referrer: IUser | null = null;
    if (referrerCode) {
      referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        // We still register the user, but we notify that the code was invalid
        console.log(`Referral code ${referrerCode} not found.`);
        // You could also choose to block registration if the code is invalid
      }
    }

    // 3. Create the new user
    const newUserReferralCode = generateReferralCode(); // Generate a unique code for this new user
    const user = await User.create({
      email,
      password,
      referralCode: newUserReferralCode,
      referredBy: referrer ? referrer._id : null,
      // Note: Credits are not awarded on signup, only on first purchase
    });

    // 4. If a valid referrer was found, create the referral relationship
    if (referrer && user) {
      await Referral.create({
        referrer: referrer._id,
        referred: user._id,
        status: "pending", // Status is 'pending' until first purchase
      });
      console.log(`Referral link created for ${referrer.email} -> ${user.email}`);
    }

    // 5. Send back user data and token
    res.status(201).json({
      _id: user._id,
      email: user.email,
      referralCode: user.referralCode,
      credits: user.credits,
      token: generateToken(user.id), // <-- UPDATED THIS LINE
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // 1. Find user by email
    const user = await User.findOne({ email }).select("+password");

    // 2. Check user and password
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
        token: generateToken(user.id), // <-- UPDATED THIS LINE
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};