

let connectedUsers = []

let connected = new Map();


let mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

let User = mongoose.model('Users');
let Chat = mongoose.model('Chats');
let Group = mongoose.model('Groups');

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
                    if (!inputData.isGroup) {
                        // let messageReceiver = connectedUsers.find((item, index) => {
                        //     return item.phone === inputData.receiverPhone
                        // })
                        let messageReceiver = connected.get(inputData.receiverPhone)
                        console.log("input result :", JSON.stringify(result))
                        if (messageReceiver) {
                            io.to(messageReceiver.socketId).emit('output', result);
                        }
                        socket.emit('markedSent', result)
                    }
                    else {
                        const rooms = Object.keys(socket.rooms);
                        console.log(rooms)
                        socket.broadcast.to(inputData.groupId).emit('output', result);
                        socket.emit('markedSent', result)
                    }
                }
                catch (e) {
                    console.log("IOERROR : ", e)
                }
            })
        });

        socket.on("online", (data) => {
            console.log(data.name + " Connected");
            try {
                // let connectedIndex
                // connectedIndex = connectedUsers.findIndex((item, index) => {
                //     if (item.phone == data.phone) {
                //         connectedIndex = index
                //         return true
                //     }
                //     return false
                // })

                // if (connectedIndex >= 0) {
                //     connectedUsers[connectedIndex] = { ...data, socketId: socket.id }
                // }
                // else {
                //     connectedUsers.push({ ...data, socketId: socket.id })
                // }
                connected.set(data.phone, { ...data, socketId: socket.id })
                console.log("CONNECTED_USERS : ", connected)
                Chat.find({ $and: [{ receiverPhone: data.phone }, { status: "0" }] }, (err, result) => {
                    if (err) {
                        throw err
                    }
                    if (result && result.length > 0)
                        socket.emit('outputOld', result)
                }).sort({ _id: 1 });
                User.find({ phone: data.phone }, (err, result) => {
                    if (result && result.length > 0) {
                        Group.find({ _id: { $in: result[0].groups } }, (er, re) => {
                            socket.emit("groupList", re)
                            re.forEach(element => {
                                socket.join(element._id);
                            });
                            Chat.find({ $and: [{ groupId: { $in: re } }, { groupStatusReceived: { $nin: [data.phone] } }] }, (e, r) => {
                                if (r && r.length > 0)
                                    socket.emit('outputOld', r)

                            })
                        })
                    }

                })

            }
            catch (e) {
                console.log(e)
                // outputOld
            }
        });

        socket.on('markReceived', (data) => {
            // console.log("markReceived : ", data)
            Chat.update(
                { _id: { "$in": data } }, { $set: { "status": "1" } }, { "multi": true }).then((product) => {
                    data.forEach(element => {
                        // let eventReceiver = connectedUsers.filter((item, index) => {
                        //     return item.phone === element.senderPhone || item.phone === element.receiverPhone
                        // })
                        try {
                            let senderId = connected.get(element.senderPhone).socketId
                            let receiverId = connected.get(element.receiverPhone).socketId
                            if (senderId) io.to(senderId).emit('markedReceived', element);
                            if (receiverId) io.to(receiverId).emit('markedReceived', element);
                        } catch (e) { console.log(e) }

                    });

                });
        });



        socket.on('markReceivedGroup', (data) => {
            // console.log("markReceivedGroup : ", data)
            Chat.update(
                { $and: [{ _id: { "$in": data.receivedList } }, { "groupStatusReceived": { $nin: [data.phone] } }] }, { $push: { "groupStatusReceived": data.phone } }, { "multi": true }).then((product) => {
                    io.to(data.receivedList[0].groupId).emit('markedReceivedGroup', data.receivedList);
                    console.log("markReceivedGroup", product)
                });
        });

        socket.on('markReadGroup', (data) => {
            // console.log("markReadGroup : ", data)
            Chat.updateMany(
                { $and: [{ _id: { "$in": data.unreadList } }, { "groupStatusRead": { $nin: [data.phone] } }] }, { "multi": true }).then((product) => {
                    io.to(data.unreadList[0].groupId).emit('markReadGroup', data.unreadList);
                    console.log("markReadGroupGroup", product)
                });
        });



        socket.on('markRead', function (data) {
            console.log("markRead : ", data)
            Chat.update(
                { _id: { "$in": data } }, { $set: { "status": "2" } }, { "multi": true }).then((product) => {
                    data.forEach(element => {
                        // let eventReceiver = connectedUsers.filter((item, index) => {
                        //     return item.phone === element.senderPhone || item.phone === element.receiverPhone
                        // })
                        try {
                            let senderId = connected.get(element.senderPhone).socketId
                            let receiverId = connected.get(element.receiverPhone).socketId
                            if (senderId) io.to(senderId).emit('markedRead', element);
                            if (receiverId) io.to(receiverId).emit('markedRead', element);
                        } catch (e) { console.log(e) }
                    });
                });
        });

        socket.on('userStatusChanges', function (data) {
            // console.log("userStatusChanges : ", data)
            connected.set(data.phone, Object.assign(connected.get(data.phone), { isOnlineTag: data.isOnlineTag, lastSeenTag: data.lastSeenTag }))
            // let connectedIndex
            // connectedIndex = connectedUsers.findIndex((item, index) => {
            //     if (item.phone == data.phone) {
            //         connectedIndex = index
            //         return true
            //     }
            //     return false
            // })

            // if (connectedIndex >= 0) {
            //     let temp = JSON.parse(JSON.stringify(connectedUsers[connectedIndex]))
            //     connectedUsers[connectedIndex] = { ...temp, isOnlineTag: data.isOnlineTag, lastSeenTag: data.lastSeenTag }
            // }
            // else {

            // }
            io.emit("markUserStatusChanged", data)
        });

        socket.on('profileUpdate', (data) => {
            console.log("profileUpdate : ", data)
            const updateObj = {
                "name": data.name,
                "profilePic": data.profilePic,
                "about": data.about
            }

            console.log("profileUpdate : ", data)


            User.updateOne({ phone: data.phone }, updateObj, (err, doc) => {
                console.log("error : ", err)
                console.log("doc : ", doc)
                if (!err) {
                    socket.emit("selfProfileUpdated", data)
                }
            })


        });

        socket.on('fetchUserStatus', function (data) {
            // console.log("fetchUserStatus : ", data)
            // let connectedIndex
            // connectedIndex = connectedUsers.findIndex((item, index) => {
            //     if (item.phone == data) {
            //         connectedIndex = index
            //         return true
            //     }
            //     return false
            // })

            // if (connectedIndex >= 0) {
            //     const { _id, isOnlineTag, lastSeenTag } = connectedUsers[connectedIndex]
            //     socket.emit("resultFetchUserStatus", { _id, isOnlineTag, lastSeenTag })
            //     // console.log("fetchUserStatus : ", {_id, isOnlineTag, lastSeenTag })

            // }
            // else {

            // }
            let user = connected.get(data)
            if (user) {
                const { _id, isOnlineTag, lastSeenTag } = user
                socket.emit("resultFetchUserStatus", { _id, isOnlineTag, lastSeenTag })
            }
        });

        socket.on("changeInGroup", d => {
            const data = JSON.parse(d)
            data.users.forEach(element => {
                let user = connected.get(element)
                if (user) {
                    console.log("socketId", user.socketId)

                    io.to(user.socketId).emit('changeGroup', data);
                }
                // let connectedIndex
                // connectedIndex = connectedUsers.findIndex((item, index) => {
                //     if (item.phone == element) {
                //         connectedIndex = index
                //         return true
                //     }
                //     return false
                // })
                // console.log("connectedIndex", connectedIndex)
                // if (connectedIndex > -1) {
                //     let socketId = connectedUsers[connectedIndex].socketId
                //     console.log("socketId", socketId)

                //     io.to(socketId).emit('changeGroup', data);
                // }
            });
        })

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
