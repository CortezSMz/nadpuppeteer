<template>
  <v-container fluid>
    <!-- APP-BAR -->
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      elevation="0"
      height="50px"
    >
      <v-app-bar-nav-icon>
        <v-icon> fa-bars </v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Inservíveis</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="filtrando = !filtrando">
        <v-icon>fa-filter</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- FILTER -->
    <v-card v-show="filtrando">
      <v-chip-group v-model="chipsEscolas" column multiple>
        <v-chip
          small
          filter
          outlined
          v-for="escola in Object.keys(escolas)"
          :key="escola"
        >
          {{ escola }}
        </v-chip>
      </v-chip-group>
      <v-card-actions> </v-card-actions>
    </v-card>

    <br />
    <!-- CARDS -->
    <v-expansion-panels accordion popout>
      <v-expansion-panel v-for="[nome, dados] of filtro" :key="nome">
        <v-expansion-panel-header disable-icon-rotate>
          <template v-slot:default>
            <v-row no-gutters>
              <v-col cols="10">
                {{ nome }}
              </v-col>
              <v-col cols="2">
                {{ Object.keys(dados.processos).length }} processo{{
                  Object.keys(dados.processos).length > 1 ? "s" : ""
                }}
              </v-col>
            </v-row>
          </template>
          <template v-slot:actions>
            <v-icon small> fa-folder </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row dense align="center" justify="center">
            <v-col
              cols="6"
              v-for="[numero, dados] in Object.entries(dados.processos)"
              :key="numero"
            >
              <v-card class="mx-auto">
                <v-card-title> {{ numero }} </v-card-title>
                <v-card-actions>
                  <v-row>
                    <v-col cols="12">
                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            Pendências
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            {{ dados.pendencias }}
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            Situação
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            {{ dados.situacao }}
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                        <v-expansion-panel>
                          <v-expansion-panel-header>
                            Documentos
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            {{ dados.documentos }}
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :ref="`select-${numero}`"
                        :items="items"
                        item-text="nome"
                        item-value="value"
                        label="Incluir documento"
                        dense
                        outlined
                        prepend-inner-icon="fa-file"
                        append-outer-icon="fa-plus"
                        @click:append-outer="incluirDocumento(nome, numero)"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style>
.v-app-bar-title__content {
  width: 200px !important;
}
</style>

<script lang="ts">
import Vue from "vue";

import { ipcRenderer } from "electron";
import { Escolas } from "@/main";
declare var api: {
  incluir: (
    password: string,
    unidade: string,
    processo: string,
    doc: string
  ) => void;
  pegarDados: (unidade: string, processo: string) => void;
};

export default Vue.extend({
  name: "Processos",

  methods: {
    incluirDocumento(unidade: string, numero: string) {
      const doc = (this.$refs["select-" + numero] as Array<Vue>)[0]?.$data
        .selectedItems[0]?.value;

      if (doc === "PEGAR_DADOS") return api.pegarDados(unidade, numero);

      api.incluir(
        this.$root.$data.credentials.sempapel.password,
        unidade,
        numero,
        doc
      );
    },
  },

  data() {
    return {
      escolas: this.$root.$data.escolas,
      filtrando: false,
      chipsEscolas: [
        ...Array(Object.keys(this.$root.$data.escolas).length).keys(),
      ],
      items: [
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
        { nome: "Encaminhar para escola", value: "ENCAMINHAR_PARA_ESCOLA" },
        {
          nome: "Despacho Dirigente - Solicitando confirmacao de retirada",
          value: "DESPACHO_DIRIGENTE_CONFIRMACAO",
        },
        {
          nome: "Informacao CAF - Autorizando baixa contabil",
          value: "INFORMACAO_CAF_AUTORIZANDO_BAIXA",
        },
        {
          nome: "Pegar dados",
          value: "PEGAR_DADOS",
        },
      ],
    };
  },

  computed: {
    filtro(): Array<unknown> {
      return this.chipsEscolas.map(
        (i: number) => Object.entries(this.escolas)[i]
      );
    },
  },
});
</script>
