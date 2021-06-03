
const everyone = ['Giorgi', 'Shota', 'Nika', 'Temo'];

//Setup fron-side socket
const socket = io.connect('http://localhost:7000', {autoConnect: false});

let message = document.getElementById('message-input');
let user_input_field = document.getElementById('user-input');
let button = document.getElementById('send');
let login = document.getElementById('login');
let history = document.querySelector('.history');
let typing = document.querySelector('.typing');
let people = document.querySelector('.people');
let connectedUsers = [];
let usernameAlreadySelected;

login.addEventListener('click', (event) => {
    // console.log('1 - Fill username');
    fetch('/Login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: user_input_field.value})
    }).then((response)=> response.json())
        .then((data) => {
            if(data.status === 'ok'){    
                onUsernameSelection(data.user);
                login.disabled = true;
                login.style.cursor = 'not-allowed';
            } else if(data.status === 'fail'){
                user_input_field.value = '';    
                user_input_field.placeholder = data.text;
            }
        })
    .catch((err)=> console.log(err))
});

function onUsernameSelection(username){
    usernameAlreadySelected = true;
    socket.auth = { username:username};
    socket.connect();
}


button.addEventListener('click', (event) => {
    socket.emit('chat-message', { user: socket.auth.username, message: message.value});
    console.log('E');
});

// message.addEventListener('input', (event) => {
//     socket.emit('typing', { user: user.value, message: message.value});
// });


//Listen for socket event
socket.on("connect", () =>{
    console.log('Conectione');
});
socket.on("disconnect", () =>{
    // document.getElementById(socket.auth.username).innerHTML = `${socket.auth.username} - Offline`;
    socket.emit('disconnect', {user: socket.auth});
    console.log('DisConectione');
});

socket.on('old', (chat) =>{
    chat.reverse().loforEach((message) => {
        let p = document.createElement('p');
        if(message.user === socket.auth.username){
            p.className = 'my-msg';
            p.innerHTML =`<strong>Me:</strong> ${message.text}`;
        } else {
            p.className = 'msg';
            p.innerHTML =`<strong>${message.user}:</strong> ${message.text}`;
        }
        document.querySelector('.history').appendChild(p);
    });
});
socket.on("users", (allConnectedUsers) => {
    // console.log(allConnectedUsers);
    connectedUsers = allConnectedUsers.sort((a, b) => {
        if(a.self) return -1;
        if(b.self) return 1;
        if(a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
    });

   
    people.innerHTML = '';
    // console.log(users);
    connectedUsers.forEach(element => {
            if(element.username != socket.auth.username){
                const p = document.createElement('p');
                p.innerHTML = element.username + " - Online";
                people.appendChild(p);
            }
    });

    //BAD search
    everyone.forEach(person => {
        let isOnline = false;
        connectedUsers.forEach(element => {
            if(person === element.username){
                isOnline = true;                
            }
        });
        if(!isOnline){
            const p = document.createElement('p');
            p.className = 'people-row';
            p.id = person;
            p.innerHTML = person +  " - Offline";
            people.appendChild(p);
        }
    });
});
socket.on("user connected", (user) => {
    
    connectedUsers.push(user);
    document.getElementById(user.username).innerHTML = `${user.username} - Online`;
});

socket.on('chat-message', (data)=>{
    typing.innerHTML = '';
    let p = document.createElement('p');
    p.className = 'msg';
    p.innerHTML =`<strong>${data.user}:</strong> ${data.message}`;
    document.querySelector('.history').appendChild(p);
});
socket.on('my-message', (data)=>{
    console.log('MAAAA');
    typing.innerHTML = '';
    let p = document.createElement('p');
    p.className = 'my-msg';
    p.innerHTML =`<strong>Me:</strong> ${data.message}`;
    document.querySelector('.history').appendChild(p);
    // history.innerHTML += `<p><strong>Me:</strong> ${data.message}</p>`;

});
// socket.on('typing', (data)=>{
//     if(data.message === ''){
//         typing.innerHTML = '';
//     } else {
//         typing.innerHTML = `<p><em>${data.user} is typing a message...</em></p>`;
//     }
// });
socket.on('connect_error', (err)=>{
    if(err.message === 'invalid username'){
        usernameAlreadySelected = false;
    }
})
