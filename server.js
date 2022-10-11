const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express();
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/user')


const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, 'public')))
const PORT = 3000 || process.env.PORT;

const botName = 'ChatcordBOT'
io.on('connection', socket => {
    //Recieves message from client
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //sending message to client
        socket.emit('message', formatMessage(botName, 'Welcome to the chat cord'))

        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg))
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

        }
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
})

server.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`)
})