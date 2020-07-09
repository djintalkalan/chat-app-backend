const app = require('express')();
const http = require('http').createServer(app);
const mongo = require('mongodb').MongoClient

const BodyParser = require("body-parser");
const { response } = require('express');
const ObjectId = require("mongodb").ObjectID;
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const DATABASE_NAME = "chat_app_db";
const CONNECTION_URL = "mongodb://127.0.0.1/" + DATABASE_NAME;
let db

const io = require('socket.io')(http);

let connectedUsers = []



mongo.connect(CONNECTION_URL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        throw err
    }
    db = client.db(DATABASE_NAME);
    let chats = db.collection("chats");
    console.log("\nConnected to " + DATABASE_NAME + "\n");

    // console.log(db)

    // connect to socket io
    io.on('connection', (socket) => {
        // console.log('user connected');

        // create function to send status

        const sendStatus = (s) => {
            socket.emit('status', s)
        }

        // get chat from mongo collection



        socket.on('input', (inputData) => {
            inputData = JSON.parse(inputData)
            // io.emit('chat message', msg);
            // socket.emit('input', inputData);


            console.log("input", inputData);


            chats.insertOne(inputData, (error, result) => {
                if (error) {
                    throw error
                }
                try {
                    let messageReciever = connectedUsers.find((item, index) => {
                        return item.phone === inputData.receiver_phone
                    })
                    if (messageReciever) {
                        io.to(messageReciever.socketId).emit('output', result.ops);
                    }
                    socket.emit('output', result.ops)
                }
                catch (e) {
                    console.log("IOERROR : ", e)
                }
            })
        });

        // Handle clear
        socket.on('clear', function (data) {
            // Remove all chats from collection
            chat.remove({}, function () {
                // Emit cleared
                socket.emit('cleared');
            });
        });

        socket.on("online", (data) => {
            console.log(data.name + " Connected");
            let chats = db.collection("chats")
            try {
                let connectedIndex
                connectedIndex = connectedUsers.findIndex((item, index) => {
                    if (item.phone == data.phone) {
                        connectedIndex = index
                        return true
                    }
                    return false
                })

                if (connectedIndex >= 0) {
                    connectedUsers[connectedIndex] = { ...data, socketId: socket.id }
                }
                else {
                    connectedUsers.push({ ...data, socketId: socket.id })
                }
                console.log("CONNECTED_USERS : ", connectedUsers)
                chats.find({ $or: [{ receiver_phone: data.phone }, { sender_phone: data.phone }] }).limit(100).sort({ _id: 1 }).toArray((err, res) => {
                    if (err) {
                        throw err
                    }
                    socket.emit('outputOld', res)
                })
            }
            catch (e) {
                console.log(e)
            }
        })


        socket.on('disconnect', function () {
            let disconnectedUserIndex = connectedUsers.findIndex((item, index) => {
                return item.socketId == socket.id
            })
            console.log("\n" + connectedUsers[disconnectedUserIndex].name + ' Disconnected\n',);
            // connectedUsers.splice(disconnectedUserIndex, 1)
            console.log("CONNECTED_USERS : ", connectedUsers)
        });


    });



})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, () => {
    console.log('listening on port:3000');
});

app.post('/login', (req, res) => {
    let users = db.collection("users");
    if (req.body) {
        users.findOne({ phone: req.body.phone }, (err, response) => {
            if (err) {
                const payload = {
                    data: null,
                    success: false,
                    error: err
                }
                return res.status(500).send(payload);
            }
            if (response) {
                users.updateOne({ phone: req.body.phone }, {
                    $set: { name: req.body.name }
                })
                const payload = {
                    data: { ...response, name: req.body.name },
                    success: true
                }
                res.send(payload);
            }
            else {
                users.insertOne(req.body, (error, result) => {
                    if (error) {
                        const payload = {
                            data: null,
                            success: false,
                            error
                        }
                        return res.status(500).send(payload);
                    }
                    const payload = {
                        data: result.ops[0],
                        success: true
                    }
                    res.send(payload);
                });
            }
        })
    }
});

app.get('/get-users', (req, res) => {
    let users = db.collection("users");

    users.find().limit(100).sort({ _id: 1 }).toArray((err, result) => {
        const payload = {
            data: result,
            success: true,
        }
        res.send(payload)
    })
});

app.get('/remove', (req, res) => {
    let users = db.collection("chats");
    users.remove();
    res.send({ success: true })
});

app.post('/sync-contacts', (req, res) => {
    let users = db.collection("users");
    if (req.body) {
        var locs = req.body.contacts.map(function (x) { return x.phone });
        // console.log(locs)
        users.find({ "phone": { "$in": locs } }).toArray((err, response) => {
            if (err) {
                const payload = {
                    data: null,
                    success: false,
                    error: err
                }
                return res.status(500).send(payload);
            }
            if (response) {
                const map = new Map();
                req.body.contacts.forEach(item => map.set(item.phone, item.name))
                response.forEach((item, index) => {
                    response[index].name = map.get(item.phone)
                })
                const payload = {
                    data: response,
                    success: true
                }
                res.send(payload);
            }
        })
    }
});

