import * as path from "path";
import { version } from "./../../package.json";
import { app, BrowserWindow, shell } from "electron";
import pie, { getPage } from "puppeteer-in-electron";
import puppeteer, { Browser } from "puppeteer-core";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import {
  registerWindow,
  unregisterWindow,
  isRegistered,
  getWindow,
  Puppet,
} from "../lib/WindowManager";

export async function createSubWindow(): Promise<Puppet> {
  if (isRegistered("SubWindow")) {
    return getWindow("SubWindow");
  }

  const mainWindow = getWindow("MainWindow");

  if (!mainWindow) return;

  const browser: Browser = await pie.connect(app, puppeteer);

  const subWindow: BrowserWindow = new BrowserWindow({
    title: `NADPuppeteer - v${version as string}`,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    parent: mainWindow.window,
    webPreferences: {
      contextIsolation: true,
      preload: process.env.WEBPACK_DEV_SERVER_URL
        ? path.join(__dirname, "./../src.mainproc/preload/preload.js")
        : "app://./preload/preload.js",
    },
    width: 800,
    height: mainWindow.window.getSize()[1] + 40,
    x: mainWindow.window.getPosition()[0] + mainWindow.window.getSize()[0],
    y: mainWindow.window.getPosition()[1],
  });

  const subPage = await getPage(browser, subWindow);

  registerWindow("SubWindow", {
    window: subWindow,
    page: subPage,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await subWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
  } else {
    createProtocol("app");
    subWindow.loadURL("app://./index.html");
  }
  subWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => callback(false)
  );

  subWindow.removeMenu();

  subWindow.setIgnoreMouseEvents(true);

  subWindow.on("closed", () => {
    unregisterWindow("SubWindow");
  });

  subWindow.webContents.on("new-window", (event, url: string) => {
    event.preventDefault();
    if (/^https?:\/\//.exec(url)) {
      shell.openExternal(url);
    }
  });

  return {
    window: subWindow,
    page: subPage,
  };
}
