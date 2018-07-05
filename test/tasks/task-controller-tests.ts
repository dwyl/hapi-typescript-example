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
});
