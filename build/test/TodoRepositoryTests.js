var assert = require("assert");
var TodoRepository = require("../src/repository/TodoRepository");
describe("TodoRepository", function () {
    it("should return all todos", function (done) {
        var todos = TodoRepository.getAllTodos();
        todos.then(function (results) {
            assert.equal(results.length, 2);
            done();
        });
    });
});

//# sourceMappingURL=TodoRepositoryTests.js.map
