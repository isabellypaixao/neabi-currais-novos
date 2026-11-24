/* =========================================================
   PERSONALIDADES — seção "Conheça" (página Materiais e Conheça)
   Lê dados/personalidades.js e desenha:
     - as 3 primeiras em <div id="pessoas-destaques">;
     - as demais em <div id="pessoas-extras">, escondidas até clicar em "Ver todas as personalidades".
   Cada card tem "Conhecer mais", que abre o texto completo no próprio card.
   Depende de: js/utilitarios.js e dados/personalidades.js.
   ========================================================= */
(function () {
  "use strict";
  var areaDestaques = document.getElementById("pessoas-destaques");
  var areaExtras = document.getElementById("pessoas-extras");
  var botaoTodas = document.getElementById("pessoas-todas");
  if (!areaDestaques || typeof personalidadesDoNeabi === "undefined") return;
  var U = NeabiUtil;
  var QUANTIDADE_EM_DESTAQUE = 3;
  var contador = 0; // gera ids únicos para o texto de cada pessoa

  function criarTexto(tag, classe, texto) {
    var elemento = U.criarElemento(tag, classe);
    elemento.appendChild(U.criarTextoComDestaque(texto));
    return elemento;
  }

  // Card de uma pessoa: foto, nome, área, descrição, botão "Conhecer mais" e texto completo (escondido).
  function criarCard(pessoa) {
    contador++;
    var idDoTexto = "pessoa-texto-" + contador;
    var card = U.criarElemento("article", "pessoa");

    if (pessoa.foto) {
      var foto = U.criarElemento("div", "pessoa__foto");
      foto.appendChild(
        U.criarFoto({
          arquivo: pessoa.foto,
          alt: pessoa.fotoAlt,
          reservado: "",
          classe: "foto--retrato",
        }),
      );
      card.appendChild(foto);
    } else {
      card.classList.add("pessoa--sem-foto");
    }

    var resumo = U.criarElemento("div", "pessoa__resumo");
    resumo.appendChild(criarTexto("h3", "pessoa__nome", pessoa.nome));
    if (pessoa.area)
      resumo.appendChild(criarTexto("p", "pessoa__area", pessoa.area));
    if (pessoa.descricao)
      resumo.appendChild(
        criarTexto("p", "pessoa__descricao", pessoa.descricao),
      );

    var temTexto = (pessoa.texto && pessoa.texto.length) || pessoa.fonte;
    if (temTexto) {
      var botao = U.criarElemento(
        "button",
        "link-texto pessoa__botao",
        "Conhecer mais",
      );
      botao.type = "button";
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-controls", idDoTexto);
      resumo.appendChild(botao);
      card.appendChild(resumo);

      var texto = U.criarElemento("div", "pessoa__texto");
      texto.id = idDoTexto;
      texto.hidden = true;
      (pessoa.texto || []).forEach(function (paragrafo) {
        texto.appendChild(criarTexto("p", "", paragrafo));
      });
      if (pessoa.fonte) {
        var fonte = U.criarElemento(
          "p",
          "pessoa__fonte",
          "Fonte: ",
        );
        fonte.appendChild(U.criarTextoComDestaque(pessoa.fonte));
        texto.appendChild(fonte);
      }
      card.appendChild(texto);

      botao.addEventListener("click", function () {
        var abrir = botao.getAttribute("aria-expanded") !== "true";
        botao.setAttribute("aria-expanded", String(abrir));
        botao.textContent = abrir ? "Mostrar menos" : "Conhecer mais";
        texto.hidden = !abrir;
      });
    } else {
      card.appendChild(resumo);
    }
    return card;
  }

  areaDestaques.textContent = "";
  areaExtras.textContent = "";
  personalidadesDoNeabi.forEach(function (pessoa, posicao) {
    (posicao < QUANTIDADE_EM_DESTAQUE ? areaDestaques : areaExtras).appendChild(
      criarCard(pessoa),
    );
  });

  if (!personalidadesDoNeabi.length) {
    areaDestaques.appendChild(
      U.criarElemento("p", "", "Nenhuma personalidade cadastrada ainda."),
    );
  }

  // "Ver todas as personalidades": mostra/esconde o grupo extra. Sem pessoas extras, o botão nem aparece.
  if (areaExtras.children.length === 0) {
    areaExtras.hidden = true;
    botaoTodas.hidden = true;
  } else {
    areaExtras.hidden = true;
    botaoTodas.addEventListener("click", function () {
      var abrir = botaoTodas.getAttribute("aria-expanded") !== "true";
      botaoTodas.setAttribute("aria-expanded", String(abrir));
      botaoTodas.textContent = abrir
        ? "Mostrar só os destaques"
        : "Ver todas as personalidades";
      areaExtras.hidden = !abrir;
    });
  }
})();
