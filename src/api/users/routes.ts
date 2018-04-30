import * as Hapi from "hapi";
import * as Joi from "joi";
import UserController from "./user-controller";
import { UserModel } from "./user";
import * as UserValidator from "./user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export default function(
  server: Hapi.Server,
  serverConfigs: IServerConfigurations,
  database: IDatabase
) {
  const userController = new UserController(serverConfigs, database);
  server.bind(userController);

  server.route({
    method: "GET",
    path: "/users/info",
    options: {
      handler: userController.infoUser,
      auth: "jwt",
      tags: ["api", "users"],
      description: "Get user info.",
      validate: {
        headers: UserValidator.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "User founded."
            },
            "401": {
              description: "Please login."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "DELETE",
    path: "/users",
    options: {
      handler: userController.deleteUser,
      auth: "jwt",
      tags: ["api", "users"],
      description: "Delete current user.",
      validate: {
        headers: UserValidator.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "User deleted."
            },
            "401": {
              description: "User does not have authorization."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/users",
    options: {
      handler: userController.updateUser,
      auth: "jwt",
      tags: ["api", "users"],
      description: "Update current user info.",
      validate: {
        payload: UserValidator.updateUserModel,
        headers: UserValidator.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Updated info."
            },
            "401": {
              description: "User does not have authorization."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/users",
    options: {
      handler: userController.createUser,
      auth: false,
      tags: ["api", "users"],
      description: "Create a user.",
      validate: {
        payload: UserValidator.createUserModel
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "201": {
              description: "User created."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/users/login",
    options: {
      handler: userController.loginUser,
      auth: false,
      tags: ["api", "users"],
      description: "Login a user.",
      validate: {
        payload: UserValidator.loginUserModel
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "User logged in."
            }
          }
        }
      }
    }
  });
}
