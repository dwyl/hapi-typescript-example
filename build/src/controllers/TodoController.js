var Joi = require("joi");
var Boom = require("boom");
var TodoRepository = require("../repository/TodoRepository");
var Todo_1 = require('../models/Todo');
function default_1(server) {
    server.route({
        method: 'GET',
        path: '/api/todos',
        handler: function (request, reply) {
            TodoRepository.getAllTodos()
                .then(function (todos) {
                reply(todos);
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/api/todos/{id}',
        handler: function (request, reply) {
            var params = request.params;
            TodoRepository.getTodoById(params.id)
                .then(function (todo) {
                if (todo)
                    reply(todo);
                else
                    reply(Boom.notFound());
            });
        },
        config: {
            validate: {
                params: {
                    id: Joi.number(),
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/api/todos',
        handler: function (request, reply) {
            var todo = new Todo_1.default(request.payload.id, request.payload.name, request.payload.description);
            TodoRepository.createTodo(todo)
                .then(function (todo) {
                reply(todo).code(201);
            });
        },
        config: {
            validate: {
                payload: {
                    id: Joi.number().required(),
                    name: Joi.string().required(),
                    description: Joi.string().required().min(10)
                }
            }
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;

//# sourceMappingURL=TodoController.js.map
