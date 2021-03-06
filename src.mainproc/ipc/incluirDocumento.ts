import { ipcMain } from "electron";
import StepIterator from "../lib/StepIterator";
import * as documentos from "../lib/sempapel/actions/index";
import { ActionsInserviveis } from "../lib/sempapel/Actions";

ipcMain.on(
  "incluirDocumento",
  async (
    _,
    username: string,
    password: string,
    unidade: string,
    processo: string,
    doc: ActionsInserviveis
  ) => {
    const steps = documentos[doc];

    console.log(username, password, unidade, processo, doc);

    const iterator = new StepIterator(steps, {
      data: { username, password, unidade, processo },
      alert: {
        color: "blue",
        icon: "fa-pencil",
        position: "center",
        timeout: 1000,
      },
    });

    await iterator.iterate();
  }
);
