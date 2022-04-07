<template>
  <v-container fluid style="padding: 0">
    <!-- APP-BAR -->
    <v-app-bar app color="secondary" elevation="1" style="padding-top: 5px">
      <!-- GO LEFT -->
      <v-btn icon light color="accent" @click="goLeft">
        <v-icon>fa-circle-left</v-icon>
      </v-btn>
      <v-app-bar-title style="overflow: visible; width: 640px">
        <!-- SELECT ESCOLA -->
        <v-combobox
          v-model="escola"
          :filter="filter"
          :hide-no-data="!comboboxEscola.search"
          :items="comboboxEscola.items"
          :search-input.sync="comboboxEscola.search"
          clearable
          height="40px"
          clear-icon="fa-xmark"
          :label="!escola ? 'Selecione uma escola' : 'Visualizando'"
          @focus="fetchEscolas"
          style="margin-top: 35px"
        >
          <!-- NO DATA -->
          <template v-slot:no-data>
            <v-list-item>
              <span class="subheading">
                Pressione <strong>enter</strong> para criar escola com nome:
              </span>
            </v-list-item>
            <v-list-item>
              <strong>{{ comboboxEscola.search }}</strong>
            </v-list-item>
          </template>
          <!-- SELECTION -->
          <template v-slot:selection="{ item }">
            <span class="text-h6">{{ item.text }}</span>
          </template>
          <!-- ITEM LIST -->
          <template v-slot:item="{ item }">
            <!-- EDITING FIELD -->
            <v-text-field
              v-if="
                comboboxEscola.editing &&
                comboboxEscola.editing.text === item.text
              "
              v-model="comboboxEscola.editing.text"
              autofocus
              flat
              background-color="secondary"
              label="Editar nome"
              hide-details
              @keyup.enter="edit(item)"
            ></v-text-field>
            <!-- NOT EDITING -->
            <span v-else> {{ item.text }} </span>
            <v-spacer></v-spacer>
            <!-- EDIT BUTTON -->
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="edit(item)">
                <v-icon>{{
                  comboboxEscola.editing !== item ? "fa-pencil" : "fa-check"
                }}</v-icon>
              </v-btn>
            </v-list-item-action>
            <!-- DEL BUTTON -->
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="del(item)">
                <v-icon>fa-xmark</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
      </v-app-bar-title>
      <!-- GO RIGHT -->
      <v-btn icon light color="accent" @click="goRight">
        <v-icon>fa-circle-right</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <!-- ADICIONAR/EDITAR PROCESSO DIALOG -->
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="accent"
            class="mb-2"
            v-bind="attrs"
            v-on="on"
            :disabled="!escola"
          >
            <v-icon left>fa-plus</v-icon> PROCESSO
          </v-btn>
        </template>
        <!-- DIALOG CARD -->
        <v-card>
          <v-app-bar>
            <v-app-bar-title style="margin: 0 auto">
              <span class="text-h5" style="color: var(--v-accent-base)">{{
                formTitle
              }}</span>
            </v-app-bar-title>

            <template v-slot:extension v-if="this.editedIndex === -1">
              <v-tabs v-model="tabs" centered color="accent" grow>
                <v-tab> Existente </v-tab>
                <v-tab> Autuar novo </v-tab>
              </v-tabs>
            </template>
          </v-app-bar>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-form ref="formNumeroProcesso" lazy-validation>
                    <v-text-field
                      v-model="editedItem.numero"
                      label="Número do processo"
                      prepend-inner-icon="fa-hashtag"
                      :rules="[rules.processo]"
                      autofocus
                      v-upper-case
                    ></v-text-field>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-form ref="formAutuarProcesso" lazy-validation>
                    <!-- MAPA DE ARROLAMENTO -->
                    <v-file-input
                      :rules="[rules.fileSize, rules.required]"
                      v-model="autuar.mapaDeArrolamento"
                      truncate-length="50"
                      accept=".pdf"
                      outlined
                      label="Mapa de Arrolamento"
                      show-size
                    >
                    </v-file-input>
                    <!-- INFORMAÇÃO DIRETOR -->
                    <v-file-input
                      :rules="[rules.fileSize, rules.required]"
                      v-model="autuar.informacaoDiretor"
                      truncate-length="50"
                      accept=".pdf"
                      outlined
                      label="Informação diretor"
                      show-size
                    >
                    </v-file-input>
                    <!-- DOCUMENTAÇÃO APM -->
                    <v-file-input
                      :rules="[rules.fileSize, rules.required]"
                      v-model="autuar.documentacaoApm"
                      truncate-length="50"
                      accept=".pdf"
                      outlined
                      label="Documentação APM"
                      show-size
                    >
                    </v-file-input>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" text @click="close"> Cancelar </v-btn>
            <v-btn color="accent" text @click="save">
              {{
                tabs === 0
                  ? this.editedIndex === -1
                    ? "Adicionar"
                    : "Salvar"
                  : "Autuar"
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- CONFIRM DELETE DIALOG -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 text-center"
            >Você tem certeza que deseja parar de<br />
            seguir esse processo?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="accent" text @click="deleteItemConfirm">Sim</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <!-- TABELA -->
    <v-data-table
      :headers="headers"
      :items="processos"
      :options.sync="tableOptions"
      :expanded.sync="expanded"
      item-key="numero"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0">
          <v-container>
            <v-card flat>
              <v-card-subtitle>
                <span>
                  Última vez atualizado:
                  {{ getTimeUpdate(item.data.lastUpdate) }}
                </span>
              </v-card-subtitle>
              <!-- Ações -->
              <v-select
                v-model="documentoParaIncluir"
                :items="documentosIncluir"
                item-text="nome"
                item-value="value"
                label="Incluir documento"
                dense
                outlined
                prepend-inner-icon="fa-file"
                append-outer-icon="fa-plus"
                @click:append-outer="incluirDocumento(item)"
              ></v-select>
              <!-- SITUAÇÃO -->
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  icon
                  @click="
                    expandedCardModel.situacao = !expandedCardModel.situacao
                  "
                >
                  <v-icon>{{
                    expandedCardModel.situacao
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }}</v-icon>
                </v-btn>
                Situação
              </v-card-actions>

              <v-expand-transition>
                <div v-show="expandedCardModel.situacao">
                  <v-divider></v-divider>

                  <v-card-text>
                    <v-list-item
                      v-for="situacao in item.data.situacao"
                      :key="situacao.join('')"
                    >
                      <v-icon small left>fa-caret-right</v-icon>
                      {{ situacao.filter((s) => !!s.trim()).join(" - ") }}
                    </v-list-item>
                  </v-card-text>
                </div>
              </v-expand-transition>

              <!-- PENDÊNCIAS -->
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  icon
                  @click="
                    expandedCardModel.pendencias = !expandedCardModel.pendencias
                  "
                >
                  <v-icon>{{
                    expandedCardModel.pendencias
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }}</v-icon>
                </v-btn>

                Pendências
              </v-card-actions>

              <v-expand-transition>
                <div v-show="expandedCardModel.pendencias">
                  <v-divider></v-divider>

                  <v-card-text>
                    <v-treeview
                      :items="parsePendencias(item.data.pendencias)"
                      open-all
                      hoverable
                      item-key="name"
                    >
                      <template v-slot:prepend="{ item, open }">
                        <v-icon v-if="!item.file">
                          {{ open ? "fa-folder-open" : "fa-folder" }}
                        </v-icon>
                        <v-icon v-else> fa-file </v-icon>
                      </template>
                      <template v-slot:append="{ item }">
                        <v-row v-if="item.file">
                          <v-col>
                            <v-btn small>
                              <v-img
                                style="margin-right: 5px"
                                src="https://www.documentos.spsempapel.sp.gov.br/siga/css/famfamfam/icons/eye.png"
                              ></v-img>
                              <span> Visualizar</span>
                            </v-btn>
                          </v-col>
                          <v-col>
                            <v-btn small>
                              <v-img
                                style="margin-right: 5px"
                                src="https://www.documentos.spsempapel.sp.gov.br/siga/css/famfamfam/icons/page_white_go.png"
                              ></v-img>
                              <span> Juntar</span>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </template>
                    </v-treeview>
                  </v-card-text>
                </div>
              </v-expand-transition>
              <!-- DOCUMENTOS -->
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  icon
                  @click="
                    expandedCardModel.documentos = !expandedCardModel.documentos
                  "
                >
                  <v-icon>{{
                    expandedCardModel.documentos
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }}</v-icon>
                </v-btn>

                Documentos
              </v-card-actions>

              <v-expand-transition>
                <div v-show="expandedCardModel.documentos">
                  <v-divider></v-divider>

                  <v-card-text>
                    <v-simple-table fixed-header dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>Tempo</th>
                            <th>Unidade</th>
                            <th>Evento</th>
                            <th>Descrição</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="[tempo, unidade, evento, descricao] in item
                              .data.documentos"
                            :key="descricao"
                          >
                            <td>{{ tempo }}</td>
                            <td>{{ unidade }}</td>
                            <td>{{ evento }}</td>
                            <td>{{ descricao }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </div>
              </v-expand-transition>
              <v-divider></v-divider>
            </v-card>
          </v-container>
        </td>
      </template>
      <template v-slot:[`item.situacao`]="{ item }">
        {{
          item.data && item.data.situacao.length > 0
            ? item.data.situacao.map((s) =>
                s
                  .slice(1, s.length - 1)
                  .filter((s) => !!s)
                  .join(" - ")
              )[0]
            : "-"
        }}
      </template>
      <template v-slot:[`item.pendencias`]="{ item }">
        <!-- {{
          item.data && item.data.pendencias.length > 0
            ? item.data.pendencias
                .find((p) => p[0].includes("UListElement"))[1]
                .split(" ")
                .filter((p) => !!p).length
            : "0"
        }} -->
        {{
          item.data.pendencias.reduce((a, c) => {
            return a + Object.entries(c)[0][1].length;
          }, 0)
        }}
      </template>
      <template v-slot:[`item.atualizar`]="{ item }">
        <v-icon small @click="atualizarDados(escola.text, item.numero)">
          fa-rotate
        </v-icon>
      </template>
      <template v-slot:[`item.editar`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> fa-pencil </v-icon>
      </template>
      <template v-slot:[`item.deletar`]="{ item }">
        <v-icon small @click="deletarProcesso(item)"> fa-xmark </v-icon>
      </template>
      <template v-slot:no-data>
        {{ noData }}
      </template>
    </v-data-table>
  </v-container>
</template>

<style>
.v-app-bar-title__content {
  width: 600px !important;
}
</style>

<script lang="ts">
import Vue from "vue";
import moment from "moment";

import { ipcRenderer } from "electron";
declare var api: {
  incluir: (
    username: string,
    password: string,
    unidade: string,
    processo: string,
    doc: string
  ) => void;
  atualizarDados: (unidade: string, processo: string) => void;
  setEscola: (unidade: string, dados: unknown) => void;
  delEscola: (unidade: string) => void;
  editEscola: (oldUnidade: string, newUnidade: string) => void;
  addProcesso: (unidade: string, processo: string) => void;
  delProcesso: (unidade: string, processo: string) => void;
  autuarProcesso: (
    username: string,
    password: string,
    unidade: string,
    docs: {
      mapaDeArrolamento: string;
      informacaoDiretor: string;
      documentacaoApm: string;
    }
  ) => void;
  editProcesso: (
    unidade: string,
    oldProcesso: string,
    newProcesso: string
  ) => void;
};

interface DataEscola {
  processos: {
    [key: string]: {
      pendencias: { [key: string]: Array<string> }[];
      documentos: Array<string[]>;
      situacao: Array<string[]>;
      lastUpdate: number;
    };
  };
}

export default Vue.extend({
  name: "Escolas",

  data(): {
    documentoParaIncluir: any;
    documentosIncluir: {
      nome: string;
      value: string;
    }[];
    autuar: {
      mapaDeArrolamento: null | { path: string };
      informacaoDiretor: null | { path: string };
      documentacaoApm: null | { path: string };
    };
    tabs: number;
    escola: null | { text: string; data?: DataEscola };
    rules: {
      processo: (value: string) => boolean | string;
      required: (value: unknown) => boolean | string;
      fileSize: (value: { size: number }) => boolean | string;
    };
    comboboxEscola: {
      editing: null;
      editingOld: null | string;
      items: {
        text?: string;
        data?: DataEscola;
        header?: string;
      }[];
      search: null;
    };
    dialog: boolean;
    dialogDelete: boolean;
    tableOptions: Record<string, unknown>;
    expanded: Array<unknown>;
    expandedCardModel: {
      pendencias: boolean;
      documentos: boolean;
      situacao: boolean;
    };
    headers: {
      text: string;
      value: string;
      align?: "start" | "center" | "end";
      sortable?: boolean;
      filterable?: boolean;
      groupable?: boolean;
      divider?: boolean;
      class?: string | string[];
      cellClass?: string | string[];
      width?: string | number;
      filter?: (value: unknown, search: string, item: unknown) => boolean;
      sort?: (a: unknown, b: unknown) => number;
    }[];
    processos:
      | {
          numero: string;
          data: {
            pendencias: { [key: string]: string[] }[];
            documentos: string[][];
            situacao: string[][];
            lastUpdate: number;
          };
        }[];
    editedIndex: number;
    editedItemOld: {
      numero: string;
    };
    editedItem: {
      numero: string;
    };
    defaultItem: {
      numero: string;
    };
  } {
    return {
      documentoParaIncluir: null,
      documentosIncluir: [
        { nome: "Informacao EAMEX", value: "INFORMACAO_EAMEX" },
        {
          nome: "Despacho Dirigente - Verifique material arrolado",
          value: "DESPACHO_DIRIGENTE_VERIFIQUE",
        },
        {
          nome: "Informação CAF - Sem impedimento legal",
          value: "INFORMACAO_CAF_SEM_IMPEDIMENTO_LEGAL",
        },
        {
          nome: "Despacho Dirigente - Autorizando desfazimento",
          value: "DESPACHO_DIRIGENTE_AUTORIZANDO",
        },
        // { nome: "Encaminhar para escola", value: "ENCAMINHAR_PARA_ESCOLA" },
        {
          nome: "Despacho Dirigente - Solicitando confirmacao de retirada",
          value: "DESPACHO_DIRIGENTE_CONFIRMACAO",
        },
        {
          nome: "Informacao CAF - Autorizando baixa contabil",
          value: "INFORMACAO_CAF_AUTORIZANDO_BAIXA",
        },
      ],
      autuar: {
        mapaDeArrolamento: null,
        informacaoDiretor: null,
        documentacaoApm: null,
      },
      rules: {
        processo: (value) =>
          /^SEDUC-(?:EXP|PRC)-[0-9]{4}\/[0-9]{4,10}$/.test(value) ||
          'Preencher no formato: "SEDUC-EXP-0000/12345678".',
        required: (value) => !!value || "Obrigatório.",
        fileSize: (value) =>
          !value || value.size < 1e7 || "Arquivo deve ser menor que 10MB",
      },
      tabs: 0,
      escola: null,
      comboboxEscola: {
        editing: null,
        editingOld: null,
        items: [],
        search: null,
      },
      dialog: false,
      dialogDelete: false,
      tableOptions: {},
      expanded: [],
      expandedCardModel: {
        pendencias: false,
        documentos: false,
        situacao: false,
      },
      headers: [
        {
          text: "",
          value: "data-table-expand",
          align: "center",
          width: 10,
          sortable: false,
        },
        {
          text: "Processos",
          align: "start",
          value: "numero",
          divider: true,
        },
        {
          text: "Situação",
          align: "start",
          value: "situacao",
          divider: true,
        },
        {
          text: "Pendências",
          value: "pendencias",
          align: "center",
          width: 110,
          divider: true,
        },
        {
          text: "Editar",
          value: "editar",
          align: "center",
          width: 10,
          divider: true,
          sortable: false,
        },
        {
          text: "Atualizar",
          value: "atualizar",
          align: "center",
          width: 10,
          divider: true,
          sortable: false,
        },
        {
          text: "Deletar",
          value: "deletar",
          align: "center",
          width: 10,
          divider: true,
          sortable: false,
        },
      ],
      processos: [],
      editedIndex: -1,
      editedItemOld: {
        numero: "",
      },
      editedItem: {
        numero: "",
      },
      defaultItem: {
        numero: "",
      },
    };
  },

  computed: {
    formTitle(): string {
      return this.editedIndex !== -1
        ? `Editar número do processo`
        : `Adicionar processo ${this.escola ? `para ${this.escola.text}` : ""}`;
    },
    noData(): string {
      return this.escola
        ? "Você ainda não está seguindo nenhum processo desta escola"
        : "Selecione uma escola para visualizar os processos";
    },
  },

  watch: {
    escola(
      val:
        | string
        | {
            text: string;
            data?: DataEscola;
          },
      prev: {
        text: string;
        data?: DataEscola;
      }
    ): void | Array<unknown> {
      if (val == null || !val) {
        return (this.processos = []);
      }

      if (typeof val === "string") {
        this.escola = { text: val, data: undefined };

        api.setEscola(val, { processos: {} });
      }

      if (typeof val === "object" && val.text !== prev?.text) {
        this.fillProcessos(val.data);
      }
    },

    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    incluirDocumento(item: { numero: string }) {
      api.incluir(
        this.$root.$data.credentials.sempapel.username,
        this.$root.$data.credentials.sempapel.password,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.escola!.text,
        item.numero,
        this.documentoParaIncluir
      );
    },
    atualizarDados(unidade: string, numero: string): void {
      api.atualizarDados(unidade, numero);
    },
    goLeft() {
      this.fetchEscolas();

      const escolas = this.comboboxEscola.items.filter((es) => !es.header);

      if (!this.escola)
        return (this.escola = escolas[escolas.length - 1] as {
          text: string;
          data?: DataEscola;
        });

      const i = escolas.findIndex((e) => e.text === this.escola?.text);

      this.escola = escolas[i - 1] as { text: string; data?: DataEscola };
    },
    goRight() {
      this.fetchEscolas();

      const escolas = this.comboboxEscola.items.filter((es) => !es.header);

      const i = escolas.findIndex((e) => e.text === this.escola?.text);

      this.escola = escolas[i + 1] as { text: string; data?: DataEscola };
    },
    parsePendencias(pendencias: Array<Array<Array<string>>>) {
      if (!pendencias.length) return [];
      let parsed;

      parsed = pendencias.map((p) => Object.entries(p)[0]);

      parsed = parsed.map((p) => {
        return {
          name: p[0],
          children: p[1].map((c) => {
            return {
              name: c,
              file: true,
            };
          }),
        };
      });

      return parsed;
    },
    getTimeUpdate(ms: number) {
      moment.updateLocale("pt-br", {});
      return moment(ms).calendar();
    },

    fillProcessos(data: DataEscola | undefined): void | Array<unknown> {
      if (!data) {
        return (this.processos = []);
      }

      this.processos = Object.entries(data.processos).map((e) => {
        return {
          numero: e[0],
          data: e[1],
        };
      });
    },

    editItem(item: { numero: string }) {
      console.log(item);
      this.tabs = 0;
      this.editedIndex = this.processos.findIndex(
        (p) => item.numero === p.numero
      );
      this.editedItemOld = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deletarProcesso(processo: { numero: string }) {
      this.editedIndex = this.processos.findIndex(
        (p) => processo.numero === p.numero
      );
      this.editedItem = Object.assign({}, processo);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.processos.splice(this.editedIndex, 1);

      if (this.escola)
        api.delProcesso(this.escola?.text, this.editedItem.numero);

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItemOld = Object.assign({}, this.defaultItem);
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save(): void {
      if (this.tabs === 1) {
        if (!this.$refs.formAutuarProcesso.validate()) return;

        api.autuarProcesso(
          this.$root.$data.credentials.sempapel.username,
          this.$root.$data.credentials.sempapel.password,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.escola!.text,
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mapaDeArrolamento: this.autuar.mapaDeArrolamento!.path,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            informacaoDiretor: this.autuar.informacaoDiretor!.path,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            documentacaoApm: this.autuar.documentacaoApm!.path,
          }
        );

        this.close();
        return;
      }

      if (this.editedIndex > -1) {
        if (!this.$refs.formNumeroProcesso.validate()) return;
        Object.assign(this.processos[this.editedIndex], this.editedItem);

        api.editProcesso(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.escola!.text,
          this.editedItemOld.numero,
          this.editedItem.numero
        );
      } else {
        if (!this.$refs.formNumeroProcesso.validate()) return;
        this.processos.push(
          Object.assign(this.editedItem, {
            data: {
              pendencias: [],
              documentos: [],
              situacao: [],
              lastUpdate: 0,
            },
          })
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        api.addProcesso(this.escola!.text, this.editedItem.numero);
      }
      this.close();
    },

    del(escola: { text: string }) {
      this.escola = null;

      this.comboboxEscola.items = this.comboboxEscola.items.filter(
        (i) => i.text !== escola.text
      );

      api.delEscola(escola.text);
    },

    edit(escola: null) {
      if (!this.comboboxEscola.editing) {
        this.comboboxEscola.editing = escola;
        this.comboboxEscola.editingOld = (
          escola as unknown as { text: string }
        ).text;
      } else {
        if (this.comboboxEscola.editingOld)
          api.editEscola(
            this.comboboxEscola.editingOld,
            (this.comboboxEscola.editing as unknown as { text: string }).text
          );

        this.comboboxEscola.editing = null;
        this.comboboxEscola.editingOld = null;
      }
    },

    filter(
      item: { header: string | undefined },
      queryText: string,
      itemText: string
    ) {
      if (item.header) return false;

      const hasValue = (val: string) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },

    fetchEscolas() {
      this.comboboxEscola.items = [
        {
          header: "Selecione a escola ou comece a digitar para criar uma nova",
        },
        ...Object.entries(this.$root.$data.escolas).map((e) => {
          return {
            text: e[0],
            data: e[1] as DataEscola,
          };
        }),
      ];
    },
  },
});
</script>
