import * as Hapi from "hapi";
import * as Boom from "boom";
import { ITask } from "./task";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { IRequest } from "../../interfaces/request";
import { ILogs } from "../logs/logs";

//Custom helper module
import * as Helper from "../../utils/helper";

export default class TaskController {
  private database: IDatabase;
  private configs: IServerConfigurations;

  constructor(configs: IServerConfigurations, database: IDatabase) {
    this.configs = configs;
    this.database = database;
  }

  public async testing(request: IRequest, h: Hapi.ResponseToolkit) {
    let profile: any = {
      _id: "AnkitJain"
    };

    //Logging user request
    Helper.dbLogger("UserID", `Validate email payload ${JSON.stringify(profile)}`, "This is a request");
    let res: any = await Helper.validateEmailDomain("ankit@live.com");

    //Logging user request response
    Helper.dbLogger("UserID", `Validate email payload reponse ${JSON.stringify(res)}`, "This is a response");

    return h.response(res).code(200);
  }

  public async createTask(request: IRequest, h: Hapi.ResponseToolkit) {
    var newTask: ITask = <ITask>request.payload;
    newTask.userId = request.auth.credentials.id;

    try {
      let task: ITask = await this.database.taskModel.create(newTask);
      return h.response(task).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async updateTask(request: IRequest, h: Hapi.ResponseToolkit) {
    let userId = request.auth.credentials.id;
    let _id = request.params["id"];

    try {
      let task: ITask = await this.database.taskModel.findByIdAndUpdate(
        { _id, userId }, //ES6 shorthand syntax
        { $set: request.payload },
        { new: true }
      );

      if (task) {
        return task;
      } else {
        return Boom.notFound();
      }
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async deleteTask(request: IRequest, h: Hapi.ResponseToolkit) {
    let id = request.params["id"];
    let userId = request["auth"]["credentials"];

    let deletedTask = await this.database.taskModel.findOneAndRemove({
      _id: id,
      userId: userId
    });

    if (deletedTask) {
      return deletedTask;
    } else {
      return Boom.notFound();
    }
  }

  public async getTaskById(request: IRequest, h: Hapi.ResponseToolkit) {
    let userId = request.auth.credentials.id;
    let _id = request.params["id"];

    let task = await this.database.taskModel.findOne({ _id, userId })
      .lean(true);

    if (task) {
      return task;
    } else {
      return Boom.notFound();
    }
  }

  public async getTasks(request: IRequest, h: Hapi.ResponseToolkit) {
    let userId = request.auth.credentials.id;
    let top = request.query["top"];
    let skip = request.query["skip"];
    let tasks = await this.database.taskModel
      .find({ userId: userId })
      .lean(true)
      .skip(skip)
      .limit(top);

    return tasks;
  }
}
