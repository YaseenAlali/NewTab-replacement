const commands = [
    { command: 'youtube', url: 'https://www.youtube.com' },
    { command: 'google', url: 'https://www.google.com/' },
    { command: 'facebook', url: 'https://www.facebook.com/' },
    { command: 'gmail', url: 'https://mail.google.com/mail' },
    { command: 'whatsapp', url: 'https://web.whatsapp.com/' },
    { command: 'git', url: 'https://github.com/' },
    { command: 'bitbucket', url: 'https://bitbucket.org/' },
    { command: 'linkedin', url: 'https://www.linkedin.com/' },
    { command: 'chatgpt', url: 'https://chat.openai.com/' },
    { command: 'torrent', url: 'https://www.1377x.to/' },
    { command: 'anime', url: 'https://nyaa.si/' },
    { command: 'gitme', url: 'https://github.com/YaseenAlali' }
];

const specialCommands = [
    { command: 'clear', callback: clearInput, hasOutput: false },
    // { command: 'showher', callback: switchImage, hasOutput: false },
    { command: 'help', callback: helpCallback, hasOutput: true },
    { command: 'commands', callback: commandsCallback, hasOutput: true },
    { command: 'ip', callback: getPublicIP, hasOutput: true },
    { command: 'urls', callback: urlsCallBack, hasOutput: true }
]

const commandInput = document.getElementById('command-input');
const autocompleteList = document.getElementById('autocomplete-list');


commandInput.addEventListener('input', function () {
    const inputText = commandInput.textContent.toLowerCase();
    const filteredCommands = ([...commands, ...specialCommands]).filter(command => command.command.startsWith(inputText) && command.command != 'showher').slice(0, 5);

    autocompleteList.innerHTML = '';

    filteredCommands.forEach(command => {
        const listItem = document.createElement('li');
        listItem.textContent = command.command;
        listItem.addEventListener('click', function () {
            commandInput.textContent = command.command;
            autocompleteList.innerHTML = '';
        });
        autocompleteList.appendChild(listItem);
    });
});

document.addEventListener('click', function (event) {
    if (event.target !== commandInput) {
        autocompleteList.innerHTML = '';
    }
});

function urlsCallBack() {
    // let urls = getUrlsListAsString()

    let textField = document.getElementById('outputText');
    let urls = '';
    if (textField.textContent.substring('youtube')) {
        urls = getGroupOfUrls(5, 10);
    }
    else {
        urls = getGroupOfUrls(0, 5);
    }
    textField.textContent = urls;
}

function getGroupOfUrls(start = 0, end = 5) {
    let output = ''
    end = Math.min(end, commands.length);
    for (let i = start; i < end; i++) {
        output += commands[i].command + ' ';
    }
    if (start == 0) output += '..'
    return output;
}


function getUrlsListAsString() {
    let output = '';
    commands.forEach(element => {
        output += element.command + ' ';
    })
    return output;
}

function helpCallback() {
    let textField = document.getElementById('outputText');
    textField.textContent = "Not my problem";
}
function getCommandsListAsString() {
    let output = ''
    specialCommands.forEach(element => {
        if (element.command != 'showher')
            output += element.command + ' ';
    });
    return output;
}
function commandsCallback() {
    let commands = getCommandsListAsString();
    let textField = document.getElementById('outputText');
    textField.textContent = commands;
}

function setOutputTextForIp(failed, ip) {
    let textField = document.getElementById('outputText');
    if (failed) {
        textField.textContent = "Failed to retrieve your IP";
    }
    else {
        textField.textContent = `Your IP is ${ip}`;
    }
}

function invalidCommandCallback() {
    let textField = document.getElementById('outputText');
    textField.textContent = 'Invalid command';
    clearTerminalOnly();
}

function getPublicIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const publicIP = data.ip;
            setOutputTextForIp(false, publicIP)
        })
        .catch(error => {
            setOutputTextForIp(true, '');
            // console.error('Error:', error);
        });
}
const inputContainer = document.getElementById('command-input');

inputContainer.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        handleEnterKey();
    }
});

function switchImage() {
    var randomImageElement = document.getElementById('randomImage');
    var body = document.getElementById("body");
    var search = document.getElementById("search-button");
    var shortcuts = document.getElementById("shortcuts");

    randomImageElement.src = './files/imdead.gif';
    body.style.backgroundColor = '#391047';
    shortcuts.style.backgroundColor = '#2c2f33';
    search.style.backgroundColor = '#2c2f33';

}

function clearInput() {
    inputContainer.textContent = '';
    let textField = document.getElementById('outputText');
    textField.textContent = ''
}

function clearTerminalOnly() {
    inputContainer.textContent = '';
}

function goToUrl(url) {
    window.location.href = url;
}
function queryParser(words) {
    let queryItems = words.slice(1).filter(item => item.length != 0);
    console.log("query items", JSON.stringify(queryItems));
    let query = queryItems[0];
    for (let i = 1; i < queryItems.length; i++) {
        query += '+' + queryItems[i];
    }
    return query;
}

inputContainer.addEventListener('input', function () {
    const maxLength = inputContainer.getAttribute('maxlength');
    if (inputContainer.textContent.length > maxLength) {
        inputContainer.contentEditable = false;
        inputContainer.textContent = 'input too long!';
        setTimeout(() => {
            if (inputContainer.textContent == 'input too long!') {
                clearInput();
                inputContainer.contentEditable = true;
                inputContainer.focus();
            }
        }, 2500);
    }
});


function handleSearch(search = 'google', words) {
    if (!words[1] || words[1].length == 0) {
        return '';
    }
    let query = queryParser(words);
    switch (search) {
        case 'youtube':
            return `https://www.youtube.com/results?search_query=${query}`;
        case 'google':
            return `https://www.google.com/search?q=${query}`;
        case 'torrent':
            return `https://www.1377x.to/search/${query}/1/`;
        case 'anime':
            return `https://nyaa.si/?f=0&c=0_0&q=${query}`;
        default:
            return '';
    }
}

function clearOutput() {
    let textField = document.getElementById('outputText');
    textField.textContent = ''
}
function handleEnterKey() {
    const inputText = inputContainer.textContent;
    let words = inputText.split(' ');
    if (words.length > 0) {
        let firstWord = words[0].toLowerCase();
        let specialCommandsFindResult = specialCommands.find(command => command.command === firstWord);
        if (specialCommandsFindResult) {
            try {
                specialCommandsFindResult.callback();
            }
            catch (error) { console.warn(error) };
            if (!specialCommandsFindResult.hasOutput)
                clearInput()
            else {
                clearTerminalOnly();
                // setTimeout(() => {
                //     clearOutput();
                // }, 2500);
            }
            return;
        }

        let findResult = commands.find(command => command.command == firstWord);
        if (findResult) {
            let uri = handleSearch(findResult.command, words);
            if (uri.length > 0) {
                goToUrl(uri);
                return;
            }
            goToUrl(findResult.url);

        }
        else {
            invalidCommandCallback()
        }
    }
}
