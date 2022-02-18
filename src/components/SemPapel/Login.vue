<template>
  <v-container fill-height style="height: 90vh">
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-img
          :src="require('../../assets/SemPapel/logo-sem-papel-cor.png')"
          class="my-3"
          contain
          height="100"
        />

        <v-form>
          <v-text-field
            v-model="username"
            :rules="[rules.required]"
            label="Usuário"
            placeholder="Digite seu CPF ou matrícula"
            filled
            autofocus
            prepend-inner-icon="fa-user"
            @keyup="username = username.toUpperCase()"
            color="primary"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="show ? 'fa-eye' : 'fa-eye-slash'"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            label="Senha"
            placeholder="Digite sua senha"
            filled
            prepend-inner-icon="fa-lock"
            @click:append="show = !show"
            color="primary"
          ></v-text-field>

          <v-btn large color="accent" dark @click="entrar">
            <v-icon left>fa-sign-in-alt</v-icon>
            Entrar</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { themes } from "../../plugins/vuetify";

import { ipcRenderer } from "electron";
declare var api: {
  entrar: (creds: { username: string; password: string }) => void;
  semPapelEntrarSucesso: (
    callback: (creds: { username: string; password: string }) => void
  ) => void;
};

export default Vue.extend({
  name: "LoginSemPapel",

  data() {
    return {
      password: "",
      username: "",
      show: false,
      rules: {
        required: (value: string) => !!value || "Obrigatório.",
      },
    };
  },

  methods: {
    entrar: function () {
      if (this.username && this.password)
        api.entrar({ username: this.username, password: this.password });
    },

    entrarSucesso: function (creds: { username: string; password: string }) {
      this.$root.$data.credentials.sempapel = creds;
      this.$router.push("/sempapel/processos");
    },
  },

  mounted() {
    api.semPapelEntrarSucesso((creds) => {
      this.entrarSucesso(creds);
    });
  },
});
</script>
