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
    next();
;});
//Setup server side socket
io.on('connection', (socket) => { //Listen for 'connection' event. Each client has its own unique socket object
    // console.log('Back - ', socket.id);
    // console.log('Socket connection made', socket.id);
    const users = [];
    
    // console.log('4 - Socket/User added in server"s variable users')
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
        // console.log(id);
    }
    
    io.to(socket.id).emit("users", users);
    
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username
    });
    // console.log(socket.handshake.auth.chatOffset);
    const chat = DBManager.loadChat(socket.handshake.auth.chatOffset, 10);
    socket.handshake.auth.chatOffset += 10;
    chat.toArray((err, result) => {
        if(err) {
            console.error(err);
            return;
        }
        socket.emit('old', result);
    }); 
    
    
    //Listeners
    socket.on('chat-message', (data) => {
        
        DBManager.addMessage(data);
        socket.broadcast.emit('chat-message', data);
        socket.emit('my-message', data);

    });
    // socket.on('typing', (data) => {
    //     socket.broadcast.emit('typing', data);
    // });

    socket.on('load-more', (data) => {
        const chat = DBManager.loadChat(socket.handshake.auth.chatOffset, 5);
        socket.handshake.auth.chatOffset += 5;
        chat.toArray((err, result) => {
            if(err) {
                console.error(err);
                return;
            }
            socket.emit('old', result);
        }); 
    });

});