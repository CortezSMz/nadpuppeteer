import type { Page } from "puppeteer-core";
import type { Action, ActionsInserviveis } from "../../Actions";

export default [
  {
    title: "Indo para Folha Líder...",
    do: (page, { processo }: { processo: string }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/exibir?sigla=${processo.replace(
          /-|\//g,
          ""
        )}V01`,
        {
          waitUntil: "networkidle0",
        }
      ),
  },
  {
    title: "Indo para inclusão de documento...",
    do: (page, { processo }: { processo: string }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=5515&mobilPaiSel.sigla=${processo.replace(
          /-|\//g,
          ""
        )}V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Personalizando assinatura...",
    do: (page) =>
      page.click(
        "#frm > div.row.js-siga-sp-documento-analisa-alteracao > div.col-sm-2 > div > div > input.form-check-input.ml-3"
      ),
  },
  {
    title: "Preenchendo função...",
    do: (page) =>
      Promise.all([
        page.waitForSelector("#personalizarFuncao"),
        page.type("#personalizarFuncao", "Membro EAMEX"),
      ]),
  },
  {
    title: "Preenchendo unidade...",
    do: (page) => page.type("#personalizarUnidade", "Núcleo de Administração"),
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
    do: (page, { unidade }: { unidade: string }) =>
      page.type(
        "#cke_1_contents > textarea",
        `
		<p>&nbsp;</p>

		<p style="text-align:justify; text-indent:2cm">A Associa&ccedil;&atilde;o de Pais e Mestres da ${unidade}, com base no Decreto&nbsp;40.645, de 31/01/95, publicado no DOE de 01/02/1996 e na Resolu&ccedil;&atilde;o SE 41, de 26/04/2000, publicado no DOE em 27/04/2000, solicita a doa&ccedil;&atilde;o do material inserv&iacute;vel existente na Unidade Escolar acima citada, conforme mapa de arrolamento e registro da Ata do Conselho de Escola.</p>

		<p style="text-align:justify; text-indent:2cm">Esta equipe de Apoio de Material Excedente, efetuou a confer&ecirc;ncia da documenta&ccedil;&atilde;o da Unidade Escolar, e nada tem a opor &agrave; efetiva&ccedil;&atilde;o da doa&ccedil;&atilde;o.</p>

		<p style="text-align:justify; text-indent:2cm">Encaminham-se os autos &agrave; considera&ccedil;&atilde;o superior, para as provid&ecirc;ncias que se fizerem necess&aacute;rias.</p>

		<p style="text-align:justify; text-indent:2cm">&nbsp;</p>

		<p>&nbsp;</p>
		`
      ),
  },
  {
    title: "Confirmando informação...",
    do: (page) =>
      Promise.all([
        page.click("#btnGravar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Incluindo cossignatário...",
    do: (page) => page.click("#incluir-cossignatario"),
  },
  {
    title: "Selecionando cossignatário...",
    do: (page) => page.type("#formulario_cosignatarioSel_sigla", "SEDUC17757"),
  },
  {
    title: "Personalizando cossignatário...",
    do: (page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(3) > div.col-sm-2 > div > div"
      ),
  },
  {
    title: "Preenchendo função...",
    do: (page) =>
      Promise.all([
        page.waitForSelector("#funcaoCosignatario", { visible: true }),
        page.type("#funcaoCosignatario", "Membro EAMEX"),
      ]),
  },
  {
    title: "Preenchendo unidade...",
    do: (page) =>
      page.type(
        "#unidadeCosignatario",
        "Núcleo de Informações Educacionais e Tecnologia"
      ),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page) =>
      Promise.all([
        page.click(
          "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(5) > div > input.btn.btn-primary"
        ),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Incluindo cossignatário...",
    do: (page) => page.click("#incluir-cossignatario"),
  },
  {
    title: "Selecionando cossignatário...",
    do: (page) => page.type("#formulario_cosignatarioSel_sigla", "SEDUC56333"),
  },
  {
    title: "Personalizando cossignatário...",
    do: (page) =>
      page.click(
        "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(3) > div.col-sm-2 > div > div"
      ),
  },
  {
    title: "Preenchendo função...",
    do: (page) =>
      Promise.all([
        page.waitForSelector("#funcaoCosignatario", { visible: true }),
        page.type("#funcaoCosignatario", "Membro EAMEX"),
      ]),
  },
  {
    title: "Preenchendo unidade...",
    do: (page) =>
      page.type("#unidadeCosignatario", "Núcleo de Apoio Administrativo"),
  },
  {
    title: "Confirmando cossignatário...",
    do: (page) =>
      Promise.all([
        page.click(
          "body > div:nth-child(6) > div > div.card-body > form > div:nth-child(5) > div > input.btn.btn-primary"
        ),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
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
] as Action[ActionsInserviveis.INFORMACAO_EAMEX];
