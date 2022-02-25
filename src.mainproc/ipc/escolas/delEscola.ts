import { ipcMain } from "electron";
import { delEscola, getEscolas } from "../../lib/StorageManager";
import { getWindow } from "../../lib/WindowManager";

ipcMain.on("delEscola", (_, unidade) => {
  delEscola(unidade);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
