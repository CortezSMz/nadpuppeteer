/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // show alert box on main window
  alert: (callback) => ipcRenderer.on("alert", (_, ...args) => callback(...args)),

  // show alert box on main window
  progress: (callback) => ipcRenderer.on("progress", (_, ...args) => callback(...args)),

  // send credentials to puppeter and try to login
  entrar: ({ username, password }) =>
    ipcRenderer.send("entrar", { username, password }),

  // confirmation
  semPapelEntrarSucesso: (callback) => {
    ipcRenderer.on("semPapelEntrarSucesso", (_, ...args) => callback(...args))
  },

  // incluir documento sem papel
  pegarDados: (unidade, processo) =>
    ipcRenderer.send("pegarDados", unidade, processo),

    // incluir documento sem papel
  incluir: (password, unidade, processo, doc) =>
    ipcRenderer.send("incluirInservivel", password, unidade, processo, doc),

  // StoreManager
  getEscolas: () => ipcRenderer.send("getEscolas"),

  updateEscolas: (callback) =>  ipcRenderer.on("updateEscolas", (_, ...args) => callback(...args)),
});
