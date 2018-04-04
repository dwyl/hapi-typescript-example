import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { ILogs, LogModel } from "./api/logs/logs";
import { IUser, UserModel } from "./api/users/user";
import { ITask, TaskModel } from "./api/tasks/task";

export interface IDatabase {
  logModel: Mongoose.Model<ILogs>;
  userModel: Mongoose.Model<IUser>;
  taskModel: Mongoose.Model<ITask>;
}

export function init(config: IDataConfiguration): IDatabase {
  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(process.env.MONGO_URL || config.connectionString);

  let mongoDb = Mongoose.connection;

  mongoDb.on("error", () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once("open", () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
    logModel: LogModel,
    taskModel: TaskModel,
    userModel: UserModel
  };
}
