import { ipcMain } from "electron";
import { getEscola, getEscolas, setEscola } from "../../lib/StorageManager";
import { getWindow } from "../../lib/WindowManager";

ipcMain.on("editProcesso", (_, unidade, oldProcesso, newProcesso) => {
  const data = getEscola(unidade);

  const tmpProcessoData = data.processos[oldProcesso];

  delete data.processos[oldProcesso];

  data.processos = Object.assign(data.processos, {
    [newProcesso]: tmpProcessoData,
  });

  setEscola(unidade, data);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
