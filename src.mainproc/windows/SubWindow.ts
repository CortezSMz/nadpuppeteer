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
    title: `NADPuppeteer - v${version}`,
    parent: mainWindow.window,
    closable: false,
    show: false,
    width: 1000,
    height: 700,
    x: mainWindow.window.getPosition()[0] + 50,
    y: mainWindow.window.getPosition()[1] + 50,
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
