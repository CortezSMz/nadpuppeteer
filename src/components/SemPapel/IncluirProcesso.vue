<template>
  <v-container fill-height fluid style="height: 80vh">
    <!-- APP-BAR -->
    <v-app-bar
      class="text-no-wrap"
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
      <v-app-bar-title>Incluir Processo</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>fa-filter</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row align="center" justify="center"
      >TODO: Criar página de inclusão de processos.</v-row
    >
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
  name: "IncluirProcesso",
  data() {
    return {
      //
    };
  },

  methods: {
    //
  },
});
</script>
