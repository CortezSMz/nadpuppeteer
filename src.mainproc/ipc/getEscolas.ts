import { ipcMain } from "electron";
import { getEscolas } from "../lib/StorageManager";
import { getWindow } from "../lib/WindowManager";

ipcMain.on("getEscolas", () => {
  const escolas = getEscolas();

  getWindow("MainWindow").window.webContents.send("updateEscolas", escolas);
});
