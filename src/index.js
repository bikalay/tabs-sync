const CHANGE_TAB_TIMEOUT = 2000;
const MASTER_ACTIVITY_TIMEOUT = 500;
const TABS_SYNCRONIZE_KEY = 'tabs_sync_mastertab';

function generateId () {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

const tabId = generateId();

let timeoutId = null;
let isMaster = checkMaster();

function masterLoop() {
    localStorage.setItem(TABS_SYNCRONIZE_KEY, tabId+"|"+Date.now());
    if(!isMaster) {
        isMaster = true;
        document.title = 'master';
        console.log('master!!!!');
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(masterLoop, MASTER_ACTIVITY_TIMEOUT);
}

self.addEventListener('storage', event => {
    if(event.key === TABS_SYNCRONIZE_KEY) {
        const lsvals = event.newValue.split("|");
        if(lsvals[0] !== tabId) {
            if (isMaster) {
                    isMaster = false;
                    console.log('not master!!!!');
                    document.title = 'slave';
            }
            clearTimeout(timeoutId);
            timeoutId = setTimeout(masterLoop, CHANGE_TAB_TIMEOUT);
        }
    }

}, false);

function checkMaster() {
    const lsvals = localStorage.getItem(TABS_SYNCRONIZE_KEY);
    return !lsvals || (Date.now() - parseInt(lsvals.split("|")[1])) > CHANGE_TAB_TIMEOUT;
}

if(isMaster){
    document.title = 'master';
    masterLoop();
}
else {
    document.title = 'slave';
    timeoutId = setTimeout(masterLoop, CHANGE_TAB_TIMEOUT);
}
