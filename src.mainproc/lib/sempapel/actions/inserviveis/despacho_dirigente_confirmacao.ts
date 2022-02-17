import type { Action, ActionsInserviveis } from "../../Actions";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page, { processo }: { processo: string }) =>
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
    do: (page) => page.select("#preenchimento", "469422"),
  },
  {
    title: "Aguardando...",
    do: (page) => page.waitForSelector("#Assunto"),
  },
  {
    title: "Preenchendo assunto...",
    do: (page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e/ou Excedente com base na Resolução SE 41/00"
      ),
  },
  {
    title: "Preenchendo interessado...",
    do: (page, { unidade }: { unidade: string }) =>
      page.type("#Interessado", unidade),
  },
  {
    title: "Mudando preenchimento para HTML...",
    do: (page) => page.click("#cke_50_label"),
  },
  {
    title: "Preenchendo conteúdo...",
    do: (page) =>
      page.type(
        "#cke_1_contents > textarea",
        `
            <p>&nbsp;</p>

            <p style="text-align:justify; text-indent:2cm">Encaminha-se o presente processo &agrave; Supervis&atilde;o de Ensino&nbsp;para que verifique se o material relacionado nos autos, doado &agrave; APM, foi totalmente retirado da Unidade Escolar, e que se manifeste em termo de visita e retorno dos autos ao Centro de Administra&ccedil;&atilde;o, Finan&ccedil;as e Infraestrutura.</p>

            <p>&nbsp;</p>
            `
      ),
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
] as Action[ActionsInserviveis.DESPACHO_DIRIGENTE_CONFIRMACAO];
