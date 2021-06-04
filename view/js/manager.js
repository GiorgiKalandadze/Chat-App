import {User} from './user.js'
class Manager {
    static setUp(){
        Manager.socket = io.connect('http://localhost:7000', {autoConnect: false});
        Manager.user_input = document.getElementById('user-input');
        Manager.login_button = document.getElementById('login');
        Manager.people = document.querySelector('.people');
        Manager.box = document.querySelector('.box');
        Manager.history = document.querySelector('.history');
        Manager.load_button = document.getElementById('load-more');
        Manager.message_input = document.getElementById('message-input');
        Manager.send_button = document.getElementById('send');
        Manager.members = ['Giorgi', 'Shota', 'Nika', 'Temo'];
    }
    static listen(){
        Manager.socket.on("connect", () =>{
            console.log(`Connected user - ${Manager.user.username}`);
        });
        Manager.socket.on("disconnect", () =>{
            console.log(`disconnect user - `);
        });

        Manager.socket.on("connected-users", (allConnectedUsers) => {
            //Sort in alphabetical order
            const connectedUsers = allConnectedUsers.sort((a, b) => {
                if(a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            //Question - Filter and remove current client or have if statement in foreach? 
            Manager.people.innerHTML = '';
            //At first, load online users in alphabetical order
            connectedUsers.forEach((element) => {
                if(element.username != Manager.socket.auth.username){
                    const p = document.createElement('p');
                    p.className = 'people-row';
                    p.id = element.username;
                    p.innerHTML = element.username + " - Online";
                    Manager.people.appendChild(p);
                }
            });
            //After onlines, load offline users in alphabetical order
            const connectedUserNames = connectedUsers.map((user) => user.username);
            Manager.members.forEach((personName) => {
                if(personName != Manager.user.username && !connectedUserNames.includes(personName)){
                    const p = document.createElement('p');
                    p.className = 'people-row';
                    p.id = personName;
                    p.innerHTML = personName +  " - Offline";
                    Manager.people.appendChild(p);
                }
            });
        });
        Manager.socket.on("user-connected", (user) => {
            if(Manager.user.username === user.username){
                return;
            }
            document.getElementById(user.username).innerHTML = `${user.username} - Online`;
        });
        Manager.socket.on('chat-history', (chat) =>{
            if(chat.length == 0){
                Manager.load.innerHTML = 'No more';
                Manager.load.disabled = true;
                Manager.load.style.cursor = 'not-allowed';
                return;
            }
            chat.forEach((message) => {
                let p = document.createElement('p');
                if(message.user === Manager.user.username){
                    p.className = 'my-msg';
                    p.innerHTML =`<strong>Me:</strong> ${message.text}`;
                } else {
                    p.className = 'msg';
                    p.innerHTML =`<strong>${message.user}:</strong> ${message.text}`;
                }
                Manager.history.insertBefore(p, Manager.history.firstChild); 
            });
        });
        Manager.socket.on('chat-message', (data)=>{
            // typing.innerHTML = '';
            let p = document.createElement('p');
            p.className = 'msg';
            p.innerHTML =`<strong>${data.user}:</strong> ${data.message}`;
            document.querySelector('.history').appendChild(p);
            Manager.box.scrollTop = Manager.box.scrollHeight;
        });
        Manager.socket.on('my-message', (data)=>{
            // typing.innerHTML = '';
            let p = document.createElement('p');
            p.className = 'my-msg';
            p.innerHTML =`<strong>Me:</strong> ${data.message}`;
            document.querySelector('.history').appendChild(p);
            Manager.box.scrollTop = Manager.box.scrollHeight;
        });      
    }
    static loginUser(){
        Manager.user = new User({username:Manager.user_input.value});
        fetch('/Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user:  Manager.user.username})
        }).then((response)=> response.json())
            .then((data) => {
                if(data.status === 'ok'){    
                    Manager.onUsernameSelection(data.user);
                    Manager.login_button.disabled = true;
                    Manager.login_button.style.cursor = 'not-allowed';
                } else if(data.status === 'fail'){
                    Manager.user_input.value = '';    
                    Manager.user_input.placeholder = data.text;
                }
            })
        .catch((err)=> console.error(err))
    }
    static onUsernameSelection(username){
        Manager.socket.auth = { username:username, chatOffset: 0};
        Manager.socket.connect();
    }
    static sendMessage(){
        Manager.socket.emit('chat-message', { user: Manager.user.username, message: Manager.message_input.value});
        Manager.message_input.value = '';    
    }
    static loadChat(){
        Manager.socket.emit('load-more');
    }
}

export {Manager}