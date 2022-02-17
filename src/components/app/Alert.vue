<template>
  <v-snackbar
    app
    rounded="pill"
    transition="scale-transition"
    origin="center center"
    v-model="alert.visible"
    :color="alert.color"
    :timeout="alert.timeout"
    :centered="alert.position.includes('center')"
    :top="alert.position.includes('top')"
    :right="alert.position.includes('right')"
    :bottom="alert.position.includes('bottom')"
    :left="alert.position.includes('left')"
  >
    <v-container style="margin: 0; padding: 0" fill-height>
      <v-row class="text-center" align="center" justify="center">
        <v-col cols="1" style="padding: 0 10px">
          <v-icon class="pr-3" dark>
            {{ setIcon(alert.color) }}
          </v-icon>
        </v-col>
        <v-col cols="10" style="padding: 0">
          <strong>{{ alert.title }}</strong>
          <br v-if="alert.title" />
          {{ alert.text }}
        </v-col>
        <v-col cols="1" style="padding: 0">
          <v-btn icon @click="alert.visible = false">
            <v-icon small>fa-xmark</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

import { AlertOptions } from "../../main";
import { ipcRenderer } from "electron";
declare var api: {
  alert: (callback: (alert: AlertOptions) => void) => void;
};

export default Vue.extend({
  name: "Alert",

  data() {
    return {
      alert: {
        ...this.$root.$data.alert,
        visible: false,
      },
    };
  },

  methods: {
    popAlert(alert: AlertOptions) {
      this.alert = {
        ...this.$root.$data.alert,
        ...alert,
        visible: true,
      };

      this.$root.$data.alert.color = alert.color ?? "success";
      this.$root.$data.alert.icon = this.setIcon(alert.color ?? "sucess");

      setTimeout(() => {
        this.alert.visible = false;
        this.$root.$data.alert.color = "success";
        this.$root.$data.alert.icon = "fa-check";
        this.$root.$data.progress.value = 0;
      }, this.alert.timeout);
    },

    setIcon(color: string) {
      switch (color) {
        case "error":
          return "fa-bug";
        case "info":
          return "fa-lightbulb";
        case "success":
          return "fa-check";
        case "warning":
          return "fa-exclamation";
        default:
          return this.alert.icon;
      }
    },
  },

  mounted() {
    api.alert((alert: AlertOptions) => {
      this.popAlert(alert);
    });
  },
});
</script>
