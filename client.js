const path = require('path')
console.log('make a worker: ', path.resolve(__dirname, 'worker.js'))

const {ipcRenderer} = require('electron');
const worker = new Worker(path.resolve(__dirname, 'worker.js'))

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('cancel-button').onclick = function () {
    worker.postMessage({ type: 'cancel' });
    ipcRenderer.send('cancel');
  }

  document.getElementById('confirm-button').onclick = function () {
    worker.postMessage({ type: 'confirm' });
    ipcRenderer.send('confirm');
  }
});

worker.onmessage = (event) => {
  console.log(event.data);
  if (event.data.type === 'detect') {
    ipcRenderer.send('detect', event.data.process);
  } else {
    ipcRenderer.send('cancel');
  }
};