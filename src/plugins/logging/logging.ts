import * as Mongoose from "mongoose";

export interface ILogging extends Mongoose.Document {
  userId: string; //User id for finding the operating user
  //userType: string; //User type to finding user role - Decide in future - currently disabled
  payload: String; //response or request payload to capture details
  response: String; //Status message to capture the reponse
}

export const LoggingSchema = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    payload: { type: String, required: true },
    response: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const LoggingModel = Mongoose.model<ILogging>("logging", LoggingSchema);
