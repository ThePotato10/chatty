document.addEventListener('keyup', (event) => {
    event.preventDefault();

    if (event.key === "c" && event.ctrlKey) {
        if (document.activeElement.id !== "input") {
            document.getElementById('input').focus();
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "1" && event.ctrlKey) {
        if (document.activeElement.id === "input") {
            input.value += '¯\\_(ツ)_/¯';
        }
    }
});