var hapi = require("hapi");
var Inert = require("inert");
var Vision = require("vision");
var HapiSwagger = require("hapi-swagger");
var controllers_1 = require("./controllers");
var port = process.env.port || 3000;
var server = new hapi.Server();
server.connection({
    port: process.env.PORT || port,
    labels: ['hapi-example'],
    router: {
        stripTrailingSlash: true
    }
});
server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: {
            info: {
                title: 'Todo api',
                description: 'Simple TODO api.',
                version: '1.0'
            },
            tags: [
                {
                    'name': 'todo',
                    'description': 'Todo api.'
                }
            ],
            enableDocumentation: true,
            documentationPath: '/documentation'
        }
    },
], {
    select: 'hapi-example'
}, function (err) {
    if (err) {
        throw err;
    }
});
controllers_1.default(server);
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

//# sourceMappingURL=app.js.map
