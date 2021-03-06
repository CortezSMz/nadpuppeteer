"use strict";

import pie from "puppeteer-in-electron";
import { app, protocol } from "electron";
const isDevelopment = process.env.NODE_ENV !== "production";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

if (require("electron-squirrel-startup")) app.quit();

// Data Storage
import "./lib/StorageManager";

// Window
import { createMainWindow } from "./windows/MainWindow";

// IPC events
import "./ipc/entrar";
import "./ipc/autuarProcesso";
import "./ipc/atualizarDados";
import "./ipc/incluirDocumento";
import "./ipc/escolas/delEscola";
import "./ipc/escolas/setEscola";
import "./ipc/escolas/editEscola";
import "./ipc/escolas/getEscolas";
import "./ipc/processos/addProcesso";
import "./ipc/processos/delProcesso";
import "./ipc/processos/editProcesso";

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
});
