import type { Action, ActionsInserviveis } from "../../Actions";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page, { processo }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=25310&mobilPaiSel.sigla=${processo.replace(
          /-|\//g,
          ""
        )}V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Selecionando modelo...",
    do: (page) => page.select("#preenchimento", "532486"),
  },
  {
    title: "Preenchendo interessado...",
    do: (page, { unidade }) => page.type("#Interessado", unidade),
  },
  {
    title: "Confirmando despacho...",
    do: (page) =>
      Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("#btnGravar"),
      ]),
  },
  {
    title: "Finalizando...",
    do: (page) =>
      Promise.all([
        page.click("#finalizar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
] as Action[ActionsInserviveis.DESPACHO_DIRIGENTE_VERIFIQUE];
