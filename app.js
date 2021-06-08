const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Connection = require('./model/connection');
const DBManager = require('./model/dbmanager');
const Config = require('./model/config');
const socket = require('socket.io')
app.use(jsonParser) 
app.use(express.static(__dirname + '/view'));

Config.set(); //Set Configuration 

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(Config.dbURL,{          //Setup MongoClient
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.error(err);
            return;
        }
        Connection.set(client.db(Config.dataBaseName)); //Set Connection
});
DBManager.set("chat");  //Set collection, which we need in this project. In our case chat collection

const server = app.listen(Config.port, () => {
    console.log(`Search app listening on port ${Config.port}!`);
});
const io = socket(server); //This man is waiting for client/browser to make a connection with server and setup a socket


const everyone = ['Giorgi', 'Shota', 'Nika', 'Temo']; //For simplicity

app.post('/Login',  (req, res) => {
    //Fake Verification
    if(everyone.includes(req.body.user)){
        res.json({status: "ok", user: req.body.user });
    } else {
        res.json({status: "fail", text: "Wrong Username" });
    }
});
app.get('/*',  (req, res) => {
    res.sendFile('index.html', {root: __dirname });
});


io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if(!username){
        return next(new Error('invalid username'));
    }
    socket.username = username;
    socket.chatOffset = Config.chatStartOffset;
    next();
;});

//Setup server side socket
io.on('connection', (socket) => { //Listen for 'connection' event. Each client has its own unique socket object
    //Find out all connected users and send list to current socket/user/client, which just connected
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
    io.to(socket.id).emit("connected-users", users); //Send 'connected users list' only to current client
    
    //Notify connected clients that current/new client was connected
    socket.broadcast.emit("user-connected", {
        userID: socket.id,
        username: socket.username
    });
    
    //Load last part of chat history from database
    const chat = DBManager.loadChat(socket.chatOffset, 10);
    socket.chatOffset += 10; //Question - is there any way to keep this chatOffset in socket? Not in handshake
    chat.toArray((err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        socket.emit('chat-history', result);
    }); 
    
      
    //Listeners
    socket.on('chat-message', (data) => {
        DBManager.addMessage(data);
        socket.broadcast.emit('chat-message', data);
        socket.emit('my-message', data);

    });
    socket.on('load-more', () => {
        const chat = DBManager.loadChat(socket.chatOffset, 5);
        socket.chatOffset += 5;
        chat.toArray((err, result) => {
            if(err) {
                console.error(err);
                return;
            }
            socket.emit('chat-history', result);
        }); 
    });


    // socket.on('typing', (data) => {
    //     socket.broadcast.emit('typing', data);
    // });

});