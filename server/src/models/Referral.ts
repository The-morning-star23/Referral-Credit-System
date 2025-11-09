import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the Referral document
export interface IReferral extends Document {
  referrer: mongoose.Schema.Types.ObjectId; // The user who made the referral (Lina)
  referred: mongoose.Schema.Types.ObjectId; // The user who signed up (Ryan)
  status: "pending" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema: Schema<IReferral> = new Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "converted"], // 'pending' = signed up, 'converted' = made first purchase
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// To prevent a user from being referred twice, or referring the same person multiple times
// We can add a compound index, although our logic will primarily handle this.
referralSchema.index({ referrer: 1, referred: 1 }, { unique: true });

const Referral: Model<IReferral> = mongoose.model<IReferral>(
  "Referral",
  referralSchema
);

export default Referral;