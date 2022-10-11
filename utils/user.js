const users = []

const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user)
    return user;
}

const getCurrentUser = (id) => {
    return users.find(user => user.id === id);

}

const userLeaves = (id) => {
    const idx = users.findIndex(user => user.id === id)
    if (idx !== -1) {
        return users.splice(idx, 1)[0];
    }
}
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, getRoomUsers, userLeaves }