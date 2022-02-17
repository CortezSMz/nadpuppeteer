import { ipcMain } from "electron";
import { popAlert } from "../lib/Util";
import StepIterator from "../lib/StepIterator";
import { getWindow } from "../lib/WindowManager";
import { ENTRAR } from "../lib/sempapel/actions/index";

ipcMain.on(
  "entrar",
  async (_, creds: { username: string; password: string }) => {
    const iterator = new StepIterator(ENTRAR, {
      data: creds,
      expect: ["success", "error"],
    });

    const { error, success } = await iterator.iterate();

    if (success)
      return getWindow("MainWindow").window.webContents.send(
        "semPapelEntrarSucesso",
        creds
      );

    if (error) return popAlert({ text: error as string, color: "error" });
  }
);
