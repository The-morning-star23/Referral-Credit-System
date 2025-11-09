import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Interface to define the User document properties
export interface IUser extends Document {
  email: string;
  password?: string; // Optional on the interface, but required for creation
  referralCode: string;
  credits: number;
  referredBy: mongoose.Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  // Method to compare passwords
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Mongoose "pre-save" middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // We need to check if password exists, as 'this.password' could be undefined
  // due to our '?' in the interface. In practice, it will be defined on creation.
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;