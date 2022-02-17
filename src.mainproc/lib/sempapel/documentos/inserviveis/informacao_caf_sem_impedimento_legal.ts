import type { Page } from "puppeteer-core";
import type { Document, DocumentosInserviveis } from "../Document";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page: Page, { processo }: { processo: string }) =>
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
    do: (page: Page) => page.select("#preenchimento", "392994"),
  },
  {
    title: "Aguardando...",
    do: (page: Page) => page.waitForSelector("#Assunto"),
  },
  {
    title: "Preenchendo assunto...",
    do: (page: Page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e/ou Excedente com base na Resolução SE 41/00"
      ),
  },
  {
    title: "Preenchendo interessado...",
    do: (page: Page, { unidade }: { unidade: string }) =>
      page.type("#Interessado", unidade),
  },
  {
    title: "Mudando preenchimento para HTML...",
    do: (page: Page) => page.click("#cke_50_label"),
  },
  {
    title: "Preenchendo conteúdo...",
    do: (page: Page) =>
      page.type(
        "#cke_1_contents > textarea",
        `
            <p>&nbsp;</p>

            <p style="text-align:justify; text-indent:2cm">A vista das informa&ccedil;&otilde;es da EAMEX e da Supervis&atilde;o de Ensino, tendo sido adotadas as medidas pertinentes ao assunto, n&atilde;o vemos impedimento legal na doa&ccedil;&atilde;o do material &agrave; APM.</p>

            <p style="text-align:justify; text-indent:2cm">Restitu&iacute;mos os presentes autos a Vossa Senhoria, a quem cabe decidir sobre a destina&ccedil;&atilde;o final do material em quest&atilde;o.</p>

            <p>&nbsp;</p>
            `
      ),
  },
  {
    title: "Confirmando informação...",
    do: (page: Page) =>
      Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("#btnGravar"),
      ]),
  },
  {
    title: "Incluindo cossignatário...",
    do: (page: Page) => page.click("#incluir-cossignatario"),
  },
  {
    title: "Selecionando cossignatário...",
    do: (page: Page) =>
      page.type("#formulario_cosignatarioSel_sigla", "SEDUC421240"),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page: Page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(3) > div.col-sm-2 > div > div > a"
      ),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page: Page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(5) > div > input.btn.btn-primary"
      ),
  },
  {
    title: "Indo para assinatura...",
    do: (page: Page) =>
      Promise.all([
        page.click("#assinar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Assinando...",
    do: (page: Page) =>
      Promise.all([
        page.click("#bot-assinar"),
        page.waitForSelector("#senhaOk", {
          hidden: false,
          visible: true,
          timeout: 15000,
        }),
      ]),
  },
  {
    title: "Preenchendo senha...",
    do: (page: Page, { password }: { password: string }) =>
      page.type("#senhaUsuarioSubscritor", password, { delay: 100 }),
  },
  {
    title: "Confirmando...",
    do: (page: Page) =>
      page.waitForSelector("#senhaOk", { hidden: false, visible: true }),
  },
  {
    title: "Confirmando...",
    do: (page: Page) =>
      Promise.all([
        page.click("#senhaOk"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
] as Document[DocumentosInserviveis.INFORMACAO_CAF_SEM_IMPEDIMENTO_LEGAL];
