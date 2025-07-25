const colorBindings = [
  { picker: 'colorPickerHeader', input: 'colorHeader' },
  { picker: 'colorPickerA', input: 'colorA' },
  { picker: 'colorPickerB', input: 'colorB' }
];
const defaultColors = {
  'japan.html': {colorB: '#16fe25'},
  'kakaotalk.html': {colorB: '#fff000'}
};
outputPage.addEventListener('change', () => {
  const colors = defaultColors[outputPage.value];
  if (colors) {
    document.getElementById('colorB').value = colors.colorB;
    document.getElementById('colorPickerB').value = colors.colorB;
  }
});
colorBindings.forEach(({ picker, input }) => {
  const colorPicker = document.getElementById(picker);
  const colorInput = document.getElementById(input);
  colorPicker.addEventListener('input', () => colorInput.value = colorPicker.value);
  colorInput.addEventListener('input', () => colorPicker.value = colorInput.value);
});

function saveAndGo() {
  const title = document.getElementById('chatTitle').value;
  const text = document.getElementById('chatInput').value;
  const avatarFile = document.getElementById('avatarFile').files[0];
  const bgFile = document.getElementById('backgroundFile').files[0];
  const colorA = document.getElementById('colorA').value;
  const colorB = document.getElementById('colorB').value;
  const colorHeader = document.getElementById('colorHeader').value;
  const outputPage = document.getElementById('outputPage').value;
  const hideChatFooter = document.getElementById('hideChatFooter').checked;

  localStorage.setItem('chatTitle', title);
  localStorage.setItem('chatData', text);
  localStorage.setItem('colorA', colorA);
  localStorage.setItem('colorB', colorB);
  localStorage.setItem('colorHeader', colorHeader);
  localStorage.setItem('hideChatFooter', hideChatFooter ? '1' : '0');

  function goToPage() {
    window.location.href = outputPage;
  }

  function handleBgFile() {
    if (bgFile) {
      const reader = new FileReader();
      reader.onload = e => {
        localStorage.setItem('bgUrl', e.target.result);
        goToPage();
      };
      reader.readAsDataURL(bgFile);
    } else {
      localStorage.removeItem('bgUrl');
      goToPage();
    }
  }

  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = e => {
      localStorage.setItem('avatarA', e.target.result);
      handleBgFile();
    };
    reader.readAsDataURL(avatarFile);
  } else {
    localStorage.removeItem('avatarA');
    handleBgFile();
  }
}
