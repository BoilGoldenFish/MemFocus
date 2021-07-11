const mem = [
    chrome.runtime.getURL("img/mem1.jpg"),
    chrome.runtime.getURL('img/mem2.jpg'),
    chrome.runtime.getURL('img/mem3.jpg')
];

const sizes = {
    'small': 1.5,
    'medium': 1,
    'large': 0.5
};

// default config
var config = {
    'enabled': true,
    'frequency': 30,
    'duration': 20,
    'size': 1.5,
    'siteList': [
        'youtube.com',
        'reddit.com',
    ]
};

function randomMem() {
    return mem[Math.floor(Math.random() * mem.length)];
}

function getHostname(url) {
    var host = url.indexOf("//") > -1 ? url.split('/')[2] : url.split('/')[0];
    host = host.split(':')[0].split('?')[0];

    if (host.startsWith('www.')) {
        host = host.substring(4);
    }

    return host;
}

function showMem(div, image, shouldLeave) {
    image.src = randomMem();
    div.style.display = 'block';

    const windowSize = Math.min(window.innerWidth, window.innerHeight);
    const targetSize = Math.floor(windowSize / sizes[config.size]);
    image.width = targetSize;

    const xScale = Math.random();
    const yScale = Math.random();
    const heightMaybe = image.height === 0 ? targetSize : image.height;
    const posX = Math.floor((window.innerHeight - heightMaybe) * xScale);
    const posY = Math.floor((window.innerWidth - image.width) * yScale);

    div.style.top = `${posX}px`;
    div.style.left = `${posY}px`;

    if (shouldLeave) {
        setTimeout(() => hideMem(div), config.duration * 1000);
    }
}

function hideMem(div) {
    div.style.display = 'none';
}

function routine() {
    if (!config.siteList.includes(getHostname(window.location.href)) || !config.enabled) {
        return;
    }

    const div = document.createElement('div');
    div.style.display = 'none';
    div.style.position = 'fixed';
    div.style.zIndex = '69696969';
    document.body.appendChild(div);

    const image = document.createElement("img");
    div.appendChild(image);

    const forever = config.duration >= config.frequency || config.duration == -1;
    showMem(div, image, !forever);
    if (!forever) {
        setInterval(() => showMem(div, image, true), config.frequency * 1000);
    }
}

function onLoad() {
    chrome.storage.sync.get({
        'focus': config
    }, (settings) => {
        config = settings.focus;
        setTimeout(routine, 1000);
    });
}

onLoad();