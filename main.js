// An Inspector Calls for Windows.
// Shows the welcome screen, then opens the workspace in its own Chrome (or Edge) app window,
// so it uses the inspector's existing Claude login and Gmail connection.
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const URL_IC = 'https://claude.ai/artifact/Dq6idUVy5f5mZRYDLS4iuQ';

if (!app.requestSingleInstanceLock()) { app.quit(); }

function installedBrowsers() {
  const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
  const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const local = process.env['LOCALAPPDATA'] || '';
  return [
    path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    local && path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
  ].filter(p => { try { return p && fs.existsSync(p); } catch { return false; } });
}

function openWorkspace() {
  const exe = process.platform === 'win32' ? installedBrowsers()[0] : null;
  if (exe) {
    try {
      const child = spawn(exe, ['--app=' + URL_IC, '--window-size=1440,920'], { detached: true, stdio: 'ignore' });
      child.unref();
      return /msedge/i.test(exe) ? 'Edge' : 'Chrome';
    } catch (e) { /* fall through to the default browser */ }
  }
  shell.openExternal(URL_IC);
  return 'your browser';
}

let win = null;
function createWindow() {
  win = new BrowserWindow({
    width: 520, height: 660, resizable: false, maximizable: false, show: false,
    title: 'An Inspector Calls', backgroundColor: '#11392d',
    icon: path.join(__dirname, 'resources', 'icon.png'),
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#11392d', symbolColor: '#ffffff', height: 34 },
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
}

ipcMain.handle('ic:open', () => {
  const how = openWorkspace();
  setTimeout(() => app.quit(), 4000);
  return how;
});

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
