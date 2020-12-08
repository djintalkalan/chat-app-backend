

let connectedUsers = []

let connected = new Map();


let mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

let User = mongoose.model('Users');
let Chat = mongoose.model('Chats');
let Group = mongoose.model('Groups');
let moment = require('moment')

module.exports = function (http) {
    const io = require('socket.io')(http);
    io.on('connection', (socket) => {
        socket.on('input', async (inputData) => {
            inputData = JSON.parse(inputData)
            console.log("input", inputData);
            if (inputData.isGroup) {
                await Group.findById(inputData.groupId, (err, doc) => {
                    if (!err) {
                        // console.log("Group is", doc)
                        inputData.groupMembers = doc.users
                    }
                })
            }
            let input_chat = new Chat(inputData)
            input_chat.save((error, result) => {
                if (error) {
                    throw error
                }
                try {
                    if (!inputData.isGroup) {
                        let messageReceiver = connected.get(inputData.receiverPhone)
                        console.log("input result :", JSON.stringify(result))
                        if (messageReceiver) {
                            io.to(messageReceiver.socketId).emit('output', result);
                        }
                        socket.emit('markedSent', result)
                    }
                    else {
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
                            Chat.find({ $and: [{ groupId: { $in: re } }, { groupStatusReceived: { $nin: [data.phone] } }, { groupMembers: data.phone }] }, (e, r) => {
                                if (e) {
                                    console.log("Error ", e)
                                }
                                console.log("result of message", r)
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
            let d = connected.get(data.phone)
            d = { ...d, isOnlineTag: data.isOnlineTag, lastSeenTag: moment() }
            connected.set(data.phone, d)
            // console.log("userStatusChanges", connected.get(data.phone))
            io.emit("markUserStatusChanged", d)
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

        socket.on('groupProfileUpdate', (data) => {
            console.log("groupProfileUpdate : ", data)
            const updateObj = {
                "name": data.name,
                "profilePic": data.profilePic,
            }

            console.log("profileUpdate : ", data)
            Group.updateOne({ _id: data._id }, updateObj, (err, doc) => {
                console.log("error : ", err)
                console.log("doc : ", doc)
                if (!err) {
                    io.to(data._id).emit('groupProfileUpdated', data);
                }
            })


        });

        socket.on('addMembersInGroup', (data) => {
            console.log("addMembersInGroup : ", data)
            let userList = JSON.parse(data.list);
            Group.findByIdAndUpdate(
                data.id,
                { $addToSet: { users: { $each: userList } } },
                { new: true },
                (err, doc) => {
                    console.log("updated", doc)
                    if (!err) {
                        io.to(data.id).emit('groupProfileUpdated', doc);
                        User.updateMany({ phone: { "$in": userList } }, { $addToSet: { groups: data.id } }, { multi: true }, (err, raw) => {
                            // console.log(err)
                            // console.log(raw)
                            userList.forEach(element => {
                                let user = connected.get(JSON.stringify(element))
                                if (user && user.socketId) {
                                    io.to(user.socketId).emit('changeGroup', doc);
                                }
                            });
                            
                            socket.emit("onMemberAdded",true)
                        })
                    }
                    // console.log(err)
                }
            )

        });

        socket.on('leaveGroup', (data) => {
            console.log("leaveGroup : ", data)
            Group.findByIdAndUpdate(
                data.id,
                { $pull: { users: data.phone, adminList: data.phone } },
                { new: true },
                (err, doc) => {
                    console.log("updated", doc)
                    if (!err) {
                        io.to(data.id).emit('groupProfileUpdated', doc);
                        User.updateOne({ phone: data.phone }, { $pull: { groups: data.id } }, (err, raw) => {
                            if (!err) {
                                let user = connected.get(data.phone)
                                if (user && user.socketId) {
                                    io.to(user.socketId).emit('groupProfileUpdated', doc);
                                }
                            }
                        })
                    }

                }
            )

        });

        socket.on('fetchUserStatus', function (phone) {
            let user = connected.get(phone)
            if (user) {
                const { _id, isOnlineTag, lastSeenTag } = user
                socket.emit("resultFetchUserStatus", { _id, isOnlineTag, lastSeenTag, phone })
                // console.log("resultFetchUserStatus", user)
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
            });
        })

        var unicodeToChar = function (text) {
            return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        }


        socket.on('typing', (data) => {
            console.log("Typing : ", data)
            let user = connected.get(JSON.stringify(data.to))
            console.log("Typing : ", user)

            if (user && user.socketId) {
                io.to(user.socketId).emit('typing', data);
            }
        })

        socket.on('disconnect', function () {
            console.log("CONNECTED_USERS : ", connectedUsers)
        });


    });

};
