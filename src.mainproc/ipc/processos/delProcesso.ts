import { ipcMain } from "electron";
import { getWindow } from "../../lib/WindowManager";
import { getEscola, getEscolas, setEscola } from "../../lib/StorageManager";

ipcMain.on("delProcesso", (_, unidade, processo) => {
  const data = getEscola(unidade);

  delete data.processos[processo];

  setEscola(unidade, data);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
