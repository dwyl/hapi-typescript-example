var Todo_1 = require("../models/Todo");
var linqsharp_1 = require("linqsharp");
var todoData = [
    new Todo_1.default(1, "Todo 1", "Description bla bla 1"),
    new Todo_1.default(2, "Todo 2", "Description bla bla 2")
];
function getAllTodos() {
    return new Promise(function (resolve, reject) {
        resolve(todoData);
    });
}
exports.getAllTodos = getAllTodos;
function getTodoById(id) {
    return new Promise(function (resolve, reject) {
        var todo = new linqsharp_1.default(todoData).FirstOrDefault(function (t) { return t.Id == id; });
        resolve(todo);
    });
}
exports.getTodoById = getTodoById;
function createTodo(todo) {
    return new Promise(function (resolve, reject) {
        todoData.push(todo);
        resolve(todo);
    });
}
exports.createTodo = createTodo;

//# sourceMappingURL=TodoRepository.js.map
