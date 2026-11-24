/* =========================================================
   MATERIAIS (página Materiais e Conheça) — indicação do mês, listas, filtros e "Ver mais"
   Lê dados/materiais.js (indicacaoDoMes e materiaisDoNeabi) e desenha:
     - a "Indicação do mês" em <div id="indicacao-grade">;
     - cada categoria (textos, livros, filmes, outros) nas listas marcadas com data-materiais="categoria";
     - o item "em destaque" de livros e filmes nos blocos data-destaque-de="categoria".
   Depois aplica o filtro por tipo e a quantidade limitada de itens:
     - "Todos": só 2 itens por categoria, sem destaques (a Indicação do mês já destaca um)
       e um link "Ver todos: ..." em cada categoria com mais itens;
     - uma categoria: o destaque dela + 6 itens, e o botão "Ver mais" libera mais 6 a cada clique.
   Itens escondidos continuam na página (atributo hidden). Aceita ?tipo=livros na URL.
   Depende de: js/utilitarios.js e dados/materiais.js.
   ========================================================= */
(function () {
  "use strict";
  var raiz = document.getElementById("lista-materiais");
  if (!raiz || typeof materiaisDoNeabi === "undefined") return;
  var U = NeabiUtil;

  var ITENS_NA_VISAO_GERAL = 2; // por categoria, quando o filtro é "Todos"
  var ITENS_POR_VEZ = 6; // quando uma categoria está escolhida; "Ver mais" libera mais 6

  /* ---------- Peças de um material ---------- */

  function criarTexto(tag, classe, texto) {
    var elemento = U.criarElemento(tag, classe);
    elemento.appendChild(U.criarTextoComDestaque(texto));
    return elemento;
  }

  // Título; vira link quando o material tem endereço (https://) cadastrado.
  function criarTitulo(material) {
    var titulo = criarTexto("h3", "material__titulo", material.titulo);
    var endereco = U.enderecoSeguro(material.link);
    if (endereco) {
      var link = U.criarElemento("a");
      link.href = endereco;
      link.rel = "noopener";
      link.appendChild(titulo.firstChild);
      titulo.appendChild(link);
    }
    return titulo;
  }

  function criarLinhaDaFonte(material) {
    if (!material.fonte) return null;
    var linha = U.criarElemento("p", "material__fonte", "Fonte: ");
    linha.appendChild(U.criarTextoComDestaque(material.fonte));
    return linha;
  }

  // Corpo de texto de um material: tipo, título, autoria, descrição e fonte (campos vazios não aparecem).
  function preencherCorpo(elemento, material, rotuloDoTipo) {
    if (material.etiqueta)
      elemento.appendChild(
        U.criarElemento("p", "material__etiqueta", material.etiqueta),
      );
    if (rotuloDoTipo)
      elemento.appendChild(
        U.criarElemento("p", "material__tipo", rotuloDoTipo),
      );
    elemento.appendChild(criarTitulo(material));
    if (material.autoria)
      elemento.appendChild(
        criarTexto("p", "material__autor", material.autoria),
      );
    if (material.descricao)
      elemento.appendChild(
        criarTexto("p", "material__descricao", material.descricao),
      );
    var fonte = criarLinhaDaFonte(material);
    if (fonte) elemento.appendChild(fonte);
  }

  /* ---------- Um construtor por tipo de lista (cada tipo tem seu visual) ---------- */

  var construtores = {
    // Textos e artigos: só tipografia
    textos: function (material) {
      var item = U.criarElemento("li", "material material--texto");
      preencherCorpo(item, material, "Texto / artigo");
      return item;
    },
    // Livros: capa na "estante" + título e autoria
    livros: function (material) {
      var item = U.criarElemento("li");
      if (material.etiqueta)
        item.appendChild(U.criarElemento("p", "material__etiqueta", material.etiqueta));
      if (material.imagem) {
        item.appendChild(
          U.criarFoto({
            arquivo: material.imagem,
            alt: material.imagemAlt,
            reservado: "",
            classe: "foto--clara",
          }),
        );
      }
      item.appendChild(criarTitulo(material));
      if (material.autoria)
        item.appendChild(criarTexto("p", "material__autor", material.autoria));
      return item;
    },
    // Filmes e documentários: cartaz + título e direção
    filmes: function (material) {
      var item = U.criarElemento("li");
      if (material.imagem) {
        item.appendChild(
          U.criarFoto({
            arquivo: material.imagem,
            alt: material.imagemAlt,
            reservado: "",
          }),
        );
      }
      item.appendChild(criarTitulo(material));
      if (material.autoria)
        item.appendChild(criarTexto("p", "material__autor", material.autoria));
      return item;
    },
    // Outros materiais: lista compacta com o tipo ("Cartilha", "Podcast"...)
    outros: function (material) {
      var item = U.criarElemento("li", "material");
      preencherCorpo(item, material, material.tipo || "Material educativo");
      return item;
    },
  };

  // Item em destaque de livros e filmes (foto maior + texto completo).
  function preencherDestaque(area, tipo, material) {
    var ehLivro = tipo === "livros";
    if (material.imagem) {
      area.appendChild(
        U.criarFoto({
          arquivo: material.imagem,
          alt: material.imagemAlt,
          reservado: "",
          classe: ehLivro ? "foto--clara foto--capa" : "",
        }),
      );
    } else {
      area.classList.add("sem-imagem");
    }
    var texto = U.criarElemento("div", "material material--destaque");
    preencherCorpo(
      texto,
      material,
      ehLivro ? "Livro em destaque" : "Filme ou documentário em destaque",
    );
    area.appendChild(texto);
  }

  /* ---------- Desenho inicial ---------- */

  function montarIndicacaoDoMes() {
    var grade = document.getElementById("indicacao-grade");
    if (!grade || typeof indicacaoDoMes === "undefined") return;
    grade.textContent = "";
    if (indicacaoDoMes.imagem) {
      grade.appendChild(
        U.criarFoto({
          arquivo: indicacaoDoMes.imagem,
          alt: indicacaoDoMes.imagemAlt,
          reservado: "",
          classe: "foto--clara foto--capa",
        }),
      );
    } else {
      grade.classList.add("indicacao__grade--sem-imagem");
    }
    var texto = U.criarElemento("div", "material material--destaque");
    texto.setAttribute("data-revela", "");
    var nome = U.criarElemento("h2", "indicacao__nome", "Do acervo de estudos · ");
    nome.id = "indicacao-titulo";
    nome.appendChild(U.criarTextoComDestaque(indicacaoDoMes.mes));
    texto.appendChild(nome);
    preencherCorpo(texto, indicacaoDoMes, "");
    grade.appendChild(texto);
  }

  function montarCategorias() {
    Object.keys(construtores).forEach(function (tipo) {
      var lista = raiz.querySelector('[data-materiais="' + tipo + '"]');
      if (!lista) return;
      var todos = materiaisDoNeabi[tipo] || [];
      var emDestaque = todos.filter(function (m) {
        return m.destaque;
      })[0];
      var comuns = todos.filter(function (m) {
        return m !== emDestaque;
      });

      lista.textContent = "";
      comuns.forEach(function (material) {
        var item = construtores[tipo](material);
        item.setAttribute("data-item", "");
        lista.appendChild(item);
      });

      // Mensagem para categoria sem nenhum item cadastrado.
      var secao = lista.closest("[data-tipo]");
      if (!todos.length) {
        var vazio = U.criarElemento(
          "p",
          "mat-vazio",
          "Nenhum item cadastrado nesta categoria ainda.",
        );
        lista.insertAdjacentElement("afterend", vazio);
      }

      // Destaque: some de vez se nenhum item foi marcado com destaque: true.
      var areaDoDestaque = secao.querySelector(
        '[data-destaque-de="' + tipo + '"]',
      );
      if (areaDoDestaque) {
        areaDoDestaque.textContent = "";
        if (emDestaque) {
          preencherDestaque(areaDoDestaque, tipo, emDestaque);
        } else {
          areaDoDestaque.removeAttribute("data-destaque");
          areaDoDestaque.hidden = true;
        }
      }
    });
  }

  /* ---------- Filtro por tipo e "Ver mais" ---------- */

  var botoesDeTipo = document.querySelectorAll("[data-filtro-material]");
  var secoes = raiz.querySelectorAll("[data-tipo]");
  var areaVerMais = document.getElementById("mat-mais");
  var botaoVerMais = document.getElementById("mat-ver-mais");
  var contagem = document.getElementById("mat-contagem");
  var tipoAtual = "todos";
  var itensLiberados = ITENS_POR_VEZ;

  // Mostra/esconde seções, itens, destaques e botões conforme o filtro e o limite atuais.
  function desenharMateriais() {
    var visaoGeral = tipoAtual === "todos";
    var limite = visaoGeral ? ITENS_NA_VISAO_GERAL : itensLiberados;
    var total = 0,
      visiveis = 0;
    secoes.forEach(function (secao) {
      var mostrar = visaoGeral || secao.getAttribute("data-tipo") === tipoAtual;
      secao.hidden = !mostrar;
      if (!mostrar) return;
      var itens = secao.querySelectorAll("[data-item]");
      itens.forEach(function (item, posicao) {
        item.hidden = posicao >= limite;
      });
      secao.querySelectorAll("[data-destaque]").forEach(function (destaque) {
        destaque.hidden = visaoGeral;
      });
      var verTodos = secao.querySelector(".mat-secao__todos");
      if (verTodos) verTodos.hidden = !(visaoGeral && itens.length > limite);
      total += itens.length;
      visiveis += Math.min(itens.length, limite);
    });
    areaVerMais.hidden = visaoGeral || visiveis >= total;
    contagem.textContent = "Mostrando " + visiveis + " de " + total;
  }

  function aplicarTipo(valor) {
    tipoAtual = valor;
    itensLiberados = ITENS_POR_VEZ;
    botoesDeTipo.forEach(function (botao) {
      botao.setAttribute(
        "aria-pressed",
        String(botao.getAttribute("data-filtro-material") === valor),
      );
    });
    desenharMateriais();
  }

  botoesDeTipo.forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarTipo(botao.getAttribute("data-filtro-material"));
    });
  });
  botaoVerMais.addEventListener("click", function () {
    itensLiberados += ITENS_POR_VEZ;
    desenharMateriais();
  });
  // "Ver todos: livros" (na visão geral) = escolher aquela categoria.
  document.querySelectorAll("[data-ir-para]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarTipo(botao.getAttribute("data-ir-para"));
      raiz.scrollIntoView();
    });
  });

  montarIndicacaoDoMes();
  montarCategorias();
  aplicarTipo("todos");
  var tipoPedido = new URLSearchParams(window.location.search).get("tipo");
  if (
    tipoPedido &&
    document.querySelector('[data-filtro-material="' + tipoPedido + '"]')
  )
    aplicarTipo(tipoPedido);
})();
