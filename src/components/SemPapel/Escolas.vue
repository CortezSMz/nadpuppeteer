<template>
  <v-container fluid style="padding: 0">
    <!-- APP-BAR -->
    <v-app-bar app clipped-left color="secondary" elevation="1">
      <v-app-bar-nav-icon>
        <v-icon> fa-bars </v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Escolas</v-app-bar-title>
    </v-app-bar>

    <!-- CONTENT -->
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="10">
        <!-- ESCOLA -->
        <v-combobox
          v-model="comboboxEscola.model"
          :filter="filterEscola"
          :hide-no-data="!comboboxEscola.search"
          :items="comboboxEscola.items"
          :search-input.sync="comboboxEscola.search"
          clearable
          clear-icon="fa-xmark"
          label="Escola"
          filled
          @focus="fetchEscolas"
        >
          <template v-slot:prepend-inner>
            <v-icon style="padding: 0 5px">fa-school</v-icon>
          </template>
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
            {{ item.text }}
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
              <v-btn icon @click.stop.prevent="editEscola(item)">
                <v-icon>{{
                  comboboxEscola.editing !== item ? "fa-pencil" : "fa-check"
                }}</v-icon>
              </v-btn>
            </v-list-item-action>
            <!-- DEL BUTTON -->
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="delEscola(item)">
                <v-icon>fa-xmark</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>

        <!-- PROCESSOS -->
        <v-combobox
          v-model="comboboxProcesso.model"
          :disabled="!comboboxEscola.model"
          :filter="filterEscola"
          :hide-no-data="!comboboxProcesso.search"
          :items="comboboxProcesso.items"
          :search-input.sync="comboboxProcesso.search"
          clearable
          clear-icon="fa-xmark"
          open-on-clear
          label="Processos"
          filled
          @focus="fetchProcessos"
        >
          <template v-slot:prepend-inner>
            <v-icon style="padding: 0 5px">fa-school</v-icon>
          </template>
          <!-- NO DATA -->
          <template v-slot:no-data>
            <v-list-item>
              <span class="subheading">
                Pressione <strong>enter</strong> para criar escola com nome:
              </span>
            </v-list-item>
            <v-list-item>
              <strong>{{ comboboxProcesso.search }}</strong>
            </v-list-item>
          </template>
          <!-- SELECTION -->
          <template v-slot:selection="{ item }">
            {{ item.text }}
          </template>
          <!-- ITEM LIST -->
          <template v-slot:item="{ item }">
            <!-- EDITING FIELD -->
            <v-text-field
              v-if="comboboxProcesso.editing === item"
              v-model="comboboxProcesso.editing.text"
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
              <v-btn icon @click.stop.prevent="editEscola(item)">
                <v-icon>{{
                  comboboxProcesso.editing !== item ? "fa-pencil" : "fa-check"
                }}</v-icon>
              </v-btn>
            </v-list-item-action>
            <!-- DEL BUTTON -->
            <v-list-item-action @click.stop>
              <v-btn icon @click.stop.prevent="delEscola(item)">
                <v-icon>fa-xmark</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-app-bar-title__content {
  width: 200px !important;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Escolas",

  data() {
    return {
      comboboxEscola: {
        editing: null,
        items: [{ header: "" }, { text: "" }],
        model: "",
        search: null,
      },
      comboboxProcesso: {
        editing: null,
        items: [{ header: "" }, { text: "" }],
        model: "",
        search: null,
      },
    };
  },

  watch: {
    escola(val, prev) {
      console.log(val, prev);
      if (!val || val.length === prev?.length) return;

      if (typeof val === "string") {
        this.comboboxEscola.model = val;
        this.comboboxEscola.items.push({
          text: val,
        });
      }
    },
  },

  methods: {
    delEscola(item: null) {
      this.comboboxEscola.model = "";
      this.comboboxEscola.items = this.comboboxEscola.items.filter(
        (i) => i !== item
      );
    },

    editEscola(item: null) {
      if (!this.comboboxEscola.editing) {
        this.comboboxEscola.editing = item;
      } else {
        this.comboboxEscola.editing = null;
      }
    },

    filterEscola(
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
        { header: "Selecione a escola ou digite para criar uma nova" },
        ...Object.entries(this.$root.$data.escolas).map((e) => {
          return { text: e[0], data: e[1] };
        }),
      ];
    },

    fetchProcessos() {
      if (this.comboboxEscola.model === "") return [];
      this.comboboxProcesso.items = [
        ...Object.entries(
          (this.comboboxEscola.model as any).data.processos
        ).map((p) => {
          return { text: p[0], data: p[1] };
        }),
      ];
    },
  },
});
</script>
