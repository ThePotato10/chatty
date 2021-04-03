import express from 'express';
import io from 'socket.io'; // Imported for type declarations

// Import stuff and setup server
const app  = express();
const http = require('http').Server(app);
const socketio = require('socket.io')(http);

let connections: number = 0;

// Generates the default username
function generateName(): string {
    let adjectives: string[] = ["Playful", "Happy", "Jumping", "Intellectual", "Wary", "Suspicious", "Fat"];
    let nouns: string[] = ["Dog", "Otter", 'Tree', "Whale", 'Yak', 'Panda'];

    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// Couple interfaces to describe the data the sockets will process
interface Message {
    message: string,
    nickname: string,
    time: string
}

interface NicknameChange {
    old: string,
    new: string
}

app.use(express.static('pages')); // Allow server to send static files in pages folder
app.get("/", (req, res, next) => res.sendFile(`${__dirname}/pages/index.html`)); // Loads home page
app.get('/getDefaultNickname', (req, res, next) => res.send({ nickname: generateName() }));

socketio.on('connection', (socket: io.Socket) => {
    connections++;
    socketio.emit('connect-event', `A new person connected. ${connections} people online`);

    // These listen for clients to open a connection
    socket.on('message', (msg: Message) => {
        socket.broadcast.emit('message', msg); // Sends msg to everyone but the client who broadcast the event
    });

    socket.on('nickname-change', (change: NicknameChange) => {
        socket.broadcast.emit('nickname-change', `${change.old} changed their nickname to ${change.new}`);
    });

    socket.on('disconnect', () => {
        connections--;
        socketio.emit('connect-event', `Someone disconnected. ${connections} people online`);
    });
});

// And finally, open the server on localhost port 3000
http.listen(3000, console.log("Listening on port 3000"));