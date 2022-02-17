import { ipcMain } from "electron";
import { getWindow } from "../lib/WindowManager";
import { popAlert, setProgress, sleep, stepIterator } from "../util/Util";
import * as documentos from "../lib/sempapel/documentos";
import { DocumentosInserviveis } from "../lib/sempapel/documentos/Document";

ipcMain.on(
  "incluirInservivel",
  async (
    _,
    password: string,
    unidade: string,
    processo: string,
    doc: DocumentosInserviveis
  ) => {
    const steps = documentos[doc];

    const ite = stepIterator(steps);

    const subWindow = getWindow("SubWindow");

    subWindow.window.show();

    let callbacks = 0;

    while (ite.hasNext()) {
      const step = ite.next();

      setProgress({
        value: Math.floor((step.index / (steps.length - 1)) * 100),
      });

      popAlert({
        text: step.value.title,
        title: `Incluindo documento...`,
        color: "blue",
        icon: "fa-pencil",
        position: "center",
      });

      try {
        await step.value.do(subWindow.page, {
          processo,
          unidade,
          doc,
          password: password,
        });
      } catch (error) {
        callbacks++;
        ite.prev();
        console.log(error);

        popAlert({ text: error, color: "error" });

        if (callbacks > 10) {
          popAlert({
            text: "Quantidade máxima de callbacks permitidos. Cancelando operação.",
            color: "error",
          });
          break;
        }
      }

      await sleep(200);
    }

    subWindow.window.hide();
  }
);
