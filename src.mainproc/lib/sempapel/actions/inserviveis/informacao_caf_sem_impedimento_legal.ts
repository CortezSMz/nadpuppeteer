import type { Action, ActionsInserviveis } from "../../Actions";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page, { processo }: { processo: string }) =>
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
    do: (page) => page.select("#preenchimento", "392994"),
  },
  {
    title: "Aguardando...",
    do: (page) => page.waitForSelector("#Assunto"),
  },
  {
    title: "Preenchendo assinante...",
    do: (page, { username }) =>
      Promise.all([
        page.click(
          "#frm > div.row.js-siga-sp-documento-analisa-alteracao > div.col-sm-8 > div > div > input",
          { clickCount: 3 }
        ),
        page.type(
          "#frm > div.row.js-siga-sp-documento-analisa-alteracao > div.col-sm-8 > div > div > input",
          username.toString()
        ),
      ]),
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

            <p style="text-align:justify; text-indent:2cm">A vista das informa&ccedil;&otilde;es da EAMEX e da Supervis&atilde;o de Ensino, tendo sido adotadas as medidas pertinentes ao assunto, n&atilde;o vemos impedimento legal na doa&ccedil;&atilde;o do material &agrave; APM.</p>

            <p style="text-align:justify; text-indent:2cm">Restitu&iacute;mos os presentes autos a Vossa Senhoria, a quem cabe decidir sobre a destina&ccedil;&atilde;o final do material em quest&atilde;o.</p>

            <p>&nbsp;</p>
            `
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
    title: "Incluindo cossignatário...",
    do: (page) => page.click("#incluir-cossignatario"),
  },
  {
    title: "Selecionando cossignatário...",
    do: (page) => page.type("#formulario_cosignatarioSel_sigla", "SEDUC421240"),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(3) > div.col-sm-2 > div > div > a"
      ),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(5) > div > input.btn.btn-primary"
      ),
  },
  {
    title: "Voltando para capa",
    do: (page) =>
      page.click(
        "body > div:nth-child(6) > div.card.bg-light.mb-3 > div.card-body > form > div:nth-child(5) > div > input.btn.btn-cancel.ml-2"
      ),
  },
  {
    title: "Indo para assinatura...",
    do: (page) =>
      Promise.all([
        page.click("#assinar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Assinando...",
    do: (page) =>
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
    do: (page, { password }: { password: string }) =>
      page.type("#senhaUsuarioSubscritor", password, { delay: 100 }),
  },
  {
    title: "Confirmando...",
    do: (page) =>
      page.waitForSelector("#senhaOk", { hidden: false, visible: true }),
  },
  {
    title: "Confirmando...",
    do: (page) =>
      Promise.all([
        page.click("#senhaOk"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
] as Action[ActionsInserviveis.INFORMACAO_CAF_SEM_IMPEDIMENTO_LEGAL];
