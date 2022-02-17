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

export async function createMainWindow(): Promise<Puppet> {
  if (isRegistered("MainWindow")) {
    return getWindow("MainWindow");
  }

  const browser: Browser = await pie.connect(app, puppeteer);

  const mainWindow: BrowserWindow = new BrowserWindow({
    title: `NADPuppeteer - v${version as string}`,
    autoHideMenuBar: true,
    resizable: false,
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: process.env.WEBPACK_DEV_SERVER_URL
        ? path.join(__dirname, "./../src.mainproc/preload/preload.js")
        : "app://./preload/preload.js",
    },
  });

  const mainPage = await getPage(browser, mainWindow);

  registerWindow("MainWindow", {
    window: mainWindow,
    page: mainPage,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => callback(false)
  );

  mainWindow.on("closed", () => {
    unregisterWindow("MainWindow");
  });

  mainWindow.webContents.on("new-window", (event, url: string) => {
    event.preventDefault();
    if (/^https?:\/\//.exec(url)) {
      shell.openExternal(url);
    }
  });

  mainWindow.on("will-move", (_, pos: { x: number; y: number }) => {
    const subWindow = getWindow("SubWindow");

    if (subWindow)
      subWindow.window.setPosition(pos.x + mainWindow.getSize()[0], pos.y);
  });

  return {
    window: mainWindow,
    page: mainPage,
  };
}
