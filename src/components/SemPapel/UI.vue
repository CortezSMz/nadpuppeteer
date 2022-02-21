<template>
  <!-- DRAWER -->
  <!-- :mini-variant.sync="mini" -->
  <v-navigation-drawer mini-variant permanent app color="secondary" light>
    <v-list>
      <v-list-item class="px-2">
        <Logo
          :quadrados="'60px'"
          :animado="true"
          :borda="'var(--v-secondary-base)'"
        />
      </v-list-item>

      <v-list-item v-for="item in items" :key="item.title" :to="item.route">
        <v-tooltip right nudge-right="10" transition="scroll-x-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon v-bind="attrs" v-on="on">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "./Logo.vue";

export default Vue.extend({
  name: "UI",

  components: {
    Logo,
  },

  data() {
    return {
      items: [
        {
          icon: "fa-book-open",
          title: "Processos Inservíveis",
          route: "/sempapel/inserviveis",
        },
        {
          icon: "fa-school",
          title: "Escolas",
          route: "/sempapel/escolas",
        },
      ],
    };
  },
});
</script>
