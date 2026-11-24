/* =========================================================
   TEXTOS INSTITUCIONAIS — todas as páginas
   Lê dados/instituicao.js (objeto instituicaoNeabi) e preenche os pontos da página marcados com:
     data-texto="chave"        -> um texto simples
     data-lista="chave"        -> uma lista de parágrafos (cria um <p> para cada item)
     data-imagem="chave"       -> uma figura (foto + legenda) de instituicaoNeabi.imagens
     data-marcos="completo"    -> a linha do tempo da página Sobre
     data-marcos="previa"      -> o primeiro marco, resumido, na Home
     data-frentes              -> frentes de atuação (Sobre)
   Para trocar um texto, edite dados/instituicao.js; este arquivo não precisa mudar.
   Depende de: js/utilitarios.js e dados/instituicao.js.
   ========================================================= */
(function () {
  "use strict";
  if (typeof instituicaoNeabi === "undefined") return;
  var dados = instituicaoNeabi;
  var U = NeabiUtil;

  // Busca uma chave simples ou um caminho com pontos dentro do objeto de dados.
  function buscarValor(caminho) {
    return caminho.split(".").reduce(function (atual, chave) {
      return atual === undefined || atual === null ? undefined : atual[chave];
    }, dados);
  }

  /* ---------- Textos simples e listas de parágrafos ---------- */

  function preencherTextos() {
    document.querySelectorAll("[data-texto]").forEach(function (elemento) {
      U.preencherComTexto(
        elemento,
        buscarValor(elemento.getAttribute("data-texto")),
      );
    });
  }

  function preencherListasDeParagrafos() {
    document.querySelectorAll("[data-lista]").forEach(function (area) {
      var paragrafos = buscarValor(area.getAttribute("data-lista")) || [];
      area.textContent = "";
      paragrafos.forEach(function (texto) {
        var p = U.criarElemento("p");
        p.appendChild(U.criarTextoComDestaque(texto));
        area.appendChild(p);
      });
    });
  }

  /* ---------- Imagens institucionais ---------- */

  // Preenche <figure data-imagem="chave" data-foto-classe="foto--clara"> com foto e legenda.
  function preencherImagens() {
    document.querySelectorAll("[data-imagem]").forEach(function (figura) {
      var imagem =
        (dados.imagens || {})[figura.getAttribute("data-imagem")] || {};
      figura.textContent = "";
      if (!imagem.arquivo) {
        figura.hidden = true;
        return;
      }
      figura.hidden = false;
      figura.appendChild(
        U.criarFoto({
          arquivo: imagem.arquivo,
          alt: imagem.alt,
          reservado: "",
          classe: figura.getAttribute("data-foto-classe") || "",
        }),
      );
      if (imagem.legenda) {
        var legenda = U.criarElemento("figcaption");
        legenda.appendChild(U.criarTextoComDestaque(imagem.legenda));
        figura.appendChild(legenda);
      }
    });
  }

  /* ---------- Nossa história ---------- */

  // Cria uma figura (foto + legenda) para um marco da história.
  function criarFiguraDoMarco(marco, classeDaFigura) {
    if (!marco.foto) return null;
    var figura = U.criarElemento("figure", classeDaFigura);
    figura.appendChild(
      U.criarFoto({
        arquivo: marco.foto,
        alt: marco.fotoAlt,
        reservado: "",
      }),
    );
    if (marco.legenda) {
      var legenda = U.criarElemento("figcaption");
      legenda.appendChild(U.criarTextoComDestaque(marco.legenda));
      figura.appendChild(legenda);
    }
    return figura;
  }

  // Um marco da linha do tempo completa (Sobre). No celular o corpo abre/fecha; no computador fica sempre visível.
  function criarMarcoCompleto(marco, posicao) {
    var idDoCorpo = "marco-" + (posicao + 1);
    var aberto = posicao === 0;
    var item = U.criarElemento("li", "marco-h" + (aberto ? " aberto" : ""));

    var cabeca = U.criarElemento("div", "marco-h__cabeca");
    var ano = U.criarElemento("p", "marco-h__ano");
    ano.appendChild(U.criarTextoComDestaque(marco.ano));
    var titulo = U.criarElemento("h3", "marco-h__titulo");
    titulo.appendChild(U.criarTextoComDestaque(marco.titulo));
    var alternador = U.criarElemento("button", "marco-h__toggle");
    alternador.type = "button";
    alternador.setAttribute("aria-expanded", String(aberto));
    alternador.setAttribute("aria-controls", idDoCorpo);
    alternador.setAttribute(
      "aria-label",
      "Mostrar ou ocultar detalhes do marco",
    );
    cabeca.appendChild(ano);
    cabeca.appendChild(titulo);
    cabeca.appendChild(alternador);
    item.appendChild(cabeca);

    var corpo = U.criarElemento("div", "marco-h__corpo");
    corpo.id = idDoCorpo;
    var texto = U.criarElemento("p", "marco-h__texto");
    texto.appendChild(U.criarTextoComDestaque(marco.texto));
    corpo.appendChild(texto);
    if (marco.trecho) {
      var citacao = U.criarElemento("blockquote", "trecho");
      citacao.appendChild(U.criarTextoComDestaque(marco.trecho));
      if (marco.fonteDoTrecho) {
        var fonte = U.criarElemento("cite");
        fonte.appendChild(U.criarTextoComDestaque(marco.fonteDoTrecho));
        citacao.appendChild(fonte);
      }
      corpo.appendChild(citacao);
    }
    var figuraDoMarco = criarFiguraDoMarco(marco, "marco-h__foto");
    if (figuraDoMarco) corpo.appendChild(figuraDoMarco);
    item.appendChild(corpo);
    return item;
  }

  // Celular: clicar no cabeçalho do marco abre/fecha o corpo. No computador (900px+) todos ficam abertos.
  function ativarAberturaDosMarcos(lista) {
    var celular = window.matchMedia("(max-width: 899px)");
    lista.addEventListener("click", function (evento) {
      var cabeca = evento.target.closest(".marco-h__cabeca");
      if (!cabeca || !celular.matches) return;
      var marco = cabeca.closest(".marco-h");
      var aberto = marco.classList.toggle("aberto");
      cabeca
        .querySelector(".marco-h__toggle")
        .setAttribute("aria-expanded", String(aberto));
    });
  }

  function montarHistoria() {
    var marcos = dados.marcos || [];

    var linhaDoTempo = document.querySelector('[data-marcos="completo"]');
    if (linhaDoTempo) {
      linhaDoTempo.textContent = "";
      marcos.forEach(function (marco, posicao) {
        linhaDoTempo.appendChild(criarMarcoCompleto(marco, posicao));
      });
      ativarAberturaDosMarcos(linhaDoTempo);
    }

    // Home: só o primeiro marco, resumido, e a foto dele (visível apenas no computador).
    var previa = document.querySelector('[data-marcos="previa"]');
    if (previa && marcos[0]) {
      previa.textContent = "";
      var item = U.criarElemento("li", "marco");
      var ano = U.criarElemento("p", "marco__ano");
      ano.appendChild(U.criarTextoComDestaque(marcos[0].ano));
      var titulo = U.criarElemento("h3", "marco__titulo");
      titulo.appendChild(U.criarTextoComDestaque(marcos[0].titulo));
      var texto = U.criarElemento("p", "marco__texto");
      texto.appendChild(U.criarTextoComDestaque(marcos[0].texto));
      item.appendChild(ano);
      item.appendChild(titulo);
      item.appendChild(texto);
      previa.appendChild(item);
    }
    var fotoDaPrevia = document.querySelector("[data-marco-foto]");
    if (fotoDaPrevia && marcos[0] && marcos[0].foto) {
      fotoDaPrevia.appendChild(
        U.criarFoto({
          arquivo: marcos[0].foto,
          alt: marcos[0].fotoAlt,
          reservado: "",
        }),
      );
      if (marcos[0].legenda) {
        var legenda = U.criarElemento("figcaption");
        legenda.appendChild(U.criarTextoComDestaque(marcos[0].legenda));
        fotoDaPrevia.appendChild(legenda);
      }
    }
  }

  /* ---------- Frentes de atuação ---------- */

  function montarFrentesDeAtuacao() {
    var lista = document.querySelector("[data-frentes]");
    if (!lista) return;
    lista.textContent = "";
    (dados.frentesDeAtuacao || []).forEach(function (frente) {
      var item = U.criarElemento("li", "frente");
      var titulo = U.criarElemento("h3", "frente__titulo");
      titulo.appendChild(U.criarTextoComDestaque(frente.titulo));
      var descricao = U.criarElemento("p");
      descricao.appendChild(U.criarTextoComDestaque(frente.descricao));
      item.appendChild(titulo);
      item.appendChild(descricao);
      lista.appendChild(item);
    });
  }

  preencherTextos();
  preencherListasDeParagrafos();
  preencherImagens();
  montarHistoria();
  montarFrentesDeAtuacao();
})();
