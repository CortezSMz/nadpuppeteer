<template>
  <v-container>
    <v-container style="padding: 0px">
      <!-- ROUTER -->
      <router-view @toggleDrawer="toggleDrawer"> </router-view>

      <!-- DRAWER -->
      <v-navigation-drawer
        :mini-variant.sync="mini"
        permanent
        app
        color="secondary"
        light
        style="z-index: 0"
      >
        <v-list>
          <v-list-item>
            <!-- empty item  -->
          </v-list-item>

          <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.icon"
            append-icon="fa-caret-up"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title">a</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.items"
              :key="child.title"
              :to="child.route"
              @click="toggleDrawer()"
            >
              <v-list-item-icon>
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { themes } from "../plugins/vuetify";

export default Vue.extend({
  name: "SemPapel",

  data() {
    return {
      items: [
        {
          icon: "fa-book-open",
          title: "Inservíveis",
          active: false,
          items: [
            {
              title: "Processos",
              route: "/sempapel/processos",
              icon: "fa-folder-tree",
            },
            {
              title: "Incluir processo",
              route: "/sempapel/incluir",
              icon: "fa-folder-plus",
            },
          ],
        },
        {
          icon: "fa-school",
          title: "Escolas",
          active: false,
          items: [{ title: "WIP", icon: "fa-wrench" }],
        },
      ],
    };
  },

  methods: {
    toggleDrawer() {
      if (this.mini) this.items[0].active = true;
      else this.items.forEach((i) => (i.active = false));
    },
  },

  computed: {
    mini(): boolean {
      return !this.items.some((i) => i.active);
    },
  },

  beforeMount() {
    this.$vuetify.theme.themes.light = themes.sempapel.light;
    this.$vuetify.theme.themes.dark = themes.sempapel.dark;
  },
});
</script>
