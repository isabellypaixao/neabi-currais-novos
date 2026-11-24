/* =========================================================
   UTILITÁRIOS COMPARTILHADOS
   Funções pequenas usadas por vários scripts do site (datas, criação de elementos,
   texto provisório e fotos). Carregue ESTE arquivo antes dos demais scripts de js/.
   Tudo fica dentro do objeto NeabiUtil para não "poluir" o resto do código.
   Os textos são sempre inseridos com textContent (nunca como HTML), o que é mais seguro.
   ========================================================= */
var NeabiUtil = (function () {
  "use strict";

  /* ---------- Elementos ---------- */

  // Cria um elemento HTML com classe e texto opcionais.
  function criarElemento(tag, classe, texto) {
    var elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined && texto !== null) elemento.textContent = texto;
    return elemento;
  }

  /* ---------- Texto provisório (placeholder) ---------- */

  // Texto entre colchetes, como "[TÍTULO]", é provisório e recebe o destaque amarelo (classe "ph").
  function ehProvisorio(texto) {
    return String(texto || "").charAt(0) === "[";
  }

  // Devolve um <span> com o texto; se for provisório, com a classe "ph".
  function criarTextoComDestaque(texto) {
    var span = criarElemento("span", ehProvisorio(texto) ? "ph" : "", texto);
    if (!span.className) span.removeAttribute("class");
    return span;
  }

  // Troca o conteúdo de um elemento pelo texto (com destaque se for provisório).
  // Texto vazio deixa o elemento vazio.
  function preencherComTexto(elemento, texto) {
    elemento.textContent = "";
    if (texto) elemento.appendChild(criarTextoComDestaque(texto));
  }

  /* ---------- Datas ----------
     Datas são cadastradas como "AAAA-MM-DD". Não usamos new Date("AAAA-MM-DD") direto,
     porque ele pode voltar um dia por causa do fuso horário. */

  function doisDigitos(numero) {
    return (numero < 10 ? "0" : "") + numero;
  }

  // "2026-10-14" -> Date local. Devolve null se o formato ou a data (ex.: 2026-02-31) estiverem errados.
  function converterTextoEmData(texto) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(texto))) return null;
    var partes = texto.split("-").map(Number);
    var data = new Date(partes[0], partes[1] - 1, partes[2]);
    return data.getMonth() === partes[1] - 1 ? data : null;
  }

  // Date -> "AAAA-MM-DD"
  function converterDataEmTexto(data) {
    return (
      data.getFullYear() +
      "-" +
      doisDigitos(data.getMonth() + 1) +
      "-" +
      doisDigitos(data.getDate())
    );
  }

  // Confere a data; se estiver errada, avisa no console do navegador (F12) e devolve false.
  function dataEhValida(texto, descricaoDoItem) {
    var valida = converterTextoEmData(texto) !== null;
    if (!valida) {
      console.warn(
        'NEABI: data inválida "' +
          texto +
          '" em "' +
          descricaoDoItem +
          '". Use o formato AAAA-MM-DD (ex.: 2026-10-15). O item foi ignorado.',
      );
    }
    return valida;
  }

  // Hoje à meia-noite (atividades de hoje ainda contam como "próximas").
  function obterInicioDeHoje() {
    var agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  }

  // "2026-10-15" -> "15 de outubro de 2026"
  function formatarDataLonga(texto) {
    return converterTextoEmData(texto).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // "2026-10-15" -> "15/10"
  function formatarDiaEMes(texto) {
    return texto.slice(8, 10) + "/" + texto.slice(5, 7);
  }

  // Junta horário e local em uma linha, ignorando o que estiver vazio.
  function montarLinhaDeHorarioELocal(item) {
    return [item.horario, item.local].filter(Boolean).join(" · ");
  }

  /* ---------- Links e fotos ---------- */

  // Aceita só endereços http(s); qualquer outra coisa (ex.: javascript:) é descartada.
  function enderecoSeguro(url) {
    return /^https?:\/\//i.test(String(url || "")) ? url : "";
  }

  // Cria o quadro de foto. Com "arquivo" cadastrado, mostra a imagem; sem ele, um espaço reservado.
  //   opcoes: { arquivo, alt, reservado (texto do espaço), classe (ex.: "foto--retrato") }
  function criarFoto(opcoes) {
    var quadro = criarElemento(
      "div",
      "foto" + (opcoes.classe ? " " + opcoes.classe : ""),
    );
    if (opcoes.arquivo) {
      var imagem = criarElemento("img");
      imagem.src = opcoes.arquivo;
      imagem.alt = opcoes.alt || "";
      imagem.loading = "lazy";
      quadro.appendChild(imagem);
    } else {
      quadro.textContent = opcoes.reservado || "[FOTO]";
    }
    return quadro;
  }

  return {
    criarElemento: criarElemento,
    ehProvisorio: ehProvisorio,
    criarTextoComDestaque: criarTextoComDestaque,
    preencherComTexto: preencherComTexto,
    converterTextoEmData: converterTextoEmData,
    converterDataEmTexto: converterDataEmTexto,
    dataEhValida: dataEhValida,
    obterInicioDeHoje: obterInicioDeHoje,
    formatarDataLonga: formatarDataLonga,
    formatarDiaEMes: formatarDiaEMes,
    montarLinhaDeHorarioELocal: montarLinhaDeHorarioELocal,
    enderecoSeguro: enderecoSeguro,
    criarFoto: criarFoto,
  };
})();
