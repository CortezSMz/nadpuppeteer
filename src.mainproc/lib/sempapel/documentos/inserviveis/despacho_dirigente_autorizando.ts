import type { Page } from "puppeteer-core";
import type { Document, DocumentosInserviveis } from "../Document";

export default [
  {
    title: "Indo para inclusão de documento...",
    do: async (page: Page, { processo }: { processo: string }) =>
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
    do: (page: Page) => page.select("#preenchimento", "392010"),
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
    do: (page: Page, { unidade }: { unidade: string }) =>
      page.type(
        "#cke_1_contents > textarea",
        `
            <p>&nbsp;</p>

            <p style="text-align:justify; text-indent:2cm">Senhor Diretor,</p>

            <p style="text-align:justify; text-indent:2cm">Tendo em vista o exposto acima, <strong>AUTORIZO</strong> a doa&ccedil;&atilde;o do material aqui solicitado pela APM da ${unidade}.</p>

            <p style="text-align:justify; text-indent:2cm">Encaminha-se &agrave; Unidade Escolar para que seja lavrada a Ata de recebimento dos materiais doados &agrave; Associa&ccedil;&atilde;o de Pais e Mestres da Unidade Escolar.</p>

            <p style="text-align:justify; text-indent:2cm">Solicitamos que a retirada do material seja realizada no prazo m&aacute;ximo de 15 dias, com juntada do Recibo e, caso n&atilde;o seja poss&iacute;vel, enviar as raz&otilde;es por escrito, devendo retornar os autos a esta Diretoria de Ensino.</p>

            <p>&nbsp;</p>
            `
      ),
  },
  {
    title: "Confirmando despacho...",
    do: (page: Page) =>
      Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("#btnGravar"),
      ]),
  },
  {
    title: "Finalizando...",
    do: (page: Page) =>
      Promise.all([
        page.click("#finalizar"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
] as Document[DocumentosInserviveis.DESPACHO_DIRIGENTE_AUTORIZANDO];
