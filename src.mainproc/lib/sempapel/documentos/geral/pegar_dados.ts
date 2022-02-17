import type { Page } from "puppeteer-core";
import { Document, DocumentosGerais } from "../Document";

export default [
  {
    title: "Indo para Folha Líder...",
    do: (page: Page, { processo }: { processo: string }) =>
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
    title: "Copiando documentos juntados...",
    do: async (page) => {
      const documentos = await page.$$eval(
        "#page > div.row.mt-2 > div.col.col-sm-12.col-md-8 > div > div.gt-content-box.gt-for-table > table > tbody > tr",
        (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("td");
            return Array.from(columns, (column) => column.innerText);
          });
        }
      );

      return { documentos };
    },
  },
  {
    title: "Copiando situação...",
    do: async (page) => {
      const situacao = await page.$$eval(
        "#collapseOutrosMob > div > table > tbody > tr",
        (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("td");
            return Array.from(columns, (column) => column.innerText);
          });
        }
      );

      return { situacao };
    },
  },
  {
    title: "Copiando pendências...",
    do: async (page) => {
      const pendencias = await page.evaluate(() => {
        const elements = [];

        const div = document.getElementById("collapsePendencias");
        if (!div) return [];

        for (const element of div.children) {
          if (element)
            elements.push([
              element.toString().replace(/\[object\s|]/g, ""),
              element.textContent.replace(/\t|\n/g, ""),
            ]);
        }

        return elements;
      });

      return { pendencias };
    },
  },
] as Document[DocumentosGerais.PEGAR_DADOS];
