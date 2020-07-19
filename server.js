const app = require('express')();
const http = require('http').createServer(app);

const BodyParser = require("body-parser");
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

require('./mongoose/Database')(http);
require('./models/UserModel');
require('./models/ChatModel');
require('./models/GroupModel');

let routes = require('./api/routes');
routes(app);

http.listen(3000, () => {
    console.log('listening on port:3000');
});

