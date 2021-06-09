import {User} from './user.js'
class Manager {
    static setUp(){
        Manager.socket = io.connect('http://localhost:7000', {autoConnect: false});
        Manager.chat_app = document.querySelector('chat-app');
    }
    static listen(){
        Manager.socket.on("connect", () =>{
            
        });
        Manager.socket.on("disconnect", () =>{
           
        });

        Manager.socket.on("connected-users", (allConnectedUsers, members) => {
            Manager.members = members; 
            let peopleArray = [];
            const connectedUserNames = allConnectedUsers.map((user) => user.username);
            Manager.members.forEach((personName) => {
                const status = {
                    name: personName,
                    link: `../image/${personName}.png`
                };
                if(personName != Manager.user.username && !connectedUserNames.includes(personName)){
                    status.status = 'offline';
                    peopleArray.push(status);
                } else if(personName != Manager.user.username && connectedUserNames.includes(personName)){
                    status.status = 'online';
                    peopleArray.push(status); 
                }
                
            });
            Manager.chat_app.peopleArray = peopleArray;
        });
        Manager.socket.on("user-connected", (user) => {
            if(Manager.user.username === user.username){
                return;
            }
            const tmp = [];
            Manager.chat_app.peopleArray.forEach((personRow) => {
                if(personRow.name === user.username){
                    personRow.status = 'online';
                }
                tmp.push(personRow);
            });
            Manager.chat_app.peopleArray = tmp; //Question - easy way to change only current?
        });
        Manager.socket.on('chat-history', (chat) =>{
            if(chat.length == 0){
                Manager.chat_app.setAttribute('load_more_value', 'No More');
                Manager.chat_app.setAttribute('chat_passive', 'passive');
                return;
            }
            const chatArray = [];
            // console.log(chat);
            chat.reverse().forEach((message) => {
                const row = {};
                if(message.user === Manager.user.username){
                    row.name = '';
                    row.me = 'me';
                } else {
                    row.name = message.user;
                }
                row.text = message.text;
                row.link = `../image/${message.user}.png`;
                chatArray.push(row);
            }); 
            if(Manager.chat_app.messageArray.length == 0){
                Manager.chat_app.messageArray = chatArray;
            } else {
                const tmp = Manager.chat_app.messageArray;
                Manager.chat_app.messageArray = chatArray.concat(tmp);
                
            }
        });
        Manager.socket.on('chat-message', (data)=>{
            const row = [{
                name: data.user,
                text: data.message,
                link: `../image/${data.user}.png`
            }];
            const tmp = Manager.chat_app.messageArray;
            Manager.chat_app.messageArray = tmp.concat(row);
            //Remove from typing      
            // console.log(data);
            const index = Manager.chat_app.typingArray.indexOf(data.user);
            const arr = Manager.chat_app.typingArray;
            if(index > -1){
                arr.splice(index,1);
                Manager.chat_app.typingArray = arr; 
            }
        });
        Manager.socket.on('my-message', (data)=>{
            const row = [{
                name: '',
                text: data.message,
                me: 'me',
                link: `../image/${data.user}.png`
            }];
            const tmp = Manager.chat_app.messageArray;
            Manager.chat_app.messageArray = tmp.concat(row);
            Manager.chat_app.moveScroll();
            
        });      
        Manager.socket.on('client_disconnect', (username) => {
            const tmp = [];
            Manager.chat_app.peopleArray.forEach((personRow) => {
                if(personRow.name === username){
                    personRow.status = 'offline';
                }
                tmp.push(personRow);
            });
            Manager.chat_app.peopleArray = tmp; //Question - easy way to change only current?
        })
        Manager.socket.on('user_typing', (data) => {
            console.log('Before', Manager.chat_app.typingArray);
                
            const tmp = Manager.chat_app.typingArray;
            if(data.stopped){
                console.log('Stoped');
                const index = Manager.chat_app.typingArray.indexOf(data.username);
                if(index > -1){
                    tmp.splice(index,1);
                    Manager.chat_app.typingArray = tmp.concat([]); 
                    
                    
                }
            } else {
                const arr = [data.username];
                if(!tmp.includes(data.username)){
                    
                    Manager.chat_app.typingArray = tmp.concat(arr);
                    // console.log(Manager.chat_app.typingArray);
                }
            }
            console.log('After',Manager.chat_app.typingArray);
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
                    Manager.chat_app.setAttribute('login_passive', 'passive');
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
        
    }
    static loadChat(){
        Manager.socket.emit('load-more');
    }
    static typing(message){
        console.log('MMM ' + message);
        Manager.socket.emit('typing', Manager.user.username, message);
    }
}

export {Manager}