const mongo = require('mongodb').MongoClient;

const app = require('express')();
const http = require('http').createServer(app);

const BodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const DATABASE_NAME = "chat_app_db";
const CONNECTION_URL = "mongodb://127.0.0.1/" + DATABASE_NAME;
let db

const io = require('socket.io')(http);

// Connect to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function (err, db) {
    if (err) {
        throw err;
    }
    console.log("mongodb connected")
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, () => {
    console.log('listening on port:3000');
});