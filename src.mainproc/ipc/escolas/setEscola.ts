import { ipcMain } from "electron";
import { getEscolas, setEscola } from "../../lib/StorageManager";
import { getWindow } from "../../lib/WindowManager";

ipcMain.on("setEscola", (_, unidade, dados) => {
  setEscola(unidade, dados);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
