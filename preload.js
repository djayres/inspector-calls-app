const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('ic', { open: () => ipcRenderer.invoke('ic:open') });
