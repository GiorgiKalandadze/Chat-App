import {Manager} from './manager.js'

let button = document.getElementById('send');
let login = document.getElementById('login');
let load = document.getElementById('load-more');

Manager.setUp();
Manager.listen();

login.addEventListener('click', () => {
    Manager.loginUser();
});

button.addEventListener('click', () => {
    Manager.sendMessage();
});

load.addEventListener('click', () => {
    Manager.loadChat();
    
});


//TYPING!!!!!!!!!!!
// message.addEventListener('input', (event) => {
//     socket.emit('typing', { user_input_field: user_input_field.value, message: message.value});
// });
// socket.on('typing', (data)=>{
//     console.log('RRR');
//     if(data.message === ''){
//         typing.innerHTML = '';
//     } else {
//         typing.innerHTML = `<p><em>${data.user} is typing a message...</em></p>`;
//     }
// });

