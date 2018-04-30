import * as Hapi from "hapi";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export function init(
  server: Hapi.Server,
  configs: IServerConfigurations,
  database: IDatabase
) {}
