"use strict";

import pie from "puppeteer-in-electron";
import { app, protocol } from "electron";
const isDevelopment = process.env.NODE_ENV !== "production";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

import pegar_dados from "./lib/sempapel/documentos/geral/pegar_dados";

// Data Storage
import "./lib/StorageManager";

// Window
import { createMainWindow } from "./windows/MainWindow";

// IPC events
import "./ipc/pegarDados";
import "./ipc/incluirDocumento";
import "./ipc/getEscolas";
import "./ipc/entrar";

// These should be done before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

pie.initialize(app);

// App lifecycle events.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e);
    }
  }
  createMainWindow();

  /* protocol.interceptFileProtocol('file', (req, callback) => {
        let filePath = new url.URL(req.url).pathname;
        if (process.platform === 'win32') {
            if (/^\/[A-Za-z]:/.exec(filePath)) {
                filePath = filePath.slice(1);
            }
            if (/^[A-Za-z]:\/(css|img|js)/.exec(filePath)) {
                filePath = path.join(app.getAppPath(), 'dist', filePath.slice(3));
            } else if (/^[A-Za-z]:\/[^/\\]+?\.(js|css|png|jpeg|jpg|ico|svg)$/.exec(filePath)) {
                // case of "vue-cli-service build --mode development"
                filePath = path.join(app.getAppPath(), 'dist', filePath.slice(3));
            }
        } else if (/^\/(css|img|js)/.exec(filePath)) {
                filePath = path.join(app.getAppPath(), 'dist', filePath.slice(1));
            } else if (/^\/[^/\\]+?\.(js|css|png|jpeg|jpg|ico|svg)$/.exec(filePath)) {
                // case of "vue-cli-service build --mode development"
                filePath = path.join(app.getAppPath(), 'dist', filePath.slice(1));
            }
        callback(path.normalize(filePath));
    }); */
});
