import { ipcMain } from "electron";
import { getWindow } from "../lib/WindowManager";
import { popAlert, setProgress, sleep, stepIterator } from "../util/Util";
import { default as pegarDados } from "../lib/sempapel/documentos/geral/pegar_dados";
import { getEscola, getEscolas, setEscola } from "../lib/StorageManager";

ipcMain.on("pegarDados", async (_, unidade: string, processo: string) => {
  const subWindow = getWindow("SubWindow");

  subWindow.window.show();

  const un = getEscola(unidade);

  const ite = stepIterator(pegarDados);

  while (ite.hasNext()) {
    const step = ite.next();

    setProgress({
      value: Math.floor((step.index / (pegarDados.length - 1)) * 100),
    });

    popAlert({
      text: step.value.title,
      title: `Pegando dados ${processo}`,
      color: "blue",
      icon: "fa-pencil",
      position: "center",
    });

    try {
      const res = await step.value.do(subWindow.page, {
        processo,
      });

      if (res && res.pendencias)
        un.processos[processo].pendencias = res.pendencias;
      if (res && res.documentos)
        un.processos[processo].documentos = res.documentos;
      if (res && res.situacao) un.processos[processo].situacao = res.situacao;

      setEscola(unidade, un);
    } catch (error) {
      console.log(error);

      popAlert({ text: error, color: "error" });
    }

    await sleep(200);
  }

  subWindow.window.hide();
});

export async function pegarAllDados(): Promise<void> {
  const subWindow = getWindow("SubWindow");
  subWindow.window.show();

  const todasUnidades = getEscolas();

  for (const [unidade, dadosEscola] of Object.entries(todasUnidades)) {
    for (const [processo, _] of Object.entries(dadosEscola.processos)) {
      const un = getEscola(unidade);

      const ite = stepIterator(pegarDados);

      while (ite.hasNext()) {
        const step = ite.next();

        setProgress({
          value: Math.floor((step.index / (pegarDados.length - 1)) * 100),
        });

        popAlert({
          text: step.value.title,
          title: `Pegando dados ${processo}`,
          color: "blue",
          icon: "fa-pencil",
          position: "center",
        });

        try {
          const res = await step.value.do(subWindow.page, {
            processo,
          });

          if (res && res.pendencias)
            un.processos[processo].pendencias = res.pendencias;
          if (res && res.documentos)
            un.processos[processo].documentos = res.documentos;
          if (res && res.situacao)
            un.processos[processo].situacao = res.situacao;

          setEscola(unidade, un);
        } catch (error) {
          console.log(error);

          popAlert({ text: error, color: "error" });
        }

        await sleep(200);
      }
    }
  }

  subWindow.window.hide();
}
