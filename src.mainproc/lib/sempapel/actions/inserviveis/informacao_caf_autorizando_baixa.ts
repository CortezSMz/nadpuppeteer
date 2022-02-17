import type { Action, ActionsInserviveis } from "../../Actions";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page, { processo }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=5515&mobilPaiSel.sigla=${processo.replace(
          /-|\//g,
          ""
        )}V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Selecionando modelo...",
    do: (page) => page.select("#preenchimento", "723002"),
  },
  {
    title: "Preenchendo interessado...",
    do: (page, { unidade }) => page.type("#Interessado", unidade),
  },
  {
    title: "Preenchendo referência...",
    do: (page, { processo }) =>
      page.type(
        "#numeroDeReferencia",
        processo.replace(
          /^([A-Z]{5})([A-Z]{3})([0-9]{4})([0-9]{4,5})V01/g,
          "$1-$2-$3/$4"
        )
      ),
  },
  {
    title: "Confirmando informação...",
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
] as Action[ActionsInserviveis.INFORMACAO_CAF_AUTORIZANDO_BAIXA];
