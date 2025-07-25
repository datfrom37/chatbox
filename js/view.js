const title = localStorage.getItem('chatTitle') || 'Tiêu đề';
const chatData = localStorage.getItem('chatData') || '';
const bgUrl = localStorage.getItem('bgUrl') || '';
const colorA = localStorage.getItem('colorA') || '#e9ecef';
const colorB = localStorage.getItem('colorB') || '#0d6efd';
const avatarA = localStorage.getItem('avatarA') || '';
const colorHeader = localStorage.getItem('colorHeader') || '#728EDF';
const hideChat = localStorage.getItem('hideChatFooter') === '1';

document.querySelector('.chat-header-name').style.backgroundColor = colorHeader;
document.getElementById('chatTitle').innerText = title;
if (bgUrl) document.body.style.backgroundImage = `url('${bgUrl}')`;
if (hideChat) document.querySelector('.chat-footer')?.classList.add('hidden');

const style = document.createElement('style');
style.innerHTML = `
  .from-a, .from-a::after { background-color: ${colorA} !important; }
  .from-b, .from-b::after { background-color: ${colorB} !important; }
  .chat-header-name { background-color: ${colorHeader} !important; }
`;
document.head.appendChild(style);

const container = document.getElementById('chatContainer');
const lines = chatData.split('\n').filter(Boolean);
let index = 0;
let isPaused = false;

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    isPaused = !isPaused;
  }
});

function wrapText(text, maxLength = 17) {
  let result = '';
  for (let i = 0; i < text.length; i += maxLength) {
    let chunk = text.slice(i, i + maxLength);
    while (i + maxLength < text.length && /[、。！？\s,.\?!a-zA-Z]/.test(text[i + maxLength])) {
      chunk += text[i + maxLength];
      i++;
    }
    result += (result ? '\n' : '') + chunk;
  }
  return result;
}

function showOverlay(message, className) {
  const overlay = document.createElement('div');
  overlay.className = className;
  overlay.innerText = message;
  if (bgUrl && className === 'chat-overlay') {
    overlay.style.backgroundImage = `url('${bgUrl}')`;
  }
  container.appendChild(overlay);
  return overlay;
}

function showNextBatch() {
  container.innerHTML = '';
  if (index >= lines.length) {
    showOverlay('Hoàn thành', 'done-overlay');
    return;
  }
  const maxHeight = container.clientHeight;
  const interval = setInterval(() => {
    if (isPaused) return;
    if (index >= lines.length) {
      clearInterval(interval);
      showOverlay('Hoàn thành', 'done-overlay');
      return;
    }
    const line = lines[index];
    const wrapper = document.createElement('div');
    wrapper.classList.add('d-flex', 'align-items-start', 'mb-1');
    const message = document.createElement('div');
    message.classList.add('chat-message');

    if (line.startsWith('A:')) {
      message.classList.add('from-a');
      message.textContent = wrapText(line.slice(2).trim());

      // Số dòng bên trái sát mép
      const lineNumber = document.createElement('div');
      lineNumber.textContent = index + 1;
      Object.assign(lineNumber.style, {
        position: 'absolute',
        width: '30px',
        textAlign: 'right',
        marginLeft: '-47px',
        marginTop: '30px',
        fontWeight: 'bold',
        color: '#000',
        flexShrink: '0',
        display: 'flex',
        alignItems: 'center'
      });

      const avatar = document.createElement('img');
      Object.assign(avatar.style, {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        marginRight: '10px'
      });
      avatar.src = avatarA || 'https://via.placeholder.com/40x40?text=A';

      wrapper.append(lineNumber, avatar, message);
    }
    else if (line.startsWith('AD:')) {
      message.classList.add('from-a');
      const icon = document.createElement('i');
      icon.classList.add('bi', 'bi-telephone-x-fill');
      icon.style.marginRight = '5px';
      icon.style.color = '#999';
      const span = document.createElement('span');
      span.textContent = '부재중';
      span.style.fontSize = '25px';
      message.append(icon, span);

      const lineNumber = document.createElement('div');
      lineNumber.textContent = index + 1;
      Object.assign(lineNumber.style, {
        position: 'absolute',
        width: '30px',
        textAlign: 'right',
        marginLeft: '-47px',
        marginTop: '30px',
        fontWeight: 'bold',
        color: '#000',
        flexShrink: '0',
        display: 'flex',
        alignItems: 'center'
      });

      const avatar = document.createElement('img');
      Object.assign(avatar.style, { width: '80px', height: '80px', borderRadius: '50%', marginRight: '10px' });
      avatar.src = avatarA || 'https://via.placeholder.com/40x40?text=A';

      wrapper.append(lineNumber, avatar, message);
    } else if (line.startsWith('B:')) {
      message.classList.add('from-b');
      message.textContent = wrapText(line.slice(2).trim());
      wrapper.classList.add('justify-content-end');
      const lineNumber = document.createElement('div');
      lineNumber.textContent = index + 1;
      Object.assign(lineNumber.style, {
        position: 'absolute',
        right: '-80px',
        top: '43px',
        width: '30px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        zIndex: '999'
      });
      wrapper.style.position = 'relative';

      wrapper.append(message, lineNumber);
    }
    else if (line.startsWith('BD:')) {
      message.classList.add('from-d');
      const icon = document.createElement('i');
      icon.classList.add('bi', 'bi-telephone-x-fill');
      icon.style.marginRight = '5px';
      icon.style.color = '#999';
      const span = document.createElement('span');
      span.textContent = '부재중';
      span.style.fontSize = '25px';
      message.append(icon, span);
      wrapper.classList.add('justify-content-end');

      const lineNumber = document.createElement('div');
      lineNumber.textContent = index + 1;
      Object.assign(lineNumber.style, {
        position: 'absolute',
        right: '-80px',
        top: '43px',
        width: '30px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        zIndex: '999'
      });
      wrapper.style.position = 'relative';

      wrapper.append(message, lineNumber);
    } else if (line.startsWith('C:')) {
      clearInterval(interval);
      const messageText = line.slice(2).trim();
      container.innerHTML = '';
      const overlay = showOverlay(messageText || 'Chuyển cảnh', 'chat-overlay');
      setTimeout(() => {
        container.innerHTML = '';
        index++;
        setTimeout(showNextBatch, 100);
      }, 1000);
      return;
    }
    else {
      message.textContent = wrapText(line);
      wrapper.append(message);
    }

    container.append(wrapper);
    if (container.scrollHeight > maxHeight) {
      container.removeChild(wrapper);
      clearInterval(interval);
      setTimeout(showNextBatch, 1000);
    } else {
      index++;
    }
  }, 1200);
}

showNextBatch();
