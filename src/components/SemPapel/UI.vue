<template>
  <v-container style="padding: 0px">
    <!-- DRAWER -->
    <v-navigation-drawer
      :mini-variant.sync="mini"
      permanent
      app
      color="primary"
      dark
    >
      <v-list dense>
        <v-list-item style="padding: 0 20px 0 9px">
          <v-row class="text-right">
            <v-col style="padding: 0; margin: 0">
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>{{ mini ? "fa-angle-right" : "fa-angle-left" }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "UISemPapel",

  data() {
    return {
      mini: true,
      items: [
        {
          title: "Inservíveis",
          icon: "fa-folder-open",
          route: "/sempapel/inserviveis",
        },
        {
          title: "Incluir processo",
          icon: "fa-folder-plus",
          route: "/sempapel/incluir",
        },
      ],
    };
  },

  methods: {
    //
  },
});
</script>
