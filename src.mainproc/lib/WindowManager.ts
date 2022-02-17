import { BrowserWindow } from "electron";
import { Page } from "puppeteer-core";

export interface Puppet {
  window: BrowserWindow;
  page: Page;
}

const windowMap = new Map<string | BrowserWindow, Puppet>();

export function registerWindow(
  key: string | BrowserWindow,
  puppet: Puppet
): void {
  windowMap.set(key, puppet);
}

export function unregisterWindow(key: string | BrowserWindow): boolean {
  return windowMap.delete(key);
}

export function isRegistered(key: string | BrowserWindow): boolean {
  return windowMap.has(key);
}

export function getWindow(key: string | BrowserWindow): Puppet {
  return windowMap.get(key);
}
