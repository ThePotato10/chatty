let typingTimeout;

function clearTyping() {
    if (input.value === "") {
        socket.emit('clear-typer', currentNickname);
    }
}

function setTyping() {
    socket.emit('typing', currentNickname);

    typingTimeout = setTimeout(clearTyping(), 10);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(clearTyping(), 500);
}

socket.on('typing', typers => {
    if (typers.length === 0) {
        document.getElementById('typing-box').innerHTML = '';
    } else if (typers.length === 1) {
        document.getElementById('typing-box').innerHTML = `${typers[0]} is typing ...`;
    } else if (typers.length === 2) {
        document.getElementById('typing-box').innerHTML = `${typers[0]} and ${typers[1]} are typing ...`;
    } else {
        let typerString = `${typers[0]}`;
        for (let i = 0; i < typers.length - 1; i++) {
            typerString += `, ${typers[i]}`;
        }
        typerString += `, and ${typers[typers.length - 1]} are typing ...`;

        document.getElementById('typing-box').innerHTML = typerString;
    }
});