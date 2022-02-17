import type { Page } from "puppeteer-core";

export enum DocumentosInserviveis {
  INFORMACAO_EAMEX = "Informacao EAMEX",
  DESPACHO_DIRIGENTE_VERIFIQUE = "Despacho Dirigente - Verifique material arrolado",
  INFORMACAO_CAF_SEM_IMPEDIMENTO_LEGAL = "Informação CAF - Sem impedimento legal",
  DESPACHO_DIRIGENTE_AUTORIZANDO = "Despacho Dirigente - Autorizando desfazimento",
  ENCAMINHAR_PARA_ESCOLA = "Encaminhar para escola",
  DESPACHO_DIRIGENTE_CONFIRMACAO = "Despacho Dirigente - Solicitando confirmacao de retirada",
  INFORMACAO_CAF_AUTORIZANDO_BAIXA = "Informacao CAF - Autorizando baixa contabil",
}

export enum DocumentosGerais {
  PEGAR_DADOS = "Pegar dados",
}

export interface DadosDocumentosInserviveis {
  processo?: string;
  unidade?: string;
  doc?: DocumentosInserviveis;
}

export type Document = {
  [key in DocumentosInserviveis | DocumentosGerais]: {
    title: string;
    do: (
      page: Page,
      { processo, unidade, doc }: DadosDocumentosInserviveis
    ) => void | Promise<unknown>;
  }[];
};
