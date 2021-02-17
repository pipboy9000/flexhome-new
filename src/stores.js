import {
  mock_atributos,
  mock_proyectos,
  mock_modelos,
  mock_opciones,
} from "./mock_data.js";
import { writable, derived } from "svelte/store";
import axios from "axios";
import { get } from "svelte/store";

export const proyectos = writable([]);

export const modelos = writable([]);

export const viviendas = writable([]);

export const opciones = writable([]);

export const atributos = writable([]);

export const menuState = writable({}); //atrributes open or closed

export const opcionesByAtributo = derived(opciones, ($opciones) => {
  let byAtr = {};
  $opciones.map((o) => {
    let atr = o.fields.atributo_nombre;
    if (!byAtr[atr]) {
      byAtr[o.fields.atributo_nombre] = [o];
    } else {
      byAtr[o.fields.atributo_nombre].push(o);
    }
  });
  return byAtr;
});

export const selection = writable({});

export const categorias = writable({});

function getCategoriasFromAtributos() {
  let cat = {
    all: true,
  };
  get(atributos).forEach((atr) => {
    if (atr.fields.Categoría) {
      atr.fields.Categoría.forEach((catName) => {
        cat[catName] = false;
      });
    }
  });
  categorias.set(cat);
}

export function getAtributos() {
  //local
  if (window.location.hostname == "localhost") {
    atributos.set(mock_atributos);
    getCategoriasFromAtributos();
    return;
  }

  axios.get("https://enl4yiidhnuij8n.m.pipedream.net").then((res) => {
    atributos.set(res.data);
    getCategoriasFromAtributos();
  });
}

export function getProyectos() {
  //local
  if (window.location.hostname == "localhost") {
    proyectos.set(mock_proyectos);
    getModelos();
    return;
  }

  axios.get("https://en57ds8aebutpuq.m.pipedream.net").then((res) => {
    proyectos.set(res.data);
    getModelos();
  });
}

export function getModelos() {
  //local
  if (window.location.hostname == "localhost") {
    modelos.set(mock_modelos);
    getOpciones(mock_modelos[0].fields.Nombre);
    return;
  }

  axios.get("https://enw9gnpjz0b6y3s.m.pipedream.net").then((res) => {
    modelos.set(res.data);
    getOpciones(res.data[0].fields.Nombre);
  });
}

export function getOpciones(vivienda) {
  //local
  if (window.location.hostname == "localhost") {
    opciones.set(mock_opciones);
    return;
  }

  axios
    .get(`https://enombb1z99rtf6o.m.pipedream.net?vivienda=${vivienda}`)
    .then((res) => {
      opciones.set(res.data);
    });
}

getAtributos();
getProyectos();