/* =========================================================
   AGENDA PÚBLICA — "Outras atividades públicas" (página Ações e Agenda)
   Lê dados/agenda.js (agendaDoNeabi) e desenha as próximas atividades das categorias
   Evento, Projeto e Campanha em <ul id="agenda-lista">. O Grupo de Estudos NÃO entra aqui:
   ele tem calendário próprio (dados/grupo-estudos.js).
   Também cuida dos filtros por categoria e aceita ?categoria=evento|projeto|campanha na URL
   (usado pelos links da Home).
   Depende de: js/utilitarios.js e dados/agenda.js.
   ========================================================= */
(function () {
  "use strict";
  var lista = document.getElementById("agenda-lista");
  if (!lista || typeof agendaDoNeabi === "undefined") return;
  var U = NeabiUtil;

  // Categorias públicas permitidas: texto escrito em dados/agenda.js -> valor do filtro/URL.
  // "Reunião" NÃO existe: reuniões internas não fazem parte do site público.
  var CATEGORIAS_PERMITIDAS = {
    Evento: "evento",
    Projeto: "projeto",
    Campanha: "campanha",
  };

  var filtros = document.querySelectorAll("[data-filtro-agenda]");
  var mensagemVazia = document.getElementById("agenda-vazio");

  // Atividades válidas (categoria permitida + data correta) de hoje em diante, em ordem de data.
  function buscarProximasAtividades() {
    var hoje = U.obterInicioDeHoje();
    return agendaDoNeabi
      .filter(function (atividade) {
        if (!CATEGORIAS_PERMITIDAS[atividade.categoria]) {
          console.warn(
            'NEABI: categoria "' +
              atividade.categoria +
              '" em "' +
              atividade.titulo +
              '" não é permitida na agenda pública. Use Evento, Projeto ou Campanha. O item foi ignorado.',
          );
          return false;
        }
        return (
          U.dataEhValida(atividade.data, atividade.titulo) &&
          U.converterTextoEmData(atividade.data) >= hoje
        );
      })
      .sort(function (a, b) {
        return a.data < b.data ? -1 : 1;
      });
  }

  // Cria um item da lista: dia/mês grandes + categoria, título, horário·local e descrição.
  function criarItem(atividade) {
    var data = U.converterTextoEmData(atividade.data);
    var item = U.criarElemento("li", "agenda-item");
    item.setAttribute(
      "data-categoria",
      CATEGORIAS_PERMITIDAS[atividade.categoria],
    );

    var quando = U.criarElemento("p", "agenda-item__data");
    quando.appendChild(
      U.criarElemento("span", "agenda-item__dia", String(data.getDate())),
    );
    quando.appendChild(
      U.criarElemento(
        "span",
        "agenda-item__mes",
        data.toLocaleDateString("pt-BR", { month: "long" }),
      ),
    );
    item.appendChild(quando);

    var corpo = U.criarElemento("div");
    corpo.appendChild(
      U.criarElemento("p", "agenda-item__categoria", atividade.categoria),
    );
    var titulo = U.criarElemento("h3", "agenda-item__titulo");
    titulo.appendChild(U.criarTextoComDestaque(atividade.titulo));
    corpo.appendChild(titulo);
    var detalhe = U.montarLinhaDeHorarioELocal(atividade);
    if (detalhe) {
      var linha = U.criarElemento("p", "agenda-item__detalhe");
      linha.appendChild(U.criarTextoComDestaque(detalhe));
      corpo.appendChild(linha);
    }
    if (atividade.descricao) {
      var descricao = U.criarElemento("p", "agenda-item__detalhe");
      descricao.appendChild(U.criarTextoComDestaque(atividade.descricao));
      corpo.appendChild(descricao);
    }
    item.appendChild(corpo);
    return item;
  }

  // Mostra só os itens da categoria escolhida ("todas" mostra tudo) e a mensagem de vazio quando não sobra nenhum.
  function aplicarFiltro(valor) {
    var visiveis = 0;
    filtros.forEach(function (botao) {
      botao.setAttribute(
        "aria-pressed",
        String(botao.getAttribute("data-filtro-agenda") === valor),
      );
    });
    lista.querySelectorAll(".agenda-item").forEach(function (item) {
      var mostrar =
        valor === "todas" || item.getAttribute("data-categoria") === valor;
      item.hidden = !mostrar;
      if (mostrar) visiveis++;
    });
    mensagemVazia.hidden = visiveis > 0;
    mensagemVazia.textContent =
      valor === "todas"
        ? "Nenhuma atividade pública marcada por enquanto."
        : "Nenhuma atividade nesta categoria por enquanto.";
  }

  buscarProximasAtividades().forEach(function (atividade) {
    lista.appendChild(criarItem(atividade));
  });
  filtros.forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarFiltro(botao.getAttribute("data-filtro-agenda"));
    });
  });

  var pedido = new URLSearchParams(window.location.search).get("categoria");
  var filtroPedido =
    pedido && document.querySelector('[data-filtro-agenda="' + pedido + '"]');
  aplicarFiltro(filtroPedido ? pedido : "todas");
  // Links da Home (?categoria=evento) levam direto a esta seção.
  if (filtroPedido) document.getElementById("outras").scrollIntoView();
})();
