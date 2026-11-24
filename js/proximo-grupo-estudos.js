/* =========================================================
   PRÓXIMO GRUPO DE ESTUDOS — Home ("O que está acontecendo") e Ações e Agenda
   Lê dados/grupo-estudos.js (a mesma lista do calendário) e preenche os elementos marcados com
     data-proximo-grupo="dia | mes | data | titulo | detalhe | texto | autor".
   Assim a data do próximo encontro é cadastrada em UM lugar só.
   Sem encontro futuro, o bloco mostra "Nenhum encontro marcado por enquanto."
   Linhas com data-oculta-sem-valor (Texto, Autor) somem quando não há valor.
   Depende de: js/utilitarios.js e dados/grupo-estudos.js.
   ========================================================= */
(function () {
  "use strict";
  var campos = document.querySelectorAll("[data-proximo-grupo]");
  if (!campos.length || typeof encontrosDoGrupoDeEstudos === "undefined")
    return;
  var U = NeabiUtil;
  var hoje = U.obterInicioDeHoje();

  // Mesma regra do calendário: o campo status, se existir; senão, decide pela data.
  function ehProximo(encontro, data) {
    if (encontro.status) return !/^real/i.test(encontro.status);
    return data >= hoje;
  }

  // O encontro futuro mais próximo (datas inválidas são ignoradas com aviso no console).
  var proximo = encontrosDoGrupoDeEstudos
    .filter(function (e) {
      return U.dataEhValida(e.data, e.tema);
    })
    .map(function (e) {
      return { dados: e, data: U.converterTextoEmData(e.data) };
    })
    .filter(function (e) {
      return ehProximo(e.dados, e.data);
    })
    .sort(function (a, b) {
      return a.data - b.data;
    })[0];

  var textos = {
    dia: "",
    mes: "",
    data: "",
    titulo: "Nenhum encontro marcado por enquanto.",
    detalhe: "",
    texto: "",
    autor: "",
  };
  if (proximo) {
    textos = {
      dia: proximo.dados.data.slice(8, 10),
      mes: proximo.data.toLocaleDateString("pt-BR", { month: "long" }),
      data: U.formatarDiaEMes(proximo.dados.data),
      titulo: proximo.dados.tema,
      detalhe: U.montarLinhaDeHorarioELocal(proximo.dados),
      texto: proximo.dados.texto || "",
      autor: proximo.dados.autor || "",
    };
  }

  campos.forEach(function (campo) {
    var texto = textos[campo.getAttribute("data-proximo-grupo")];
    var linha = campo.closest("[data-oculta-sem-valor]");
    if (linha) linha.hidden = !texto;
    U.preencherComTexto(campo, texto);
  });
})();
