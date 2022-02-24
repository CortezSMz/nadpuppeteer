import moment from "moment";
import { ipcMain } from "electron";
import StepIterator from "../lib/StepIterator";
import { getEscola, getEscolas, setEscola } from "../lib/StorageManager";
import { PEGAR_DADOS } from "../lib/sempapel/actions/index";

const atualizarDados = async (_, unidade: string, processo: string) => {
  const iterator = new StepIterator(PEGAR_DADOS, {
    expect: ["documentos", "situacao", "pendencias"],
    data: { unidade, processo },
    alert: {
      title: `${unidade}: ${processo}`,
      color: "blue",
      icon: "fa-pencil",
      position: "center",
      timeout: 1000,
    },
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

  dados.processos[processo].lastUpdate = moment().valueOf();

  setEscola(unidade, dados);
};

const atualizarDadosTodas = async () => {
  const escolas = getEscolas();

  for (const [nomeEscola, dadosEscola] of Object.entries(escolas)) {
    for (const [numeroProcesso, _] of Object.entries(dadosEscola.processos)) {
      await atualizarDados(null, nomeEscola, numeroProcesso);
    }
  }
};

ipcMain.on("atualizarDados", atualizarDados);
ipcMain.on("atualizarDadosTodas", atualizarDadosTodas);
