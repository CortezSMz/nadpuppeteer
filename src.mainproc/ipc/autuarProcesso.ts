import { ipcMain } from "electron";
import StepIterator from "../lib/StepIterator";
import { AUTUAR_PROCESSO } from "../lib/sempapel/actions/index";

ipcMain.on(
  "autuarProcesso",
  async (
    _,
    username: string,
    password: string,
    unidade: string,
    docs: {
      mapaDeArrolamento: string;
      informacaoDiretor: string;
      documentacaoApm: string;
    }
  ) => {
    const iterator = new StepIterator(AUTUAR_PROCESSO, {
      expect: ["numero"],
      data: { username, password, unidade, ...docs },
      alert: {
        color: "blue",
        icon: "fa-pencil",
        position: "center",
        timeout: 5000,
      },
    });

    const res = await iterator.iterate();

    ipcMain.emit("addProcesso", "", unidade, res.numero);
  }
);
