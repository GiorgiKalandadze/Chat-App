import {User} from './user.js'
class Manager {
    static setUp(){
        Manager.socket = io.connect('http://localhost:7000', {autoConnect: false});
        Manager.chat_app = document.querySelector('chat-app');
        Manager.members = ['Giorgi', 'Shota', 'Nika', 'Temo'];
        
    }
    static listen(){
        Manager.socket.on("connect", () =>{
            
        });
        Manager.socket.on("disconnect", () =>{
            console.log(`disconnect user - `);
        });

        Manager.socket.on("connected-users", (allConnectedUsers) => {
            console.log(allConnectedUsers);
            //Sort in alphabetical order
            const connectedUsers = allConnectedUsers.sort((a, b) => {
                if(a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            //Question - Filter and remove current client or have if statement in foreach? 
            Manager.chat_app.clearPeople();
            // Manager.people.innerHTML = '';
            //At first, load online users in alphabetical order
            let peopleArray = [];
            connectedUsers.forEach((element) => {
                if(element.username != Manager.socket.auth.username){
                    const status = document.createElement('status-row');
                    status.setAttribute('name', element.username);
                    status.setAttribute('status', 'online');
                    status.setAttribute('link', `../image/${element.username}.png`);
                    Manager.chat_app.addPerson(status);
                    //QUestion - change to send array 
                }
            });
            //After onlines, load offline users in alphabetical order
            const connectedUserNames = connectedUsers.map((user) => user.username);
            Manager.members.forEach((personName) => {
                if(personName != Manager.user.username && !connectedUserNames.includes(personName)){
                    const status = document.createElement('status-row');
                    status.setAttribute('name', personName);
                    status.setAttribute('status', 'offline');
                    status.setAttribute('link', `../image/${personName}.png`);
                    Manager.chat_app.addPerson(status);
                }
            });

            // const www = [{name: "VERA", status:"offline"}, {name: "ALOO", status:"offline"}];
            // Manager.chat_app.setAttribute("peopleArray", JSON.stringify(www));
            
        });
        Manager.socket.on("user-connected", (user) => {
            console.log('user-connected', user.username);
            if(Manager.user.username === user.username){
                return;
            }
            //Question -  document.getElementById(user.username).innerHTML = `${user.username} - Online`;
        });
        Manager.socket.on('chat-history', (chat) =>{
            if(chat.length == 0){
                Manager.chat_app.setAttribute('load_more_value', '');
                // Manager.load.innerHTML = 'No more';
                // Manager.load.disabled = true;
                // Manager.load.style.cursor = 'not-allowed';
                return;
            }
            chat.forEach((message) => {
                const row = document.createElement('chat-row');
                if(message.user === Manager.user.username){
                    row.setAttribute('name', '');
                    row.setAttribute('me', 'me');    
                } else {
                    row.setAttribute('name', message.user);
                }
                row.setAttribute('text', message.text);
                row.setAttribute('link', `../image/${message.user}.png`);
                Manager.chat_app.insertMessage(row, 'before');
            });
        });
        Manager.socket.on('chat-message', (data)=>{
            const row = document.createElement('chat-row');
            row.setAttribute('name', data.user);
            row.setAttribute('text', data.message);
            row.setAttribute('link', `../image/${data.user}.png`);
            Manager.chat_app.insertMessage(row, 'after');
        });
        Manager.socket.on('my-message', (data)=>{
            const row = document.createElement('chat-row');
            row.setAttribute('name', '');
            row.setAttribute('me', 'me');  
            row.setAttribute('text', data.message);
            row.setAttribute('link', `../image/${data.user}.png`);
            Manager.chat_app.insertMessage(row, 'after');
        });      
    }
    static loginUser(username){
        Manager.user = new User({username:username});
        fetch('/Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user:  Manager.user.username})
        }).then((response)=> response.json())
            .then((data) => {
                if(data.status === 'ok'){    
                    Manager.onUsernameSelection(data.user);
                    Manager.chat_app.setAttribute('login_disabled', true);
                    //Question how to do it? 
                    //Manager.login_button.style.cursor = 'not-allowed';
                } else if(data.status === 'fail'){
                    // console.log(Manager.chat_app);
                    Manager.chat_app.setAttribute('username_input_value', '');
                    Manager.chat_app.setAttribute('username_placeholder', data.text);
                }
            })
        .catch((err)=> console.error(err))
    }
    static onUsernameSelection(username){
        Manager.socket.auth = { username:username};
        Manager.socket.connect();
    }
    static sendMessage(message){
        Manager.socket.emit('chat-message', { user: Manager.user.username, message: message});
        Manager.chat_app.setAttribute('message_placeholder', '');
        // Manager.message_input.value = '';    
    }
    static loadChat(){
        Manager.socket.emit('load-more');
    }
}

export {Manager}