const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io();

//Join room
socket.emit('joinRoom', { username, room });

//Get room and user
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users)
})


// Message from server
socket.on('message', message => {

  outputMessage(message)

  chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //getting the message
  const msg = e.target.elements.msg.value;

  //Emiting message to the server
  socket.emit('chatMessage', msg)

  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()

})

const outputMessage = (message) => {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`

  document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}