<template>
  <v-container fluid style="padding: 0">
    <!-- APP-BAR -->
    <v-app-bar app color="secondary" elevation="1" style="padding-top: 5px">
      <v-app-bar-title style="overflow: visible">
        <!-- SELECT ESCOLA -->
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
          label="Selecione uma escola"
          @focus="fetchEscolas"
          style="margin-top: 35px"
        >
          <!-- NO DATA -->
          <template v-slot:no-data style="width: 600px">
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
            <span class="text-h5">{{ item.text }}</span>
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
      <!-- BUTTONS -->
      <v-dialog v-model="dialog" max-width="500px">
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
        <v-card>
          <v-app-bar>
            <v-app-bar-title style="margin: 0 auto">
              <span class="text-h5" style="color: var(--v-accent-base)">{{
                formTitle
              }}</span>
            </v-app-bar-title>

            <template v-slot:extension>
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
                  <v-text-field
                    v-model="processoExistente"
                    label="Número do processo"
                    prepend-inner-icon="fa-hashtag"
                    :rules="[rules.required]"
                    autofocus
                    @keyup="processoExistente = processoExistente.toUpperCase()"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>a</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
            <v-btn color="blue darken-1" text @click="save">
              {{ tabs === 0 ? "Adicionar" : "Autuar" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <!-- TABELA -->
    <v-data-table :headers="headers" :items="processos">
      <template v-slot:[`item.atualizar`]="{ item }">
        <v-icon small @click="atualizarProcesso(item)"> fa-rotate </v-icon>
      </template>
      <template v-slot:[`item.editar`]="{ item }">
        <v-icon small class="mr-2" @click="edit(item)"> fa-pencil </v-icon>
      </template>
      <template v-slot:[`item.deletar`]="{ item }">
        <v-icon small @click="deletarProcesso(item)"> fa-xmark </v-icon>
      </template>
      <template v-slot:no-data>
        Selecione uma escola para visualizar os processos
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

export default Vue.extend({
  name: "Escolas",

  data(): {
    processoExistente: string;
    tabs: number;
    autuar: boolean;
    escola: string;
    rules: { required: (value: string) => boolean | string };
    comboboxEscola: {
      editing: null;
      items: (
        | {
            text: string;
            data: null | {
              processos: {
                [key: string]: {
                  pendencias: string[];
                  documentos: string[];
                  situacao: string[];
                };
              };
            };
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
            [key: string]: {
              pendencias: string[];
              documentos: string[];
              situacao: string[];
            };
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
      processoExistente: "",
      rules: {
        required: (value: string) =>
          /^SEDUC-(?:EXP|PRC)-[0-9]{4}\/[0-9]{4,10}/.test(value) ||
          'Preencher no formato: "SEDUC-EXP-0000/12345678".',
      },
      tabs: 0,
      escola: "",
      autuar: false,
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
      return this.editedIndex === -1
        ? `Adicionar processo\npara ${this.escola}`
        : "Editar processo";
    },
  },

  watch: {
    escola(val, prev): void | Array<unknown> {
      if (!val) return (this.processos = []);

      if (prev === "" || val.length === prev?.length) {
        return this.fillProcessos(val.data.processos);
      }

      if (typeof val === "string") {
        this.escola = val;
        this.comboboxEscola.items.push({
          text: val,
          data: null,
        });
      }
    },

    /*     dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }, */
  },

  methods: {
    fillProcessos(data: {
      processos: {
        [key: string]: {
          pendencias: Array<string>;
          documentos: Array<string>;
          situacao: Array<string>;
        };
      };
    }): void {
      this.processos = Object.entries(data).map((e) => {
        return {
          numero: e[0],
          data: e[1],
        };
      });
    },

    /*     editItem(item: {
      name: string;
      calories: number;
      fat: number;
      carbs: number;
      protein: number;
    }) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item: {
      name: string;
      calories: number;
      fat: number;
      carbs: number;
      protein: number;
    }) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }, */

    del(item: null) {
      this.escola = "";
      this.comboboxEscola.items = this.comboboxEscola.items.filter(
        (i) => i !== item
      );
    },

    edit(item: null) {
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
            data: e[1] as {
              processos: {
                [key: string]: {
                  pendencias: string[];
                  documentos: string[];
                  situacao: string[];
                };
              };
            },
          };
        }),
      ];
    },
  },
});
</script>
