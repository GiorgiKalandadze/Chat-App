import {Manager} from './manager.js'
import  '../components/chat-app'  //It's not "normal" import. It is webpack import
import  '../components/status-row'  //It's not "normal" import. It is webpack import
import  '../components/chat-button'  //It's not "normal" import. It is webpack import
import  '../components/chat-row'  //It's not "normal" import. It is webpack import


Manager.setUp();
Manager.listen();

document.querySelector('chat-app').addEventListener('button-click', (event) => {
    if(event.detail.name === 'Login'){
        Manager.loginUser(event.detail.username);
    } else if(event.detail.name === 'Load More'){
        Manager.loadChat();
    } else if(event.detail.name === 'Send'){
        Manager.sendMessage(event.detail.message);
    }
});



// //TYPING!!!!!!!!!!!
// // message.addEventListener('input', (event) => {
// //     socket.emit('typing', { user_input_field: user_input_field.value, message: message.value});
// // });
// // socket.on('typing', (data)=>{
// //     console.log('RRR');
// //     if(data.message === ''){
// //         typing.innerHTML = '';
// //     } else {
// //         typing.innerHTML = `<p><em>${data.user} is typing a message...</em></p>`;
// //     }
// // });

