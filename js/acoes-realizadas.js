/* =========================================================
   AÇÕES REALIZADAS (página Ações e Agenda)
   Lê dados/acoes-realizadas.js e desenha em <div id="acoes-realizadas-lista">:
     1ª ação -> destaque (foto grande);  2ª e 3ª -> lado a lado;  demais -> "Ver registros anteriores".
   Sem nenhuma ação cadastrada, mostra "Nenhuma ação registrada ainda."
   Depende de: js/utilitarios.js e dados/acoes-realizadas.js.
   ========================================================= */
(function () {
  "use strict";
  var area = document.getElementById("acoes-realizadas-lista");
  if (!area || typeof acoesRealizadasDoNeabi === "undefined") return;
  var U = NeabiUtil;
  var acoes = acoesRealizadasDoNeabi;

  function criarTexto(tag, classe, texto) {
    var elemento = U.criarElemento(tag, classe);
    elemento.appendChild(U.criarTextoComDestaque(texto));
    return elemento;
  }

  // Foto da ação dentro de uma <figure>, com legenda opcional.
  function criarFiguraDaAcao(acao, comLegenda) {
    if (!acao.foto) return null;
    var figura = U.criarElemento("figure");
    figura.appendChild(
      U.criarFoto({
        arquivo: acao.foto,
        alt: acao.fotoAlt,
        reservado: "",
      }),
    );
    if (comLegenda && acao.legenda)
      figura.appendChild(criarTexto("figcaption", "", acao.legenda));
    return figura;
  }

  // Ação em destaque (com foto grande e texto) ou ação menor (foto + categoria + título + ano).
  function criarAcao(acao, emDestaque) {
    var artigo = U.criarElemento(
      "article",
      "acao" + (emDestaque ? " acao--destaque" : ""),
    );
    var figura = criarFiguraDaAcao(acao, emDestaque);
    if (figura) artigo.appendChild(figura);
    else artigo.classList.add("acao--sem-foto");
    var corpo = emDestaque ? U.criarElemento("div") : artigo;
    if (acao.categoria)
      corpo.appendChild(criarTexto("p", "acao__categoria", acao.categoria));
    corpo.appendChild(criarTexto("h3", "acao__titulo", acao.titulo));
    if (acao.ano) corpo.appendChild(criarTexto("p", "acao__ano", acao.ano));
    if (emDestaque && acao.texto)
      corpo.appendChild(criarTexto("p", "", acao.texto));
    if (emDestaque) artigo.appendChild(corpo);
    return artigo;
  }

  // Registro antigo (só texto) para a lista recolhida.
  function criarRegistroAntigo(acao) {
    var item = U.criarElemento("li");
    item.appendChild(criarTexto("p", "acoes-arquivo__ano", acao.ano || ""));
    item.appendChild(criarTexto("p", "acoes-arquivo__titulo", acao.titulo));
    if (acao.categoria)
      item.appendChild(
        criarTexto("p", "acoes-arquivo__categoria", acao.categoria),
      );
    return item;
  }

  area.textContent = "";
  if (!acoes.length) {
    area.appendChild(
      U.criarElemento("p", "", "Nenhuma ação registrada ainda."),
    );
    return;
  }
  area.appendChild(criarAcao(acoes[0], true));

  if (acoes.length > 1) {
    var duas = U.criarElemento("div", "acoes-duas");
    acoes.slice(1, 3).forEach(function (acao) {
      duas.appendChild(criarAcao(acao, false));
    });
    area.appendChild(duas);
  }

  if (acoes.length > 3) {
    var detalhes = U.criarElemento("details", "acoes-mais");
    detalhes.appendChild(
      U.criarElemento("summary", "", "Ver registros anteriores"),
    );
    var arquivo = U.criarElemento("ul", "acoes-arquivo");
    acoes.slice(3).forEach(function (acao) {
      arquivo.appendChild(criarRegistroAntigo(acao));
    });
    detalhes.appendChild(arquivo);
    area.appendChild(detalhes);
  }
})();
