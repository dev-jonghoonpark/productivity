let ps = require('ps-node');

const sleep = async time => new Promise(r => setTimeout(r, time))

let aleadyDetected = false;
let isSleep = false;

self.onmessage = async (e) => {
  if (e.data.type === 'cancel') {
    isSleep = true;
    postMessage({ type: 'cancel' });
    console.log('sleep 30 minute');
    await sleep(30 * 60 * 1000);
    isSleep = false;
  }
  aleadyDetected = false;
}

~(async function main() {
  checkProcess();
})()

async function checkProcess() {
  ps.lookup({ command: 'football' }, async function (err, resultList) {
    if (err) {
      throw new Error(err);
    }

    resultList.forEach(function (process) {
      if (process && process.command.includes('fm.exe')) {
        console.log('fm20 running');
        console.log('aleadyDetected:' + aleadyDetected);

        if (!aleadyDetected && !isSleep) {
          postMessage({ type: 'detect', process: process });
        }

        aleadyDetected = true;
      }
    });

    await sleep(1000);
    checkProcess();
  });
}