import { ipcMain } from "electron";
import { getWindow } from "../../lib/WindowManager";
import {
  delEscola,
  getEscola,
  getEscolas,
  setEscola,
} from "../../lib/StorageManager";

ipcMain.on("editEscola", (_, oldUnidade, newUnidade) => {
  const tempData = getEscola(oldUnidade);

  delEscola(oldUnidade);

  setEscola(newUnidade, tempData);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
