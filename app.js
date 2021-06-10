const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Connection = require('./server/common/connection');
const DBManager = require('./server/module/dbmanager');
const Config = require('./server/common/config');
const socket = require('socket.io')
const path = require('path');
app.use(jsonParser) 
app.use(express.static(__dirname + '/public'));


const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(Config.options.dbURL,{          //Setup MongoClient
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        Connection.set(client.db(Config.options.dataBaseName)); //Set Connection
});
DBManager.set("chat");  //Set collection, which we need in this project. In our case chat collection

const server = app.listen(Config.options.port, () => {
    console.log(`Search app listening on port ${Config.options.port}!`);
});
const io = socket(server); 


const everyone = ['Giorgi', 'Shota', 'Nika', 'Temo']; //For simplicity, I won't keep it in database

app.post('/Login',  (req, res) => {
    //Case sensitive Verification - no password for simplicity
    if(everyone.includes(req.body.username)){
        res.json({status:"ok", username:req.body.username});
    } else {
        res.json({status:"fail", text:"Wrong Username"});
    }
});
app.get('/*',  (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));

});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if(!username){
        return next(new Error('invalid username'));
    }
    socket.username = username;
    //Keep offset in socket, in order to load chat according to it and then update for each client
    socket.chatOffset = Config.options.chatStartOffset; 
    next();
});

//Setup server side socket
io.on('connection', (socket) => { //Listen for 'connection' event. Each client has its own unique socket object
    //Find out all connected users(except himself) and send list to current socket/client, which just connected
    const users = [];
    for (let [id, current] of io.of("/").sockets) {
        if(socket.username === current.username){ //Omit current client from connected clients.
            continue;
        }
        users.push({
            userID: id,
            username: current.username,
        });
    }
    io.to(socket.id).emit("connected-users", users, everyone); //Send 'connected users list' only to just connected client
    
    //Notify already connected clients that new client was connected
    socket.broadcast.emit("user-connected", {
        userID: socket.id,
        username: socket.username
    });
    
    //On client login load last part of chat history from database
    loadChat(socket, Config.options.chatStartQuantity);
      
    //Listeners
    socket.on('load-more', () => {
        loadChat(socket, Config.options.chatLoadQuantity);
    });
    socket.on('chat-message', (data) => {
        DBManager.addMessage(data);
        socket.broadcast.emit('chat-message', data);
        socket.emit('my-message', data);
    });
    socket.on('typing', (username, message) => {
        if(message === ''){

            socket.broadcast.emit('user_typing', {username:username, stopped:true});
        } else {
            socket.broadcast.emit('user_typing', {username:username, stopped:false});
        }
    });
    socket.on('disconnect', () => {
        io.emit('client_disconnect', socket.username);
    });
});

//Load messages from database according to offset and quantity
function loadChat(socket, quantity){
    const chat = DBManager.loadChat(socket.chatOffset, quantity);
    socket.chatOffset += quantity;
    chat.toArray((err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        socket.emit('chat-history', result);
    }); 
}