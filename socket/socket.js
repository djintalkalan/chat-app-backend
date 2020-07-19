

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
            let input_chat = new Chat(inputData)

            input_chat.save((error, result) => {
                if (error) {
                    throw error
                }
                try {
                    let messageReceiver = connectedUsers.find((item, index) => {
                        return item.phone === inputData.receiverPhone
                    })
                    console.log("input result :",JSON.stringify(result))
                    if (messageReceiver) {
                        io.to(messageReceiver.socketId).emit('output', result);
                    }
                    socket.emit('output', result)
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
                Chat.find({ $or: [{ receiverPhone: data.phone }, { senderPhone: data.phone }] }, (err, result) => {
                    if (err) {
                        throw err
                    }
                    socket.emit('outputOld', result)
                }).sort({ _id: 1 });

            }
            catch (e) {
                console.log(e)
                // outputOld
            }
        })


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