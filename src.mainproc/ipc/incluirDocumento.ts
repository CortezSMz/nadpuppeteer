import { ipcMain } from "electron";
import StepIterator from "../lib/StepIterator";
import * as documentos from "../lib/sempapel/actions/index";
import { ActionsInserviveis } from "../lib/sempapel/Actions";

ipcMain.on(
  "incluirInservivel",
  async (
    _,
    password: string,
    unidade: string,
    processo: string,
    doc: ActionsInserviveis
  ) => {
    const steps = documentos[doc];

    const iterator = new StepIterator(steps, {
      data: { password, unidade, processo },
    });

    await iterator.iterate();
  }
);
