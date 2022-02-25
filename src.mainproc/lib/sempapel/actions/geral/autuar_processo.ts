import { Action, ActionsGerais } from "../../Actions";

export default [
  {
    title: "Criando folha líder...",
    do: (page) =>
      page.goto(
        "https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=4320&criandoAnexo=false&criandoSubprocesso=false",
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Preenchendo interessado...",
    do: (page, { unidade }) => page.type("#Interessado", unidade as string),
  },
  {
    title: "Preenchendo assunto...",
    do: (page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e ou excedente, com base na resolução SE 41/00"
      ),
  },
  {
    title: "Salvando folha líder...",
    do: (page) =>
      Promise.all([
        page.click("#btnGravar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Assinando folha líder...",
    do: (page) =>
      Promise.all([
        page.click("#assinar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Assinando folha líder...",
    do: (page) =>
      Promise.all([
        page.click("#bot-assinar"),
        page.waitForSelector("#senhaOk", { visible: true, timeout: 15000 }),
      ]),
  },
  {
    title: "Preenchendo senha...",
    do: (page, { password }) =>
      page.type("#senhaUsuarioSubscritor", password.toString(), { delay: 100 }),
  },
  {
    title: "Confirmando...",
    do: (page) =>
      Promise.all([
        page.click("#senhaOk"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Pegando número do processo...",
    do: async (page) => {
      const element = await page.$("#page > div.row.mt-3 > div > h2");
      const numero = (
        await page.evaluate((element) => element.textContent, element)
      )
        .replace("Voltar", "")
        .replace(/\n|\t/g, "");
      return { numero };
    },
  },
  /* INFORMAÇÃO DIRETOR */
  {
    title: "Incluindo anexo...",
    do: (page) =>
      Promise.all([
        page.click("#incluir-documento"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Mudando modelo...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=57306&mobilPaiSel.sigla=${numero}-V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Enviando arquivo...",
    do: async (page, { informacaoDiretor }) => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click("#arquivo"),
      ]);

      await fileChooser.accept([informacaoDiretor as string]);
    },
  },
  {
    title: "Preenchendo assunto...",
    do: (page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e ou excedente, com base na resolução SE 41/00"
      ),
  },
  {
    title: "Preenchendo espécie...",
    do: (page) => page.select("#especie", "Ofício"),
  },
  {
    title: "Preenchendo tipo de conferência...",
    do: (page) =>
      page.select("#conferencia", "Cópia autenticada administrativamente"),
  },
  {
    title: "Salvando anexo...",
    do: (page) =>
      Promise.all([
        page.click("#btnGravar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Autenticando anexo...",
    do: (page) =>
      Promise.all([
        page.click("#autenticar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Autenticando com senha...",
    do: (page) =>
      Promise.all([
        page.click("#bot-autenticar"),
        page.waitForSelector("#senhaOk", { visible: true, timeout: 15000 }),
      ]),
  },
  {
    title: "Preenchendo senha...",
    do: (page, { password }) =>
      page.type("#senhaUsuarioSubscritor", password.toString(), { delay: 100 }),
  },
  {
    title: "Confirmando senha...",
    do: (page) =>
      Promise.all([
        page.click("#senhaOk"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  /* MAPA DE ARROLAMENTO */
  {
    title: "Indo para Folha Líder...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/exibir?sigla=${numero}V01`,
        {
          waitUntil: "networkidle0",
        }
      ),
  },
  {
    title: "Incluindo anexo...",
    do: (page) =>
      Promise.all([
        page.click("#incluir-documento"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Mudando modelo...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=57806&mobilPaiSel.sigla=${numero}-V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Preenchendo responsável pela assinatura...",
    do: async (page, { username }) => {
      await page.evaluate((user) => {
        const resp = document.getElementById(
          "formulario_exDocumentoDTO.subscritorSel_sigla"
        ) as unknown as HTMLTextAreaElement;
        resp.value = user;

        resp.focus();
      }, username as string);
    },
  },
  {
    title: "Enviando arquivo...",
    do: async (page, { mapaDeArrolamento }) => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click("#arquivo"),
      ]);

      await fileChooser.accept([mapaDeArrolamento as string]);
    },
  },
  {
    title: "Preenchendo assunto...",
    do: (page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e ou excedente, com base na resolução SE 41/00"
      ),
  },
  {
    title: "Preenchendo espécie...",
    do: (page) => page.select("#especie", "Relatório"),
  },
  {
    title: "Salvando anexo...",
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
    do: (page, { password }) =>
      page.type("#senhaUsuarioSubscritor", password.toString(), { delay: 100 }),
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
  /* DOCUMENTAÇÃO APM */
  {
    title: "Indo para Folha Líder...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/exibir?sigla=${numero}V01`,
        {
          waitUntil: "networkidle0",
        }
      ),
  },
  {
    title: "Incluindo anexo...",
    do: (page) =>
      Promise.all([
        page.click("#incluir-documento"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Mudando modelo...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=57306&mobilPaiSel.sigla=${numero}-V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Enviando arquivo...",
    do: async (page, { documentacaoApm }) => {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click("#arquivo"),
      ]);

      await fileChooser.accept([documentacaoApm as string]);
    },
  },
  {
    title: "Preenchendo assunto...",
    do: (page) =>
      page.type(
        "#Assunto",
        "Arrolamento de Material Inservível e ou excedente, com base na resolução SE 41/00"
      ),
  },
  {
    title: "Preenchendo espécie...",
    do: (page) => page.select("#especie", "Ofício"),
  },
  {
    title: "Preenchendo tipo de conferência...",
    do: (page) =>
      page.select("#conferencia", "Cópia autenticada administrativamente"),
  },
  {
    title: "Salvando anexo...",
    do: (page) =>
      Promise.all([
        page.click("#btnGravar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Autenticando anexo...",
    do: (page) =>
      Promise.all([
        page.click("#autenticar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Autenticando com senha...",
    do: (page) =>
      Promise.all([
        page.click("#bot-autenticar"),
        page.waitForSelector("#senhaOk", { visible: true, timeout: 15000 }),
      ]),
  },
  {
    title: "Preenchendo senha...",
    do: (page, { password }) =>
      page.type("#senhaUsuarioSubscritor", password.toString(), { delay: 100 }),
  },
  {
    title: "Confirmando senha...",
    do: (page) =>
      Promise.all([
        page.click("#senhaOk"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  /* INFORMAÇÃO EAMEX */
  {
    title: "Indo para inclusão de documento...",
    do: (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=5515&mobilPaiSel.sigla=${numero}-V01&criandoAnexo=true&criandoSubprocesso=false`,
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
    do: (page, { password }) =>
      page.type("#senhaUsuarioSubscritor", password.toString(), { delay: 100 }),
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
  /* DESPACHO DIRIGENTE VERIFIQUE */
  {
    title: "Indo para inclusão de documento...",
    do: async (page, { numero }) =>
      page.goto(
        `https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/editar?modelo=25310&mobilPaiSel.sigla=${numero}V01&criandoAnexo=true&criandoSubprocesso=false`,
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Selecionando modelo...",
    do: (page) => page.select("#preenchimento", "532486"),
  },
  {
    title: "Preenchendo interessado...",
    do: (page, { unidade }) => page.type("#Interessado", unidade.toString()),
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
] as Action[ActionsGerais.AUTUAR_PROCESSO];
