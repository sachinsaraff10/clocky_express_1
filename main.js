const { app, BrowserWindow, ipcMain} = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration in the renderer process (use it only if you trust the content of your HTML file)
    },
  });

  mainWindow.loadFile('index.html'); // Load the HTML file for the renderer process
}
let urls = [];
app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on('url-added',(event,url)=>{
    urls.push(url);
    
})