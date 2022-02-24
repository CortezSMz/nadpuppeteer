<template>
  <v-container fluid style="padding: 0">
    <!-- APP-BAR -->
    <v-app-bar app clipped-left color="secondary" elevation="1">
      <v-app-bar-nav-icon>
        <v-icon> fa-bars </v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Processos Inservíveis</v-app-bar-title>
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

    <br v-if="filtrando" />
    <!-- ESCOLAS -->
    <v-expansion-panels accordion hover>
      <v-expansion-panel v-for="[nome, dados] of filtro" :key="nome">
        <v-expansion-panel-header disable-icon-rotate>
          <template v-slot:default>
            <v-row no-gutters>
              <v-col cols="8">
                {{ nome }}
              </v-col>
              <v-col cols="2">
                {{ Object.keys(dados.processos).length }} processo{{
                  Object.keys(dados.processos).length > 1 ? "s" : ""
                }}
              </v-col>
              <v-col cols="2">
                {{
                  Object.values(dados.processos)
                    .map((p) => p.pendencias.length)
                    .reduce((t, c) => t + c)
                }}
                pendencias
              </v-col>
            </v-row>
          </template>
          <template v-slot:actions>
            <v-icon small> fa-graduation-cap </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- PROCESSOS -->
          <v-expansion-panels hover>
            <v-expansion-panel
              v-for="[numero, dados] in Object.entries(dados.processos)"
              :key="numero"
            >
              <!-- HEADER -->
              <v-expansion-panel-header disable-icon-rotate>
                <template v-slot:default>
                  <v-row no-gutters class="text-center">
                    <!-- NUMERO DO PROCESSO -->
                    <v-col cols="4" class="text-left">
                      <a
                        target="_blank"
                        :href="`https://www.documentos.spsempapel.sp.gov.br/sigaex/app/expediente/doc/exibir?sigla=${numero}`"
                        >{{ numero }}</a
                      >
                    </v-col>
                    <!-- SITUAÇÃO -->
                    <v-col cols="3">
                      {{ dados.situacao[0][1] }}
                    </v-col>
                    <!-- DOCUMENTOS PENDENTES -->
                    <v-col cols="2">
                      {{ dados.pendencias.length }} pendencias
                    </v-col>
                    <!-- ÚLTIMO UPDATE -->
                    <v-col cols="3">
                      Último update: {{ getTimeUpdate(dados.lastUpdate) }}
                    </v-col>
                  </v-row>
                </template>
                <!-- HEADER ICON -->
                <template v-slot:actions>
                  <v-icon small> fa-folder </v-icon>
                </template>
              </v-expansion-panel-header>
              <!-- CONTENT -->
              <v-expansion-panel-content>
                <template v-slot:default>
                  <!-- INCLUIR DOCUMENTO -->
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
                  <!-- ATUALIZAR -->
                  <v-btn @click="atualizarDados(nome, numero)"
                    >ATUALIZAR PROCESSO</v-btn
                  >
                  <!-- PENDENCIAS -->
                  {{ dados.pendencias }}
                  <!-- DOCUMENTOS JUNTADOS -->
                  <v-list>
                    <v-list-group>
                      <template v-slot:activator>
                        <v-list-item-title>
                          Documentos juntados:
                        </v-list-item-title>
                      </template>

                      <v-list>
                        <v-list-group
                          v-for="[
                            tempo,
                            responsavel,
                            acao,
                            descricao,
                          ] in dados.documentos"
                          :key="descricao"
                        >
                          <template v-slot:activator>
                            <v-list-item-title>
                              {{ tempo }}
                              -
                              {{ responsavel }}
                              -
                              {{ acao }}
                              -
                              {{
                                descricao.match(
                                  /(?:SEDUC-\w{3}-[0-9]{4}\/[0-9]{0,10})/
                                )
                              }}
                            </v-list-item-title>
                          </template>
                          {{ descricao }}
                        </v-list-group>
                      </v-list>
                    </v-list-group>
                  </v-list>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
import moment from "moment";

import { ipcRenderer } from "electron";
declare var api: {
  incluir: (
    password: string,
    unidade: string,
    processo: string,
    doc: string
  ) => void;
  atualizarDados: (unidade: string, processo: string) => void;
};

export default Vue.extend({
  name: "Processos",

  methods: {
    incluirDocumento(unidade: string, numero: string) {
      const doc = (this.$refs["select-" + numero] as Array<Vue>)[0]?.$data
        .selectedItems[0]?.value;

      if (doc === "PEGAR_DADOS") return api.atualizarDados(unidade, numero);

      api.incluir(
        this.$root.$data.credentials.sempapel.password,
        unidade,
        numero,
        doc
      );
    },

    atualizarDados(unidade: string, numero: string): void {
      api.atualizarDados(unidade, numero);
    },

    getTimeUpdate(ms: number) {
      moment.updateLocale("pt-br", {});
      return moment(ms).calendar();
    },
  },

  computed: {
    filtro(): Array<unknown> {
      return this.chipsEscolas.map(
        (i: number) => Object.entries(this.escolas)[i]
      );
    },
  },

  data() {
    return {
      paineisEscolas: 0,
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
      ],
    };
  },
});
</script>
