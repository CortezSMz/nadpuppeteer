import { ipcMain } from "electron";
import StepIterator from "../lib/StepIterator";
import { getEscola, setEscola } from "../lib/StorageManager";
import { PEGAR_DADOS } from "../lib/sempapel/actions/index";

ipcMain.on("pegarDados", async (_, unidade: string, processo: string) => {
  const iterator = new StepIterator(PEGAR_DADOS, {
    expect: ["documentos", "situacao", "pendencias"],
    data: { unidade, processo },
  });

  const response = await iterator.iterate();

  const dados = getEscola(unidade);

  if (!response) return;

  if (response.documentos)
    dados.processos[processo].documentos =
      response.documentos as unknown as Array<string>;

  if (response.situacao)
    dados.processos[processo].situacao =
      response.situacao as unknown as Array<string>;

  if (response.pendencias)
    dados.processos[processo].pendencias =
      response.pendencias as unknown as Array<string>;

  setEscola(unidade, dados);
});
