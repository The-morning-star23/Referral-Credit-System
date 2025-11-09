import crypto from "crypto";

// Generates a simple 6-character uppercase alphanumeric code
export const generateReferralCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};