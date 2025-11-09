import { type Request } from "express";
import { type IUser } from "../models/User";

// Export a custom interface that extends Express's Request
// and adds an OPTIONAL 'user' property.
export interface AuthRequest extends Request {
  user?: IUser;
}