import * as chai from "chai";
import TaskController from "../../src/api/tasks/task-controller";
import { ITask } from "../../src/api/tasks/task";
import { IUser } from "../../src/api/users/user";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();

describe("TastController Tests", () => {
  let server;

  before(done => {
    Server.init(serverConfig, database).then(s => {
      server = s;
      done();
    });
  });

  beforeEach(done => {
    Utils.createSeedTaskData(database, done);
  });

  afterEach(done => {
    Utils.clearDatabase(database, done);
  });

  it("Get tasks", async () => {
    var user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    var login: any = JSON.parse(loginResponse.payload);

    const res = await server.inject({
      method: "Get",
      url: serverConfig.routePrefix + "/tasks",
      headers: { authorization: login.token }
    });

    assert.equal(200, res.statusCode);
    var responseBody: Array<ITask> = JSON.parse(res.payload);
    assert.equal(3, responseBody.length);
  });

  it("Get single task", async () => {
    var user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    var login: any = JSON.parse(loginResponse.payload);

    const task = await database.taskModel.findOne({});
    const res = await server.inject({
      method: "Get",
      url: serverConfig.routePrefix + "/tasks/" + task._id,
      headers: { authorization: login.token }
    });

    var responseBody: ITask = JSON.parse(res.payload);
    assert.equal(200, res.statusCode);
    assert.equal(task.name, responseBody.name);
  });

  it("Create task", async () => {
    var user = Utils.createUserDummy();
    var task = Utils.createTaskDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    var login: any = JSON.parse(loginResponse.payload);

    const res = await server.inject({
      method: "POST",
      url: serverConfig.routePrefix + "/tasks",
      payload: task,
      headers: { authorization: login.token }
    });

    assert.equal(201, res.statusCode);
    var responseBody: ITask = <ITask>JSON.parse(res.payload);
    assert.equal(task.name, responseBody.name);
    assert.equal(task.description, responseBody.description);
  });

  it("Update task", async () => {
    var user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    var login: any = JSON.parse(loginResponse.payload);

    const task = await database.taskModel.findOne({});
    var updateTask = {
      completed: true,
      name: task.name,
      description: task.description
    };

    const res = await server.inject({
      method: "PUT",
      url: serverConfig.routePrefix + "/tasks/" + task._id,
      payload: updateTask,
      headers: { authorization: login.token }
    });

    assert.equal(200, res.statusCode);
    console.log(res.payload);
    var responseBody: ITask = JSON.parse(res.payload);
    assert.isTrue(responseBody.completed);
  });

  it("Delete single task", async () => {
    var user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    var login: any = JSON.parse(loginResponse.payload);

    const task = await database.taskModel.findOne({});
    const res = await server.inject({
      method: "DELETE",
      url: serverConfig.routePrefix + "/tasks/" + task._id,
      headers: { authorization: login.token }
    });

    assert.equal(200, res.statusCode);
    var responseBody: ITask = JSON.parse(res.payload);
    assert.equal(task.name, responseBody.name);

    const deletedTask = await database.taskModel.findById(responseBody._id);
    assert.isNull(deletedTask);
  });
});
