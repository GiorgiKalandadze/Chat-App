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
            //Sort in alphabetical order
            const connectedUsers = allConnectedUsers.sort((a, b) => {
                if(a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            // Manager.people.innerHTML = '';
            //At first, load online users in alphabetical order
            let peopleArray = [];
            connectedUsers.forEach((element) => {
                const status = {
                    name: element.username,
                    link: `../image/${element.username}.png`,
                    status: 'online'
                };
                peopleArray.push(status); 
            });
            //After onlines, load offline users in alphabetical order
            const connectedUserNames = connectedUsers.map((user) => user.username);
            Manager.members.forEach((personName) => {
                if(personName != Manager.user.username && !connectedUserNames.includes(personName)){
                    const status = {
                        name: personName,
                        link: `../image/${personName}.png`,
                        status: 'offline'
                    };
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
        });
        Manager.socket.on('my-message', (data)=>{
            const row = [{
                name: '',
                text: data.message,
                me: 'me',
                link: `../image/${data.user}.png`
            }];
            console.log('Beofre T', Manager.chat_app.scrollTop);
            console.log('Beofre H', Manager.chat_app.scrollHeight);
            const tmp = Manager.chat_app.messageArray;
            Manager.chat_app.messageArray = tmp.concat(row);
            //Question - 6 scrollba
           
            Manager.chat_app.scrollTop = Manager.chat_app.scrollHeight;
            console.log('After T', Manager.chat_app.scrollTop);
            console.log('After H', Manager.chat_app.scrollHeight);
                // history.scrollTop = history.scrollHeight 
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
        Manager.chat_app.setAttribute('message_placeholder', '');
        // Manager.message_input.value = '';    
    }
    static loadChat(){
        Manager.socket.emit('load-more');
    }
}

export {Manager}