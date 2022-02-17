import Store from "electron-store";
import { getWindow } from "./WindowManager";

interface Escola {
  processos: {
    [key: string]: {
      pendencias: Array<string>;
      documentos: Array<string>;
      situacao: Array<string>;
    };
  };
}

type StoreType = {
  [key: string]: Escola;
};

Store.initRenderer();

const escolas = new Store<StoreType>({ watch: true, name: "escolas" });

escolas.onDidAnyChange((newValue, oldValue) => {
  getWindow("MainWindow").window.webContents.send("updateEscolas", newValue);
});

export function setEscola(nome: string, dados: Escola): void {
  return escolas.set(nome, dados);
}

export function getEscolas(): StoreType {
  return escolas.store;
}

export function getEscola(nome: string): Escola {
  return escolas.get(nome, null);
}

export function delEscola(nome: string): void {
  return escolas.delete(nome);
}
