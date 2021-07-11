const enabled = document.getElementById('enabled');
const frequency = document.getElementById('frequency');
const duration = document.getElementById('duration');
const size = document.getElementById('size');
const sites = document.getElementById('sites');

function cleanSites(text) {
    const list = text.split('\n').map(a => a.trim())
                     .filter(site => site !== '');

    return list;
}

function save() {
    const config = {
        'enabled': enabled.checked,
        'frequency': frequency.value,
        'duration': duration.value,
        'size': size.value,
        'siteList': cleanSites(sites.value)
    };

    chrome.storage.sync.set({'focus': config}, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved; refresh page to apply';
        setTimeout(() => {
            status.textContent = '';
        }, 4000);
    });
}

function onLoad() {
    enabled.onclick = save;
    frequency.addEventListener('focusout', save);
    duration.addEventListener('focusout', save);
    size.addEventListener("change", save);
    sites.addEventListener('focusout', save);

    // default config
    chrome.storage.sync.get({
        'focus': {
            'enabled': false,
            'frequency': '30',
            'duration': '20',
            'size': 'medium',
            'siteList': [
                'youtube.com',
            ]
        }
    }, (config) => {
        enabled.checked = config.focus.enabled;
        frequency.value = config.focus.frequency;
        duration.value = config.focus.duration;
        size.value = config.focus.size;
        sites.value = config.focus.siteList.join('\n');
    });
}

onLoad();