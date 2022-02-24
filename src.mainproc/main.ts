"use strict";

import pie from "puppeteer-in-electron";
import { app, protocol } from "electron";
const isDevelopment = process.env.NODE_ENV !== "production";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
// Data Storage
import "./lib/StorageManager";

// Window
import { createMainWindow } from "./windows/MainWindow";

// IPC events
import "./ipc/atualizarDados";
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
});
