<template>
  <v-container fill-height fluid style="height: 80vh">
    <!-- APP-BAR -->
    <v-app-bar app clipped-left color="secondary" elevation="1">
      <v-app-bar-nav-icon @click="toggleDrawer">
        <v-icon> fa-bars </v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Incluir processo</v-app-bar-title>
    </v-app-bar>

    <!-- CONTENT -->
    <v-row align="center" justify="center" class="text-center">
      <!-- TITLE -->
      <v-col cols="1">
        <v-icon large>{{ navigation.icon }}</v-icon>
      </v-col>
      <v-col cols="6" class="text-center">
        <span class="title">{{ navigation.title }}</span>
      </v-col>
      <!-- ESCOLA -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="unidade"
          :rules="[rules.required]"
          label="Unidade escolar"
          placeholder="Selecione a unidade"
          filled
          prepend-inner-icon="fa-graduation-cap"
          color="primary"
        ></v-select>
        <v-select
          v-model="unidade"
          :rules="[rules.required]"
          label="Unidade escolar"
          placeholder="Selecione a unidade"
          filled
          prepend-inner-icon="fa-graduation-cap"
          color="primary"
        ></v-select>
      </v-col>
    </v-row>
    {{ sigla }}
    {{ unidade }}
    <!-- BOTTOM NAVIGATION -->
    <v-bottom-navigation
      v-model="tab"
      color="primary"
      background-color="secondary"
      app
      horizontal
      grow
    >
      <v-btn v-for="item in items" :key="item.title">
        <span>{{ item.title }}</span>

        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<style>
.v-app-bar-title__content {
  width: 200px !important;
}
.row {
  border: 1px solid green !important;
}
.col {
  border: 1px solid red !important;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IncluirProcesso",
  data() {
    return {
      tab: 0,
      unidade: "",
      rules: {
        required: (value: string) => !!value || "Obrigatório.",
      },
      items: [
        { title: "Incluir existente", icon: "fa-paste" },
        { title: "Autuar novo", icon: "fa-file-arrow-up" },
      ],
    };
  },

  methods: {
    toggleDrawer() {
      return this.$emit("toggleDrawer");
    },
  },

  computed: {
    navigation() {
      switch (this.tab) {
        case 1:
          return { title: "Autuar novo processo", icon: "fa-file-arrow-up" };
        case 0:
        default:
          return { title: "Incluir processo existente", icon: "fa-paste" };
      }
    },
  },
});
</script>
