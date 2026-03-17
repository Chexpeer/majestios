const btn = document.getElementById('send-btn');
const input = document.getElementById('user-input');
const display = document.getElementById('chat-display');

function addMessage(text, side) {
    const msg = document.createElement('div');
    msg.style.background = side === 'user' ? 'rgba(78, 148, 248, 0.1)' : 'rgba(255, 255, 255, 0.05)';
    msg.style.padding = '15px';
    msg.style.borderRadius = '12px';
    msg.style.marginBottom = '15px';
    msg.style.border = side === 'user' ? '1px solid #4e94f8' : '1px solid #333';
    msg.style.maxWidth = '85%';
    msg.style.alignSelf = side === 'user' ? 'flex-end' : 'flex-start';
    msg.innerHTML = `<strong>${side === 'user' ? 'Vous' : 'M@jestiOS'}</strong><br>${text}`;
    display.appendChild(msg);
    display.scrollTop = display.scrollHeight;
}

btn.onclick = () => {
    if (!input.value.trim()) return;
    addMessage(input.value, 'user');
    const question = input.value;
    input.value = '';

    setTimeout(() => {
        addMessage("Réception de votre message : \"" + question + "\". Interface M@jestiOS connectée.", 'bot');
    }, 800);
};

input.onkeydown = (e) => { if(e.key === 'Enter') btn.click(); };