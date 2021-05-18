// Global variables established 
// so that if they match the parameters in makeMessage, 
// the message is moved up, iMessage-style

let lastMessage = '';
let lastClass = '';
let upshiftCount = 0;

function makeMessage(content, options) {
    let item = document.createElement('div');
    let bubble = document.createElement('div');
    let infotext = document.createElement('p');

    if (options.hasDash) infotext.textContent = `${options.user} - ${options.time}`;
    else infotext.textContent = `${options.user} ${options.time}`;
    bubble.classList.add(options.class);
    bubble.classList.add('bubble');
    bubble.textContent = content;

    item.classList.add('message');
    item.classList.add(options.class);

    // If the sender and time are the same. 
    // The stuff after the || is there because system-event and own-message classes both don't provide a user
    // And thus they would get moved up if not for the class differentiation
    if (lastMessage !== `${options.user} - ${options.time}` || lastClass !== options.class) {
        item.appendChild(infotext);
        upshiftCount = 0;
    } else {
        upshiftCount++;
        item.style.transform = `translateY(${-15 * upshiftCount}px)`; // The amount of pixels we need to shift upwards grows, so this calculates that on the fly
    }

    item.appendChild(bubble);

    lastMessage = `${options.user} - ${options.time}`;
    lastClass = options.class;

    document.getElementById('message-items').appendChild(item);
    document.getElementById('message-items').scrollTop = document.getElementById('message-items').scrollHeight
}

function getDate() {
    let date = new Date();
    return date.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });
}

const socket = io();

// Declare some DOM elements as easy to use variables
const form = document.getElementById('form');
const input = document.getElementById('input');
const nicknameForm = document.getElementById('nickname-form');
const nickname = document.getElementById('nickname');

let currentNickname = nickname.value;

// Sets the current nickname as what it pulls from the API
fetch('http://localhost:3000/getDefaultNickname')
    .then(response => response.json())
    .then(result => {
        document.getElementById('nickname').value = result.nickname;
        currentNickname = result.nickname;
    });

// Send message event listener
form.addEventListener('submit', e => {
    e.preventDefault(); // prevent page from reloading
    
    if (input.value) {
        // Append own message locally
        makeMessage(input.value, { user: "", time: getDate(), class: "own-message", hasDash: false});

        // Emit to socket for others
        socket.emit('message', { message: input.value, nickname: nickname.value, time: getDate() });
        input.value = '';
    }
});

// Change nickname event listener
nicknameForm.addEventListener('submit', event => {
    event.preventDefault();

    if (nickname.value) {
        makeMessage("You changed your nickname to " + nickname.value, { user: "", time: getDate(), class: 'system-event', hasDash: false});
        
        socket.emit('nickname-change', {old: currentNickname, new: nickname.value});
        currentNickname = nickname.value;
    }
});

// Listen for message events
socket.on('message', msg => {
    makeMessage(msg.message, { user: msg.nickname, time: msg.time, hasDash: true});
});

socket.on('connect-event', msg => {
    makeMessage(msg, { user: "", time: getDate(), class: "system-event", hasDash: false});
});

socket.on('nickname-change', msg => {
    makeMessage(msg, { user: "", time: getDate(), class: "system-event", hasDash: false});    
});