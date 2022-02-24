<template>
  <v-container fluid style="padding: 0">
    <!-- APP-BAR -->
    <v-app-bar app color="secondary" elevation="1" style="padding-top: 5px">
      <!-- SELECT ESCOLA -->
      <v-app-bar-title style="overflow: visible">
        <v-combobox
          v-model="escola"
          :filter="filter"
          :hide-no-data="!comboboxEscola.search"
          :items="comboboxEscola.items"
          :search-input.sync="comboboxEscola.search"
          auto-select-first
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
              v-if="comboboxEscola.editing === item"
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
                      @keyup="
                        editedItem.numero = editedItem.numero.toUpperCase()
                      "
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
    <v-data-table :headers="headers" :items="processos">
      <template v-slot:[`item.atualizar`]="{ item }">
        <v-icon small @click="atualizarProcesso(escola.text, item)">
          fa-rotate
        </v-icon>
      </template>
      <template v-slot:[`item.editar`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(escola.text, item)">
          fa-pencil
        </v-icon>
      </template>
      <template v-slot:[`item.deletar`]="{ item }">
        <v-icon small @click="deletarProcesso(escola.text, item)">
          fa-xmark
        </v-icon>
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

interface DataEscola {
  processos: {
    [key: string]: {
      pendencias: string[];
      documentos: string[];
      situacao: string[];
    };
  };
}

export default Vue.extend({
  name: "Escolas",

  data(): {
    autuar: {
      mapaDeArrolamento: null;
      informacaoDiretor: null;
      documentacaoApm: null;
    };
    processoExistente: string;
    tabs: number;
    escola: null | { text: string };
    rules: {
      processo: (value: string) => boolean | string;
      required: (value: unknown) => boolean | string;
      fileSize: (value: { size: number }) => boolean | string;
    };
    comboboxEscola: {
      editing: null;
      items: (
        | {
            text: string;
            data?: DataEscola;
          }
        | {
            header: string;
          }
      )[];
      search: null;
    };
    dialog: boolean;
    dialogDelete: boolean;
    headers: {
      text?: string;
      value?: string;
      align?: string;
      width?: number;
      divider?: boolean;
      sortable?: boolean;
    }[];
    processos:
      | {
          numero: string;
          data: {
            pendencias: string[];
            documentos: string[];
            situacao: string[];
          };
        }[]
      | [];
    editedIndex: number;
    editedItem: {
      numero: string;
    };
    defaultItem: {
      numero: string;
    };
  } {
    return {
      autuar: {
        mapaDeArrolamento: null,
        informacaoDiretor: null,
        documentacaoApm: null,
      },
      processoExistente: "",
      rules: {
        processo: (value) =>
          /^SEDUC-(?:EXP|PRC)-[0-9]{4}\/[0-9]{4,10}$/.test(value) ||
          'Preencher no formato: "SEDUC-EXP-0000/12345678".',
        required: (value) => !!value || "Obrigatório.",
        fileSize: (value) =>
          !value || value.size < 1e7 || "Arquivo deve ser menor que 10MB",
      },
      tabs: 1,
      escola: null,
      comboboxEscola: {
        editing: null,
        items: [
          {
            header:
              "Selecione a escola ou comece a digitar para criar uma nova",
          },
        ],
        search: null,
      },
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Processos",
          align: "start",
          value: "numero",
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
        this.escola = { text: val };
        // this.comboboxEscola.items.push(val);
        // TODO: refactor so it push to DB
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

    atualizarProcesso(escola: string, processo: { numero: string }) {
      console.log(escola, processo.numero);
    },

    editItem(escola: string, item: { numero: string }) {
      this.tabs = 0;
      this.editedIndex = this.processos.findIndex(
        (p) => item.numero === p.numero
      );
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deletarProcesso(escola: string, processo: { numero: string }) {
      this.editedIndex = this.processos.findIndex(
        (p) => processo.numero === p.numero
      );
      this.editedItem = Object.assign({}, processo);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.processos.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
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
        console.log("autuando");
        console.log(this.autuar);

        return;
      }
      if (this.editedIndex > -1) {
        if (!this.$refs.formNumeroProcesso.validate()) return;
        Object.assign(this.processos[this.editedIndex], this.editedItem);
      } else {
        this.processos.push(this.editedItem as unknown as never);
      }
      this.close();
    },

    del(item: null) {
      this.escola = null;
      this.comboboxEscola.items = this.comboboxEscola.items.filter(
        (i) => i !== item
      );
    },

    edit(escola: string, item: null) {
      if (!this.comboboxEscola.editing) {
        this.comboboxEscola.editing = item;
      } else {
        this.comboboxEscola.editing = null;
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
        ...this.comboboxEscola.items,
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
