import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the Purchase document
export interface IPurchase extends Document {
  user: mongoose.Schema.Types.ObjectId;
  productName: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema: Schema<IPurchase> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      default: "Simulated Product",
    },
    amount: {
      type: Number,
      required: true,
      default: 10, // Example amount
    },
  },
  {
    timestamps: true,
  }
);

const Purchase: Model<IPurchase> = mongoose.model<IPurchase>(
  "Purchase",
  purchaseSchema
);

export default Purchase;