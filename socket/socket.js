

let connectedUsers = []


let mongoose = require('mongoose');

let User = mongoose.model('Users');
let Chat = mongoose.model('Chats');

module.exports = function (http) {
    const io = require('socket.io')(http);
    io.on('connection', (socket) => {
        socket.on('input', (inputData) => {
            inputData = JSON.parse(inputData)
            console.log("input", inputData);
            // inputData.message = inputData.message.toString("utf-8")
            let input_chat = new Chat(inputData)
            input_chat.save((error, result) => {
                if (error) {
                    throw error
                }
                try {
                    let messageReceiver = connectedUsers.find((item, index) => {
                        return item.phone === inputData.receiverPhone
                    })
                    console.log("input result :", JSON.stringify(result))
                    if (messageReceiver) {
                        io.to(messageReceiver.socketId).emit('output', result);
                    }
                    socket.emit('markedSent', result)
                }
                catch (e) {
                    console.log("IOERROR : ", e)
                }
            })
        });

        socket.on("online", (data) => {
            console.log(data.name + " Connected");
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
                Chat.find({ $and: [{ receiverPhone: data.phone }, { status: "0" }] }, (err, result) => {
                    if (err) {
                        throw err
                    }
                    if (result && result.length > 0)
                        socket.emit('outputOld', result)
                }).sort({ _id: 1 });
            }
            catch (e) {
                console.log(e)
                // outputOld
            }
        });

        socket.on('markReceived', (data) => {
            console.log("markReceived : ", data)
            Chat.update(
                { _id: { "$in": data } }, { $set: { "status": "1" } }, { "multi": true }).then((product) => {
                    data.forEach(element => {
                        let eventReceiver = connectedUsers.filter((item, index) => {
                            return item.phone === element.senderPhone || item.phone === element.receiverPhone
                        })
                        // console.log("eventReceiver", eventReceiver);
                        if (eventReceiver) {
                            io.to(eventReceiver[0].socketId).emit('markedReceived', element);
                            io.to(eventReceiver[1].socketId).emit('markedReceived', element);
                        }
                    });

                });
        });

        socket.on('markRead', function (data) {
            console.log("markRead : ", data)
            Chat.update(
                { _id: { "$in": data } }, { $set: { "status": "2" } }, { "multi": true }).then((product) => {
                    data.forEach(element => {
                        let eventReceiver = connectedUsers.filter((item, index) => {
                            return item.phone === element.senderPhone || item.phone === element.receiverPhone
                        })
                        // console.log("markReadReceiver", eventReceiver);
                        if (eventReceiver) {
                            io.to(eventReceiver[0].socketId).emit('markedRead', element);
                            io.to(eventReceiver[1].socketId).emit('markedRead', element);
                        }
                    });
                });
        });

        socket.on('userStatusChanges', function (data) {
            // console.log("userStatusChanges : ", data)
            let connectedIndex
            connectedIndex = connectedUsers.findIndex((item, index) => {
                if (item.phone == data.phone) {
                    connectedIndex = index
                    return true
                }
                return false
            })

            if (connectedIndex >= 0) {
                let temp = JSON.parse(JSON.stringify(connectedUsers[connectedIndex]))
                connectedUsers[connectedIndex] = { ...temp, isOnlineTag: data.isOnlineTag, lastSeenTag: data.lastSeenTag }
            }
            else {

            }
            io.emit("markUserStatusChanged", data)
        });

        socket.on('fetchUserStatus', function (data) {
            // console.log("fetchUserStatus : ", data)
            let connectedIndex
            connectedIndex = connectedUsers.findIndex((item, index) => {
                if (item.phone == data) {
                    connectedIndex = index
                    return true
                }
                return false
            })

            if (connectedIndex >= 0) {
                const { _id, isOnlineTag, lastSeenTag } = connectedUsers[connectedIndex]
                socket.emit("resultFetchUserStatus", { _id, isOnlineTag, lastSeenTag })
                // console.log("fetchUserStatus : ", {_id, isOnlineTag, lastSeenTag })

            }
            else {

            }
        });

        var unicodeToChar = function (text) {
            return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        }






        socket.on('disconnect', function () {
            // let disconnectedUserIndex = connectedUsers.findIndex((item, index) => {
            //     return item.socketId == socket.id
            // })
            // console.log("\n" + connectedUsers[disconnectedUserIndex].name + ' Disconnected\n',);
            // // connectedUsers.splice(disconnectedUserIndex, 1)
            console.log("CONNECTED_USERS : ", connectedUsers)
        });


    });

};
