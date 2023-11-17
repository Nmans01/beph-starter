// Establish a WebSocket connection

let reconnectInterval = 3000; // Reconnection interval in milliseconds

class WSMethodChain extends WebSocket {
    constructor(url) { super(url); }
    onOpen(func) { super.onopen = func; return this; }
    onMessage(func) { super.onmessage = func; return this; }
    onError(func) { super.onerror = func; return this; }
    onClose(func) { super.onclose = func; return this; }
}

function reconnect() {
    console.log('WebSocket connection closed. refreshing...');
    location.reload();
    setTimeout(() => {
        console.log('Reconnecting...');
        refresh();
    }, reconnectInterval += Math.random() * 1000);
}

function refresh() {
    new WSMethodChain('ws://localhost:3000/refresh')
        .onOpen(() => { console.log('WebSocket connection established'); })
        .onError((error) => {
            console.log('WebSocket error:', error);
            reconnect();
        })
        .onClose(() => {
            console.log('WebSocket connection closed. refreshing...');
            location.reload();
        });
};

refresh();