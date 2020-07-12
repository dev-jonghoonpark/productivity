const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron')
let ps = require('ps-node');

let win
let targetProcess;
function createWindow () {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;

  // 브라우저 창을 생성합니다.
  win = new BrowserWindow({
    type:'toolbar',
    width: 400,
    height: 220,
    x: width - 400,
    y: 24,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },
    transparent: true, 
    frame: false,
    icon: __dirname + '/resources/images/logo.png'
  })

  win.setResizable(false)

  // and load the index.html of the app.
  win.loadFile('index.html')

  // 개발자 도구를 엽니다.
  // win.webContents.openDevTools()

  win.hide();

  //checkProcess();
}

// 이 메소드는 Electron의 초기화가 완료되고
// 브라우저 윈도우가 생성될 준비가 되었을때 호출된다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.whenReady().then(createWindow)

// 모든 윈도우가 닫히면 종료된다.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

let tray = null
app.on('ready', () => {
  tray = new Tray(__dirname + '/resources/images/tray.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '종료',
      click() {
        app.exit(0);
      }
    },
  ])
  tray.setToolTip('억제기가 실행중입니다.')
  tray.setContextMenu(contextMenu)
})

// 이 파일에는 나머지 앱의 특정 주요 프로세스 코드를 포함시킬 수 있습니다. 별도의 파일에 추가할 수도 있으며 이 경우 require 구문이 필요합니다.

app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath("exe")
});

ipcMain.on('detect', (event, arg) => {
  win.show();
  targetProcess = arg;

  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true);
  win.setFullScreenable(false);
});

ipcMain.on('cancel', (event, arg) => {
  console.log('cancel')
  win.hide()
}) 

ipcMain.on('confirm', (event, arg) => {
  console.log('confirm')

  if (targetProcess) {
    ps.kill(targetProcess.pid, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  win.hide();
}) 