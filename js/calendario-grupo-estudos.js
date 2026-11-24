/* =========================================================
   CALENDÁRIO DO GRUPO DE ESTUDOS (página Ações e Agenda)
   Lê a lista encontrosDoGrupoDeEstudos (dados/grupo-estudos.js) e monta:
     a) o calendário mensal (<tbody id="calendario-corpo">) com navegação entre meses;
     b) o painel de detalhes (<div id="calendario-detalhes">), que mostra o dia escolhido;
     c) as listas "Próximos encontros" e "Encontros anteriores" (úteis no celular).
   Só os dias com encontro são botões; os demais dias são só texto.
   Sem bibliotecas e sem armazenar nada: tudo é calculado ao abrir a página.
   Depende de: js/utilitarios.js e dados/grupo-estudos.js.
   ========================================================= */
(function () {
  var corpoDoCalendario = document.getElementById("calendario-corpo");
  if (!corpoDoCalendario || typeof encontrosDoGrupoDeEstudos === "undefined")
    return;

  var tituloDoMes = document.getElementById("calendario-mes");
  var painelDeDetalhes = document.getElementById("calendario-detalhes");
  var listaDeProximos = document.getElementById("calendario-proximos");
  var listaDeAnteriores = document.getElementById("calendario-anteriores");
  var movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- datas (funções compartilhadas em js/utilitarios.js) ---------- */

  var U = NeabiUtil;
  var converterTextoEmData = U.converterTextoEmData;
  var converterDataEmTexto = U.converterDataEmTexto;
  var dataEhValida = U.dataEhValida;
  var formatarDataLonga = U.formatarDataLonga;
  var formatarDiaEMes = U.formatarDiaEMes;
  var textoDeHoje = converterDataEmTexto(new Date());

  /* ---------- dados ---------- */

  // "realizado" ou "proximo": usa o campo status, se existir; senão decide pela data.
  function obterStatus(encontro) {
    if (encontro.status)
      return /^real/i.test(encontro.status) ? "realizado" : "proximo";
    return encontro.data < textoDeHoje ? "realizado" : "proximo";
  }
  var encontros = encontrosDoGrupoDeEstudos
    .filter(function (e) {
      return dataEhValida(e.data, e.tema);
    })
    .sort(function (a, b) {
      return a.data < b.data ? -1 : 1;
    });

  function encontrosDoDia(textoDaData) {
    return encontros.filter(function (e) {
      return e.data === textoDaData;
    });
  }

  /* ---------- elementos de tela ---------- */

  var criarElemento = U.criarElemento;
  // Valores entre colchetes são placeholders: recebem a classe "ph" (destaque amarelo).
  function criarValor(tag, texto) {
    var elemento = criarElemento(tag, "", texto);
    if (U.ehProvisorio(texto)) elemento.className = "ph";
    return elemento;
  }

  // Lista "rótulo: valor" com os dados do encontro (campos vazios não aparecem).
  function criarDados(encontro) {
    var lista = criarElemento("dl", "encontro__dados");
    [
      ["Horário", encontro.horario],
      ["Local", encontro.local],
      ["Tema", encontro.tema],
      ["Texto", encontro.texto],
      ["Autor(a)", encontro.autor],
      ["Observação", encontro.observacao],
    ].forEach(function (par) {
      if (!par[1]) return;
      var linha = criarElemento("div");
      linha.appendChild(criarElemento("dt", "", par[0]));
      var valor = criarElemento("dd");
      valor.appendChild(criarValor("span", par[1]));
      linha.appendChild(valor);
      lista.appendChild(linha);
    });
    return lista;
  }

  // Painel: mostra todos os encontros da data escolhida (normalmente um só).
  function mostrarDetalhes(textoDaData) {
    painelDeDetalhes.textContent = "";
    encontrosDoDia(textoDaData).forEach(function (encontro) {
      var status = obterStatus(encontro);
      var bloco = criarElemento("article", "encontro");
      bloco.appendChild(
        criarElemento(
          "p",
          "encontro__status encontro__status--" + status,
          status === "proximo" ? "Próximo encontro" : "Realizado",
        ),
      );
      var data = criarElemento("p", "encontro__data");
      data.appendChild(
        criarElemento("span", "encontro__dia", textoDaData.slice(8, 10)),
      );
      data.appendChild(
        criarElemento(
          "span",
          "encontro__mes",
          converterTextoEmData(textoDaData).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          }),
        ),
      );
      bloco.appendChild(data);
      bloco.appendChild(
        criarElemento("h3", "encontro__titulo", "Grupo de Estudos"),
      );
      bloco.appendChild(criarDados(encontro));
      painelDeDetalhes.appendChild(bloco);
    });
    // marca o dia escolhido no calendário
    corpoDoCalendario.querySelectorAll("button.dia").forEach(function (botao) {
      botao.setAttribute(
        "aria-pressed",
        String(botao.getAttribute("data-data") === textoDaData),
      );
    });
  }

  /* ---------- calendário mensal ---------- */

  var mesExibido = {
    ano: new Date().getFullYear(),
    mes: new Date().getMonth(),
  };

  function desenharMes() {
    var primeiroDia = new Date(mesExibido.ano, mesExibido.mes, 1);
    var totalDeDias = new Date(mesExibido.ano, mesExibido.mes + 1, 0).getDate();
    var nomeDoMes = primeiroDia.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    tituloDoMes.textContent =
      nomeDoMes.charAt(0).toUpperCase() + nomeDoMes.slice(1);
    corpoDoCalendario.textContent = "";

    var linha = criarElemento("tr");
    for (var vazio = 0; vazio < primeiroDia.getDay(); vazio++)
      linha.appendChild(criarElemento("td")); // getDay(): 0 = domingo

    for (var dia = 1; dia <= totalDeDias; dia++) {
      var textoDaData = converterDataEmTexto(
        new Date(mesExibido.ano, mesExibido.mes, dia),
      );
      var doDia = encontrosDoDia(textoDaData);
      var celula = criarElemento("td");
      var marca;
      if (doDia.length) {
        var status = obterStatus(doDia[0]);
        marca = criarElemento("button", "dia dia--" + status, String(dia));
        marca.type = "button";
        marca.setAttribute("data-data", textoDaData);
        marca.setAttribute("aria-pressed", "false");
        marca.setAttribute("aria-controls", "calendario-detalhes");
        marca.setAttribute(
          "aria-label",
          formatarDataLonga(textoDaData) +
            ": Grupo de Estudos, " +
            (status === "proximo" ? "próximo encontro" : "encontro realizado"),
        );
      } else {
        marca = criarElemento("span", "dia", String(dia));
      }
      if (textoDaData === textoDeHoje)
        marca.setAttribute("aria-current", "date");
      celula.appendChild(marca);
      linha.appendChild(celula);
      if (linha.children.length === 7) {
        corpoDoCalendario.appendChild(linha);
        linha = criarElemento("tr");
      }
    }
    if (linha.children.length) {
      while (linha.children.length < 7) linha.appendChild(criarElemento("td"));
      corpoDoCalendario.appendChild(linha);
    }
  }

  function mudarMes(diferenca) {
    var novo = new Date(mesExibido.ano, mesExibido.mes + diferenca, 1);
    mesExibido = { ano: novo.getFullYear(), mes: novo.getMonth() };
    desenharMes();
    var escolhido = painelDeDetalhes.getAttribute("data-data");
    if (escolhido) mostrarMarcaDoPainel(escolhido);
  }
  function mostrarMarcaDoPainel(textoDaData) {
    corpoDoCalendario.querySelectorAll("button.dia").forEach(function (botao) {
      botao.setAttribute(
        "aria-pressed",
        String(botao.getAttribute("data-data") === textoDaData),
      );
    });
  }
  document
    .getElementById("calendario-anterior")
    .addEventListener("click", function () {
      mudarMes(-1);
    });
  document
    .getElementById("calendario-seguinte")
    .addEventListener("click", function () {
      mudarMes(1);
    });

  // Clique (ou Enter/Espaço) em um dia marcado: mostra os detalhes.
  corpoDoCalendario.addEventListener("click", function (evento) {
    var botao = evento.target.closest("button.dia");
    if (!botao) return;
    painelDeDetalhes.setAttribute("data-data", botao.getAttribute("data-data"));
    mostrarDetalhes(botao.getAttribute("data-data"));
    // no celular o painel fica abaixo do calendário: garante que ele apareça na tela
    painelDeDetalhes.scrollIntoView({
      block: "nearest",
      behavior: movimentoReduzido ? "auto" : "smooth",
    });
  });

  /* ---------- listas "Próximos" e "Anteriores" (cada item abre/fecha os detalhes, sem sair do lugar) ---------- */

  function preencherLista(elementoUl, lista, mensagemVazia) {
    elementoUl.textContent = "";
    if (!lista.length) {
      var vazio = criarElemento("li", "lista-encontros__vazio");
      vazio.appendChild(criarElemento("span", "ph", mensagemVazia));
      elementoUl.appendChild(vazio);
      return;
    }
    lista.forEach(function (encontro) {
      var item = criarElemento("li");
      var detalhes = criarElemento("details", "lista-encontro");
      var resumo = criarElemento("summary");
      resumo.setAttribute(
        "aria-label",
        "Grupo de Estudos, " + formatarDataLonga(encontro.data),
      );
      resumo.appendChild(
        criarElemento(
          "span",
          "lista-encontro__data",
          formatarDiaEMes(encontro.data),
        ),
      );
      resumo.appendChild(criarValor("span", encontro.tema));
      detalhes.appendChild(resumo);
      var corpo = criarElemento("div", "lista-encontro__corpo");
      corpo.appendChild(criarDados(encontro));
      detalhes.appendChild(corpo);
      item.appendChild(detalhes);
      elementoUl.appendChild(item);
    });
  }
  var proximos = encontros.filter(function (e) {
    return obterStatus(e) === "proximo";
  });
  var anteriores = encontros
    .filter(function (e) {
      return obterStatus(e) === "realizado";
    })
    .reverse(); // mais recente primeiro
  preencherLista(
    listaDeProximos,
    proximos,
    "[Nenhum encontro marcado por enquanto.]",
  );
  preencherLista(
    listaDeAnteriores,
    anteriores,
    "[Nenhum encontro anterior registrado.]",
  );

  /* ---------- início: abre no mês do próximo encontro (ou do mais recente), sem repetir os detalhes ----------
     O próximo encontro já aparece em destaque no topo da página; o painel só mostra algo quando se escolhe um dia. */
  var inicial = proximos[0] || anteriores[0];
  if (inicial) {
    var data = converterTextoEmData(inicial.data);
    mesExibido = { ano: data.getFullYear(), mes: data.getMonth() };
  }
  painelDeDetalhes.appendChild(
    criarElemento(
      "p",
      "calendario__dica",
      inicial
        ? "Escolha um dia marcado no calendário para ver o texto, o autor e o horário do encontro."
        : "Nenhum encontro cadastrado ainda.",
    ),
  );
  desenharMes();
})();
