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
    title: `NADPuppeteer - v${version}`,
    autoHideMenuBar: true,
    resizable: false,
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
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

  return {
    window: mainWindow,
    page: mainPage,
  };
}
