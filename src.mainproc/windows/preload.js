/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require("electron");

console.log("preload loaded!");

contextBridge.exposeInMainWorld("api", {
  // show alert box on main window
  alert: (callback) =>
    ipcRenderer.on("alert", (_, ...args) => callback(...args)),

  // show alert box on main window
  progress: (callback) =>
    ipcRenderer.on("progress", (_, ...args) => callback(...args)),

  // send credentials to puppeter and try to login
  entrar: ({ username, password }) =>
    ipcRenderer.send("entrar", { username, password }),

  // confirmation
  semPapelEntrarSucesso: (callback) => {
    ipcRenderer.on("semPapelEntrarSucesso", (_, ...args) => callback(...args));
  },

  // incluir documento sem papel
  atualizarDados: (unidade, processo) =>
    ipcRenderer.send("atualizarDados", unidade, processo),

  // incluir documento sem papel
  incluir: (username, password, unidade, processo, doc) =>
    ipcRenderer.send(
      "incluirDocumento",
      username,
      password,
      unidade,
      processo,
      doc
    ),

  autuarProcesso: (username, password, unidade, docs) =>
    ipcRenderer.send("autuarProcesso", username, password, unidade, docs),

  // StoreManager
  getEscolas: () => ipcRenderer.send("getEscolas"),

  setEscola: (unidade, dados) => ipcRenderer.send("setEscola", unidade, dados),

  delEscola: (unidade) => ipcRenderer.send("delEscola", unidade),

  editEscola: (oldUnidade, newUnidade) =>
    ipcRenderer.send("editEscola", oldUnidade, newUnidade),

  addProcesso: (unidade, processo) =>
    ipcRenderer.send("addProcesso", unidade, processo),

  delProcesso: (unidade, processo) =>
    ipcRenderer.send("delProcesso", unidade, processo),

  editProcesso: (unidade, oldProcesso, newProcesso) =>
    ipcRenderer.send("editProcesso", unidade, oldProcesso, newProcesso),

  /* Update escolas on renderer */
  updateEscolas: (callback) =>
    ipcRenderer.on("updateEscolas", (_, ...args) => callback(...args)),
});
