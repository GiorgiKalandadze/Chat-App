import {User} from './user.js'
class Manager {
    static setUp(){
        Manager.socket = io.connect('http://localhost:7000', {autoConnect: false});
        Manager.chatApp = document.querySelector('chat-app');
        Manager.imgPath = `../image/`;
    }
    static listen(){
        Manager.socket.on("connected-users", (allConnectedUsers, members) => {
            Manager.members = members; 
            const peopleArray = [];
            const connectedUserNames = allConnectedUsers.map((user) => user.username);
            Manager.members.forEach((personName) => {
                const status = {
                    name: personName,
                    link: `${Manager.imgPath}${personName}.png`
                };
                if(personName != Manager.user.username && !connectedUserNames.includes(personName)){
                    status.status = 'offline';
                    peopleArray.push(status);
                } else if(personName != Manager.user.username && connectedUserNames.includes(personName)){
                    status.status = 'online';
                    peopleArray.push(status); 
                }
            });
            Manager.chatApp.peopleArray = peopleArray;
        });
        Manager.socket.on("user-connected", (user) => {
            if(Manager.user.username === user.username){
                return;
            }
            const tmp = [];
            Manager.chatApp.peopleArray.forEach((personRow) => {
                if(personRow.name === user.username){
                    personRow.status = 'online';
                }
                tmp.push(personRow);
            });
            Manager.chatApp.peopleArray = tmp; 
        });
        Manager.socket.on('chat-history', (chat) =>{
            if(chat.length == 0){
                Manager.chatApp.loadMoreValue = 'No More';
                Manager.chatApp.chatPassive = 'passive';
                return;
            }
            const chatArray = [];
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
            if(Manager.chatApp.messageArray.length == 0){
                Manager.chatApp.messageArray = chatArray;
            } else {
                const tmp = Manager.chatApp.messageArray;
                Manager.chatApp.messageArray = chatArray.concat(tmp);
            }
        });
        Manager.socket.on('chat-message', (data)=>{
            const row = [{
                name: data.user,
                text: data.message,
                link: `../image/${data.user}.png`
            }];
            //Case when client from multiple sockets
            if(data.user === Manager.user.username){
                row[0].name = '';
                row[0].me = 'me';
            }
            const tmp = Manager.chatApp.messageArray;
            Manager.chatApp.messageArray = tmp.concat(row);
            //Remove from typers
            const index = Manager.chatApp.typingArray.indexOf(data.user);
            const arr = Manager.chatApp.typingArray;
            if(index > -1){
                arr.splice(index,1);
                Manager.chatApp.typingArray = arr.concat([]);
            }
        });
        Manager.socket.on('my-message', (data)=>{
            const row = [{
                name: '',
                text: data.message,
                me: 'me',
                link: `../image/${data.user}.png`
            }];
            const tmp = Manager.chatApp.messageArray;
            Manager.chatApp.messageArray = tmp.concat(row);
            Manager.chatApp.moveScroll();
        });      
        Manager.socket.on('client_disconnect', (username) => {
            const tmp = [];
            Manager.chatApp.peopleArray.forEach((personRow) => {
                if(personRow.name === username){
                    personRow.status = 'offline';
                }
                tmp.push(personRow);
                Manager.chatApp.peopleArray = tmp.concat([]);
            });
            //If client was typing and disconnected remove it from typers
            const index = Manager.chatApp.typingArray.indexOf(username);
            const arr = Manager.chatApp.typingArray;
            if(index > -1){
                arr.splice(index,1);
                Manager.chatApp.typingArray = arr.concat([]);
            }      
        })
        Manager.socket.on('user_typing', (data) => {
            //Case when same client with multiple sockets(In real life from multiple device)
            if(data.username === Manager.user.username){
                return;
            }
            const tmp = Manager.chatApp.typingArray;
            if(data.stopped){
                const index = Manager.chatApp.typingArray.indexOf(data.username);
                if(index > -1){
                    tmp.splice(index,1);    
                    Manager.chatApp.typingArray = tmp.concat([]);        
                }
            } else {
                const arr = [data.username];
                if(!tmp.includes(data.username)){    
                    Manager.chatApp.typingArray = tmp.concat(arr);
                }
            }
        });
    }
    static loginUser(username){
        fetch('/Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username:username})
        }).then((response)=> response.json())
            .then((data) => {
                if(data.status === 'ok'){    
                    Manager.onUsernameSelection(data.username);
                    Manager.chatApp.loginPassive = 'passive';
                    Manager.user = new User({username:username});
                } else if(data.status === 'fail'){
                    Manager.chatApp.usernameInputValue = '';
                    Manager.chatApp.usernamePlaceholder = data.text;
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
        Manager.socket.emit('typing', Manager.user.username, message);
    }
}

export {Manager}