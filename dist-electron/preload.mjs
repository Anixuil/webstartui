"use strict";const o=require("electron");o.contextBridge.exposeInMainWorld("ipcRenderer",{on(...e){const[n,r]=e;return o.ipcRenderer.on(n,(c,...t)=>r(c,...t))},off(...e){const[n,...r]=e;return o.ipcRenderer.off(n,...r)},send(...e){const[n,...r]=e;return o.ipcRenderer.send(n,...r)},invoke:(e,n)=>o.ipcRenderer.invoke(e,n)});
