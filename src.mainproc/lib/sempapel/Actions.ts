import { Step } from "../StepIterator";

export enum ActionsInserviveis {
  INFORMACAO_EAMEX = "Informacao EAMEX",
  DESPACHO_DIRIGENTE_VERIFIQUE = "Despacho Dirigente - Verifique material arrolado",
  INFORMACAO_CAF_SEM_IMPEDIMENTO_LEGAL = "Informação CAF - Sem impedimento legal",
  DESPACHO_DIRIGENTE_AUTORIZANDO = "Despacho Dirigente - Autorizando desfazimento",
  ENCAMINHAR_PARA_ESCOLA = "Encaminhar para escola",
  DESPACHO_DIRIGENTE_CONFIRMACAO = "Despacho Dirigente - Solicitando confirmacao de retirada",
  INFORMACAO_CAF_AUTORIZANDO_BAIXA = "Informacao CAF - Autorizando baixa contabil",
}

export enum ActionsGerais {
  AUTUAR_PROCESSO = "Autuar processo",
  PEGAR_DADOS = "Pegar dados",
  ENTRAR = "Entrar",
}

export type Action = {
  [key in ActionsInserviveis | ActionsGerais]: Array<Step>;
};
