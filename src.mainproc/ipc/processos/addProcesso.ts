import moment from "moment";
import { ipcMain } from "electron";
import { getWindow } from "../../lib/WindowManager";
import { getEscola, getEscolas, setEscola } from "../../lib/StorageManager";

ipcMain.on("addProcesso", async (_, unidade, processo) => {
  const data = getEscola(unidade);

  data.processos = Object.assign(data.processos, {
    [`${processo}`]: {
      pendencias: [],
      documentos: [],
      situacao: [],
      lastUpdate: moment().valueOf(),
    },
  });

  setEscola(unidade, data);

  getWindow("MainWindow").window.webContents.send(
    "updateEscolas",
    getEscolas()
  );
});
